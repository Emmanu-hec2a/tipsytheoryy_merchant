import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Wine, List, Package,
  Users, BarChart3, Wallet, Settings, LogOut, Bell,
  Store, Menu, X, ChevronDown, Megaphone, BadgePercent, Plus,
  CreditCard, Clock, Lock, ArrowRight, Moon, Sun
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { partner } from '../api';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, path, badge, active, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all mb-1 group ${
      active
        ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-[1.02]'
        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-white'} />
      <span className="text-[11px] uppercase tracking-wider">{label}</span>
    </div>
    {badge > 0 && (
      <span className={`${active ? 'bg-white text-primary' : 'bg-primary text-white'} text-[9px] font-black px-1.5 py-0.5 rounded-lg`}>
        {badge}
      </span>
    )}
  </Link>
);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [branches, setBranches] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [isStoreSwitcherOpen, setIsStoreSwitcherOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Audio reference for new orders
  const audioRef = React.useRef(new Audio('/sounds/new-order.mp3'));

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      // Play and immediately pause to "unlock" audio for browser
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  useEffect(() => {
    let lastOrderCount = 0;
    let flashInterval = null;
    const originalTitle = document.title;

    const flashTab = () => {
      if (flashInterval) return;
      flashInterval = setInterval(() => {
        document.title = document.title === originalTitle ? '🔔 NEW ORDER!' : originalTitle;
      }, 1000);

      // Stop flashing when user clicks anywhere on the page
      const stopFlashing = () => {
        clearInterval(flashInterval);
        flashInterval = null;
        document.title = originalTitle;
        window.removeEventListener('click', stopFlashing);
      };
      window.addEventListener('click', stopFlashing);
    };

    const fetchStats = async () => {
        try {
            const { data } = await partner.getDashboardStats();
            // Cache stats locally for plan gating in other components
            localStorage.setItem('dashboard_stats', JSON.stringify(data));

            // Logic for Audio Alert
            if (data.pending_orders > lastOrderCount && lastOrderCount !== 0) {
              if (userInteracted) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
              }
              flashTab();
            }

            lastOrderCount = data.pending_orders;
            setPendingCount(data.pending_orders || 0);
            setIsRestricted(data.is_restricted || false);

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

    // Fetch Branches for Enterprise Switcher
    const fetchBranches = async () => {
        try {
            // First check if user is Enterprise via the stats we already have
            const { data: stats } = await partner.getDashboardStats();
            const isEnterprise = stats.plan === 'enterprise' || stats.plan === 'custom';

            // Critical Fix: Always set active store state so UI doesn't show "Loading..."
            const currentStoreInfo = {
                id: stats.store_id || 'default',
                name: stats.business_name || 'My Store',
                shop_name: stats.business_name || 'My Store',
                plan: stats.plan,
                logo: stats.logo || null
            };
            setActiveStore(currentStoreInfo);

            // Critical Fix: Always attempt to fetch branches for partners to keep switcher alive
            const { data } = await partner.getBranches();
            setBranches(data || []);

            // Set active store from localStorage or default to the one returned by stats
            const savedId = localStorage.getItem('active_store_id');
            const current = data.find(s => s.id === parseInt(savedId)) || currentStoreInfo;

            if (current) {
                setActiveStore(current);
                if (!savedId && current.id !== 'default') {
                    localStorage.setItem('active_store_id', current.id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch branches');
        }
    };
    fetchBranches();

    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleSwitchStore = async (store) => {
    try {
        localStorage.setItem('active_store_id', store.id);
        setActiveStore(store);
        setIsStoreSwitcherOpen(false);
        // Refresh page to reset all cached API states with new X-Store-ID
        window.location.reload();
    } catch (err) {
        alert('Failed to switch store');
    }
  };

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
    { icon: Wallet, label: 'Revenue Share', path: '/revenue-sharing' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-2.5">
          <div className="flex items-center justify-between px-2 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Wine size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">TipsyTheoryy</h2>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Merchant</p>
              </div>
            </div>

            {/* Close Button for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
              />
            ))}
          </nav>

          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
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
              className="flex items-center gap-2.5 px-3.5 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
            >
               <LogOut size={16} />
               <span className="text-xs font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 w-full ${isSidebarOpen ? 'lg:pl-56' : 'lg:pl-0'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Menu size={20} />
            </button>
            <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[120px] md:max-w-none">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                title={`Currently: ${theme}. Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isNotifOpen ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                <Bell size={18} />
                {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white dark:border-slate-900" />
                )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white">Notifications</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary-light dark:bg-primary/20 px-2 py-0.5 rounded-full uppercase">{notifications.length} New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">
                            <Bell className="mx-auto mb-3 opacity-20" size={32} />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="p-5 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                        <notif.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{notif.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{notif.desc}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            <Clock size={10} />
                                            {notif.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Mark all as read</button>
              </div>
            )}

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="relative">
              <div
                onClick={() => setIsStoreSwitcherOpen(!isStoreSwitcherOpen)}
                className="flex items-center gap-2.5 pl-2 cursor-pointer group"
              >
                  <div className="flex flex-col items-end hidden md:flex">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {activeStore?.shop_name || activeStore?.name || 'Loading...'}
                      </p>
                      <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          <span className="text-[9px] text-slate-500 dark:text-slate-400">
                            {activeStore?.plan?.toUpperCase()} Plan
                          </span>
                      </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold group-hover:scale-105 transition-all overflow-hidden border-2 border-primary/20">
                     {activeStore?.logo ? (
                       <img src={activeStore.logo} alt="Logo" className="w-full h-full object-cover" />
                     ) : (
                       <Store size={18} />
                     )}
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${isStoreSwitcherOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Enterprise Store Switcher Dropdown */}
              {isStoreSwitcherOpen && (branches.length > 1 || ['enterprise', 'custom'].includes(activeStore?.plan)) && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Management</p>
                  </div>

                  {branches.length > 1 && (
                    <div className="max-h-60 overflow-y-auto no-scrollbar">
                      {branches.map(store => (
                        <div
                          key={store.id}
                          onClick={() => handleSwitchStore(store)}
                          className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${activeStore?.id === store.id ? 'bg-primary-light/30 dark:bg-primary/10 border-r-4 border-primary' : ''}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                            {store.logo ? <img src={store.logo} alt="" className="w-full h-full object-cover" /> : <Store size={14} className="text-slate-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{store.shop_name || store.name}</p>
                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{store.plan} Plan</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expansion Tool - Gated for Enterprise/Custom */}
                  {['enterprise', 'custom'].includes(activeStore?.plan) && (
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsStoreSwitcherOpen(false);
                          navigate('/settings?action=add-branch');
                        }}
                        className="w-full py-2.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                      >
                        <Plus size={14} /> Add New Branch
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 relative">
          {children}

          {/* 🛡️ Hard Lock Overlay */}
          {isRestricted && location.pathname !== '/revenue-sharing' && (
            <div className="fixed inset-0 z-[100] lg:ml-56 top-[61px] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
               <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
                     <Lock size={40} />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Access Restricted</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Your account has been restricted due to <strong>2+ weeks</strong> of unpaid revenue share. Please settle your balance to resume operations.
                     </p>
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/revenue-sharing"
                      className="w-full bg-slate-900 dark:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-primary/20"
                    >
                      Go to Revenue Share <ArrowRight size={16} />
                    </Link>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Store visibility: Offline</p>
                  </div>
               </div>
            </div>
          )}
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
