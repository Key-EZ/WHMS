import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Search, Package } from 'lucide-react';

const InventoryAssets = () => {
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
        <div className="space-y-8">
            {/* Search header bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">สถิติและล็อตพัสดุในคลังสินค้า</h3>
                    <p className="text-slate-400 text-xs font-medium">รายการล็อตสิ่งของแยกตามเลขนำเข้าและวันหมดอายุ</p>
                </div>

                <div className="w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหารายการหรือเลขล็อต..."
                            className="vx-input !pl-12 w-full md:w-72"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left">รายละเอียดรายการ</th>
                                <th className="text-center">ประเภท</th>
                                <th className="text-left">ล็อต / ปีงบประมาณ</th>
                                <th className="text-left">วันหมดอายุ</th>
                                <th className="text-right">ยอดคงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดข้อมูลสินค้า...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบข้อมูลที่ตรงกับการค้นหา
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700">{row.item_name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{row.unit_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${
                                                row.item_type === 'วัสดุ' 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                {row.item_type}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-mono font-bold text-slate-700">{row.lot_number}</span>
                                                <span className="text-[10px] font-bold text-slate-400">ปีงบประมาณ {row.budget_year}</span>
                                            </div>
                                        </td>
                                        <td className="text-slate-500 font-semibold text-sm">
                                            {row.expiry_date ? new Date(row.expiry_date).toLocaleDateString('th-TH') : 'ไม่มีกำหนด'}
                                        </td>
                                        <td className="text-right">
                                            <span className={`font-mono font-black text-lg ${row.stock_on_hand <= 0 ? 'text-red-500' : 'text-[#4361ee]'}`}>
                                                {row.stock_on_hand.toLocaleString()}
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
    );
};

export default InventoryAssets;
