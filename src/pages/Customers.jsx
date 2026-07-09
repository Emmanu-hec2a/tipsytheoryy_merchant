import React, { useState, useEffect } from 'react';
import { partner } from '../api';
import { User, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Your Customers</h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
            <tr><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Total Orders</th><th className="px-6 py-4">Rating Given</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan="4" className="p-6"><div className="h-4 bg-slate-50 animate-pulse rounded" /></td></tr>) :
              customers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={18} /></div>
                      <span className="font-bold text-slate-900">{cust.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Mail size={12} /> {cust.email}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Phone size={12} /> {cust.phone}</div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-primary">{cust.total_deliveries} Orders</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-orange-500">{cust.avg_rating} ★</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
