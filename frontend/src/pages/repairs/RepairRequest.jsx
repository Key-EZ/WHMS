import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

const RepairRequest = () => {
    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data);
            } catch (err) {
                console.error('Failed to fetch items', err);
            }
        };
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const currentUser = JSON.parse(localStorage.getItem('user') || '{"id": 1}');

        try {
            await api.post('/repairs', {
                item_id: itemId ? parseInt(itemId) : null,
                requester_id: currentUser.id || 1,
                subject,
                description
            });
            setSuccess(true);
            setItemId('');
            setSubject('');
            setDescription('');
        } catch (err) {
            console.error('Failed to submit repair request', err);
            setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งคำขอแจ้งซ่อม');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="vx-card">
                <h3 className="text-xl font-black text-slate-800 font-kanit mb-6 pb-4 border-b border-slate-100">
                    ยื่นคำขอส่งซ่อมอุปกรณ์
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {success && (
                        <div className="p-4 rounded-xl bg-[#28c76f]/10 text-[#28c76f] font-bold flex items-center gap-2.5 border border-[#28c76f]/20 shadow-sm">
                            <CheckCircle size={18} />
                            <span>ส่งใบแจ้งซ่อมเรียบร้อยแล้ว! เจ้าหน้าที่จะดำเนินการโดยเร็วที่สุด</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 font-bold flex items-center gap-2.5 border border-red-100 shadow-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="vx-input-group">
                        <label className="vx-label">อุปกรณ์ / พัสดุที่ต้องการแจ้งซ่อม</label>
                        <select
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            className="vx-input w-full"
                            required
                        >
                            <option value="">-- เลือกอุปกรณ์/พัสดุ --</option>
                            {items.map((item) => (
                                <option key={item.item_id} value={item.item_id}>
                                    {item.item_name} {item.category?.category_name ? `(${item.category.category_name})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="vx-input-group">
                        <label className="vx-label">เรื่องที่แจ้งซ่อม / ปัญหาที่พบ</label>
                        <input
                            type="text"
                            placeholder="เช่น หน้าจอเปิดไม่ติด, เครื่องปริ้นหมึกหมด..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="vx-input"
                            required
                        />
                    </div>

                    <div className="vx-input-group">
                        <label className="vx-label">รายละเอียดอาการชำรุดเพิ่มเติม</label>
                        <textarea
                            placeholder="ระบุรายละเอียดเพิ่มเติม เช่น อาการชำรุด, สถานที่ตั้งเครื่องพัสดุ..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            className="vx-input resize-none"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="vx-btn-primary w-full mt-4"
                    >
                        <Send size={16} />
                        <span>{loading ? 'กำลังส่งข้อมูล...' : 'ส่งใบแจ้งซ่อมออนไลน์'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RepairRequest;
