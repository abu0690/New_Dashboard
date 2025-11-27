import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="pool" element={<div className="p-6"><h1 className="text-2xl font-bold">Pool Management - Coming Soon</h1></div>} />
          <Route path="plan" element={<div className="p-6"><h1 className="text-2xl font-bold">Plan Management - Coming Soon</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;