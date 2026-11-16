import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Content Calendar', path: '/content-calendar', icon: Calendar }
];

const MOBILE_BOTTOM_ITEMS: Array<{ name: string; path: string; icon: any }> = [];

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve authenticated user
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('veltrix_user') || '{}') : {};
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kayode Agbaje';
  const userEmail = user.email || 'admin@veltrixhub.com';

  const handleLogout = () => {
    localStorage.removeItem('veltrix_token');
    localStorage.removeItem('veltrix_user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* ===================================================================== */}
      {/* DESKTOP SIDEBAR (Visible md:flex, hidden on mobile) */}
      {/* ===================================================================== */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white text-sm shadow-md shadow-emerald-500/20">
                V
              </div>
              <span className="font-semibold text-sm tracking-tight text-white font-heading">
                Veltrix Hub
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white text-sm">
              V
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User / Logout Footer */}
        <div className="border-t border-slate-800 p-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between rounded-xl bg-slate-950 p-2.5 border border-slate-800">
              <div className="truncate pr-2">
                <p className="truncate text-xs font-semibold text-slate-200">{userName}</p>
                <p className="truncate text-[10px] text-slate-400">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* MOBILE DRAWER / OVERLAY (When Hamburger is Clicked) */}
      {/* ===================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-slate-900 border-r border-slate-800 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white text-sm">
                  V
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Veltrix Hub</h3>
                  <p className="text-[10px] text-slate-400">AI Growth Command</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold min-h-[44px] transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-2.5 border border-slate-800 mb-2">
                <div className="truncate pr-2">
                  <p className="text-xs font-semibold text-slate-200">{userName}</p>
                  <p className="text-[10px] text-slate-400">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors min-h-[44px]"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN VIEWPORT */}
      {/* ===================================================================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur px-3 sm:px-6 shrink-0">
          {/* Left on Mobile: Hamburger + Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden rounded-xl p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white text-xs">
                V
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Veltrix Hub
              </span>
            </div>
          </div>

          {/* Right Header Status + User Profile + Quick Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">Organization:</span>
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              Growth Hub Active
            </span>

            {/* Top Bar Logout Action */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all text-xs"
              title="Log Out of Session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className={`flex-1 overflow-y-auto p-3 sm:p-6 ${MOBILE_BOTTOM_ITEMS.length > 0 ? 'pb-24' : 'pb-6'} md:pb-6`}>
          <Outlet />
        </main>

        {/* =================================================================== */}
        {/* MOBILE BOTTOM NAVIGATION BAR (md:hidden, renders when > 0 items)   */}
        {/* =================================================================== */}
        {MOBILE_BOTTOM_ITEMS.length > 0 && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-xl px-1 pt-1 safe-area-pb shadow-2xl">
            {MOBILE_BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl transition-all ${
                    isActive
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200 active:scale-95'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
                      isActive ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] leading-tight tracking-tight mt-0.5">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
