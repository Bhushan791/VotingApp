import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Home from '../pages/guest/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/user/Dashboard';
import Polls from '../pages/user/Polls';
import PollDetail from '../pages/user/PollDetail';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PollStats from '../pages/admin/PollStats';
import CreatePoll from '../pages/admin/CreatePoll';
import CreateBanner from '../pages/admin/CreateBanner';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
