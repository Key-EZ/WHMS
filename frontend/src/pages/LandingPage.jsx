import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/neumorphism.css';
import { Shield, BarChart2, Package, Zap, ChevronRight, Globe, User, Mail } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="neu-container flex-col min-h-screen bg-[#e0e5ec]">
            {/* Navbar */}
            <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 neu-icon-wrapper !m-0 !w-10 !h-10">
                        <Package size={20} className="text-[#6c7293]" />
                    </div>
                    <span className="text-xl font-bold text-[#3d4468] font-kanit">WHMS</span>
                </div>
                <div className="flex gap-6">
                    <Link to="/login" className="px-6 py-2 rounded-xl text-[#6c7293] font-medium hover:text-[#3d4468] transition">เข้าสู่ระบบ</Link>
                    <Link to="/signup" className="px-6 py-2 rounded-xl bg-[#e0e5ec] shadow-[4px_4px_10px_#bec3cf,-4px_-4px_10px_#ffffff] text-[#3d4468] font-bold hover:shadow-inner transition">ลงทะเบียน</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#3d4468] leading-tight mb-6 font-kanit">
                        ระบบจัดการ <br /> 
                        <span className="text-[#6c7293]">คลังสินค้าอัจฉริยะ</span>
                    </h1>
                    <p className="text-lg text-[#9499b7] mb-10 max-w-lg">
                        สัมผัสประสบการณ์การจัดการคลังสินค้ารูปแบบใหม่ ด้วยอินเตอร์เฟซที่สวยงาม ใช้งานง่าย มั่นคง และรวดเร็ว พร้อมรองรับทุกความต้องการของคุณ
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                        <Link to="/signup" className="neu-button !mt-0 !w-auto px-10 flex items-center justify-center gap-2">
                            เริ่มต้นใช้งาน <ChevronRight size={20} />
                        </Link>
                        <button className="px-10 py-[18px] rounded-[15px] bg-[#e0e5ec] shadow-[8px_8px_20px_#bec3cf,-8px_-8px_20px_#ffffff] text-[#6c7293] font-semibold hover:shadow-inner transition">
                            เรียนรู้เพิ่มเติม
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <div className="w-64 h-64 md:w-96 md:h-96 rounded-[50px] bg-[#e0e5ec] shadow-[20px_20px_60px_#bec3cf,-20px_-20px_60px_#ffffff] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <Package size={120} className="text-[#bec3cf] opacity-50" />
                        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-[#e0e5ec] shadow-[8px_8px_16px_#bec3cf,-8px_-8px_16px_#ffffff] flex items-center justify-center">
                            <BarChart2 size={30} className="text-[#6c7293]" />
                        </div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-[#e0e5ec] shadow-[8px_8px_16px_#bec3cf,-8px_-8px_16px_#ffffff] flex items-center justify-center">
                            <Shield size={24} className="text-[#6c7293]" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="w-full bg-[#e0e5ec] py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#3d4468] text-center mb-16 font-kanit">ฟีเจอร์ที่โดดเด่น</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-[30px] bg-[#e0e5ec] shadow-[15px_15px_30px_#bec3cf,-15px_-15px_30px_#ffffff] hover:translate-y-[-5px] transition-all">
                            <div className="w-14 h-14 neu-icon-wrapper !m-0 mb-6">
                                <Zap size={24} className="text-[#6c7293]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d4468] mb-4 font-kanit">ซิงค์ข้อมูลเรียลไทม์</h3>
                            <p className="text-[#9499b7]">อัปเดตข้อมูลสินค้าคงคลังของคุณให้เป็นปัจจุบันในทุกอุปกรณ์ทันทีด้วยการซิงค์ข้อมูลอัตโนมัติ</p>
                        </div>
                        <div className="p-8 rounded-[30px] bg-[#e0e5ec] shadow-[15px_15px_30px_#bec3cf,-15px_-15px_30px_#ffffff] hover:translate-y-[-5px] transition-all">
                            <div className="w-14 h-14 neu-icon-wrapper !m-0 mb-6">
                                <Shield size={24} className="text-[#6c7293]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d4468] mb-4 font-kanit">การจัดเก็บที่ปลอดภัย</h3>
                            <p className="text-[#9499b7]">ข้อมูลของคุณได้รับการปกป้องด้วยมาตรฐานระดับอุตสาหกรรมและการจัดเก็บข้อมูลบนคลาวด์ที่มั่นคง</p>
                        </div>
                        <div className="p-8 rounded-[30px] bg-[#e0e5ec] shadow-[15px_15px_30px_#bec3cf,-15px_-15px_30px_#ffffff] hover:translate-y-[-5px] transition-all">
                            <div className="w-14 h-14 neu-icon-wrapper !m-0 mb-6">
                                <BarChart2 size={24} className="text-[#6c7293]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#3d4468] mb-4 font-kanit">การวิเคราะห์ขั้นสูง</h3>
                            <p className="text-[#9499b7]">รับข้อมูลเชิงลึกเกี่ยวกับระดับสต็อกและรูปแบบการทำธุรกรรมของคุณด้วยรายงานภาพที่ชัดเจนและเข้าใจง่าย</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 px-6 text-center text-[#9499b7]">
                <p>© 2026 WHMS. สงวนลิขสิทธิ์ทั้งหมด</p>
            </footer>
        </div>
    );
};

export default LandingPage;
