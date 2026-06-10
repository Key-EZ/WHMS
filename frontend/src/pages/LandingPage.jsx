import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern-saas.css';
import { Shield, BarChart2, Package, Zap, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page-wrapper min-h-screen bg-[#fafbfc]">

            <header className="w-full border-b border-[#e3e8ee] bg-white">
                <div className="max-w-6xl mx-auto px-6 navbar-mktg">
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="nav-btn-text">เข้าสู่ระบบ</Link>
                        <Link to="/signup" className="nav-btn-primary">ลงทะเบียน</Link>
                    </div>
                </div>
            </header>
            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1f36] leading-tight font-kanit">
                        ระบบจัดการคลังพัสดุ <br />
                        และแจ้งซ่อม <span className="text-[#635BFF]">อัจฉริยะ</span>
                    </h1>
                    <p className="text-lg text-[#6b7385] max-w-lg leading-relaxed font-medium">
                        สัมผัสประสบการณ์การจัดการคลังพัสดุและระบบส่งซ่อมออนไลน์รูปแบบใหม่ ด้วยอินเตอร์เฟซที่สะอาดตา ทันสมัย มั่นคง และรวดเร็ว พร้อมรองรับทุกแผนกในหน่วยงานของคุณ
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <Link to="/signup" className="cta-btn-primary">
                            เริ่มต้นใช้งาน <ChevronRight size={18} />
                        </Link>
                        <Link to="/login" className="cta-btn-secondary">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-center">
                    {/* Mockup Dashboard Card */}
                    <div className="mockup-card">
                        <div className="mockup-card-header">
                            <span className="mockup-card-title">สถานะคลังพัสดุจำลอง</span>
                            <span className="mockup-stat-pill">อัปเดตเรียลไทม์</span>
                        </div>
                        <div className="space-y-1">
                            <div className="mockup-row">
                                <div className="mockup-item-info">
                                    <div className="mockup-item-icon">
                                        <Package size={14} />
                                    </div>
                                    <span className="mockup-item-name">เครื่องคอมพิวเตอร์ Lenovo</span>
                                </div>
                                <span className="mockup-item-value">12 เครื่อง</span>
                            </div>
                            <div className="mockup-row">
                                <div className="mockup-item-info">
                                    <div className="mockup-item-icon">
                                        <Package size={14} />
                                    </div>
                                    <span className="mockup-item-name">กระดาษ A4 Double A</span>
                                </div>
                                <span className="mockup-item-value">45 รีม</span>
                            </div>
                            <div className="mockup-row">
                                <div className="mockup-item-info">
                                    <div className="mockup-item-icon text-red-500">
                                        <AlertTriangle size={14} />
                                    </div>
                                    <span className="mockup-item-name font-bold text-red-600">พัสดุใกล้หมดอายุการใช้งาน</span>
                                </div>
                                <span className="mockup-item-value danger">3 รายการ</span>
                            </div>
                            <div className="mockup-row">
                                <div className="mockup-item-info">
                                    <div className="mockup-item-icon text-emerald-500">
                                        <CheckCircle size={14} />
                                    </div>
                                    <span className="mockup-item-name">สถานะใบงานแจ้งซ่อม</span>
                                </div>
                                <span className="mockup-item-value !text-emerald-500 font-bold">ดำเนินการเสร็จสิ้น</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="feature-section">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-[#1a1f36] text-center mb-16 font-kanit">ฟีเจอร์ที่โดดเด่นของระบบ</h2>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-kanit">ซิงค์ข้อมูลเรียลไทม์</h3>
                            <p>อัปเดตยอดคงเหลือของสต็อกพัสดุและสถานะใบงานแจ้งซ่อมทันทีในทุกอุปกรณ์ด้วยระบบแจ้งเตือนอัตโนมัติ</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-kanit">การจัดเก็บที่ปลอดภัย</h3>
                            <p>ปกป้องข้อมูลคลังและประวัติการทำรายการแจ้งซ่อมของหน่วยงานผ่านระบบตรวจสอบสิทธิ์ JWT และ OIDC SSO</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <BarChart2 size={24} />
                            </div>
                            <h3 className="font-kanit">สถิติและรายงานครบครัน</h3>
                            <p>ประมวลผลรายงานยอดคงคลังสูงสุด ล็อตพัสดุแยกตามปีงบประมาณ และรายการวัสดุที่ต้องสั่งซื้อด่วนได้อย่างแม่นยำ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-mktg">
                <div className="max-w-6xl mx-auto px-6">
                    <p>© 2026 WHMS - Warehouse Management System. สงวนลิขสิทธิ์ทั้งหมด</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
