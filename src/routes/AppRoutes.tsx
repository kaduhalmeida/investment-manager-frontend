import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/Login';
import Register from '../pages/login/Register';
import ProtectedRoute from '../components/ProtectedRoute';

import Dashboard from '../pages/dashboard/Dashboard';
import WalletDetail from '../pages/wallet/WalletDetail';
import Companies from '../pages/companies/Companies';
import CompanyDetails from '../pages/companies/CompanyDetails';
import Portfolio from '../pages/investment/Portfolio';
import Profile from '../pages/profile/Profile';
import DashboardLayout from '../components/DashboardLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />}>
        <Route index element={<Dashboard />} />
        <Route path="wallet" element={<WalletDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="companies" element={<Companies />} />
        <Route path="company/:companyId" element={<CompanyDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
