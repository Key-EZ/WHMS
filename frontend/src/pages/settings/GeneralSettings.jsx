import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Home, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const GeneralSettings = () => {
    const [companyName, setCompanyName] = useState('');
    const [reportHeader, setReportHeader] = useState('');
    const [address, setAddress] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setCompanyName(response.data.company_name || '');
                setReportHeader(response.data.report_header || '');
                setAddress(response.data.address || '');
            } catch (err) {
                console.error('Failed to load settings', err);
                setError('ไม่สามารถโหลดข้อมูลการตั้งค่าได้');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/settings', {
                companyName,
                reportHeader,
                address
            });
            setSuccess(true);
            // Auto hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save settings', err);
            setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 font-medium max-w-2xl mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                กำลังโหลดข้อมูลการตั้งค่า...
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">ตั้งค่าทั่วไป (General Settings)</h2>
                <p className="text-slate-400 font-medium">ตั้งค่าข้อมูลหน่วยงาน ชื่อระบบ และหัวกระดาษรายงาน</p>
            </div>

            <div className="vx-card space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] shrink-0">
                        <Home size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold font-kanit text-lg text-slate-800">ข้อมูลระบบหลัก</h3>
                        <p className="text-xs text-slate-400">ข้อมูลชื่อแอปพลิเคชันและโลโก้</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {success && (
                        <div className="p-4 rounded-xl bg-[#28c76f]/10 text-[#28c76f] font-bold flex items-center gap-2.5 border border-[#28c76f]/20 shadow-sm">
                            <CheckCircle size={18} />
                            <span>บันทึกข้อมูลการตั้งค่าระบบเรียบร้อยแล้ว!</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 font-bold flex items-center gap-2.5 border border-red-100 shadow-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="vx-input-group">
                        <label className="vx-label">ชื่อหน่วยงาน / โรงเรียน / บริษัท</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="vx-input w-full text-sm"
                            required
                        />
                    </div>

                    <div className="vx-input-group">
                        <label className="vx-label">หัวข้อรายงาน (Report Header)</label>
                        <input
                            type="text"
                            value={reportHeader}
                            onChange={(e) => setReportHeader(e.target.value)}
                            className="vx-input w-full text-sm"
                            required
                        />
                    </div>

                    <div className="vx-input-group">
                        <label className="vx-label">ที่อยู่ / ติดต่อ</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                            className="vx-input w-full text-sm resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="vx-btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2.5 shadow-md shadow-[#4361ee]/20 hover:shadow-lg hover:shadow-[#4361ee]/30 transition"
                        >
                            {saving ? (
                                <>
                                    <Loader className="animate-spin" size={16} />
                                    <span>กำลังบันทึก...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>บันทึกข้อมูลการตั้งค่า</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeneralSettings;
