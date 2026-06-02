import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, RefreshCw, Settings, LogOut, Menu, User } from 'lucide-react';
import '../styles/neumorphism.css';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "ผู้ใช้", "role": "User"}');
    
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/app/dashboard', label: 'แผงควบคุม', icon: LayoutDashboard },
        { path: '/app/inventory', label: 'คลังสินค้า', icon: Package },
        { path: '/app/transactions', label: 'รายการธุรกรรม', icon: RefreshCw },
        { path: '/app/settings', label: 'ตั้งค่าระบบ', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#e0e5ec] flex p-4 md:p-6 gap-6">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 flex-col rounded-[40px] bg-[#e0e5ec] shadow-[20px_20px_60px_#bec3cf,-20px_-20px_60px_#ffffff] p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-[15px] bg-[#e0e5ec] shadow-[6px_6px_12px_#bec3cf,-6px_-6px_12px_#ffffff] flex items-center justify-center">
                        <Package size={24} className="text-[#6c7293]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#3d4468] font-kanit">WHMS</h1>
                </div>

                <nav className="flex-1 space-y-6">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 p-4 rounded-[20px] transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#bec3cf,inset_-6px_-6px_12px_#ffffff] text-[#3d4468]' 
                                    : 'text-[#9499b7] hover:text-[#6c7293]'
                                }`}
                            >
                                <item.icon size={22} />
                                <span className="font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-8 border-t border-[#bec3cf]/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 rounded-[20px] text-[#9499b7] hover:text-red-400 transition-all duration-300 text-left"
                    >
                        <LogOut size={22} />
                        <span className="font-semibold">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col min-h-0 gap-6">
                {/* Header */}
                <header className="h-20 rounded-[25px] bg-[#e0e5ec] shadow-[10px_10px_20px_#bec3cf,-10px_-10px_20px_#ffffff] flex items-center justify-between px-8">
                    <div className="flex items-center gap-4 md:hidden">
                        <button className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bec3cf,-4px_-4px_8px_#ffffff] flex items-center justify-center">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-[#3d4468] font-kanit">WHMS</h1>
                    </div>
                    
                    <h2 className="hidden md:block text-xl font-bold text-[#3d4468] font-kanit">
                        {navItems.find(i => location.pathname === i.path)?.label || 'ระบบจัดการคลังสินค้า'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#3d4468]">{user.name}</p>
                            <p className="text-xs text-[#9499b7]">{user.role}</p>
                        </div>
                        <div className="w-12 h-12 rounded-[15px] bg-[#e0e5ec] shadow-[6px_6px_12px_#bec3cf,-6px_-6px_12px_#ffffff] p-1">
                            <div className="w-full h-full rounded-[12px] bg-gradient-to-br from-[#bec3cf] to-[#ffffff] flex items-center justify-center">
                                <User size={20} className="text-[#6c7293]" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto rounded-[40px] bg-[#e0e5ec] shadow-[inset_10px_10px_20px_#bec3cf,inset_-10px_-10px_20px_#ffffff] p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
