const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all items with category and unit
router.get('/', async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            include: {
                category: true,
                unit: true
            }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Create item
router.post('/', async (req, res) => {
    try {
        const { item_name, category_id, unit_id, item_type, min_stock, ...rest } = req.body;

        // Validate item_type
        if (!['MATERIAL', 'EQUIPMENT'].includes(item_type)) {
            return res.status(400).json({ error: 'Invalid item_type' });
        }

        const item = await prisma.item.create({
            data: {
                item_name,
                category_id: category_id ? parseInt(category_id) : null,
                unit_id: unit_id ? parseInt(unit_id) : null,
                item_type,
                min_stock: min_stock ? parseInt(min_stock) : 0
            },
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// Update item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, category_id, unit_id, item_type, min_stock } = req.body;

        if (item_type && !['MATERIAL', 'EQUIPMENT'].includes(item_type)) {
            return res.status(400).json({ error: 'Invalid item_type' });
        }

        const item = await prisma.item.update({
            where: { item_id: parseInt(id) },
            data: {
                item_name,
                category_id: category_id !== undefined ? (category_id ? parseInt(category_id) : null) : undefined,
                unit_id: unit_id !== undefined ? (unit_id ? parseInt(unit_id) : null) : undefined,
                item_type,
                min_stock: min_stock !== undefined ? parseInt(min_stock) : undefined
            }
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.item.delete({
            where: { item_id: parseInt(id) }
        });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;

