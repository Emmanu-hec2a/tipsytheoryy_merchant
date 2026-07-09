import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, Download,
  MoreVertical, Eye, FileText, ChevronLeft,
  ChevronRight, ArrowUpDown, X, Phone,
  User, MapPin, Package, Clock, Star,
  Motorbike, Navigation2, CheckCircle2,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { partner } from '../api';

const FilterTab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
      active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
          active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
        }`}>
          {count}
        </span>
      )}
    </div>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
    )}
  </button>
);

const RiderAssignmentModal = ({ isOpen, onClose, onAssign, orderId }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNearbyRiders();
    }
  }, [isOpen]);

  const fetchNearbyRiders = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getNearbyRiders();
      setRiders(data);
    } catch (err) {
      console.error('Failed to fetch nearby riders');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Assign Nearby Rider</h3>
            <p className="text-sm text-slate-500 font-medium">Available riders in your delivery zone</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-medium">Scanning for riders...</div>
          ) : riders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Navigation2 size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">No available riders found nearby.</p>
              <p className="text-xs text-slate-300">Try increasing your delivery radius in settings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {riders.map(rider => (
                <button
                  key={rider.id}
                  onClick={() => onAssign(rider.id)}
                  className="w-full p-4 flex items-center justify-between border border-slate-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-white transition-all">
                      <Motorbike size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">{rider.username}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star size={12} fill="currentColor" /> {rider.avg_rating}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {rider.distance_km} KM AWAY
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderDetailSidebar = ({ orderId, onClose, onUpdate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchDetail();
    }
  }, [orderId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getOrderDetail(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await partner.updateOrderStatus(orderId, { status: newStatus });
      fetchDetail();
      onUpdate();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    const baseUrl = 'http://localhost:8000/api/v1/';
    const token = localStorage.getItem('access_token');
    window.open(`${baseUrl}partner/orders/${orderId}/invoice/?token=${token}`, '_blank');
  };

  const handleAssignRider = async (riderId) => {
    try {
      await partner.assignRider(orderId, riderId);
      setIsAssigning(false);
      fetchDetail();
      onUpdate();
    } catch (err) {
      alert('Failed to assign rider');
    }
  };

  if (!orderId) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Order Details</h3>
              <p className="text-sm text-slate-500 font-medium">#{order?.order_number || '...'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium animate-pulse">Loading order info...</div>
          ) : !order ? (
            <div className="p-8 text-center text-red-500 font-bold">Failed to load order.</div>
          ) : (
            <div className="p-8 space-y-8 pb-32">
              {/* Status & Summary */}
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-extrabold text-primary">KES {parseFloat(order.total).toLocaleString()}</p>
                </div>
              </div>

              {/* Rider Info (If Assigned) */}
              {order.rider_name && (
                <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary rounded-xl text-white">
                      <Motorbike size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Assigned Rider</h4>
                  </div>
                  <p className="text-sm font-bold text-slate-900 ml-10">{order.rider_name}</p>
                </section>
              )}

              {/* Customer Info */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-slate-400" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Customer Information</h4>
                </div>
                <div className="space-y-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Name</span>
                    <span className="text-sm text-slate-900 font-bold">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Delivery Address</span>
                    <span className="text-sm text-slate-900 font-bold text-right leading-relaxed">{order.address_string || 'Not specified'}</span>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-slate-400" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Order Items</h4>
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  {order.items?.map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between border-b last:border-0 border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                          {item.product_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-primary">KES {parseFloat(item.subtotal).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Persistent Action Footer */}
          {!loading && order && (
            <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex flex-col gap-3 z-20">
              <div className="flex gap-4">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={updating}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Confirm Order
                  </button>
                )}

                {order.status === 'confirmed' && (
                   <button
                    onClick={() => handleUpdateStatus('processing')}
                    disabled={updating}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                   >
                     <RefreshCw size={18} />
                     Start Preparing
                   </button>
                )}

                {['confirmed', 'processing'].includes(order.status) && (
                  <button
                    onClick={() => setIsAssigning(true)}
                    className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Motorbike size={18} />
                    Assign Rider
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrintInvoice}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Print Invoice
                </button>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={updating}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Reject
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <RiderAssignmentModal
        isOpen={isAssigning}
        onClose={() => setIsAssigning(false)}
        onAssign={handleAssignRider}
        orderId={orderId}
      />
    </>
  );
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await partner.getOrders({
        status: activeTab === 'All' ? '' : activeTab.toLowerCase()
      });
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={18} />
            Today
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <FilterTab
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              count={orders.filter(o => tab === 'All' || o.status.toLowerCase() === tab.toLowerCase()).length}
            />
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Name</th>
                <th className="px-6 py-5">Order Date</th>
                <th className="px-6 py-5">Total Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="px-6 py-5"><div className="h-4 w-full bg-slate-50 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">#{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-bold">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-primary">KES {parseFloat(order.total).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="bg-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-accent/20 group-hover:scale-105 active:scale-95 transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailSidebar
        orderId={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={fetchOrders}
      />
    </div>
  );
};

export default Orders;
