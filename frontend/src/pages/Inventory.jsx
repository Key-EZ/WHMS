import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/neumorphism.css';
import { Search, Package } from 'lucide-react';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get('/reports/inventory');
                setInventory(response.data);
            } catch (error) {
                console.error('Failed to fetch inventory', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filteredInventory = inventory.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lot_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#3d4468] font-kanit">คลังสินค้า</h2>
                    <p className="text-[#9499b7] font-medium">ติดตามสถานะสินค้าคงคลังแบบเรียลไทม์</p>
                </div>
                
                <div className="w-full md:w-auto">
                    <div className="neu-input-container !shadow-[8px_8px_16px_#bec3cf,-8px_-8px_16px_#ffffff] !rounded-2xl">
                        <Search className="neu-input-icon !left-4" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหารายการหรือเลขล็อต..."
                            className="!pl-12 !py-4 w-full md:w-72"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="neu-card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#e0e5ec] border-b border-[#bec3cf]/40">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-[#6c7293] uppercase tracking-wider">รายละเอียดรายการ</th>
                                <th className="px-8 py-5 text-xs font-bold text-[#6c7293] uppercase tracking-wider text-center">ประเภท</th>
                                <th className="px-8 py-5 text-xs font-bold text-[#6c7293] uppercase tracking-wider">ล็อต / ปีงบประมาณ</th>
                                <th className="px-8 py-5 text-xs font-bold text-[#6c7293] uppercase tracking-wider">วันหมดอายุ</th>
                                <th className="px-8 py-5 text-xs font-bold text-[#6c7293] uppercase tracking-wider text-right">ยอดคงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#bec3cf]/20">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[#9499b7] font-medium">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6c7293]"></div>
                                            กำลังโหลดข้อมูลสินค้า...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[#9499b7] font-medium">
                                        ไม่พบข้อมูลที่ตรงกับการค้นหา
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((row, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition duration-200">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bec3cf,-4px_-4px_8px_#ffffff] flex items-center justify-center text-[#6c7293]">
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#3d4468]">{row.item_name}</p>
                                                    <p className="text-xs text-[#9499b7]">{row.unit_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-[2px_2px_5px_#bec3cf,-2px_-2px_5px_#ffffff] ${
                                                row.item_type === 'วัสดุ' ? 'text-blue-500' : 'text-purple-500'
                                            }`}>
                                                {row.item_type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-mono font-bold text-[#3d4468]">{row.lot_number}</span>
                                                <span className="text-[10px] font-bold text-[#9499b7]">ปีงบประมาณ {row.budget_year}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-[#6c7293]">
                                                {row.expiry_date ? new Date(row.expiry_date).toLocaleDateString('th-TH') : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="inline-block px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3cf,inset_-4px_-4px_8px_#ffffff]">
                                                <span className={`font-mono font-black text-lg ${row.stock_on_hand <= 0 ? 'text-red-400' : 'text-[#3d4468]'}`}>
                                                    {row.stock_on_hand.toLocaleString()}
                                                </span>
                                            </div>
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

export default Inventory;
