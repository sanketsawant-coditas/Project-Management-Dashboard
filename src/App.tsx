import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar/Navbar';
import Login from '@/pages/Login/Login';
import UsersList from '@/pages/users/UsersList';
import ProjectsList from '@/pages/projects/ProjectsList';

const Dashboard = () => <div>Dashboard (coming soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <div className="container">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;