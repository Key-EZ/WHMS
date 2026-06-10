import React from 'react';
import '../../styles/styles.css';
import { Package, Award, ShieldAlert } from 'lucide-react';

const MyEquipment = () => {
    // Mock user equipment list
    const myAssets = [
        { name: 'เครื่องคอมพิวเตอร์ Lenovo Core i5', code: 'COM-67-001', receiveDate: '2024-03-12', serial: 'LNV983748293' },
        { name: 'จอแสดงผล Dell 24"', code: 'MON-67-010', receiveDate: '2024-03-12', serial: 'CN-0HG782-7289' }
    ];

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h2 className="text-3xl font-black text-slate-800 font-kanit">ครุภัณฑ์ของฉัน (My Equipment)</h2>
                <p className="text-slate-400 font-medium">รายการพัสดุและครุภัณฑ์ที่อยู่ในความรับผิดชอบและอยู่ในครอบครองของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myAssets.map((asset, i) => (
                    <div key={i} className="vx-card space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] shrink-0">
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold font-kanit text-lg text-slate-800">{asset.name}</h3>
                                <p className="font-mono text-xs font-bold text-slate-400">{asset.code}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-400">หมายเลขเครื่อง / Serial</span>
                                <span className="font-mono font-bold text-slate-600">{asset.serial}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-400">วันที่เริ่มครอบครอง</span>
                                <span className="font-mono font-bold text-slate-600">
                                    {new Date(asset.receiveDate).toLocaleDateString('th-TH')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEquipment;
