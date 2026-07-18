import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { User, Mail, Phone, Calendar, ShoppingBag, Star } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await partner.getCustomers();
        setCustomers(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Base</h2>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Community Insights</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact Details</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3 text-right">Avg. Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan="4" className="px-5 py-3.5"><div className="h-3.5 w-full bg-slate-50 dark:bg-slate-800 animate-pulse rounded" /></td></tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan="4" className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">No customers yet.</td></tr>
              ) : (
                customers.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600"><User size={16} /></div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{cust.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium"><Mail size={10} className="text-slate-300 dark:text-slate-600" /> {cust.email}</div>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium"><Phone size={10} className="text-slate-300 dark:text-slate-600" /> {cust.phone}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-bold text-primary bg-primary-light dark:bg-primary/20 px-2 py-0.5 rounded-lg">{cust.total_deliveries} Orders</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                       <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-orange-500">
                          <Star size={10} fill="currentColor" /> {cust.avg_rating}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
