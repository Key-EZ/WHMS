import React from 'react';
import '../../styles/styles.css';
import { ShieldAlert } from 'lucide-react';

const Permissions = () => {
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">สิทธิ์การใช้งาน (Permissions)</h2>
                <p className="text-slate-400 font-medium">จัดการควบคุมสิทธิ์การเข้าถึงข้อมูลของแต่ละกลุ่มสถานะสมาชิก</p>
            </div>

            <div className="vx-card flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] shrink-0">
                    <ShieldAlert size={20} />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold font-kanit text-lg text-slate-800">สิทธิ์การเข้าใช้งานระบบ</h3>
                    <p className="text-sm text-slate-400">
                        หน้าต่างการตั้งค่าสิทธิ์ให้ผู้ใช้งานในระดับต่างๆ สามารถทำรายการ เช่น เขียน, แก้ไข, ลบ หรือเห็นข้อมูล ในแต่ละโมดูลของระบบ (Inventory, Repair, Users)
                    </p>
                    <p className="text-xs text-slate-400 italic pt-4">
                        *ระบบปัจจุบันอยู่ในโหมดจำลองสิทธิ์เป็น Admin สำหรับการทดสอบ ทำให้สามารถเข้าถึงและใช้งานได้ทุกส่วนโดยไม่มีการปิดกั้น
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Permissions;
