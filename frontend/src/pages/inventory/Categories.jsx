import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Plus, Edit, Trash2, Save, X, Tag } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [editingCategory, setEditingCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setName('');
        setShowModal(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setName(category.category_name);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            alert('ไม่สามารถลบหมวดหมู่ได้ เนื่องจากมีสิ่งของที่ยังใช้หมวดหมู่นี้ค้างอยู่');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.category_id}`, {
                    category_name: name
                });
            } else {
                await api.post('/categories', {
                    category_name: name
                });
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">ประเภทพัสดุและสินค้า</h3>
                    <p className="text-slate-400 text-xs font-medium">จัดการหมวดหมู่หลักเพื่อจำแนกประเภทรายการสิ่งของ</p>
                </div>
                
                <button
                    onClick={handleOpenCreate}
                    className="vx-btn-primary"
                >
                    <Plus size={18} />
                    <span>เพิ่มหมวดหมู่</span>
                </button>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left w-1/4">รหัสหมวดหมู่</th>
                                <th className="text-left">ชื่อหมวดหมู่</th>
                                <th className="text-center w-1/4">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดหมวดหมู่...
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบข้อมูลหมวดหมู่สินค้า
                                    </td>
                                </tr>
                            ) : (
                                categories.map((row) => (
                                    <tr key={row.category_id}>
                                        <td className="font-mono text-xs font-bold text-slate-400">
                                            #{row.category_id}
                                        </td>
                                        <td className="font-bold text-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    <Tag size={14} />
                                                </div>
                                                {row.category_name}
                                            </div>
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
                                                    onClick={() => handleDelete(row.category_id)}
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
                    <div className="vx-modal-card max-w-md">
                        <button
                            onClick={() => setShowModal(false)}
                            className="vx-modal-close"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="vx-modal-title">
                            {editingCategory ? 'แก้ไขชื่อหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="vx-input-group">
                                <label className="vx-label">ชื่อหมวดหมู่</label>
                                <input
                                    type="text"
                                    placeholder="เช่น เครื่องใช้ไฟฟ้า, วัสดุสำนักงาน..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="vx-input"
                                    required
                                />
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

export default Categories;
