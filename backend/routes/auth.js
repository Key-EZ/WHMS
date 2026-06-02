const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'whms_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER'
            }
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.user_id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Authentik SSO Login Callback
router.post('/authentik/callback', async (req, res) => {
    try {
        const { code, redirectUri } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code is required' });
        }

        let email;
        let name;

        const authentikClientId = process.env.AUTHENTIK_CLIENT_ID;
        const authentikClientSecret = process.env.AUTHENTIK_CLIENT_SECRET;
        const authentikIssuer = process.env.AUTHENTIK_ISSUER;

        // Check if we are in mock mode (client id is 'mock' or not configured in dev)
        const isMockMode = !authentikClientId || authentikClientId === 'mock';

        if (isMockMode || code.startsWith('mock_auth_code_')) {
            // Mock flow for easy local testing
            email = 'authentik.user@example.com';
            name = 'Authentik Test User';
        } else {
            if (!authentikClientSecret || !authentikIssuer) {
                return res.status(500).json({ error: 'SSO provider configuration is missing on the server' });
            }

            // Standard OIDC Token Exchange
            const issuerUrl = authentikIssuer.replace(/\/$/, '');
            const tokenUrl = `${issuerUrl}/token/`;
            const userinfoUrl = `${issuerUrl}/userinfo/`;

            // Prepare token request params
            const tokenParams = new URLSearchParams();
            tokenParams.append('grant_type', 'authorization_code');
            tokenParams.append('code', code);
            tokenParams.append('redirect_uri', redirectUri);
            tokenParams.append('client_id', authentikClientId);
            tokenParams.append('client_secret', authentikClientSecret);

            const tokenResponse = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: tokenParams.toString(),
            });

            if (!tokenResponse.ok) {
                const errText = await tokenResponse.text();
                console.error('Authentik token exchange error:', errText);
                return res.status(400).json({ error: 'Failed to exchange authorization code' });
            }

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            // Fetch user info using Access Token
            const userinfoResponse = await fetch(userinfoUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!userinfoResponse.ok) {
                const errText = await userinfoResponse.text();
                console.error('Authentik userinfo fetch error:', errText);
                return res.status(400).json({ error: 'Failed to fetch user info from Authentik' });
            }

            const userData = await userinfoResponse.json();
            email = userData.email;
            name = userData.name || userData.preferred_username || email.split('@')[0];
        }

        if (!email) {
            return res.status(400).json({ error: 'Email not provided by identity provider' });
        }

        // Find or create user in database
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Auto-provision user with a secure random password since schema requires password
            const crypto = require('crypto');
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || email.split('@')[0],
                    role: 'USER'
                }
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'SSO Login successful',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Authentik SSO callback error:', error);
        res.status(500).json({ error: 'Internal server error during SSO login' });
    }
});

module.exports = router;

