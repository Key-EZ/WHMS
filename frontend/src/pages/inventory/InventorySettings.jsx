import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Plus, Edit, Trash2, Save, X, Tag } from 'lucide-react';

const InventorySettings = () => {
    const [units, setUnits] = useState([]);
    const [years, setYears] = useState([]);
    const [loadingUnits, setLoadingUnits] = useState(true);
    const [loadingYears, setLoadingYears] = useState(true);
    
    // Unit Form States
    const [editingUnit, setEditingUnit] = useState(null);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [unitName, setUnitName] = useState('');

    const fetchUnits = async () => {
        setLoadingUnits(true);
        try {
            const response = await api.get('/units');
            setUnits(response.data);
        } catch (error) {
            console.error('Failed to fetch units', error);
        } finally {
            setLoadingUnits(false);
        }
    };

    const fetchYears = async () => {
        setLoadingYears(true);
        try {
            const response = await api.get('/years');
            setYears(response.data);
        } catch (error) {
            console.error('Failed to fetch years', error);
        } finally {
            setLoadingYears(false);
        }
    };

    useEffect(() => {
        fetchUnits();
        fetchYears();
    }, []);

    const handleOpenCreateUnit = () => {
        setEditingUnit(null);
        setUnitName('');
        setShowUnitModal(true);
    };

    const handleOpenEditUnit = (unit) => {
        setEditingUnit(unit);
        setUnitName(unit.unit_name);
        setShowUnitModal(true);
    };

    const handleDeleteUnit = async (id) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหน่วยนับนี้?')) return;
        try {
            await api.delete(`/units/${id}`);
            fetchUnits();
        } catch (error) {
            console.error('Failed to delete unit', error);
            alert('ไม่สามารถลบหน่วยนับได้ เนื่องจากมีรายการที่อ้างอิงหน่วยนับนี้อยู่');
        }
    };

    const handleUnitSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUnit) {
                await api.put(`/units/${editingUnit.unit_id}`, {
                    unit_name: unitName
                });
            } else {
                await api.post('/units', {
                    unit_name: unitName
                });
            }
            setShowUnitModal(false);
            fetchUnits();
        } catch (error) {
            console.error('Failed to save unit', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Unit List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-5 rounded-[20px] border border-slate-100/60 shadow-sm">
                        <div>
                            <h4 className="text-lg font-black text-slate-800 font-kanit">หน่วยนับพัสดุ (Units)</h4>
                            <p className="text-slate-400 text-[11px] font-medium">จัดการหน่วยนับของวัสดุและครุภัณฑ์</p>
                        </div>
                        <button
                            onClick={handleOpenCreateUnit}
                            className="w-10 h-10 rounded-xl bg-[#4361ee]/10 text-[#4361ee] hover:bg-[#4361ee]/20 flex items-center justify-center transition"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="vx-card !p-0 overflow-hidden">
                        <div className="vx-table-container">
                            <table className="vx-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">ชื่อหน่วยนับ</th>
                                        <th className="text-center w-1/3">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingUnits ? (
                                        <tr>
                                            <td colSpan="2" className="text-center py-8 text-slate-400 font-medium">กำลังโหลดข้อมูล...</td>
                                        </tr>
                                    ) : units.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="text-center py-8 text-slate-400 font-medium">ไม่มีข้อมูลหน่วยนับ</td>
                                        </tr>
                                    ) : (
                                        units.map((u) => (
                                            <tr key={u.unit_id}>
                                                <td className="font-bold text-slate-700">{u.unit_name}</td>
                                                <td className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditUnit(u)}
                                                            className="p-1.5 rounded-lg border border-slate-200/80 bg-white text-slate-400 hover:text-[#4361ee] transition"
                                                        >
                                                            <Edit size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUnit(u.unit_id)}
                                                            className="p-1.5 rounded-lg border border-slate-200/80 bg-white text-slate-400 hover:text-red-500 transition"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
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

                {/* Budget Year List */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-[20px] border border-slate-100/60 shadow-sm">
                        <h4 className="text-lg font-black text-slate-800 font-kanit">ปีงบประมาณ (Budget Years)</h4>
                        <p className="text-slate-400 text-[11px] font-medium">ข้อมูลรอบระยะเวลาและสถานะปีงบประมาณ</p>
                    </div>

                    <div className="vx-card !p-0 overflow-hidden">
                        <div className="vx-table-container">
                            <table className="vx-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">ปีงบประมาณ</th>
                                        <th className="text-left">ระยะเวลา</th>
                                        <th className="text-center">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingYears ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-slate-400 font-medium">กำลังโหลดข้อมูล...</td>
                                        </tr>
                                    ) : years.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-slate-400 font-medium">ไม่มีข้อมูลปีงบประมาณ</td>
                                        </tr>
                                    ) : (
                                        years.map((y) => (
                                            <tr key={y.year_id}>
                                                <td className="font-bold text-slate-700 font-mono">พ.ศ. {y.year_id}</td>
                                                <td className="text-xs text-slate-500 font-mono">
                                                    {new Date(y.start_date).toLocaleDateString('th-TH')} - {new Date(y.end_date).toLocaleDateString('th-TH')}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                        y.is_active 
                                                        ? 'bg-[#28c76f]/10 text-[#28c76f]' 
                                                        : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                        {y.is_active ? 'ใช้งานอยู่' : 'ปิดแล้ว'}
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

            {/* Unit Modal */}
            {showUnitModal && (
                <div className="vx-modal-overlay">
                    <div className="vx-modal-card max-w-sm">
                        <button
                            onClick={() => setShowUnitModal(false)}
                            className="vx-modal-close"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="vx-modal-title">
                            {editingUnit ? 'แก้ไขหน่วยนับ' : 'เพิ่มหน่วยนับใหม่'}
                        </h3>

                        <form onSubmit={handleUnitSubmit} className="space-y-5">
                            <div className="vx-input-group">
                                <label className="vx-label">ชื่อหน่วยนับ</label>
                                <input
                                    type="text"
                                    placeholder="เช่น เครื่อง, เครื่องพิมพ์, กล่อง..."
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    className="vx-input"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUnitModal(false)}
                                    className="vx-btn-secondary flex-1"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="vx-btn-primary flex-1"
                                >
                                    <Save size={16} />
                                    <span>บันทึก</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventorySettings;
