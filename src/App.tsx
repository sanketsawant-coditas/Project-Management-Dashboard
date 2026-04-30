import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar/Navbar';
import Login from '@/pages/Login/Login';
import UsersList from '@/pages/users/UsersList';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Profile/Profile';
import ProjectsList from './pages/projects/ProjectsList';
import ProjectDetails from './pages/projects/ProjectDetails';

import { Outlet } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet /> 
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
`       {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
        {/* Protected routes group */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;