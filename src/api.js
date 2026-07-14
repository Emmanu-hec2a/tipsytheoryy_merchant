import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('auth/partner/login/', credentials),
  signup: (data) => api.post('auth/partner/signup/', data),
};

export const partner = {
  checkStatus: () => api.get('partner/status/'),
  getDashboardStats: () => api.get('partner/dashboard/stats/'),
  getOrders: (params) => api.get('partner/orders/', { params }),
  getOrderDetail: (id) => api.get(`partner/orders/${id}/`),
  updateOrderStatus: (id, data) => api.patch(`partner/orders/${id}/`, data),
  getOrderSummary: () => api.get('partner/orders/summary/'),
  getProducts: (params) => api.get('partner/menu/', { params }),
  createProduct: (data) => api.post('partner/menu/', data),
  updateProduct: (id, data) => api.patch(`partner/menu/${id}/`, data),
  getCategories: () => api.get('partner/categories/'),
  createCategory: (data) => api.post('partner/categories/', data),
  updateCategory: (id, data) => api.patch(`partner/categories/${id}/`, data),
  getInventoryStats: () => api.get('partner/inventory/stats/'),
  getPromotions: () => api.get('partner/promotions/'),
  createPromotion: (data) => api.post('partner/promotions/', data),
  deletePromotion: (id) => api.delete(`partner/promotions/${id}/`),
  getCustomers: () => api.get('partner/customers/'),
  getPayoutHistory: () => api.get('partner/payouts/history/'),
  getNearbyRiders: () => api.get('partner/riders/nearby/'),
  assignRider: (orderId, riderId) => api.post(`partner/orders/${orderId}/assign-rider/`, { rider_id: riderId }),
  bulkActionProducts: (data) => api.post('partner/products/bulk-action/', data),
  getAnalyticsSummary: () => api.get('partner/analytics/'),
  getRevenueAnalytics: (range) => api.get('partner/analytics/revenue/', { params: { range } }),
  getTopProductsAnalytics: () => api.get('partner/analytics/top-products/'),
  getSettings: () => api.get('partner/settings/'),
  updateSettings: (data) => api.patch('partner/settings/', data),
  getBillingHistory: () => api.get('partner/billing/history/'),
  paySubscription: (data) => api.post('partner/billing/pay-now/', data),
  sendMarketingBlast: (data) => api.post('partner/marketing/blast/', data),
  getMarketingStats: () => api.get('partner/marketing/stats/'),
};

export default api;
