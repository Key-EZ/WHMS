const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.path}`);
    if (req.method !== 'GET') {
        console.log('[HTTP BODY]', JSON.stringify(req.body));
    }
    next();
});

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'WHMS Backend is running' });
});

const categoryRoutes = require('./routes/categories');
const unitRoutes = require('./routes/units');
const yearRoutes = require('./routes/years');
const itemRoutes = require('./routes/items');
const stockLotRoutes = require('./routes/stockLots');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');
const { router: authRoutes, authenticateToken, requireAdmin } = require('./routes/auth');
const repairRoutes = require('./routes/repairs');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/units', authenticateToken, unitRoutes);
app.use('/api/years', authenticateToken, yearRoutes);
app.use('/api/items', authenticateToken, itemRoutes);
app.use('/api/stock-lots', authenticateToken, stockLotRoutes);
app.use('/api/transactions', authenticateToken, transactionRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/repairs', authenticateToken, repairRoutes);
app.use('/api/repair', authenticateToken, repairRoutes);
app.use('/api/users', authenticateToken, requireAdmin, userRoutes);

// Mock endpoints to support Now.js frontend configuration and CSRF checks
const fs = require('fs');

app.get('/api/settings', authenticateToken, requireAdmin, (req, res) => {
    try {
        const settingsPath = path.join(__dirname, 'data', 'settings.json');
        if (!fs.existsSync(settingsPath)) {
            const defaultSettings = {
                company_name: "WHMS - Warehouse Management System",
                report_header: "ระบบจัดการคลังพัสดุและครุภัณฑ์กลาง",
                address: "123 ถนนเพชรเกษม แขวงบางแค เขตบางแค กรุงเทพมหานคร 10160"
            };
            fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
            fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf8');
        }
        const data = fs.readFileSync(settingsPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Failed to get settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/settings', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { companyName, reportHeader, address } = req.body;
        const settingsPath = path.join(__dirname, 'data', 'settings.json');
        
        const settings = {
            company_name: companyName,
            report_header: reportHeader,
            address: address
        };
        
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Failed to save settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/config/frontend-settings', (req, res) => {
    try {
        const settingsPath = path.join(__dirname, 'data', 'settings.json');
        let site = {
            title: 'WHMS - Warehouse Management System',
            description: 'ระบบจัดการคลังสินค้าและแจ้งซ่อม'
        };
        if (fs.existsSync(settingsPath)) {
            const rawData = fs.readFileSync(settingsPath, 'utf8');
            const parsed = JSON.parse(rawData);
            site = {
                title: parsed.company_name,
                description: parsed.report_header
            };
        }
        res.json({
            success: true,
            data: {
                variables: {
                    '--color-primary': '#4361ee'
                },
                site
            }
        });
    } catch (error) {
        res.json({
            success: true,
            data: {
                variables: {
                    '--color-primary': '#4361ee'
                },
                site: {
                    title: 'WHMS - Warehouse Management System',
                    description: 'ระบบจัดการคลังสินค้าและแจ้งซ่อม'
                }
            }
        });
    }
});

app.get('/api/config/login', (req, res) => {
    res.json({
        success: true,
        data: {
            logo: 'images/logo.png',
            web_title: 'WHMS - Warehouse Management System',
            user_forgot: 1,
            user_register: 1,
            demo_mode: 0
        }
    });
});

app.get('/api/auth/csrf-token', (req, res) => {
    res.json({
        success: true,
        data: {
            _token: 'mock-csrf-token'
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
