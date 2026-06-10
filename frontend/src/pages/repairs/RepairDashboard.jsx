import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import '../../styles/styles.css';
import { 
    Clock, AlertCircle, CheckCircle2, XCircle, Plus, 
    UserCheck, History, Briefcase, Wrench 
} from 'lucide-react';

const RepairDashboard = () => {
    const [cardsData, setCardsData] = useState(null);
    const [deptStats, setDeptStats] = useState([]);
    const [opStats, setOpStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cardsRes, deptRes, opRes] = await Promise.all([
                api.get('/repair/dashboard/cards'),
                api.get('/repair/dashboard/department'),
                api.get('/repair/dashboard/operators')
            ]);
            setCardsData(cardsRes.data);
            setDeptStats(deptRes.data);
            setOpStats(opRes.data);
        } catch (error) {
            console.error('Failed to fetch repair dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getIcon = (iconClass) => {
        if (iconClass === 'icon-clock') return Clock;
        if (iconClass === 'icon-tools') return Wrench;
        if (iconClass === 'icon-valid') return CheckCircle2;
        if (iconClass === 'icon-close') return XCircle;
        return Briefcase;
    };

    const renderStackedBar = (item, type = 'dept') => {
        const total = item.total || 0;
        if (total === 0) return null;
        const name = type === 'dept' ? item.department : item.operator;
        
        const pPending = (item.PENDING / total) * 100;
        const pInProgress = (item.IN_PROGRESS / total) * 100;
        const pCompleted = (item.COMPLETED / total) * 100;
        const pCancelled = (item.CANCELLED / total) * 100;

        return (
            <div key={name} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700">{name}</span>
                    <span className="text-slate-400 font-bold text-xs">{total} รายการ</span>
                </div>
                
                {/* Horizontal Stacked Bar */}
                <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    {item.PENDING > 0 && (
                        <div 
                            style={{ width: `${pPending}%` }} 
                            className="bg-[#ff9f43] h-full transition-all duration-300 relative group cursor-pointer"
                            title={`รอดำเนินการ: ${item.PENDING}`}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.PENDING}
                            </span>
                        </div>
                    )}
                    {item.IN_PROGRESS > 0 && (
                        <div 
                            style={{ width: `${pInProgress}%` }} 
                            className="bg-[#00bad1] h-full transition-all duration-300 relative group cursor-pointer"
                            title={`กำลังดำเนินการ: ${item.IN_PROGRESS}`}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.IN_PROGRESS}
                            </span>
                        </div>
                    )}
                    {item.COMPLETED > 0 && (
                        <div 
                            style={{ width: `${pCompleted}%` }} 
                            className="bg-[#28c76f] h-full transition-all duration-300 relative group cursor-pointer"
                            title={`เสร็จสิ้น: ${item.COMPLETED}`}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.COMPLETED}
                            </span>
                        </div>
                    )}
                    {item.CANCELLED > 0 && (
                        <div 
                            style={{ width: `${pCancelled}%` }} 
                            className="bg-[#ea5455] h-full transition-all duration-300 relative group cursor-pointer"
                            title={`ยกเลิก: ${item.CANCELLED}`}
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.CANCELLED}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading || !cardsData) {
        return (
            <div className="py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4361ee]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header / Subheader area matching the template */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm gap-4">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">แผงควบคุมงานแจ้งซ่อม</h3>
                    <p className="text-slate-400 text-xs font-medium">ติดตามรายการแจ้งซ่อม สถานะคิว และปริมาณภาระงานทั้งหมดในที่เดียว</p>
                </div>
                
                {/* Actions grid */}
                <div className="flex flex-wrap gap-3">
                    <Link to="/inventory-myassets" className="vx-btn-secondary text-xs font-bold py-2 px-3.5">
                        ครุภัณฑ์ของฉัน
                    </Link>
                    <Link to="/repair-request" className="vx-btn-primary text-xs font-bold py-2 px-3.5">
                        <Plus size={14} />
                        <span>ส่งแจ้งซ่อมพัสดุ</span>
                    </Link>
                    <Link to="/repair-history" className="vx-btn-secondary text-xs font-bold py-2 px-3.5 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100">
                        ประวัติแจ้งซ่อม
                    </Link>
                    {cardsData.show_queue_cards && (
                        <Link to="/repair-jobs" className="vx-btn-secondary text-xs font-bold py-2 px-3.5 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100">
                            บริหารงานซ่อม
                        </Link>
                    )}
                </div>
            </div>

            {/* 1. My Repair Requests Section */}
            <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-base font-black text-slate-800 font-kanit">การแจ้งซ่อมของฉัน (My Repair Requests)</h4>
                    <p className="text-xs text-slate-400 font-medium">ความคืบหน้าล่าสุดของใบแจ้งซ่อมพัสดุที่คุณเป็นผู้ส่งคำขอเข้ามา</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {cardsData.my_status_cards.map((card, idx) => {
                        const Icon = getIcon(card.icon_class);
                        return (
                            <Link 
                                key={idx} 
                                to={card.href} 
                                className="mockup-card block space-y-4 bg-white"
                                style={{ borderTop: `4px solid ${card.color}` }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-500">{card.label}</span>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                                        <Icon size={16} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-800 font-mono">{card.count_text}</p>
                                    <p className="text-[11px] text-slate-400 font-medium">{card.scope_text}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 2. Assigned To Me Section */}
            {cardsData.show_assigned_cards && (
                <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-2">
                        <h4 className="text-base font-black text-slate-800 font-kanit">ได้รับมอบหมายให้ฉัน (Assigned To Me)</h4>
                        <p className="text-xs text-slate-400 font-medium">รายการงานที่ประเมินและได้รับมอบหมายให้คุณเป็นผู้ดำเนินการซ่อมแซมล่าสุด</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {cardsData.assigned_status_cards.map((card, idx) => {
                            const Icon = getIcon(card.icon_class);
                            return (
                                <Link 
                                    key={idx} 
                                    to={card.href} 
                                    className="mockup-card block space-y-4 bg-white"
                                    style={{ borderTop: `4px solid ${card.color}` }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500">{card.label}</span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                                            <Icon size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-800 font-mono">{card.count_text}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">{card.scope_text}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3. All Repair Queue Section */}
            {cardsData.show_queue_cards && (
                <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-2">
                        <h4 className="text-base font-black text-slate-800 font-kanit">คิวงานซ่อมทั้งหมดในระบบ (All Repair Queue)</h4>
                        <p className="text-xs text-slate-400 font-medium">ตารางประเมินคิวงานแจ้งซ่อมจำแนกตามขั้นตอนการดำเนินงานทั้งหมดของระบบ</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {cardsData.queue_status_cards.map((card, idx) => {
                            const Icon = getIcon(card.icon_class);
                            return (
                                <Link 
                                    key={idx} 
                                    to={card.href} 
                                    className="mockup-card block space-y-4 bg-white"
                                    style={{ borderTop: `4px solid ${card.color}` }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500">{card.label}</span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                                            <Icon size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-800 font-mono">{card.count_text}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">{card.scope_text}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Charts Section */}
            {cardsData.show_queue_cards && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Department Chart Card */}
                    <div className="mockup-card space-y-6 md:col-span-2">
                        <div className="border-b border-slate-100 pb-4">
                            <h4 className="text-base font-black text-slate-800 font-kanit">งานแจ้งซ่อมแยกตามฝ่าย/แผนก (By Department)</h4>
                            <p className="text-xs text-slate-400 font-medium">สถิติจำนวนงานซ่อมค้างและงานที่ซ่อมเสร็จจำแนกตามฝ่ายงานผู้ใช้</p>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 text-xs font-bold pb-2 justify-center border-b border-slate-100">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ff9f43]"></span>รอดำเนินการ</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00bad1]"></span>กำลังดำเนินการ</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#28c76f]"></span>เสร็จสิ้น</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ea5455]"></span>ยกเลิก</span>
                        </div>

                        <div className="space-y-4">
                            {deptStats.length === 0 ? (
                                <p className="text-center text-slate-400 py-10 font-medium text-sm">ไม่มีข้อมูลการทำแผนก</p>
                            ) : (
                                deptStats.map(item => renderStackedBar(item, 'dept'))
                            )}
                        </div>
                    </div>

                    {/* Operator Chart Card */}
                    <div className="mockup-card space-y-6 md:col-span-2">
                        <div className="border-b border-slate-100 pb-4">
                            <h4 className="text-base font-black text-slate-800 font-kanit">ภาระงานซ่อมแยกตามรายช่าง (By Operator)</h4>
                            <p className="text-xs text-slate-400 font-medium">สถิติปริมาณคิวงานซ่อมที่ได้รับมอบหมายแยกตามตัวบุคคลช่างซ่อม</p>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 text-xs font-bold pb-2 justify-center border-b border-slate-100">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ff9f43]"></span>รอดำเนินการ</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00bad1]"></span>กำลังดำเนินการ</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#28c76f]"></span>เสร็จสิ้น</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ea5455]"></span>ยกเลิก</span>
                        </div>

                        <div className="space-y-4">
                            {opStats.length === 0 ? (
                                <p className="text-center text-slate-400 py-10 font-medium text-sm">ไม่มีข้อมูลภาระงานช่าง</p>
                            ) : (
                                opStats.map(item => renderStackedBar(item, 'operator'))
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default RepairDashboard;
