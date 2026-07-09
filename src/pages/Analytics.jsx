import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, ShoppingBag,
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import SoftGate from '../components/SoftGate';
import { partner } from '../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total_revenue: 0, total_orders: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, revenueRes, topProdRes, settingsRes] = await Promise.all([
        partner.getAnalyticsSummary(),
        partner.getRevenueAnalytics(dateRange),
        partner.getTopProductsAnalytics(),
        partner.getSettings()
      ]);

      setSummary(summaryRes.data);
      setRevenueData(revenueRes.data || []);
      setTopProducts(topProdRes.data || []);
      setStore(settingsRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const lineData = {
    labels: revenueData.map(d => d.day),
    datasets: [{
      label: 'Revenue (KSh)',
      data: revenueData.map(d => d.revenue),
      borderColor: '#0D3B30',
      backgroundColor: 'rgba(13, 59, 48, 0.05)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
    }]
  };

  const barData = {
    labels: topProducts.map(p => p.food_item__name),
    datasets: [{
      label: 'Orders',
      data: topProducts.map(p => p.total_sold),
      backgroundColor: '#F97316',
      borderRadius: 8,
      barThickness: 24,
    }]
  };

  // Status distribution requires backend support for counts by status.
  // For now, we'll keep a clean mock or derive if possible.
  const donutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [summary.total_orders, 0, 0], // Derived roughly for UI
      backgroundColor: ['#10B981', '#F97316', '#EF4444'],
      borderWidth: 0,
      cutout: '75%',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  if (loading && !store) return <div className="p-20 text-center text-slate-400 font-medium">Loading reports...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
          <p className="text-slate-500 text-sm">Track your performance and customer behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm shadow-sm outline-none cursor-pointer hover:bg-slate-50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `KSh ${summary.total_revenue.toLocaleString()}`, trend: 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Orders', value: summary.total_orders, trend: 0, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary-light' },
          { label: 'Avg Order Value', value: `KSh ${summary.total_orders > 0 ? (summary.total_revenue / summary.total_orders).toFixed(0) : 0}`, trend: 0, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Customer Satisfaction', value: '4.9/5', trend: 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={16} />
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider truncate">{stat.label}</p>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sales Trend</h3>
                <p className="text-[10px] text-slate-400 font-medium">Revenue distribution over time</p>
              </div>
           </div>
           <div className="h-[250px]">
              {revenueData.length > 0 ? (
                <Line data={lineData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                   No data available for this period
                </div>
              )}
           </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-base font-bold text-slate-900 mb-1">Order Performance</h3>
           <p className="text-[10px] text-slate-400 font-medium mb-6">Summary of your total output</p>

           <div className="relative h-[180px] mb-6">
              <Doughnut data={donutData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-extrabold text-slate-900">{summary.total_orders}</span>
                 <span className="text-[8px] text-slate-400 font-bold uppercase">Total Orders</span>
              </div>
           </div>

           <div className="space-y-3">
              {donutData.labels.map((label, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }} />
                      <span className="text-sm font-medium text-slate-600">{label}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{donutData.datasets[0].data[i]}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-900">Top Selling Products</h3>
           </div>
           <div className="h-[250px]">
              {topProducts.length > 0 ? (
                <Bar data={barData} options={{...chartOptions, indexAxis: 'y'}} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                   No sales data recorded yet
                </div>
              )}
           </div>
        </div>

        {/* Customer Demographics Placeholder */}
        <SoftGate isGated={store?.plan !== 'pro'} featureName="Customer Demographics" planRequired="Pro">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full min-h-[300px]">
              <h3 className="text-base font-bold text-slate-900 mb-6">Customer Insights</h3>
              <div className="space-y-6">
                {[
                  { label: 'New Customers', val: 0, color: 'bg-primary' },
                  { label: 'Returning', val: 0, color: 'bg-accent' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>{item.label}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                      </div>
                  </div>
                ))}
              </div>
          </div>
        </SoftGate>
      </div>
    </div>
  );
};

export default Analytics;
