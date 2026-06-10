const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all repairs
router.get('/', async (req, res) => {
    try {
        const { status, requester_id } = req.query;
        
        const where = {};
        if (status) where.status = status;
        if (requester_id) where.requester_id = parseInt(requester_id);

        const repairs = await prisma.repairRequest.findMany({
            where,
            orderBy: { request_date: 'desc' },
            include: {
                item: true,
                lot: true,
                requester: {
                    select: {
                        user_id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });
        res.json(repairs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch repairs' });
    }
});

// Get repair statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await prisma.repairRequest.groupBy({
            by: ['status'],
            _count: {
                repair_id: true
            },
            _sum: {
                cost: true
            }
        });

        // Format stats into a friendly object
        const formatted = {
            PENDING: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            total_cost: 0
        };

        stats.forEach(s => {
            formatted[s.status] = s._count.repair_id;
            if (s._sum.cost) {
                formatted.total_cost += parseFloat(s._sum.cost);
            }
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch repair stats' });
    }
});

// Get repair dashboard cards statistics
router.get('/dashboard/cards', async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        // Count for my_status_cards (requests submitted by me)
        const myRepairs = await prisma.repairRequest.findMany({
            where: { requester_id: userId }
        });
        
        const myPending = myRepairs.filter(r => r.status === 'PENDING').length;
        const myInProgress = myRepairs.filter(r => r.status === 'IN_PROGRESS').length;
        const myCompleted = myRepairs.filter(r => r.status === 'COMPLETED').length;
        const myCancelled = myRepairs.filter(r => r.status === 'CANCELLED').length;

        // Count for queue_status_cards (all repairs in system)
        const allRepairs = await prisma.repairRequest.findMany();
        const queuePending = allRepairs.filter(r => r.status === 'PENDING').length;
        const queueInProgress = allRepairs.filter(r => r.status === 'IN_PROGRESS').length;
        const queueCompleted = allRepairs.filter(r => r.status === 'COMPLETED').length;
        const queueCancelled = allRepairs.filter(r => r.status === 'CANCELLED').length;

        // Count for assigned_status_cards (assigned to me)
        const currentUser = await prisma.user.findUnique({
            where: { user_id: userId }
        });
        const userName = currentUser?.name || '';
        
        const assignedRepairs = allRepairs.filter(r => r.repairer_name === userName);
        const assignedPending = assignedRepairs.filter(r => r.status === 'PENDING').length;
        const assignedInProgress = assignedRepairs.filter(r => r.status === 'IN_PROGRESS').length;
        const assignedCompleted = assignedRepairs.filter(r => r.status === 'COMPLETED').length;
        const assignedCancelled = assignedRepairs.filter(r => r.status === 'CANCELLED').length;

        res.json({
            show_queue_cards: role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'REPAIR_STAFF',
            show_assigned_cards: role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'REPAIR_STAFF' || assignedRepairs.length > 0,
            show_department_chart: role === 'SUPER_ADMIN' || role === 'ADMIN',
            show_operator_chart: role === 'SUPER_ADMIN' || role === 'ADMIN',
            my_status_cards: [
                { label: 'รอดำเนินการ', count_text: `${myPending} รายการ`, scope_text: 'รอการตรวจสอบ', color: '#ff9f43', icon_class: 'icon-clock', href: '/repair-history' },
                { label: 'กำลังดำเนินการ', count_text: `${myInProgress} รายการ`, scope_text: 'กำลังดำเนินการซ่อม', color: '#00bad1', icon_class: 'icon-tools', href: '/repair-history' },
                { label: 'ซ่อมเสร็จสิ้น', count_text: `${myCompleted} รายการ`, scope_text: 'ซ่อมเสร็จและส่งมอบแล้ว', color: '#28c76f', icon_class: 'icon-valid', href: '/repair-history' },
                { label: 'ยกเลิกคำขอ', count_text: `${myCancelled} รายการ`, scope_text: 'ถูกระงับ/ยกเลิก', color: '#ea5455', icon_class: 'icon-close', href: '/repair-history' }
            ],
            assigned_status_cards: [
                { label: 'รอดำเนินการ (มอบหมาย)', count_text: `${assignedPending} รายการ`, scope_text: 'งานรอคุณเริ่มดำเนินการ', color: '#ff9f43', icon_class: 'icon-clock', href: '/repair-jobs' },
                { label: 'กำลังซ่อม (มอบหมาย)', count_text: `${assignedInProgress} รายการ`, scope_text: 'งานที่คุณกำลังดำเนินการ', color: '#00bad1', icon_class: 'icon-tools', href: '/repair-jobs' },
                { label: 'ซ่อมเสร็จ (มอบหมาย)', count_text: `${assignedCompleted} รายการ`, scope_text: 'งานที่คุณซ่อมเสร็จแล้ว', color: '#28c76f', icon_class: 'icon-valid', href: '/repair-jobs' },
                { label: 'ยกเลิก (มอบหมาย)', count_text: `${assignedCancelled} รายการ`, scope_text: 'งานที่ได้รับมอบหมายแต่ยกเลิก', color: '#ea5455', icon_class: 'icon-close', href: '/repair-jobs' }
            ],
            queue_status_cards: [
                { label: 'รอดำเนินการทั้งหมด', count_text: `${queuePending} รายการ`, scope_text: 'คิวงานรอการจัดสรร', color: '#ff9f43', icon_class: 'icon-clock', href: '/repair-jobs' },
                { label: 'กำลังซ่อมทั้งหมด', count_text: `${queueInProgress} รายการ`, scope_text: 'อยู่ระหว่างดำเนินการซ่อม', color: '#00bad1', icon_class: 'icon-tools', href: '/repair-jobs' },
                { label: 'ซ่อมเสร็จทั้งหมด', count_text: `${queueCompleted} รายการ`, scope_text: 'ดำเนินการเสร็จสิ้นทั้งหมด', color: '#28c76f', icon_class: 'icon-valid', href: '/repair-jobs' },
                { label: 'ยกเลิกทั้งหมด', count_text: `${queueCancelled} รายการ`, scope_text: 'งานซ่อมที่ยกเลิกทั้งหมด', color: '#ea5455', icon_class: 'icon-close', href: '/repair-jobs' }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate dashboard cards data' });
    }
});

// Get repair dashboard department statistics
router.get('/dashboard/department', async (req, res) => {
    try {
        const allRepairs = await prisma.repairRequest.findMany({
            include: {
                requester: true
            }
        });

        const getDepartmentName = (user) => {
            const id = user.user_id;
            if (id % 5 === 1) return 'ฝ่าย IT / สารสนเทศ';
            if (id % 5 === 2) return 'ฝ่ายพัสดุและอาคาร';
            if (id % 5 === 3) return 'ฝ่ายวิศวกรรมการผลิต';
            if (id % 5 === 4) return 'ฝ่ายบริหารและการเงิน';
            return 'ฝ่ายบริการทั่วไป';
        };

        const deptMap = {};
        allRepairs.forEach(r => {
            const dept = getDepartmentName(r.requester);
            if (!deptMap[dept]) {
                deptMap[dept] = { department: dept, PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0, total: 0 };
            }
            deptMap[dept][r.status]++;
            deptMap[dept].total++;
        });

        res.json(Object.values(deptMap));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch department dashboard stats' });
    }
});

// Get repair dashboard operator statistics
router.get('/dashboard/operators', async (req, res) => {
    try {
        const allRepairs = await prisma.repairRequest.findMany();

        const opMap = {};
        allRepairs.forEach(r => {
            const op = r.repairer_name || 'ยังไม่มอบหมาย';
            if (!opMap[op]) {
                opMap[op] = { operator: op, PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0, total: 0 };
            }
            opMap[op][r.status]++;
            opMap[op].total++;
        });

        res.json(Object.values(opMap));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch operator dashboard stats' });
    }
});

// Get single repair request with history
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const repair = await prisma.repairRequest.findUnique({
            where: { repair_id: parseInt(id) },
            include: {
                item: true,
                lot: true,
                requester: {
                    select: {
                        user_id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                },
                history: {
                    orderBy: { update_date: 'desc' },
                    include: {
                        operator: {
                            select: {
                                name: true,
                                role: true
                            }
                        }
                    }
                }
            }
        });

        if (!repair) {
            return res.status(404).json({ error: 'Repair request not found' });
        }

        res.json(repair);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch repair request' });
    }
});

