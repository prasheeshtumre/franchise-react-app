import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<Navigate to="/user-profile" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
