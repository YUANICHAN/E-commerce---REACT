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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/deals" element={<TodaysDeals />} />
          <Route path="/account/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Product />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<Customer />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </Router>
      <NotificationContainer />
    </>
  )
}

export default App
