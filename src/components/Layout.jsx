import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Wine, List, Package,
  Users, BarChart3, Wallet, Settings, LogOut, Bell,
  Store, Menu, X, ChevronDown, Megaphone, BadgePercent,
  CreditCard, Clock
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { partner } from '../api';

const SidebarItem = ({ icon: Icon, label, path, badge, active }) => (
  <Link
    to={path}
    className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all mb-0.5 group ${
      active
        ? 'bg-primary-light text-primary font-bold shadow-sm'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <Icon size={18} className={active ? 'text-primary' : 'group-hover:text-slate-900'} />
      <span className="text-xs">{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const { data } = await partner.getDashboardStats();
            setPendingCount(data.pending_orders || 0);

            // Mock some notifications based on stats
            const newNotifs = [];
            if (data.pending_orders > 0) {
                newNotifs.push({
                    id: 1,
                    title: 'New Orders Pending',
                    desc: `You have ${data.pending_orders} new orders to process`,
                    icon: ShoppingBag,
                    time: 'Just now'
                });
            }
            if (data.low_stock_count > 0) {
                newNotifs.push({
                    id: 2,
                    title: 'Low Stock Alert',
                    desc: `${data.low_stock_count} items are running low`,
                    icon: Package,
                    time: '10m ago'
                });
            }
            setNotifications(newNotifs);
        } catch (err) {
            console.error('Failed to fetch stats for layout');
        }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders', badge: pendingCount },
    { icon: Wine, label: 'Products', path: '/products' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Megaphone, label: 'Marketing', path: '/marketing' },
    { icon: BadgePercent, label: 'Promotions', path: '/promotions' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-slate-200 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-2.5">
          <div className="flex items-center gap-2.5 px-2 mb-5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Wine size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">TipsyTheoryy</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Merchant</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          <div className="mt-auto pt-3 border-t border-slate-100">
            <Link to="/settings" className="bg-primary text-white p-3 rounded-2xl mb-3 relative overflow-hidden group block">
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-[10px]">TT</div>
                    <div>
                        <p className="text-[11px] font-bold truncate w-20">Store Profile</p>
                        <p className="text-[8px] opacity-70 uppercase tracking-tighter">View Account</p>
                    </div>
                  </div>
                  <ChevronDown size={12} />
               </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3.5 py-2 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
               <LogOut size={16} />
               <span className="text-xs font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:ml-56' : ''}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-500">
              <Menu size={20} />
            </button>
            <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">{menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}</h1>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isNotifOpen ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
                <Bell size={18} />
                {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white" />
                )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Notifications</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase">{notifications.length} New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">
                            <Bell className="mx-auto mb-3 opacity-20" size={32} />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <notif.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 mb-1">{notif.title}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-2">{notif.desc}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Clock size={10} />
                                            {notif.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button className="w-full py-4 bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all">Mark all as read</button>
              </div>
            )}

            <div className="h-8 w-[1px] bg-slate-200" />

            <Link to="/settings" className="flex items-center gap-2.5 pl-2 cursor-pointer group">
                <div className="flex flex-col items-end hidden md:flex">
                    <p className="text-xs font-bold text-slate-900">Tipsy Theoryy Store</p>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        <span className="text-[9px] text-slate-500">Online</span>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold group-hover:scale-105 transition-all">
                   <Store size={18} />
                </div>
                <ChevronDown size={14} className="text-slate-400" />
            </Link>
          </div>
        </header>

        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Overlay to close notif dropdown */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsNotifOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
