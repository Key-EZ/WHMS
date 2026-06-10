import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { User, Package } from 'lucide-react';

const Holders = () => {
    const [holders, setHolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHolders = async () => {
            try {
                // Get users list to show as holders
                const response = await api.get('/users');
                // Mock assets assigned to users for premium representation
                const userList = response.data.map((u, index) => {
                    const assets = index === 0 ? [
                        { name: 'เครื่องคอมพิวเตอร์ Lenovo Core i5', code: 'COM-67-001' },
                        { name: 'จอแสดงผล Dell 24"', code: 'MON-67-010' }
                    ] : index === 1 ? [
                        { name: 'เครื่องพิมพ์ HP LaserJet', code: 'PRN-67-003' }
                    ] : [];
                    return { ...u, assets };
                });
                setHolders(userList);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHolders();
    }, []);

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">ผู้ครอบครอง (Holder)</h2>
                <p className="text-slate-400 font-medium">รายชื่อผู้ครอบครองและครุภัณฑ์ที่อยู่ในความรับผิดชอบ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-2 text-center py-20 text-slate-400 font-medium">กำลังโหลดข้อมูล...</div>
                ) : holders.length === 0 ? (
                    <div className="col-span-2 text-center py-20 text-slate-400 font-medium">ไม่พบข้อมูลผู้ครอบครอง</div>
                ) : (
                    holders.map((holder) => (
                        <div key={holder.user_id} className="vx-card space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] shrink-0">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold font-kanit text-lg text-slate-800">{holder.name || holder.email}</h3>
                                    <p className="text-xs text-slate-400">{holder.role} - {holder.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ครุภัณฑ์ในครอบครอง ({holder.assets?.length || 0})</p>
                                {holder.assets?.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">ไม่มีพัสดุในความรับผิดชอบ</p>
                                ) : (
                                    <div className="space-y-3">
                                        {holder.assets.map((asset, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-[#f8f7fa] border border-[#dbdade]/50 flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-slate-500" />
                                                    <span className="font-semibold text-slate-700">{asset.name}</span>
                                                </div>
                                                <span className="font-mono text-xs font-bold text-slate-400">{asset.code}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Holders;
