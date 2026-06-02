const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all budget years
router.get('/', async (req, res) => {
    try {
        const years = await prisma.budgetYear.findMany({
            orderBy: { year_id: 'desc' }
        });
        res.json(years);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch budget years' });
    }
});

// Create budget year
router.post('/', async (req, res) => {
    try {
        const { year_id, start_date, end_date, is_active } = req.body;
        const year = await prisma.budgetYear.create({
            data: {
                year_id: parseInt(year_id),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                is_active: is_active ?? true
            },
        });
        res.json(year);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create budget year' });
    }
});

module.exports = router;