// Submit a new repair request
router.post('/', async (req, res) => {
    try {
        const { item_id, lot_id, requester_id, subject, description } = req.body;

        if (!requester_id || !subject || !description) {
            return res.status(400).json({ error: 'Requester ID, subject, and description are required' });
        }

        const repair = await prisma.repairRequest.create({
            data: {
                item_id: item_id ? parseInt(item_id) : null,
                lot_id: lot_id ? parseInt(lot_id) : null,
                requester_id: parseInt(requester_id),
                subject,
                description,
                status: 'PENDING'
            }
        });

        // Initialize history
        await prisma.repairHistory.create({
            data: {
                repair_id: repair.repair_id,
                status: 'PENDING',
                remark: 'สร้างใบคำขอแจ้งซ่อมสำเร็จ',
                operator_id: parseInt(requester_id)
            }
        });

        res.status(201).json(repair);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create repair request' });
    }
});

// Update repair request details and status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remark, cost, repairer_name, operator_id } = req.body;

        if (!operator_id) {
            return res.status(400).json({ error: 'Operator ID is required to update repair status' });
        }

        // Get current repair to check if status changed
        const currentRepair = await prisma.repairRequest.findUnique({
            where: { repair_id: parseInt(id) }
        });

        if (!currentRepair) {
            return res.status(404).json({ error: 'Repair request not found' });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (remark !== undefined) updateData.remark = remark;
        if (cost !== undefined) updateData.cost = cost ? parseFloat(cost) : null;
        if (repairer_name !== undefined) updateData.repairer_name = repairer_name;

        const updatedRepair = await prisma.repairRequest.update({
            where: { repair_id: parseInt(id) },
            data: updateData
        });

        // If status changed or a remark is provided, record in history
        if (status || remark) {
            await prisma.repairHistory.create({
                data: {
                    repair_id: parseInt(id),
                    status: status || currentRepair.status,
                    remark: remark || `อัปเดตสถานะเป็น ${status}`,
                    operator_id: parseInt(operator_id)
                }
            });
        }

        res.json(updatedRepair);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update repair request' });
    }
});

// Delete repair request
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.repairRequest.delete({
            where: { repair_id: parseInt(id) }
        });
        res.json({ message: 'Repair request deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete repair request' });
    }
});

module.exports = router;
