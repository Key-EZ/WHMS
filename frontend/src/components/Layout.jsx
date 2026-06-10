import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation, { Sidebar, Topbar } from './navigate';

/**
 * Layout Component
 * Defines the main visual layout structure of the application.
 * You can easily customize the grid layout, classes, header/footer placement,
 * or add new wrappers directly in this file.
 */
const Layout = () => {
    return (
        <Navigation.Provider>
            <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
                {/* Sidebar Menu (Desktop & Mobile drawers) */}
                <Sidebar />

                {/* Main Content Area Wrapper */}
                <div className="main-content">
                    {/* Header Topbar */}
                    <Topbar />

                    {/* Primary page rendering slot */}
                    <main className="content">
                        <Outlet />
                    </main>

                    {/* Footer bar */}
                    <footer className="footer">
                        <p>© 2026 WHMS - Warehouse Management System. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </Navigation.Provider>
    );
};

export default Layout;
