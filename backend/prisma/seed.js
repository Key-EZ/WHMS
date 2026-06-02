const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning and Seeding data...');

    // Clean existing data to avoid PK/Unique constraints
    await prisma.transaction.deleteMany({});
    await prisma.stockLot.deleteMany({});
    await prisma.item.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.unit.deleteMany({});
    await prisma.budgetYear.deleteMany({});

    // 1. Budget Year
    await prisma.budgetYear.create({
        data: {
            year_id: 2567,
            start_date: new Date('2023-10-01'),
            end_date: new Date('2024-09-30'),
            is_active: true,
        },
    });

    // 1.1 Category & Units
    const cat1 = await prisma.category.create({ data: { category_name: 'ยา' } });
    const cat2 = await prisma.category.create({ data: { category_name: 'IT' } });

    const unit1 = await prisma.unit.create({ data: { unit_name: 'กล่อง' } });
    const unit2 = await prisma.unit.create({ data: { unit_name: 'License' } });
    const unit3 = await prisma.unit.create({ data: { unit_name: 'เครื่อง' } });

    // 2. Items
    const item1 = await prisma.item.create({
        data: {
            item_name: 'ยาพาราเซตามอล 500mg',
            item_type: 'MATERIAL',
            category_id: cat1.category_id,
            unit_id: unit1.unit_id,
        },
    });

    const item2 = await prisma.item.create({
        data: {
            item_name: 'Adobe Creative Cloud',
            item_type: 'MATERIAL',
            category_id: cat2.category_id,
            unit_id: unit2.unit_id,
        },
    });

    const item3 = await prisma.item.create({
        data: {
            item_name: 'Laptop Dell Latitude',
            item_type: 'EQUIPMENT',
            category_id: cat2.category_id,
            unit_id: unit3.unit_id,
        },
    });

    // 3. Stock Lots
    await prisma.stockLot.createMany({
        data: [
            {
                item_id: item1.item_id,
                lot_number: 'LOT-A001',
                qr_code_data: 'ITEM001-LOTA001',
                receive_date: new Date('2024-01-15'),
                expiry_date: new Date('2026-01-15'),
            },
            {
                item_id: item2.item_id,
                lot_number: 'SUB-2024',
                qr_code_data: 'ADOBE-2024-KEY',
                receive_date: new Date('2024-01-01'),
                expiry_date: new Date('2025-01-01'),
            },
        ],
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
