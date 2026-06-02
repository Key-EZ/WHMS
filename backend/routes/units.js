const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all units
router.get('/', async (req, res) => {
    try {
        const units = await prisma.unit.findMany();
        res.json(units);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch units' });
    }
});

// Create unit
router.post('/', async (req, res) => {
    try {
        const { unit_name } = req.body;
        const unit = await prisma.unit.create({
            data: { unit_name },
        });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create unit' });
    }
});

module.exports = router;
