import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Calendar, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

const RepairHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
            try {
                const response = await api.get(`/repairs?requester_id=${currentUser.id || 1}`);
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch repair history', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { text: 'รอดำเนินการ', color: 'bg-[#ff9f43]/10 text-[#ff9f43]', icon: Clock },
            IN_PROGRESS: { text: 'กำลังดำเนินการ', color: 'bg-[#00bad1]/10 text-[#00bad1]', icon: AlertCircle },
            COMPLETED: { text: 'เสร็จสิ้น', color: 'bg-[#28c76f]/10 text-[#28c76f]', icon: CheckCircle2 },
            CANCELLED: { text: 'ยกเลิก', color: 'bg-[#ea5455]/10 text-[#ea5455]', icon: XCircle }
        };
        const badge = badges[status] || { text: status, color: 'bg-slate-50 text-slate-500', icon: Clock };
        const Icon = badge.icon;
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${badge.color}`}>
                <Icon size={12} />
                {badge.text}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header info */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 font-kanit">ประวัติการแจ้งซ่อมของฉัน</h3>
                <p className="text-slate-400 text-xs font-medium">ติดตามและดูความคืบหน้าสถานะการซ่อมพัสดุอุปกรณ์</p>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left">เรื่อง / อาการที่แจ้ง</th>
                                <th className="text-left">อุปกรณ์</th>
                                <th className="text-left">วันที่แจ้ง</th>
                                <th className="text-center">สถานะ</th>
                                <th className="text-right">ค่าซ่อม (บาท)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดประวัติแจ้งซ่อม...
                                        </div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบประวัติการส่งซ่อม
                                    </td>
                                </tr>
                            ) : (
                                history.map((row) => (
                                    <tr key={row.repair_id}>
                                        <td>
                                            <div>
                                                <p className="font-bold text-slate-700">{row.subject}</p>
                                                <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{row.description}</p>
                                            </div>
                                        </td>
                                        <td className="font-bold text-slate-600">
                                            {row.item?.item_name || 'ไม่ระบุ'}
                                        </td>
                                        <td className="text-sm text-slate-500 font-semibold">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(row.request_date).toLocaleDateString('th-TH')}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {getStatusBadge(row.status)}
                                        </td>
                                        <td className="text-right font-mono font-bold text-slate-800">
                                            {row.cost ? parseFloat(row.cost).toLocaleString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RepairHistory;
