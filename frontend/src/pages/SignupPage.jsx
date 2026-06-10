import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/modern-saas.css';
import { Globe, Eye, EyeOff } from 'lucide-react';
import api from '../api';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMockModal, setShowMockModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            window.history.replaceState({}, document.title, window.location.pathname);
            handleSSOCallback(code);
        }
    }, [window.location.search]);

    const handleSSOCallback = async (code) => {
        setIsLoading(true);
        setError('');
        try {
            const redirectUri = window.location.origin + window.location.pathname;
            const response = await api.post('/auth/authentik/callback', { code, redirectUri });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'การลงทะเบียนผ่าน SSO ล้มเหลว');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthentikLogin = () => {
        const clientId = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
        const issuer = import.meta.env.VITE_AUTHENTIK_ISSUER;
        const redirectUri = window.location.origin + window.location.pathname;

        if (!clientId || clientId === 'mock') {
            setShowMockModal(true);
        } else {
            const state = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('auth_state', state);
            const authUrl = `${issuer.replace(/\/$/, '')}/authorize/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid+profile+email&state=${state}`;
            window.location.href = authUrl;
        }
    };

    const handleMockAuthorize = () => {
        setShowMockModal(false);
        const mockCode = 'mock_auth_code_' + Math.random().toString(36).substring(2, 10);
        navigate('?code=' + mockCode);
    };

    const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (name.length < 2) {
            setError('กรุณากรอกชื่อ-นามสกุลของคุณ');
            return;
        }

        if (!validateEmail(email)) {
            setError('กรุณากรอกอีเมลที่ถูกต้อง');
            return;
        }

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/register', { email, password, name });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'ลงทะเบียนล้มเหลว');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo">
                            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="6" fill="#635BFF"/>
                                <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h10v2H8v-2z" fill="white"/>
                            </svg>
                        </div>
                        <h2>สร้างบัญชีใหม่</h2>
                        <p>เข้าร่วมกับเราเพื่อเริ่มต้นใช้งาน WHMS</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 text-red-500 text-sm font-semibold border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                type="text"
                                id="name"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                            <label htmlFor="name">ชื่อ-นามสกุล</label>
                            <span className="input-border"></span>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <label htmlFor="email">ที่อยู่อีเมล</label>
                            <span className="input-border"></span>
                        </div>

                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <label htmlFor="password">รหัสผ่าน</label>
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="แสดง/ซ่อนรหัสผ่าน"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <span className="input-border"></span>
                        </div>

                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="แสดง/ซ่อนรหัสผ่าน"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <span className="input-border"></span>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-btn ${isLoading ? 'loading' : ''}`} 
                            disabled={isLoading}
                        >
                            <span className="btn-text">{isLoading ? 'กำลังสร้างบัญชี...' : 'ลงทะเบียน'}</span>
                            <div className="btn-loader">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" opacity="0.25"/>
                                    <path d="M16 9a7 7 0 01-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <animateTransform attributeName="transform" type="rotate" dur="1s" values="0 9 9;360 9 9" repeatCount="indefinite"/>
                                    </path>
                                </svg>
                            </div>
                        </button>
                    </form>

                    <div className="divider">
                        <span>หรือลงทะเบียนด้วย OIDC</span>
                    </div>

                    <div className="social-buttons">
                        <button 
                            type="button" 
                            onClick={handleAuthentikLogin} 
                            className="social-btn"
                        >
                            <Globe size={18} />
                            <span>ลงทะเบียนด้วย Authentik</span>
                        </button>
                    </div>

                    <div className="signup-link">
                        <span>มีบัญชีอยู่แล้ว? </span>
                        <Link to="/login">เข้าสู่ระบบ</Link>
                    </div>
                </div>
            </div>

            {/* Mock Authentik SSO Dialog */}
            {showMockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl text-center border border-slate-100">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Globe size={32} className="animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800 font-kanit">Authentik SSO (Mock Mode)</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            ระบบกำลังทำงานในโหมดทดสอบ (Mock Mode)<br/>
                            กดปุ่มด้านล่างเพื่อจำลองการอนุมัติสิทธิ์การเชื่อมต่อ
                        </p>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setShowMockModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                type="button"
                                onClick={handleMockAuthorize}
                                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                อนุมัติ (Authorize)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupPage;
