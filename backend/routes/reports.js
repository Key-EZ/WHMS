const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get items expiring within 180 days
router.get('/expiring', async (req, res) => {
    try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 180);

        const expiringLots = await prisma.stockLot.findMany({
            where: {
                expiry_date: {
                    not: null,
                    lte: futureDate,
                },
            },
            include: {
                item: {
                    select: {
                        item_name: true,
                    },
                },
            },
            orderBy: {
                expiry_date: 'asc',
            },
        });

        const result = expiringLots.map(lot => {
            const daysLeft = Math.ceil((new Date(lot.expiry_date) - today) / (1000 * 60 * 60 * 24));
            return {
                item_name: lot.item.item_name,
                lot_number: lot.lot_number,
                expiry_date: lot.expiry_date,
                days_left: daysLeft,
            };
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch expiring items' });
    }
});

// Get stock balance by budget year
router.get('/stock-balance/:yearId', async (req, res) => {
    try {
        const { yearId } = req.params;
        // We use queryRaw because of the complex conditional aggregation
        const result = await prisma.$queryRaw`
      SELECT i.item_name, CAST(SUM(CASE WHEN t.trans_type IN ('รับเข้า', 'ยกยอดมา') THEN t.quantity ELSE -t.quantity END) AS SIGNED) AS current_stock
      FROM Transactions t
      JOIN Stock_Lots l ON t.lot_id = l.lot_id
      JOIN Items i ON l.item_id = i.item_id
      WHERE t.year_id = ${parseInt(yearId)}
      GROUP BY i.item_name
    `;
        // Prisma returns BigInt for SUM in some cases, so we ensure it's JSON serializable
        const formattedResult = result.map(row => ({
            ...row,
            current_stock: Number(row.current_stock)
        }));
        res.json(formattedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stock balance' });
    }
});

// Get current inventory (stock on hand per lot/item)
router.get('/inventory', async (req, res) => {
    try {
        // Using the user provided SQL view logic
        const result = await prisma.$queryRaw`
      SELECT 
          i.item_id,
          i.item_name,
          i.item_type,
          l.lot_number,
          l.expiry_date,
          y.year_id AS budget_year,
          CAST(SUM(CASE 
              WHEN t.trans_type IN ('รับเข้า', 'ยกยอดมา') THEN t.quantity 
              WHEN t.trans_type IN ('เบิกจ่าย', 'จำหน่ายออก') THEN -t.quantity 
              ELSE 0 
          END) AS SIGNED) AS stock_on_hand,
          u.unit_name
      FROM Items i
      JOIN Stock_Lots l ON i.item_id = l.item_id
      JOIN Transactions t ON l.lot_id = t.lot_id
      JOIN Budget_Years y ON t.year_id = y.year_id
      JOIN Units u ON i.unit_id = u.unit_id
      WHERE y.is_active = TRUE
      GROUP BY i.item_id, l.lot_id, y.year_id
    `;

        const formattedResult = result.map(row => ({
            ...row,
            stock_on_hand: Number(row.stock_on_hand)
        }));

        res.json(formattedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch current inventory' });
    }
});

module.exports = router;
