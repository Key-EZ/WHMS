const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const transactions = await prisma.transaction.findMany({
            take: limit ? parseInt(limit) : undefined,
            orderBy: { trans_date: 'desc' },
            include: {
                lot: {
                    include: { item: true }
                },
                budget_year: true
            }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Create transaction
router.post('/', async (req, res) => {
    try {
        const { lot_id, year_id, trans_type, quantity, remark } = req.body;

        // Validate trans_type
        const validTypes = ['IN', 'WITHDRAW', 'SALE', 'FORWARD'];
        if (!validTypes.includes(trans_type)) {
            return res.status(400).json({ error: 'Invalid trans_type' });
        }

        const transaction = await prisma.transaction.create({
            data: {
                lot_id: parseInt(lot_id),
                year_id: parseInt(year_id),
                trans_type,
                quantity: parseInt(quantity),
                remark
            },
        });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

module.exports = router;
