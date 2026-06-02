const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const { category_name } = req.body;
        const category = await prisma.category.create({
            data: { category_name },
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

module.exports = router;
