import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Usage: import { notify } from './Notification'; notify.success('Saved!')
export const notify = {
  success: (msg, options = {}) => toast.success(msg, options),
  error: (msg, options = {}) => toast.error(msg, options),
  info: (msg, options = {}) => toast.info(msg, options),
  warning: (msg, options = {}) => toast.warn(msg, options),
};

export default function NotificationContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
