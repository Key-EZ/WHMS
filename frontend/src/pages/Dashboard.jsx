import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/neumorphism.css';
import { Package, AlertTriangle, Calendar } from 'lucide-react';

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
        <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard 
                    title="รายการทั้งหมด" 
                    value={stockBalance.length} 
                    icon={<Package size={24} />} 
                />
                <StatCard 
                    title="ใกล้หมดอายุ" 
                    value={expiringItems.length} 
                    icon={<AlertTriangle size={24} />} 
                    color="text-red-500" 
                />
                <StatCard 
                    title="ปีงบประมาณ" 
                    value={`พ.ศ. ${selectedYear}`} 
                    icon={<Calendar size={24} />} 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Stock Balance Table */}
                <div className="neu-card">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[#3d4468] font-kanit">ยอดคงเหลือ ({selectedYear})</h2>
                        <div className="px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3cf,inset_-4px_-4px_8px_#ffffff] text-xs font-bold text-[#6c7293]">
                            สินค้าคงคลัง
                        </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-2xl bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#bec3cf,inset_-6px_-6px_12px_#ffffff]">
                        <table className="w-full text-left">
                            <thead className="bg-[#e0e5ec] border-b border-[#bec3cf]/30">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[#6c7293] uppercase">ชื่อรายการ</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-[#6c7293] uppercase">จำนวนคงเหลือ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-[#9499b7]">กำลังโหลดข้อมูล...</td>
                                    </tr>
                                ) : stockBalance.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-[#9499b7]">ไม่พบข้อมูลสต็อก</td>
                                    </tr>
                                ) : (
                                    stockBalance.map((item, index) => (
                                        <tr key={index} className="border-b border-[#bec3cf]/10 hover:bg-white/10 transition">
                                            <td className="px-6 py-4 font-semibold text-[#3d4468]">{item.item_name}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`font-mono font-bold ${item.current_stock <= 0 ? 'text-red-400' : 'text-emerald-500'}`}>
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

                {/* Expiring Items Table */}
                <div className="neu-card">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[#3d4468] font-kanit">รายการใกล้หมดอายุ</h2>
                        <div className="px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3cf,inset_-4px_-4px_8px_#ffffff] text-xs font-bold text-red-400">
                            แจ้งเตือน
                        </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-2xl bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#bec3cf,inset_-6px_-6px_12px_#ffffff]">
                        <table className="w-full text-left">
                            <thead className="bg-[#e0e5ec] border-b border-[#bec3cf]/30">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[#6c7293] uppercase">ชื่อรายการ</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-[#6c7293] uppercase">เหลือเวลา (วัน)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-[#9499b7]">กำลังโหลดข้อมูล...</td>
                                    </tr>
                                ) : expiringItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-[#9499b7]">ไม่มีรายการใกล้หมดอายุ</td>
                                    </tr>
                                ) : (
                                    expiringItems.map((item, index) => (
                                        <tr key={index} className="border-b border-[#bec3cf]/10 hover:bg-white/10 transition">
                                            <td className="px-6 py-4 font-semibold text-[#3d4468] truncate max-w-[200px]" title={item.item_name}>
                                                {item.item_name}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-[2px_2px_5px_#bec3cf,-2px_-2px_5px_#ffffff] ${
                                                    item.days_left < 30 ? 'text-red-500' :
                                                    item.days_left < 90 ? 'text-orange-500' :
                                                    'text-yellow-600'
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

const StatCard = ({ title, value, icon, color = "text-[#3d4468]" }) => (
    <div className="neu-card flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#bec3cf,-6px_-6px_12px_#ffffff] flex items-center justify-center text-[#6c7293]">
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-[#9499b7] uppercase tracking-wider mb-1">{title}</p>
            <p className={`text-3xl font-black font-kanit ${color}`}>{value}</p>
        </div>
    </div>
);

export default Dashboard;
