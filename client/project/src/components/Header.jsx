import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Vote, LogOut, LayoutDashboard, User } from 'lucide-react';
import Button from './Button';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VoteNow</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/polls" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Polls
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
