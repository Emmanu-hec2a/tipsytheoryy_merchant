import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, ShoppingBag,
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  ChevronDown, CheckCircle2
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
import { AnalyticsSkeleton } from '../components/Skeleton';

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
    } catch (err) { console.error('Failed to fetch analytics data'); }
    finally { setLoading(false); }
  };

  const lineData = {
    labels: revenueData.map(d => d.day),
    datasets: [{
      label: 'Revenue',
      data: revenueData.map(d => d.revenue),
      borderColor: '#0D3B30',
      backgroundColor: 'rgba(13, 59, 48, 0.05)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#fff',
    }]
  };

  const barData = {
    labels: topProducts.map(p => p.food_item__name),
    datasets: [{
      label: 'Orders',
      data: topProducts.map(p => p.total_sold),
      backgroundColor: '#F97316',
      borderRadius: 6,
      barThickness: 16,
    }]
  };

  const donutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [summary.completed_orders || 0, summary.pending_orders || 0, summary.cancelled_orders || 0],
      backgroundColor: ['#10B981', '#F97316', '#EF4444'],
      borderWidth: 0,
      cutout: '80%',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1E293B', padding: 8, titleFont: { size: 11 }, bodyFont: { size: 11 } }
    },
    scales: {
      y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 9 } } },
      x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 9 } } }
    }
  };

  if (loading && !store) return <AnalyticsSkeleton />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analytics & Insights</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">Performance Tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `KSh ${summary.total_revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Orders', value: summary.total_orders, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary-light dark:bg-primary/20' },
          { label: 'Deliveries', value: summary.completed_orders || 0, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Avg Value', value: `KSh ${summary.total_orders > 0 ? (summary.total_revenue / summary.total_orders).toFixed(0) : 0}`, icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className={`w-7 h-7 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}><stat.icon size={14} /></div>
              <p className="text-slate-400 dark:text-slate-500 text-[8px] font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sales Trend</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Revenue over time</p>
           </div>
           <div className="h-[200px]">
              {revenueData.length > 0 ? <Line data={lineData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">No data</div>}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Output</h3>
           <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mb-4 uppercase tracking-widest">Order distribution</p>
           <div className="relative h-[150px] mb-4">
              <Doughnut data={donutData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-xl font-extrabold text-slate-900 dark:text-white">{summary.total_orders}</span>
                 <span className="text-[7px] text-slate-400 dark:text-slate-500 font-bold uppercase">Total</span>
              </div>
           </div>
           <div className="space-y-2">
              {donutData.labels.map((label, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }} />
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{label}</span>
                   </div>
                   <span className="text-[11px] font-bold text-slate-900 dark:text-white">{donutData.datasets[0].data[i]}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Top Selling Items</h3>
           <div className="h-[200px]">
              {topProducts.length > 0 ? <Bar data={barData} options={{...chartOptions, indexAxis: 'y'}} /> : <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">No sales yet</div>}
           </div>
        </div>

        <SoftGate isGated={store?.plan !== 'pro'} featureName="Customer Insights" planRequired="Pro">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[250px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Demographics</h3>
              <div className="space-y-5">
                {[ { label: 'New', val: 0, color: 'bg-primary' }, { label: 'Returning', val: 0, color: 'bg-accent' } ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <span>{item.label}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
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
