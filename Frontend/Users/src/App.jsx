import './index.css'
import Home from './Pages/Users/Home.jsx';
import Shop from './Pages/Users/Shop.jsx';
import Cart from './Pages/Users/Cart.jsx';
import Wishlist from './Pages/Users/Wishlist.jsx';
import TodaysDeals from './Pages/Users/TodaysDeal.jsx';
import Account from './Pages/Users/Account.jsx';
import Register from './Pages/Users/Register.jsx';
import Login from './Pages/Users/Login.jsx';

import Dashboard from './Pages/Admin/Dashboard.jsx';
import Product from './Pages/Admin/Product.jsx';
import Orders from './Pages/Admin/Orders.jsx';
import Customer from './Pages/Admin/Customer.jsx';
import Analytics from './Pages/Admin/Analytics.jsx';
import Settings from './Pages/Admin/Settings.jsx';
import NotificationContainer from './Components/Notification.jsx';
import Checkout from './Pages/Users/Checkout.jsx';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AdminLogin from './Pages/Admin/AdminLogin.jsx';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/deals" element={<TodaysDeals />} />
          <Route path="/account/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<ProtectedRoute requiredAuth={false} requireAdmin={true} element={<AdminLogin />} />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Dashboard />} />} />
          <Route path="/admin/products" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Product />} />} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Orders />} />} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Customer />} />} />
          <Route path="/admin/analytics" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Analytics />} />} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredAuth={true} requireAdmin={true} element={<Settings />} />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
      <NotificationContainer />
    </>
  )
}

export default App
