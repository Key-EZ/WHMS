const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all stock lots
router.get('/', async (req, res) => {
    try {
        const lots = await prisma.stockLot.findMany({
            include: {
                item: true
            }
        });
        res.json(lots);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock lots' });
    }
});

// Create stock lot
router.post('/', async (req, res) => {
    try {
        const { item_id, lot_number, qr_code_data, receive_date, expiry_date, cost_per_unit } = req.body;

        const lot = await prisma.stockLot.create({
            data: {
                item_id: parseId(item_id),
                lot_number,
                qr_code_data,
                receive_date: new Date(receive_date),
                expiry_date: expiry_date ? new Date(expiry_date) : null,
                cost_per_unit: cost_per_unit ? parseFloat(cost_per_unit) : null
            },
        });
        res.json(lot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create stock lot' });
    }
});

// Update stock lot
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_id, lot_number, qr_code_data, receive_date, expiry_date, cost_per_unit } = req.body;

        const lot = await prisma.stockLot.update({
            where: { lot_id: parseInt(id) },
            data: {
                item_id: parseId(item_id),
                lot_number,
                qr_code_data,
                receive_date: receive_date ? new Date(receive_date) : undefined,
                expiry_date: expiry_date !== undefined ? (expiry_date ? new Date(expiry_date) : null) : undefined,
                cost_per_unit: cost_per_unit !== undefined ? (cost_per_unit ? parseFloat(cost_per_unit) : null) : undefined
            }
        });
        res.json(lot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update stock lot' });
    }
});

// Delete stock lot
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.stockLot.delete({
            where: { lot_id: parseInt(id) }
        });
        res.json({ message: 'Stock lot deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete stock lot' });
    }
});

function parseId(id) {
    return id ? parseInt(id) : null;
}

module.exports = router;

