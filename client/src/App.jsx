// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './common/auth';

// User components
import Register from './users/components/Register';
import Login from './users/components/Login';
import Profile from './users/components/Profile';
import UserDashboard from './users/components/UserDashboard';

// Poll components
import PollList from './polls/components/PollList';
import PollVote from './polls/components/PollVote';
import PollResults from './polls/components/PollResults';
import PollCreate from './polls/components/PollCreate';

// Protected Route Component
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Admin Route Component
function AdminRoute({ children }) {
  return isAuthenticated() && isAdmin() ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PollList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/polls/:pollId/results" element={<PollResults />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/polls/:pollId/vote"
          element={
            <ProtectedRoute>
              <PollVote />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <p className="mb-4">
                  Welcome Admin! Dashboard analytics will be added next.
                </p>
                <button
                  onClick={() => (window.location.href = '/polls/create')}
                  className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create New Poll
                </button>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/polls/create"
          element={
            <AdminRoute>
              <PollCreate />
            </AdminRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;