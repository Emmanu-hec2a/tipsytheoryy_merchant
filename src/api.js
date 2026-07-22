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

  // Production-Ready: Include Active Store ID header if present
  const activeStoreId = localStorage.getItem('active_store_id');
  if (activeStoreId) {
    config.headers['X-Store-ID'] = activeStoreId;
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

// Simple In-Memory Cache for GET Requests
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const cachedGet = async (url, params = {}) => {
  // Production-Ready: Cache must be scoped to the active store to avoid data leaks during switching
  const activeStoreId = localStorage.getItem('active_store_id') || 'default';
  const cacheKey = JSON.stringify({ url, params, activeStoreId });
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const { timestamp, data } = cache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      return { data };
    }
  }

  const response = await api.get(url, { params });
  cache.set(cacheKey, { timestamp: now, data: response.data });
  return response;
};

export const partner = {
  checkStatus: () => cachedGet('partner/status/'),
  getDashboardStats: () => cachedGet('partner/dashboard/stats/'),
  getOrders: (params) => api.get('partner/orders/', { params }), // Orders change frequently, don't cache
  getOrderDetail: (id) => api.get(`partner/orders/${id}/`),
  updateOrderStatus: (id, data) => api.patch(`partner/orders/${id}/`, data),
  getOrderSummary: () => cachedGet('partner/orders/summary/'),
  getProducts: (params) => api.get('partner/menu/', { params }),
  createProduct: (data) => api.post('partner/menu/', data),
  updateProduct: (id, data) => api.patch(`partner/menu/${id}/`, data),
  getCategories: () => cachedGet('partner/categories/'),
  createCategory: (data) => api.post('partner/categories/', data),
  updateCategory: (id, data) => api.patch(`partner/categories/${id}/`, data),
  getInventoryStats: () => cachedGet('partner/inventory/stats/'),
  getPromotions: () => cachedGet('partner/promotions/'),
  createPromotion: (data) => api.post('partner/promotions/', data),
  deletePromotion: (id) => api.delete(`partner/promotions/${id}/`),
  getCustomers: () => cachedGet('partner/customers/'),
  getPayoutHistory: () => cachedGet('partner/payouts/history/'),
  getNearbyRiders: () => api.get('partner/riders/nearby/'),
  assignRider: (orderId, riderId) => api.post(`partner/orders/${orderId}/assign-rider/`, { rider_id: riderId }),
  bulkActionProducts: (data) => api.post('partner/products/bulk-action/', data),
  getAnalyticsSummary: () => cachedGet('partner/analytics/'),
  getRevenueAnalytics: (range) => cachedGet('partner/analytics/revenue/', { range }),
  getTopProductsAnalytics: () => cachedGet('partner/analytics/top-products/'),
  getSettings: () => cachedGet('partner/settings/'),
  updateSettings: (data) => api.patch('partner/settings/', data),
  getBillingHistory: () => cachedGet('partner/billing/history/'),
  paySubscription: (data) => api.post('partner/billing/pay-now/', data),
  sendMarketingBlast: (data) => api.post('partner/marketing/blast/', data),
  getMarketingStats: () => cachedGet('partner/marketing/stats/'),
  getRevenueShare: () => cachedGet('partner/revenue-share/'),
  payRevenueShare: (data) => api.post('partner/revenue-share/', data),
  verifyRevenueGate: (data) => api.post('partner/revenue-share/gate/', data),
  getBranches: () => api.get('partner/franchise/branches/'),
  switchStore: (storeId) => api.post('partner/franchise/switch/', { store_id: storeId }),
  createBranch: (data) => api.post('partner/franchise/create-branch/', data),
};

export default api;
