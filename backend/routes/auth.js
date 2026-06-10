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
        const { email, username, password, name } = req.body;
        const registerEmail = email || username;

        if (!registerEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Username and password are required'
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: registerEmail }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: registerEmail,
                password: hashedPassword,
                name: name || registerEmail.split('@')[0],
                role: 'USER'
            }
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user.user_id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const loginEmail = email || username;

        if (!loginEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/Username and password are required'
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: loginEmail }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
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
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
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

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};

// Verify JWT Token for Now.js frontend
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user.userId }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.json({ success: false, message: 'Invalid token' });
    }
});

// Get current user details
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user.userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const menus = [
            // 1. Dashboard (แผงควบคุม)
            {
                title: 'Dashboard',
                url: '/',
                icon: 'icon-dashboard'
            },
            // 2. Repair (แจ้งซ่อม)
            {
                title: 'Repair',
                icon: 'icon-tools',
                children: [
                    {
                        title: 'Repair Dashboard',
                        url: '/repair-dashboard',
                        icon: 'icon-dashboard'
                    },
                    {
                        title: 'Get a repair',
                        url: '/repair-request',
                        icon: 'icon-write'
                    },
                    {
                        title: 'Repair history',
                        url: '/repair-history',
                        icon: 'icon-clock'
                    },
                    {
                        title: 'Repair jobs',
                        url: '/repair-jobs',
                        icon: 'icon-customer'
                    },
                    {
                        title: 'Repair status',
                        url: '/repair-statuses',
                        icon: 'icon-index'
                    },
                    {
                        title: 'Settings',
                        url: '/repair-settings',
                        icon: 'icon-settings'
                    }
                ]
            },
            // 3. Inventory (คลังสินค้า)
            {
                title: 'Inventory',
                icon: 'icon-product',
                children: [
                    {
                        title: 'My equipment',
                        url: '/inventory-myassets',
                        icon: 'icon-star0'
                    },
                    {
                        title: 'Inventory',
                        url: '/inventory-assets',
                        icon: 'icon-index'
                    },
                    {
                        title: 'Holder',
                        url: '/inventory-holders',
                        icon: 'icon-customer'
                    },
                    {
                        title: 'Item rows',
                        url: '/inventory-items',
                        icon: 'icon-list'
                    },
                    {
                        title: 'Category',
                        url: '/inventory-categories',
                        icon: 'icon-category'
                    },
                    {
                        title: 'Settings',
                        url: '/inventory-settings',
                        icon: 'icon-settings'
                    }
                ]
            }
        ];

        // 4. Settings (ตั้งค่าระบบ) - Only visible to ADMIN users
        if (user.role === 'ADMIN') {
            menus.push({
                title: 'Settings',
                icon: 'icon-settings',
                children: [
                    {
                        title: 'Users',
                        url: '/users',
                        icon: 'icon-user'
                    },
                    {
                        title: 'Member status',
                        url: '/user-status',
                        icon: 'icon-star0'
                    },
                    {
                        title: 'Permissions',
                        url: '/permission',
                        icon: 'icon-valid'
                    },
                    {
                        title: 'General Settings',
                        url: '/general-settings',
                        icon: 'icon-config'
                    },
                    {
                        title: 'Company Settings',
                        url: '/company-settings',
                        icon: 'icon-office'
                    },
                    {
                        title: 'Email Settings',
                        url: '/email-settings',
                        icon: 'icon-email'
                    },
                    {
                        title: 'API Settings',
                        url: '/api-settings',
                        icon: 'icon-menus'
                    },
                    {
                        title: 'Theme Settings',
                        url: '/theme-settings',
                        icon: 'icon-colorpicker'
                    },
                    {
                        title: 'Line Settings',
                        url: '/line-settings',
                        icon: 'icon-line'
                    },
                    {
                        title: 'Telegram Settings',
                        url: '/telegram-settings',
                        icon: 'icon-telegram'
                    },
                    {
                        title: 'SMS Settings',
                        url: '/sms-settings',
                        icon: 'icon-sms'
                    },
                    {
                        title: 'AI Settings',
                        url: '/ai-settings',
                        icon: 'icon-magic'
                    },
                    {
                        title: 'Manage languages',
                        url: '/languages',
                        icon: 'icon-language'
                    },
                    {
                        title: 'Usage history',
                        url: '/usage',
                        icon: 'icon-clock'
                    }
                ]
            });
        }

        res.json({
            id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            menus
        });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access forbidden: Administrator role required' });
    }
    next();
};

module.exports = {
    router,
    authenticateToken,
    requireAdmin
};


