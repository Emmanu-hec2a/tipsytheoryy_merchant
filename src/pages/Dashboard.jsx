import React, { useEffect, useState } from 'react';
import {
  ShoppingBag, DollarSign, Clock, Users,
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Calendar, ChevronRight, Package, User, AlertCircle
} from 'lucide-react';
import { partner } from '../api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-8 h-8 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
        <Icon size={16} />
      </div>
      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest truncate">{title}</p>
    </div>
    {loading ? (
      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-lg" />
    ) : (
      <h3 className="text-lg font-extrabold text-slate-900">{value}</h3>
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
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h3>
        <p className="text-slate-500 max-w-xs">{error}</p>
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm shadow-sm">
              <Calendar size={18} />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
           </div>
           <Link
            to="/reports"
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"
           >
              Detailed Analytics
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`KSh ${stats?.today_revenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color={{bg: 'bg-green-50', text: 'text-green-600'}}
          loading={loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${stats?.monthly_revenue?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color={{bg: 'bg-primary-light', text: 'text-primary'}}
          loading={loading}
        />
        <StatCard
          title="Orders Today"
          value={stats?.today_orders || 0}
          icon={ShoppingBag}
          color={{bg: 'bg-blue-50', text: 'text-blue-600'}}
          loading={loading}
        />
        <StatCard
          title="Pending Action"
          value={stats?.pending_orders || 0}
          icon={Clock}
          color={{bg: 'bg-orange-50', text: 'text-orange-600'}}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
            <Link to="/orders" className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="px-6 py-4"><div className="h-4 w-full bg-slate-50 animate-pulse rounded" /></td>
                    </tr>
                   ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">No recent orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">#{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <User size={14} />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">KSh {parseFloat(order.total).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                          order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
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
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
           <h3 className="text-base font-bold text-slate-900 mb-5">Inventory Status</h3>
           <div className="space-y-4">
              {[
                { label: 'Low Stock Alert', count: stats?.low_stock_count || 0, color: 'text-orange-500', bg: 'bg-orange-50', icon: AlertCircle, link: '/products' },
                { label: 'Active Products', count: 'View', color: 'text-primary', bg: 'bg-primary-light', icon: Package, link: '/products' },
              ].map((item, i) => (
                <Link to={item.link} key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-50 hover:border-slate-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                       <item.icon size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900">{item.label}</p>
                        <p className="text-[9px] text-slate-400">Inventory Sync</p>
                    </div>
                  </div>
                  <span className={`text-base font-extrabold ${item.color} group-hover:translate-x-1 transition-transform`}>
                    {loading ? '...' : item.count}
                  </span>
                </Link>
              ))}
           </div>

           <div className="mt-8 bg-primary-light p-4 rounded-2xl">
              <p className="text-[10px] text-primary font-bold uppercase mb-2">Platform Status</p>
              <p className="text-xs text-primary/80 leading-relaxed">
                Your store is currently <strong>Active</strong>. Keep your stock updated to ensure a smooth customer experience.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
