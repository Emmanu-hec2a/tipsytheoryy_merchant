import React, { useEffect, useState } from 'react';
import {
  ShoppingBag, DollarSign, Clock, Users,
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Calendar, ChevronRight, Package, User, AlertCircle
} from 'lucide-react';
import { partner } from '../api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
    <div className="flex items-center gap-2.5 mb-1.5">
      <div className={`w-7 h-7 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
        <Icon size={14} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-[8px] font-bold uppercase tracking-widest truncate">{title}</p>
    </div>
    {loading ? (
      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
    ) : (
      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{value}</h3>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, ordersRes] = await Promise.all([
          partner.getDashboardStats(),
          partner.getOrders()
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Oops! Something went wrong</h3>
        <p className="text-slate-500 text-sm max-w-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ⚠️ Payout Overdue Alert */}
      {stats?.has_unpaid_overdue && (
        <div className="bg-orange-600 p-4 rounded-3xl text-white shadow-xl shadow-orange-600/20 flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <AlertCircle size={20} className="text-white" />
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Payout Overdue</h4>
                 <p className="text-[10px] opacity-80 font-bold">You have unpaid revenue share from previous weeks.</p>
              </div>
           </div>
           <Link
             to="/revenue-sharing"
             className="bg-white text-orange-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
           >
             Pay Now
           </Link>
        </div>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs shadow-sm">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
           </div>
           <Link
            to="/reports"
            className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all"
           >
              Detailed Analytics
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={`KSh ${stats?.today_revenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color={{bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400'}}
          loading={loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${stats?.monthly_revenue?.toLocaleString() || 25800}`}
          icon={TrendingUp}
          color={{bg: 'bg-primary-light dark:bg-primary/20', text: 'text-primary'}}
          loading={loading}
        />
        <StatCard
          title="Orders Today"
          value={stats?.today_orders || 0}
          icon={ShoppingBag}
          color={{bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400'}}
          loading={loading}
        />
        <StatCard
          title="Pending Action"
          value={stats?.pending_orders || 0}
          icon={Clock}
          color={{bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400'}}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <Link to="/orders" className="text-primary text-[10px] font-bold flex items-center gap-1 hover:gap-1.5 transition-all uppercase tracking-wider">
                View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="px-5 py-3.5"><div className="h-3.5 w-full bg-slate-50 dark:bg-slate-800 animate-pulse rounded" /></td>
                    </tr>
                   ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">No recent orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white text-xs">#{order.order_number}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                             <User size={12} />
                          </div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{order.customer_email || order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-primary">KSh {parseFloat(order.total).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          order.status === 'pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Inventory Status</h3>
           <div className="space-y-3">
              {[
                { label: 'Low Stock Alert', count: stats?.low_stock_count || 0, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: AlertCircle, link: '/products' },
                { label: 'Active Products', count: 'View', color: 'text-primary', bg: 'bg-primary-light dark:bg-primary/20', icon: Package, link: '/products' },
              ].map((item, i) => (
                <Link to={item.link} key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                       <item.icon size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-none mb-1">{item.label}</p>
                        <p className="text-[8px] text-slate-400 dark:text-slate-500">Inventory Sync</p>
                    </div>
                  </div>
                  <span className={`text-sm font-extrabold ${item.color} group-hover:translate-x-1 transition-transform`}>
                    {loading ? '...' : item.count}
                  </span>
                </Link>
              ))}
           </div>

           <div className="mt-6 bg-primary-light dark:bg-primary/10 p-3.5 rounded-2xl">
              <p className="text-[9px] text-primary font-bold uppercase mb-1.5">Platform Status</p>
              <p className="text-[11px] text-primary/80 dark:text-primary/90 leading-relaxed font-medium">
                Your store is currently <strong>Active</strong>. Keep your stock updated for customers.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
