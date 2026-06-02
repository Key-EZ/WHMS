import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/neumorphism.css';
import { Mail, Lock, User, Globe } from 'lucide-react';
import api from '../api';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMockModal, setShowMockModal] = useState(false);
    const cardRef = useRef(null);
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
            navigate('/app/dashboard');
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


    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!cardRef.current) return;
            const card = cardRef.current;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            const shadowX = x * 20;
            const shadowY = y * 20;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 60px #bec3cf, ${-shadowX}px ${-shadowY}px 60px #ffffff`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
        <div className="neu-container">
            <div className="login-card" ref={cardRef}>
                <div className="login-header">
                    <div className="neu-icon">
                        <User size={40} />
                    </div>
                    <h2>สร้างบัญชีใหม่</h2>
                    <p>เข้าร่วมกับเราเพื่อเริ่มต้นใช้งาน</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm font-semibold shadow-[inset_2px_2px_5px_#ffb8c4,inset_-2px_-2px_5px_#ffffff]">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <div className="neu-input">
                            <User className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label htmlFor="name">ชื่อ-นามสกุล</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="neu-input">
                            <Mail className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">ที่อยู่อีเมล</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="neu-input">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">รหัสผ่าน</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="neu-input">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                        </div>
                    </div>

                    <button type="submit" className={`neu-button ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading}>
                        {isLoading ? 'กำลังสร้างบัญชี...' : 'ลงทะเบียน'}
                    </button>
                </form>

                <div className="neu-divider">
                    <div className="neu-line"></div>
                    <span>หรือเชื่อมต่อด้วย SSO</span>
                    <div className="neu-line"></div>
                </div>

                <div className="mb-6">
                    <button 
                        type="button" 
                        onClick={handleAuthentikLogin} 
                        className="neu-button flex items-center justify-center gap-3 text-[#3d4468] hover:text-[#5046e5]"
                    >
                        <Globe size={20} />
                        <span>ลงทะเบียนด้วย Authentik</span>
                    </button>
                </div>

                <div className="neu-footer-link">
                    <p>มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
                </div>
            </div>

            {/* Mock Authentik SSO Dialog */}
            {showMockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md p-8 rounded-[30px] bg-[#e0e5ec] shadow-[20px_20px_60px_#bec3cf,-20px_-20px_60px_#ffffff] text-center">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bec3cf,inset_-4px_-4px_8px_#ffffff] text-[#3d4468]">
                            <Globe size={32} className="animate-pulse text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#3d4468] font-kanit">Authentik SSO (Mock Mode)</h3>
                        <p className="text-sm text-[#9499b7] mb-6">
                            ระบบกำลังทำงานในโหมดทดสอบ (Mock Mode)<br/>
                            กดปุ่มด้านล่างเพื่อจำลองการอนุมัติสิทธิ์การเชื่อมต่อ
                        </p>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setShowMockModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-[#e0e5ec] text-[#6c7293] shadow-[4px_4px_10px_#bec3cf,-4px_-4px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bec3cf,inset_-2px_-2px_5px_#ffffff] transition-all hover:scale-[1.02]"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                type="button"
                                onClick={handleMockAuthorize}
                                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-[#e0e5ec] text-emerald-600 shadow-[4px_4px_10px_#bec3cf,-4px_-4px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bec3cf,inset_-2px_-2px_5px_#ffffff] transition-all hover:scale-[1.02]"
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
