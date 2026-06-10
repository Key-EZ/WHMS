import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Wrench, Package, Settings, LogOut, Menu, User,
    History, Briefcase, Activity, Tag, List, Users as UsersIcon, Shield, Key, Sliders, PenTool, Database, UserCheck,
    Calendar, ChevronDown, ChevronRight, Plus
} from 'lucide-react';
import api from '../api';
import '../styles/styles.css';
// Create a Context for Navigation State
const NavigateContext = createContext(null);
export const useNavigateContext = () => {
    const context = useContext(NavigateContext);
    if (!context) {
        throw new Error('useNavigateContext must be used within a NavigateProvider');
    }
    return context;
};
// Icon Maps and Translation Map
const iconMap = {
    'Dashboard': LayoutDashboard,
    'Repair': Wrench,
    'Inventory': Package,
    'Settings': Settings
};
const subIconMap = {
    'Get a repair': PenTool,
    'Repair history': History,
    'Repair jobs': Briefcase,
    'Repair status': Activity,
    'Repair Dashboard': LayoutDashboard,
    'My equipment': UserCheck,
    'Inventory': Database,
    'Holder': User,
    'Item rows': List,
    'Category': Tag,
    'Users': UsersIcon,
    'Member status': Shield,
    'Permissions': Key,
    'General Settings': Sliders,
    'Settings': Settings
};
const translationMap = {
    'Dashboard': 'Dashboard',
    'Repair': 'ระบบแจ้งซ่อม',
    'Get a repair': 'ส่งซ่อม',
    'Repair history': 'ประวัติแจ้งซ่อม',
    'Repair jobs': 'รายการแจ้งซ่อม',
    'Repair status': 'สถานะงานซ่อม',
    'Repair Dashboard': 'แผงควบคุมแจ้งซ่อม',
    'Inventory': 'ระบบจัดการพัสดุและครุภัณฑ์',
    'My equipment': 'ครุภัณฑ์ของฉัน',
    'Holder': 'ผู้ครอบครอง',
    'Item rows': 'รายการสิ่งของ',
    'Category': 'หมวดหมู่สินค้า',
    'Settings': 'ตั้งค่าระบบ',
    'Users': 'ผู้ใช้งาน',
    'Member status': 'สถานะสมาชิก',
    'Permissions': 'สิทธิ์การใช้งาน',
    'General Settings': 'ตั้งค่าทั่วไป'
};
const translate = (text) => translationMap[text] || text;
export const NavigateProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : { name: '', role: '' };
        } catch {
            return { name: '', role: '' };
        }
    });
    const [openSections, setOpenSections] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        // Fast-path client-side route guard using localStorage cache
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                const settingsPaths = ['/users', '/user-status', '/permission', '/general-settings'];
                if (settingsPaths.includes(location.pathname) && parsedUser.role !== 'ADMIN' && parsedUser.role !== 'SUPER_ADMIN') {
                    navigate('/dashboard');
                    return;
                }
            }
        } catch (e) {
            console.error('Failed to parse cached user role', e);
        }
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data) {
                    setUser({
                        name: response.data.name,
                        role: response.data.role
                    });
                    // Direct routing protection: only allow ADMIN to access system settings paths
                    const settingsPaths = ['/users', '/user-status', '/permission', '/general-settings'];
                    if (settingsPaths.includes(location.pathname) && response.data.role !== 'ADMIN' && response.data.role !== 'SUPER_ADMIN') {
                        navigate('/dashboard');
                        return;
                    }
                    if (response.data.menus) {
                        setMenus(response.data.menus);
                        const newOpenSections = {};
                        response.data.menus.forEach(menu => {
                            if (menu.children) {
                                const hasActiveChild = menu.children.some(child => child.url === location.pathname);
                                if (hasActiveChild) {
                                    newOpenSections[menu.title] = true;
                                }
                            }
                        });
                        setOpenSections(newOpenSections);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data and menus', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [location.pathname]);
    const handleLogout = (e) => {
        if (e) e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const toggleSection = (title) => {
        setOpenSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };
    // Get subheader title & action configurations
    const getSubheaderConfig = () => {
        const path = location.pathname;
        if (path === '/' || path === '/dashboard') return { title: `ยินดีต้อนรับกลับ, ${user.name}`, showAction: true, label: 'แจ้งซ่อมพัสดุ', url: '/repair-request' };
        if (path === '/repair-request') return { title: 'ส่งซ่อมพัสดุอุปกรณ์', showAction: false };
        if (path === '/repair-history') return { title: 'ประวัติการส่งซ่อม', showAction: true, label: 'แจ้งซ่อมใหม่', url: '/repair-request' };
        if (path === '/repair-jobs') return { title: 'รายการแจ้งซ่อมทั้งหมด', showAction: false };
        if (path === '/repair-statuses') return { title: 'สถานะการดำเนินงานซ่อม', showAction: false };
        if (path === '/repair-settings') return { title: 'ตั้งค่าการแจ้งซ่อม', showAction: false };
        if (path === '/repair-dashboard') return { title: 'แผงควบคุมงานแจ้งซ่อม', showAction: false };
        if (path === '/inventory-myassets') return { title: 'ครุภัณฑ์ของฉัน', showAction: false };
        if (path === '/inventory-assets') return { title: 'ยอดสินค้าคงคลัง', showAction: true, label: 'จัดการสิ่งของ', url: '/inventory-items' };
        if (path === '/inventory-items') return { title: 'รายการพัสดุและครุภัณฑ์', showAction: true, label: 'เพิ่มพัสดุใหม่', url: '/inventory-items' }; // Modal action handled in page
        if (path === '/inventory-holders') return { title: 'ผู้ครอบครองพัสดุ', showAction: false };
        if (path === '/inventory-categories') return { title: 'หมวดหมู่พัสดุ', showAction: false };
        if (path === '/inventory-settings') return { title: 'ตั้งค่าคลังสินค้า', showAction: false };
        if (path === '/users') return { title: 'จัดการผู้ใช้งานระบบ', showAction: false };
        if (path === '/user-status') return { title: 'จัดการสถานะสมาชิก', showAction: false };
        if (path === '/permission') return { title: 'จัดการสิทธิ์การใช้งาน', showAction: false };
        if (path === '/general-settings') return { title: 'ตั้งค่าระบบทั่วไป', showAction: false };
        return { title: 'ระบบจัดการคลังพัสดุ WHMS', showAction: false };
    };
    const subheaderConfig = getSubheaderConfig();
    return (
        <NavigateContext.Provider value={{
            user,
            menus,
            openSections,
            mobileMenuOpen,
            setMobileMenuOpen,
            toggleSection,
            handleLogout,
            subheaderConfig,
            location
        }}>
            {children}
        </NavigateContext.Provider>
    );
};
// Sidebar Component
export const Sidebar = () => {
    const {
        menus,
        openSections,
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleSection,
        handleLogout,
        location
    } = useNavigateContext();
    const renderNavItems = (isMobile = false) => {
        return menus.map((menu, index) => {
            const hasChildren = menu.children && menu.children.length > 0;
            const ParentIcon = iconMap[menu.title] || Package;
            if (!hasChildren) {
                const isActive = location.pathname === menu.url || (menu.url === '/' && location.pathname === '/dashboard');
                return (
                    <Link
                        key={index}
                        to={menu.url}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                        className={isActive ? 'active' : ''}
                    >
                        <div className="flex items-center gap-3">
                            <ParentIcon size={18} />
                            <span>{translate(menu.title)}</span>
                        </div>
                    </Link>
                );
            }
            const isOpen = openSections[menu.title];
            const hasActiveChild = menu.children.some(child => child.url === location.pathname);
            return (
                <div key={index} className="space-y-0.5">
                    <button
                        onClick={() => toggleSection(menu.title)}
                        className={`menu-section ${hasActiveChild ? 'active' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <ParentIcon size={18} />
                            <span>{translate(menu.title)}</span>
                        </div>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isOpen && (
                        <div className="submenu pl-2">
                            {menu.children.map((child, cIndex) => {
                                const isChildActive = location.pathname === child.url;
                                const ChildIcon = subIconMap[child.title] || List;
                                return (
                                    <Link
                                        key={cIndex}
                                        to={child.url}
                                        onClick={() => isMobile && setMobileMenuOpen(false)}
                                        className={isChildActive ? 'active' : ''}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChildIcon size={14} />
                                            <span>{translate(child.title)}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        });
    };
    return (
        <>
            {/* Desktop Vertical Sidebar */}
            <aside className="sidebar hidden md:flex w-64 flex-col h-screen fixed left-0 top-0 z-30">
                {/* Logo Section */}
                <div className="sidebar-header">
                    <div className="logo bg-[#ffffff]/20 flex items-center justify-center text-white rounded-lg">
                        <Package size={20} />
                    </div>
                    <div>
                        <h1 className="logo-text text-lg font-black text-white tracking-wider leading-none">WHMS</h1>
                        <p className="text-[9px] text-[#ffffff]/85 font-bold mt-1 uppercase">Warehouse System</p>
                    </div>
                </div>
                {/* Sidebar Navigation */}
                <nav className="sidemenu flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {renderNavItems()}
                </nav>
                {/* Sidebar Footer Action */}
                <div className="p-4 border-t border-[#ffffff]/10 bg-[#000000]/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-[#ffffff]/10 text-white hover:bg-red-500 hover:text-white transition duration-200 text-sm font-bold border-none cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            {/* Mobile Sidebar Menu */}
            <aside className={`sidebar fixed top-0 bottom-0 left-0 w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="sidebar-header">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#ffffff]/20 flex items-center justify-center text-white">
                            <Package size={18} />
                        </div>
                        <h1 className="logo-text text-lg font-black text-white tracking-wider">WHMS</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-1 rounded bg-[#ffffff]/10 text-white text-xs border-none cursor-pointer ml-auto"
                    >
                        ✕
                    </button>
                </div>
                <nav className="sidemenu flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {renderNavItems(true)}
                </nav>
                <div className="p-4 border-t border-[#ffffff]/10 bg-[#000000]/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-[#ffffff]/10 text-white hover:bg-red-500 hover:text-white transition duration-200 text-sm font-bold border-none cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
// Topbar Component
export const Topbar = () => {
    const { user, setMobileMenuOpen, subheaderConfig } = useNavigateContext();
    return (
        <header className="topbar">
            <div>
                <div className="flex items-center gap-4">
                    {/* Hamburger menu for mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition border-none bg-transparent cursor-pointer"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="topbar-left">
                        <h1>{subheaderConfig.title}</h1>
                        <p>ระบบคลังพัสดุและระบบส่งบริการแจ้งซ่อมแซมวัสดุออนไลน์</p>
                    </div>
                </div>
                {/* Right Header Controls */}
                <div className="topbar-right">
                    {/* Budget Year indicator pill */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-1.5 text-xs text-slate-600 font-bold">
                        <Calendar size={14} className="text-slate-400" />
                        <span>ปีงบประมาณ 2567</span>
                    </div>
                    {/* Action button */}
                    {subheaderConfig.showAction && (
                        <Link
                            to={subheaderConfig.url}
                            className="vx-btn-primary text-xs font-bold"
                        >
                            <Plus size={14} />
                            <span>{subheaderConfig.label}</span>
                        </Link>
                    )}
                    {/* Profile Info */}
                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <div className="user-avatar">
                            {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
// Default Export containing both for backward compatibility or simple usage
export default {
    Provider: NavigateProvider,
    Sidebar,
    Topbar
};