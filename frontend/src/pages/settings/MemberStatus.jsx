import React from 'react';
import '../../styles/styles.css';
import { ShieldAlert } from 'lucide-react';

const MemberStatus = () => {
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">สถานะสมาชิก</h2>
                <p className="text-slate-400 font-medium">จัดการระดับขั้นสถานะและกลุ่มผู้ใช้ในระบบ</p>
            </div>

            <div className="vx-card flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] shrink-0">
                    <ShieldAlert size={20} />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold font-kanit text-lg text-slate-800">กลุ่มสถานะผู้ใช้งาน</h3>
                    <p className="text-sm text-slate-400">
                        ระบบของ goragodwiriya-inventory แบ่งผู้ใช้ออกเป็นกลุ่มเพื่อรับมอบสิทธิ์และการมองเห็นเมนูที่ต่างกัน ได้แก่:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 pt-2 font-medium">
                        <li><strong>ผู้ดูแลระบบสูงสุด (Super Admin)</strong> - เข้าถึงการตั้งค่าของทุกอย่างในระบบ</li>
                        <li><strong>ผู้ดูแลคลังสินค้า (Inventory Staff)</strong> - จัดการสิ่งของ ล็อต และธุรกรรมรับเข้า/เบิกจ่าย</li>
                        <li><strong>ช่างผู้ซ่อมพัสดุ (Repair Staff)</strong> - จัดการงานซ่อม ใบแจ้งซ่อม และอัปเดตงานซ่อม</li>
                        <li><strong>สมาชิกทั่วไป (Member)</strong> - ยื่นขอแจ้งซ่อมพัสดุ และตรวจสอบทรัพย์สินของตัวเอง</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MemberStatus;
