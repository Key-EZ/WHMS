import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Plus, Edit, Trash2, Save, X, Search, Package } from 'lucide-react';

const ItemRows = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form States
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [itemType, setItemType] = useState('MATERIAL');
    const [minStock, setMinStock] = useState('0');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, catRes, unitRes] = await Promise.all([
                api.get('/items'),
                api.get('/categories'),
                api.get('/units')
            ]);
            setItems(itemsRes.data);
            setCategories(catRes.data);
            setUnits(unitRes.data);
        } catch (error) {
            console.error('Failed to fetch item metadata', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setName('');
        setCategoryId('');
        setUnitId('');
        setItemType('MATERIAL');
        setMinStock('0');
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setName(item.item_name);
        setCategoryId(item.category_id ? item.category_id.toString() : '');
        setUnitId(item.unit_id ? item.unit_id.toString() : '');
        setItemType(item.item_type);
        setMinStock(item.min_stock.toString());
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรายการสิ่งของนี้?')) return;
        try {
            await api.delete(`/items/${id}`);
            fetchData();
        } catch (error) {
            console.error('Failed to delete item', error);
            alert('ไม่สามารถลบรายการได้ เนื่องจากอาจมีประวัติการใช้หรือล็อตสต็อกค้างอยู่');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            item_name: name,
            category_id: categoryId ? parseInt(categoryId) : null,
            unit_id: unitId ? parseInt(unitId) : null,
            item_type: itemType,
            min_stock: parseInt(minStock) || 0
        };

        try {
            if (editingItem) {
                await api.put(`/items/${editingItem.item_id}`, payload);
            } else {
                await api.post('/items', payload);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save item', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Search Header Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">รายชื่อวัสดุและครุภัณฑ์ทั้งหมด</h3>
                    <p className="text-slate-400 text-xs font-medium">จัดการ เพิ่ม ลบ แก้ไข ข้อมูลสิ่งของภายในระบบคลังพัสดุ</p>
                </div>
                
                <div className="w-full md:w-auto flex gap-4">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อรายการ..."
                            className="vx-input !pl-12 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="vx-btn-primary"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">เพิ่มพัสดุ</span>
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left">ชื่อรายการ</th>
                                <th className="text-left">ประเภท</th>
                                <th className="text-left">หมวดหมู่</th>
                                <th className="text-left">หน่วยนับ</th>
                                <th className="text-right">จำนวนเตือนขั้นต่ำ</th>
                                <th className="text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดรายการสิ่งของ...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบข้อมูลรายการสิ่งของ
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((row) => (
                                    <tr key={row.item_id}>
                                        <td className="font-bold text-slate-750">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    <Package size={14} />
                                                </div>
                                                {row.item_name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                                row.item_type === 'วัสดุ' 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                {row.item_type}
                                            </span>
                                        </td>
                                        <td className="text-slate-500 font-medium">{row.category?.category_name || '-'}</td>
                                        <td className="text-slate-500 font-medium">{row.unit?.unit_name || '-'}</td>
                                        <td className="text-right font-mono font-bold text-slate-800">
                                            {row.min_stock.toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-[#4361ee] transition"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.item_id)}
                                                    className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 transition"
                                                >
                                                    <Trash2 size={14} />
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

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="vx-modal-overlay">
                    <div className="vx-modal-card max-w-lg">
                        <button
                            onClick={() => setShowModal(false)}
                            className="vx-modal-close"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="vx-modal-title">
                            {editingItem ? 'แก้ไขรายละเอียดพัสดุ' : 'เพิ่มรายละเอียดพัสดุใหม่'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="vx-input-group">
                                <label className="vx-label">ชื่อรายการพัสดุ/ครุภัณฑ์</label>
                                <input
                                    type="text"
                                    placeholder="เช่น เครื่องปรับอากาศ LG, กระดาษ A4..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="vx-input"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="vx-input-group">
                                    <label className="vx-label">ประเภท</label>
                                    <select
                                        value={itemType}
                                        onChange={(e) => setItemType(e.target.value)}
                                        className="vx-input"
                                    >
                                        <option value="MATERIAL">วัสดุ</option>
                                        <option value="EQUIPMENT">ครุภัณฑ์</option>
                                    </select>
                                </div>

                                <div className="vx-input-group">
                                    <label className="vx-label">เตือนขั้นต่ำ</label>
                                    <input
                                        type="number"
                                        value={minStock}
                                        onChange={(e) => setMinStock(e.target.value)}
                                        className="vx-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="vx-input-group">
                                    <label className="vx-label">หมวดหมู่</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="vx-input"
                                    >
                                        <option value="">-- ไม่ระบุ --</option>
                                        {categories.map((c) => (
                                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="vx-input-group">
                                    <label className="vx-label">หน่วยนับ</label>
                                    <select
                                        value={unitId}
                                        onChange={(e) => setUnitId(e.target.value)}
                                        className="vx-input"
                                    >
                                        <option value="">-- ไม่ระบุ --</option>
                                        {units.map((u) => (
                                            <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="vx-btn-secondary flex-1"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="vx-btn-primary flex-1"
                                >
                                    <Save size={16} />
                                    <span>บันทึกข้อมูล</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemRows;
