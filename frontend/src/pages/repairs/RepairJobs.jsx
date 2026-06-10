import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Edit, Save, X, RefreshCw, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

const RepairJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [editRemark, setEditRemark] = useState('');
    const [editCost, setEditCost] = useState('');
    const [editRepairer, setEditRepairer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/repairs');
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to fetch repair jobs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleOpenEdit = (job) => {
        setSelectedJob(job);
        setEditStatus(job.status);
        setEditRemark(job.remark || '');
        setEditCost(job.cost ? parseFloat(job.cost).toString() : '');
        setEditRepairer(job.repairer_name || '');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedJob) return;

        setSubmitting(true);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{"id": 1}');

        try {
            await api.put(`/repairs/${selectedJob.repair_id}`, {
                status: editStatus,
                remark: editRemark,
                cost: editCost ? parseFloat(editCost) : null,
                repairer_name: editRepairer,
                operator_id: currentUser.id || 1
            });
            setSelectedJob(null);
            fetchJobs();
        } catch (error) {
            console.error('Failed to update repair job', error);
            alert('ไม่สามารถอัปเดตงานซ่อมได้');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { text: 'รอดำเนินการ', color: 'bg-[#ff9f43]/10 text-[#ff9f43]', icon: Clock },
            IN_PROGRESS: { text: 'กำลังดำเนินการ', color: 'bg-[#00bad1]/10 text-[#00bad1]', icon: AlertCircle },
            COMPLETED: { text: 'เสร็จสิ้น', color: 'bg-[#28c76f]/10 text-[#28c76f]', icon: CheckCircle2 },
            CANCELLED: { text: 'ยกเลิก', color: 'bg-[#ea5455]/10 text-[#ea5455]', icon: XCircle }
        };
        const badge = badges[status] || { text: status, color: 'bg-slate-100 text-slate-500', icon: Clock };
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
            {/* Header section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">บริหารจัดการงานซ่อมแซมทั้งหมด</h3>
                    <p className="text-slate-400 text-xs font-medium">ติดตามสถานะงาน อัปเดตช่าง และบันทึกค่าใช้จ่ายดำเนินการ</p>
                </div>
                
                <button 
                    onClick={fetchJobs}
                    className="w-10 h-10 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 flex items-center justify-center text-[#6c7293] transition"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left">เรื่อง / ปัญหา</th>
                                <th className="text-left">พัสดุ</th>
                                <th className="text-left">ผู้แจ้ง</th>
                                <th className="text-center">สถานะ</th>
                                <th className="text-right">ค่าใช้จ่าย (บาท)</th>
                                <th className="text-center">ช่างผู้รับผิดชอบ</th>
                                <th className="text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดรายการแจ้งซ่อม...
                                        </div>
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบรายการแจ้งซ่อมในระบบ
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((row) => (
                                    <tr key={row.repair_id}>
                                        <td>
                                            <div>
                                                <p className="font-bold text-slate-700">{row.subject}</p>
                                                <p className="text-xs text-slate-400 font-medium max-w-xs truncate">{row.description}</p>
                                            </div>
                                        </td>
                                        <td className="font-bold text-slate-600">
                                            {row.item?.item_name || 'ไม่ระบุ'}
                                        </td>
                                        <td className="text-sm text-slate-500 font-semibold">
                                            {row.requester?.name || row.requester?.email || 'ไม่ทราบชื่อ'}
                                        </td>
                                        <td className="text-center">
                                            {getStatusBadge(row.status)}
                                        </td>
                                        <td className="text-right font-mono font-bold text-slate-800">
                                            {row.cost ? parseFloat(row.cost).toLocaleString() : '-'}
                                        </td>
                                        <td className="text-center text-sm font-semibold text-slate-500">
                                            {row.repairer_name || '-'}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleOpenEdit(row)}
                                                className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-[#4361ee] transition"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {selectedJob && (
                <div className="vx-modal-overlay">
                    <div className="vx-modal-card max-w-xl">
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="vx-modal-close"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="vx-modal-title">
                            อัปเดตสถานะการดำเนินการซ่อมพัสดุ
                        </h3>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">เรื่องที่แจ้งซ่อม</p>
                                <p className="font-bold text-slate-800 text-lg">{selectedJob.subject}</p>
                                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl mt-2 font-medium">
                                    {selectedJob.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="vx-input-group">
                                    <label className="vx-label">สถานะงานซ่อม</label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="vx-input text-sm"
                                    >
                                        <option value="PENDING">รอดำเนินการ</option>
                                        <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                                        <option value="COMPLETED">เสร็จสิ้น</option>
                                        <option value="CANCELLED">ยกเลิก</option>
                                    </select>
                                </div>

                                <div className="vx-input-group">
                                    <label className="vx-label">ค่าซ่อมแซม (บาท)</label>
                                    <input
                                        type="number"
                                        placeholder="ค่าใช้จ่าย..."
                                        value={editCost}
                                        onChange={(e) => setEditCost(e.target.value)}
                                        className="vx-input text-sm"
                                    />
                                </div>
                            </div>

                            <div className="vx-input-group">
                                <label className="vx-label">ช่างผู้รับผิดชอบ / หน่วยงานซ่อม</label>
                                <input
                                    type="text"
                                    placeholder="ระบุชื่อช่าง..."
                                    value={editRepairer}
                                    onChange={(e) => setEditRepairer(e.target.value)}
                                    className="vx-input text-sm"
                                />
                            </div>

                            <div className="vx-input-group">
                                <label className="vx-label">หมายเหตุการดำเนินการ / วิธีแก้ไข</label>
                                <textarea
                                    placeholder="ระบุหมายเหตุการซ่อมแซม หรือรายละเอียดการดำเนินการ..."
                                    value={editRemark}
                                    onChange={(e) => setEditRemark(e.target.value)}
                                    rows="3"
                                    className="vx-input text-sm resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedJob(null)}
                                    className="vx-btn-secondary flex-1"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="vx-btn-primary flex-1"
                                >
                                    <Save size={16} />
                                    <span>{submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairJobs;
