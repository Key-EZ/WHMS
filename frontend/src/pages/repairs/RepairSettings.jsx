import React from 'react';
import '../../styles/styles.css';
import { Settings } from 'lucide-react';

const RepairSettings = () => {
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">ตั้งค่าการแจ้งซ่อม</h2>
                <p className="text-slate-400 font-medium">จัดการกำหนดสิทธิ์การแจ้งซ่อม รูปแบบหมายเลขงาน และพารามิเตอร์อื่นๆ</p>
            </div>

            <div className="vx-card space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee]">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold font-kanit text-lg text-slate-800">ตั้งค่าพื้นฐานของโมดูลแจ้งซ่อม</h3>
                        <p className="text-xs text-slate-400">ข้อมูลและโครงสร้างของโมดูลซ่อมแซมครุภัณฑ์</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-slate-600">เปิดรับงานซ่อมแซมพัสดุภายนอก</span>
                        <div className="w-12 h-6 rounded-full bg-[#4361ee] p-1 cursor-pointer flex items-center justify-end transition-all duration-200">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-slate-600">แจ้งเตือนผู้รับผิดชอบผ่านแอปพลิเคชัน Line API</span>
                        <div className="w-12 h-6 rounded-full bg-[#dbdade] p-1 cursor-pointer flex items-center justify-start transition-all duration-200">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-slate-600">จำกัดการส่งคำขอย้อนหลังไม่เกิน 7 วัน</span>
                        <div className="w-12 h-6 rounded-full bg-[#4361ee] p-1 cursor-pointer flex items-center justify-end transition-all duration-200">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairSettings;
