import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/styles.css';
import { Plus, Edit, Trash2, Save, X, User } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenCreate = () => {
        setEditingUser(null);
        setEmail('');
        setName('');
        setPassword('');
        setRole('USER');
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setEmail(user.email);
        setName(user.name || '');
        setPassword('');
        setRole(user.role);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (id === 1) {
            alert('ไม่สามารถลบผู้ใช้งานหลัก (Admin) ได้');
            return;
        }
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานนี้?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('ไม่สามารถลบผู้ใช้งานได้');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            email,
            name,
            role,
        };

        if (password) {
            payload.password = password;
        }

        try {
            if (editingUser) {
                await api.put(`/users/${editingUser.user_id}`, payload);
            } else {
                if (!password) {
                    alert('ต้องระบุรหัสผ่านสำหรับการสร้างบัญชีใหม่');
                    return;
                }
                await api.post('/users', payload);
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user', error);
            alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-800 font-kanit">รายชื่อผู้ใช้ระบบทั้งหมด</h3>
                    <p className="text-slate-400 text-xs font-medium">จัดการระดับสิทธิ์ แก้ไขรหัสผ่าน และเพิ่มผู้รับผิดชอบระบบ</p>
                </div>
                
                <button
                    onClick={handleOpenCreate}
                    className="vx-btn-primary"
                >
                    <Plus size={18} />
                    <span>เพิ่มผู้ใช้</span>
                </button>
            </div>

            {/* Table Card */}
            <div className="vx-card !p-0 overflow-hidden">
                <div className="vx-table-container">
                    <table className="vx-table">
                        <thead>
                            <tr>
                                <th className="text-left">ผู้ใช้งาน</th>
                                <th className="text-left">อีเมล</th>
                                <th className="text-center">สิทธิ์การใช้งาน</th>
                                <th className="text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20 text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-4 justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                                            กำลังโหลดผู้ใช้งาน...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20 text-slate-400 font-medium">
                                        ไม่พบข้อมูลผู้ใช้
                                    </td>
                                </tr>
                            ) : (
                                users.map((row) => (
                                    <tr key={row.user_id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    <User size={14} />
                                                </div>
                                                <span className="font-bold text-slate-700">{row.name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="font-mono text-sm text-slate-500">
                                            {row.email}
                                        </td>
                                        <td className="text-center">
                                            <span className={`px-2.5 py-1 rounded text-xs font-black uppercase ${
                                                row.role === 'ADMIN' 
                                                ? 'bg-red-50 text-red-500' 
                                                : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {row.role}
                                            </span>
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
                                                    onClick={() => handleDelete(row.user_id)}
                                                    disabled={row.user_id === 1}
                                                    className={`p-2 rounded-xl border border-slate-200/80 bg-white text-slate-400 hover:text-red-500 transition ${row.user_id === 1 ? 'opacity-30 cursor-not-allowed hover:bg-white' : 'hover:bg-red-50'}`}
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
                            {editingUser ? 'แก้ไขระดับสิทธิ์ผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="vx-input-group">
                                <label className="vx-label">อีเมล (บัญชีผู้ใช้)</label>
                                <input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="vx-input"
                                    disabled={!!editingUser}
                                    required
                                />
                            </div>

                            <div className="vx-input-group">
                                <label className="vx-label">ชื่อผู้ใช้</label>
                                <input
                                    type="text"
                                    placeholder="ระบุชื่อจริง/ชื่อเล่น..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="vx-input"
                                    required
                                />
                            </div>

                            <div className="vx-input-group">
                                <label className="vx-label">
                                    รหัสผ่าน {editingUser && '(เว้นว่างหากไม่ต้องการเปลี่ยน)'}
                                </label>
                                <input
                                    type="password"
                                    placeholder="ป้อนรหัสผ่าน..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="vx-input"
                                    required={!editingUser}
                                />
                            </div>

                            <div className="vx-input-group">
                                <label className="vx-label">ระดับสิทธิ์</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="vx-input text-sm"
                                    disabled={editingUser?.user_id === 1}
                                >
                                    <option value="USER">ผู้ใช้งานทั่วไป (USER)</option>
                                    <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                                </select>
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

export default Users;
