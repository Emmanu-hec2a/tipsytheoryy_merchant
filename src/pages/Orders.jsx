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
    className={`px-4 py-3 text-xs font-bold transition-all relative whitespace-nowrap ${
      active ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
    }`}
  >
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
          active ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/';
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
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 no-scrollbar">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">#{order?.order_number || '...'}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-600 text-sm font-medium animate-pulse">Loading order info...</div>
          ) : !order ? (
            <div className="p-6 text-center text-red-500 font-bold text-sm">Failed to load order.</div>
          ) : (
            <div className="p-6 space-y-6 pb-32">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                    'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Total</p>
                  <p className="text-xl font-extrabold text-primary">KES {parseFloat(order.total).toLocaleString()}</p>
                  {parseFloat(order.discount_amount || 0) > 0 && (
                    <p className="text-[8px] font-bold text-green-600 uppercase tracking-tighter">Saved KSh {parseFloat(order.discount_amount).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {order.rider_name && (
                <section className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="p-1.5 bg-primary rounded-lg text-white">
                      <Motorbike size={14} />
                    </div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Assigned Rider</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white ml-8">{order.rider_name}</p>
                </section>
              )}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <User size={16} className="text-slate-400 dark:text-slate-600" />
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Customer Information</h4>
                </div>
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Name</span>
                    <span className="text-xs text-slate-900 dark:text-white font-bold">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Address</span>
                    <span className="text-xs text-slate-900 dark:text-white font-bold text-right leading-relaxed">{order.address_string || 'Not specified'}</span>
                  </div>
                </div>
              </section>

              {order.verification_image_url && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye size={16} className="text-slate-400 dark:text-slate-600" />
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Midnight Mirror Verification</h4>
                  </div>
                  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 dark:border-slate-700 shadow-lg relative group">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}${order.verification_image_url}`}
                      alt="Verification"
                      className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">AES-256 SECURED</span>
                    </div>
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-slate-400 dark:text-slate-600" />
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Order Items</h4>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  {order.items?.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase">
                          {item.product_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{item.product_name}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-primary">KES {parseFloat(item.subtotal).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {!loading && order && (
            <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 z-20">
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={updating}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm
                  </button>
                )}
                {['confirmed', 'processing'].includes(order.status) && (
                  <button
                    onClick={() => setIsAssigning(true)}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Assign Rider
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrintInvoice} className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Invoice</button>
                {order.status === 'pending' && (
                  <button onClick={() => handleUpdateStatus('cancelled')} className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">Reject</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Numbered Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Showing <span className="text-primary">{orders.length}</span> of {totalOrders} Orders
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="First Page"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                  <ChevronLeft size={16} strokeWidth={3} className="-ml-2.5" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="Last Page"
                >
                  <ChevronRight size={16} strokeWidth={3} />
                  <ChevronRight size={16} strokeWidth={3} className="-ml-2.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const tabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when tab changes
    fetchOrders(1);
  }, [activeTab]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await partner.getOrders({
        status: activeTab === 'All' ? '' : activeTab.toLowerCase(),
        page: page
      });

      // Handle Paginated Response
      if (data.results) {
        setOrders(data.results);
        setTotalOrders(data.count);
        // Calculate total pages (assuming 15 items per page from backend)
        setTotalPages(Math.ceil(data.count / 15));
      } else {
        setOrders(data || []);
        setTotalOrders(data.length || 0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Calendar size={16} /> Today
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Numbered Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Showing <span className="text-primary">{orders.length}</span> of {totalOrders} Orders
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="First Page"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                  <ChevronLeft size={16} strokeWidth={3} className="-ml-2.5" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="Last Page"
                >
                  <ChevronRight size={16} strokeWidth={3} />
                  <ChevronRight size={16} strokeWidth={3} className="-ml-2.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-2 overflow-x-auto no-scrollbar">
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

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="px-5 py-3.5"><div className="h-3.5 w-full bg-slate-50 dark:bg-slate-800 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white text-xs">#{order.order_number}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 font-bold truncate max-w-[120px]">{order.customer_name}</td>
                    <td className="px-5 py-3.5 text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-extrabold text-primary">KES {parseFloat(order.total).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                        order.status === 'pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                        'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="bg-accent text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent/10 group-hover:scale-105 active:scale-95 transition-all"
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

        {/* Numbered Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Showing <span className="text-primary">{orders.length}</span> of {totalOrders} Orders
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="First Page"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                  <ChevronLeft size={16} strokeWidth={3} className="-ml-2.5" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors"
                  title="Last Page"
                >
                  <ChevronRight size={16} strokeWidth={3} />
                  <ChevronRight size={16} strokeWidth={3} className="-ml-2.5" />
                </button>
              </div>
            </div>
          </div>
        )}
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
