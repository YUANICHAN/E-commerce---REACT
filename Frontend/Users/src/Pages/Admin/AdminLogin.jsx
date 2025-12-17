import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { adminAuthAPI } from '../../Services/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const role = localStorage.getItem('authRole');
    const hasSession = document.cookie.includes('PHPSESSID');
    const hasToken = !!localStorage.getItem('authToken');
    if (role === 'admin' && (hasSession || hasToken)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Enter email and password.' });
      return;
    }
    const res = await adminAuthAPI.login(formData);
    if (res?.success) {
      // mark admin auth locally (session cookie is set server-side)
      localStorage.setItem('authToken', 'admin-session');
      localStorage.setItem('authRole', 'admin');
      // navigate immediately; also hard-redirect as a fallback to avoid being stuck on login
      navigate('/admin/dashboard', { replace: true });
      Swal.fire({ icon: 'success', title: 'Welcome, Admin', timer: 800, showConfirmButton: false })
        .then(() => { window.location.href = '/admin/dashboard'; });
    } else {
      Swal.fire({ icon: 'error', title: 'Login failed', text: res?.message || 'Invalid credentials' });
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700"><Shield size={24} /></div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input name="email" type="email" value={formData.email} onChange={handleChange} onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? <EyeOff size={20} className="text-gray-400"/> : <Eye size={20} className="text-gray-400"/>}
              </button>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold">Login</button>
        </div>
      </div>
    </div>
  );
}
