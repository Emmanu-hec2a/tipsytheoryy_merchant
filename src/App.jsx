import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Analytics from './pages/Analytics';
import Inventory from './pages/Inventory';
import Promotions from './pages/Promotions';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import PendingApproval from './pages/PendingApproval';
import Marketing from './pages/Marketing';
import Layout from './components/Layout';
import { partner } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('access_token'));
  const [isApproved, setIsApproved] = React.useState(true);
  const [loading, setLoading] = React.useState(!!localStorage.getItem('access_token'));

  // Define checkApproval at the top level so it can be passed down
  const checkApproval = React.useCallback(async () => {
    if (!localStorage.getItem('access_token')) return;

    try {
      const { data } = await partner.checkStatus();
      // A partner is "Approved" for the dashboard if they are approved AND have a store
      setIsApproved(data.is_approved && data.has_store);
    } catch (err) {
      console.error("Status check failed", err);
      setIsApproved(false);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      checkApproval();
    }
  }, [isAuthenticated, checkApproval]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-primary animate-pulse text-2xl uppercase tracking-widest">TipsyTheoryy...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          isAuthenticated ? (
            isApproved ? (
              <Layout><Dashboard /></Layout>
            ) : <Navigate to="/pending-approval" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/pending-approval" element={
          isAuthenticated ? (
            isApproved ? <Navigate to="/dashboard" replace /> : <PendingApproval onCheckStatus={checkApproval} />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/orders" element={
          isAuthenticated ? (
            isApproved ? (
              <Layout><Orders /></Layout>
            ) : <Navigate to="/pending-approval" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/products" element={
          isAuthenticated ? (
            isApproved ? (
              <Layout><Products /></Layout>
            ) : <Navigate to="/pending-approval" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/inventory" element={isAuthenticated ? (isApproved ? <Layout><Inventory /></Layout> : <Navigate to="/pending-approval" />) : <Navigate to="/login" replace />} />
        <Route path="/marketing" element={isAuthenticated ? (isApproved ? <Layout><Marketing /></Layout> : <Navigate to="/pending-approval" />) : <Navigate to="/login" replace />} />
        <Route path="/promotions" element={isAuthenticated ? (isApproved ? <Layout><Promotions /></Layout> : <Navigate to="/pending-approval" />) : <Navigate to="/login" replace />} />
        <Route path="/customers" element={isAuthenticated ? (isApproved ? <Layout><Customers /></Layout> : <Navigate to="/pending-approval" />) : <Navigate to="/login" replace />} />

        <Route path="/reports" element={
          isAuthenticated ? (
            isApproved ? (
              <Layout><Analytics /></Layout>
            ) : <Navigate to="/pending-approval" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/settings" element={
          isAuthenticated ? (
            isApproved ? (
              <Layout><Settings /></Layout>
            ) : <Navigate to="/pending-approval" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/billing" element={
          isAuthenticated ? (
            <Layout>
               <Billing />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
