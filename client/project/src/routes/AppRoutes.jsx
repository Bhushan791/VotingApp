import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ProtectedRoute from './ProtectedRoute';

// Guest Pages
import Home from '../pages/guest/Home';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import Dashboard from '../pages/user/Dashboard';
import Polls from '../pages/user/Polls';
import PollDetail from '../pages/user/PollDetail';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PollStats from '../pages/admin/PollStats';
import CreatePoll from '../pages/admin/CreatePoll';
import CreateBanner from '../pages/admin/CreateBanner';

// Admin Management Pages (NEW)
import UserManagement from '../pages/admin/UserManagement';
import PollManagement from '../pages/admin/PollManagement';
import BannerManagement from '../pages/admin/BannerManagement';
import VoteManagement from '../pages/admin/VoteManagement';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/polls"
          element={
            <ProtectedRoute>
              <Polls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/polls/:id"
          element={
            <ProtectedRoute>
              <PollDetail />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Dashboard & Analytics */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls/:id/stats"
          element={
            <ProtectedRoute adminOnly>
              <PollStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-poll"
          element={
            <ProtectedRoute adminOnly>
              <CreatePoll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-banner"
          element={
            <ProtectedRoute adminOnly>
              <CreateBanner />
            </ProtectedRoute>
          }
        />

        {/* Admin Management Routes - NEW CRUD Pages */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls-management"
          element={
            <ProtectedRoute adminOnly>
              <PollManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners-management"
          element={
            <ProtectedRoute adminOnly>
              <BannerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/votes-management"
          element={
            <ProtectedRoute adminOnly>
              <VoteManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;