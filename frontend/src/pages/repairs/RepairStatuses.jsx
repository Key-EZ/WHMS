import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Clock, AlertCircle, CheckCircle2, XCircle, User, Calendar, Wrench, Package } from 'lucide-react';

const RepairStatuses = () => {
    const [inProgressRepairs, setInProgressRepairs] = useState([]);
    const [loading, setLoading] = useState(true);

    const statuses = [
        {
            name: 'รอดำเนินการ (PENDING)',
            desc: 'งานแจ้งซ่อมใหม่ที่ส่งเข้ามารอเจ้าหน้าที่ตรวจสอบและประเมินอาการเบื้องต้น',
            color: 'text-[#ff9f43]',
            bgColor: 'bg-[#ff9f43]/10',
            textColor: 'text-[#ff9f43]',
            icon: Clock
        },
        {
            name: 'กำลังดำเนินการ (IN_PROGRESS)',
            desc: 'งานซ่อมอยู่ระหว่างการวิเคราะห์ ตรวจสอบ หรือจัดหาอะไหล่โดยช่างผู้รับผิดชอบ',
            color: 'text-[#00bad1]',
            bgColor: 'bg-[#00bad1]/10',
            textColor: 'text-[#00bad1]',
            icon: AlertCircle
        },
        {
            name: 'เสร็จสิ้น (COMPLETED)',
            desc: 'งานซ่อมได้รับการแก้ไขเสร็จสมบูรณ์ และส่งมอบคืนผู้แจ้งหรือเปิดใช้งานเรียบร้อย',
            color: 'text-[#28c76f]',
            bgColor: 'bg-[#28c76f]/10',
            textColor: 'text-[#28c76f]',
            icon: CheckCircle2
        },
        {
            name: 'ยกเลิก (CANCELLED)',
            desc: 'ใบแจ้งซ่อมถูกยกเลิกเนื่องจากข้อมูลไม่ถูกต้อง หรือไม่สามารถดำเนินการซ่อมแซมได้',
            color: 'text-[#ea5455]',
            bgColor: 'bg-[#ea5455]/10',
            textColor: 'text-[#ea5455]',
            icon: XCircle
        }
    ];

    const fetchInProgressRepairs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/repairs?status=IN_PROGRESS');
            setInProgressRepairs(response.data);
        } catch (error) {
            console.error('Failed to fetch in progress repairs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInProgressRepairs();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header section matching other WHMS pages */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 font-kanit">คำอธิบายและรายการสัญลักษณ์สถานะ</h3>
                <p className="text-slate-400 text-xs font-medium">ทำความเข้าใจขั้นตอนและสัญลักษณ์สถานะงานแจ้งซ่อมในระบบ</p>
            </div>

            {/* Statuses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statuses.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="vx-card flex items-start gap-5 p-6 hover:shadow-md transition-shadow duration-200">
                            <div className={`w-14 h-14 rounded-2xl ${s.bgColor} ${s.textColor} flex items-center justify-center shrink-0`}>
                                <Icon size={26} />
                            </div>
                            <div className="space-y-2">
                                <h4 className={`font-black font-kanit text-lg ${s.color}`}>{s.name}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* In Progress Equipment Section */}
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 font-kanit flex items-center gap-2">
                            <AlertCircle size={20} className="text-[#00bad1]" />
                            <span>รายการอุปกรณ์ที่กำลังดำเนินการซ่อม (IN_PROGRESS)</span>
                        </h3>
                        <p className="text-slate-400 text-xs font-medium">แสดงพัสดุครุภัณฑ์ที่อยู่ระหว่างขั้นตอนการแก้ไขปรับปรุงของช่าง</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#00bad1]/10 text-[#00bad1] text-xs font-black self-start sm:self-auto">
                        {inProgressRepairs.length} รายการ
                    </span>
                </div>

                {loading ? (
                    <div className="vx-card py-12 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bad1]"></div>
                    </div>
                ) : inProgressRepairs.length === 0 ? (
                    <div className="vx-card py-10 text-center text-slate-400 font-medium">
                        ไม่มีอุปกรณ์ที่อยู่ระหว่างการดำเนินการซ่อมในขณะนี้
                    </div>
                ) : (
                    <div className="vx-card py-12 flex justify-center items-center">
                        {inProgressRepairs.map((repair) => (
                            <div key={repair.repair_id} className="vx-card p-6 border-l-4 border-l-[#00bad1] hover:shadow-md transition duration-200 space-y-4 bg-white">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                            <Package size={16} className="text-slate-400" />
                                            {repair.item?.item_name || 'ไม่ระบุชื่อพัสดุ'}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium font-mono">ID งาน: #{repair.repair_id}</p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-[#00bad1]/10 text-[#00bad1] text-[10px] font-black uppercase">
                                        กำลังซ่อม
                                    </span>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">อาการชำรุดที่แจ้ง</p>
                                    <p className="text-sm font-bold text-slate-700">{repair.subject}</p>
                                    {repair.description && (
                                        <p className="text-xs text-slate-500 font-medium">{repair.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        <span>ผู้แจ้ง: {repair.requester?.name || 'ไม่ระบุชื่อ'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>วันที่แจ้ง: {new Date(repair.request_date).toLocaleDateString('th-TH')}</span>
                                    </div>
                                </div>

                                {repair.repairer_name && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#00bad1] bg-[#00bad1]/5 p-2.5 rounded-lg border border-[#00bad1]/10">
                                        <Wrench size={14} />
                                        <span>ช่างผู้รับผิดชอบ: {repair.repairer_name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairStatuses;
