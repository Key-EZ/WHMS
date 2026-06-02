const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
const authRoutes = require('./routes/auth');

app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/years', yearRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stock-lots', stockLotRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
