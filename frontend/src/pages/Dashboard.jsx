import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/styles.css';
import { Package, AlertTriangle, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [expiringItems, setExpiringItems] = useState([]);
    const [stockBalance, setStockBalance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear] = useState(2567);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [expResponse, balanceResponse] = await Promise.all([
                    api.get('/reports/expiring'),
                    api.get(`/reports/stock-balance/${selectedYear}`)
                ]);
                setExpiringItems(expResponse.data);
                setStockBalance(balanceResponse.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedYear]);

    return (
        <div className="space-y-8">
            {/* Top Cards Section - Matches the Quixotic Balance & Goal visual elements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Card: Main Green Card - Inspired by the green credit card/balance goal */}
                <div className="bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] text-white rounded-xl p-8 shadow-md shadow-[#4361ee]/20 flex flex-col justify-between h-56 relative overflow-hidden">
                    {/* Background shapes */}
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none"></div>
                    <div className="absolute right-12 top-4 w-16 h-16 bg-white/5 rounded-full pointer-events-none"></div>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">มูลค่าหรือพัสดุคงเหลือในคลัง</p>
                            <h3 className="text-3xl font-black font-kanit mt-1">ทะเบียนสินค้าหลัก</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-white/80 text-xs font-bold">รายการสินค้าคงเหลือทั้งหมด</p>
                        <p className="text-4xl font-black font-mono">
                            {loading ? '...' : stockBalance.length.toLocaleString()} <span className="text-xl font-bold">รายการ</span>
                        </p>
                    </div>
                </div>

                {/* Center Card: Alert Items Card */}
                <div className="vx-card flex flex-col justify-between h-56">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">การแจ้งเตือนพัสดุใกล้หมดอายุ</p>
                            <h3 className="text-2xl font-black text-slate-800 font-kanit mt-1">ใกล้หมดอายุ</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-slate-400 text-xs font-bold">ต้องได้รับการจัดการ</p>
                            <p className="text-4xl font-black text-red-500 font-mono mt-1">
                                {loading ? '...' : expiringItems.length} <span className="text-xl font-bold font-kanit">รายการ</span>
                            </p>
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                            ด่วนที่สุด
                        </span>
                    </div>
                </div>

                {/* Right Card: Budget Year Card */}
                <div className="vx-card flex flex-col justify-between h-56">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">ปีงบประมาณใช้งานปัจจุบัน</p>
                            <h3 className="text-2xl font-black text-slate-800 font-kanit mt-1">พ.ศ. {selectedYear}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <Calendar size={20} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-bold">สถานะดำเนินการ</p>
                        <p className="text-xl font-black text-[#4361ee] flex items-center gap-1.5 mt-2">
                            <CheckCircle size={18} />
                            <span>เปิดใช้งานระบบคลังสินค้า</span>
                        </p>
                    </div>
                </div>

            </div>

            {/* Tables Area - Matches the Payment History and Engagement Rate Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* Stock Balance List */}
                <div className="vx-card">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 font-kanit">ยอดพัสดุคงคลังสูงสุด</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">รายงานยอดคงคลังของสินค้าในรอบปีงบประมาณ</p>
                        </div>
                        <span className="text-xs font-bold text-[#4361ee] bg-[#4361ee]/10 px-3 py-1.5 rounded-xl">
                            สินค้าทั้งหมด
                        </span>
                    </div>

                    <div className="vx-table-container">
                        <table className="vx-table">
                            <thead>
                                <tr>
                                    <th className="text-left">ชื่อรายการ</th>
                                    <th className="text-right">จำนวนคงเหลือ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-10 text-slate-400 font-medium">กำลังโหลดข้อมูลสต็อก...</td>
                                    </tr>
                                ) : stockBalance.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-10 text-slate-400 font-medium">ไม่พบข้อมูลพัสดุในคลัง</td>
                                    </tr>
                                ) : (
                                    stockBalance.slice(0, 5).map((item, index) => (
                                        <tr key={index}>
                                            <td className="font-semibold text-slate-700">{item.item_name}</td>
                                            <td className="text-right">
                                                <span className={`font-mono font-bold text-base ${item.current_stock <= 0 ? 'text-red-500' : 'text-slate-800'}`}>
                                                    {item.current_stock.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expiring Items List */}
                <div className="vx-card">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 font-kanit">พัสดุ/อุปกรณ์ใกล้หมดอายุ</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">แจ้งเตือนสินค้าล็อตที่จะสิ้นสุดอายุการใช้งานเร็วๆ นี้</p>
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl">
                            แจ้งเตือนด่วน
                        </span>
                    </div>

                    <div className="vx-table-container">
                        <table className="vx-table">
                            <thead>
                                <tr>
                                    <th className="text-left">ชื่อรายการ</th>
                                    <th className="text-right">เหลือวันหมดอายุ (วัน)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-10 text-slate-400 font-medium">กำลังโหลดข้อมูลพัสดุ...</td>
                                    </tr>
                                ) : expiringItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-10 text-slate-400 font-medium">ไม่มีรายการแจ้งเตือนหมดอายุ</td>
                                    </tr>
                                ) : (
                                    expiringItems.slice(0, 5).map((item, index) => (
                                        <tr key={index}>
                                            <td className="font-semibold text-slate-700 truncate max-w-[200px]" title={item.item_name}>
                                                {item.item_name}
                                            </td>
                                            <td className="text-right">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    item.days_left < 30 ? 'bg-red-50 text-red-500' :
                                                    item.days_left < 90 ? 'bg-amber-50 text-amber-600' :
                                                    'bg-slate-50 text-slate-500'
                                                }`}>
                                                    {item.days_left} วัน
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
