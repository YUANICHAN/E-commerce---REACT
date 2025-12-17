import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar.jsx";
import Header from "../../Components/Admin/Header.jsx";
import EditModal from "../../Components/Admin/EditModal.jsx";
import { Eye, Edit } from "lucide-react";
import { orderAPI } from "../../Services/api.js";
import Swal from 'sweetalert2';

function Orders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders from /admin/orders...');
      const response = await orderAPI.getAllOrders();
      console.log('Admin Orders Response:', response);
      
      if (response && response.success) {
        console.log('Orders fetched successfully:', response.data);
        setOrders(response.data || []);
      } else {
        const errorMsg = response?.message || 'Failed to fetch orders';
        console.error('Error response:', errorMsg);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsViewOpen(false);
    setIsEditOpen(true);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsEditOpen(false);
    setIsViewOpen(true);
  };

  const handleSave = async (updatedOrder) => {
    try {
      const response = await orderAPI.updateOrderStatus(updatedOrder.id, updatedOrder.status);
      
      if (response.success) {
        setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
        setIsEditOpen(false);
        setSelectedOrder(null);
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order status updated successfully',
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to update order status',
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update order status. Please try again.',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const parseAddress = (addressString) => {
    try {
      if (typeof addressString === 'string') {
        const parsed = JSON.parse(addressString);
        return `${parsed.firstName} ${parsed.lastName}, ${parsed.address}, ${parsed.city}, ${parsed.zipCode}, ${parsed.country}`;
      }
      return addressString || 'N/A';
    } catch (error) {
      return addressString || 'N/A';
    }
  };

  const ViewModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl animate-in fade-in duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-blue-50 sticky top-0">
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4 text-sm text-gray-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Order Number</p>
                <p className="font-semibold">{order.order_number}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Customer</p>
                <p className="font-semibold">{order.customer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Email</p>
                <p className="font-semibold">{order.customer_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Amount</p>
                <p className="font-semibold">${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Payment Method</p>
                <p className="font-semibold capitalize">{order.payment_method || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Transaction ID</p>
                <p className="font-semibold">{order.transaction_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Payment Status</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.payment_status)}`}>
                  {order.payment_status || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Date</p>
                <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Location</p>
                <p className="font-semibold">
                  {order.location_lat && order.location_lng
                    ? `${parseFloat(order.location_lat).toFixed(4)}, ${parseFloat(order.location_lng).toFixed(4)}`
                    : 'Not set'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase text-gray-500">Shipping Address</p>
                <p className="font-semibold">{parseAddress(order.shipping_address)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase text-gray-500">Billing Address</p>
                <p className="font-semibold">{parseAddress(order.billing_address)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar activeItem="orders" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                All Orders
              </h2>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order Number
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment Method
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-3 sm:px-6 py-4 font-medium text-gray-900">
                        {order.order_number}
                      </td>

                      <td className="hidden sm:table-cell px-6 py-4">
                        {order.customer_name || 'N/A'}
                      </td>

                      <td className="hidden md:table-cell px-6 py-4 capitalize">
                        {order.payment_method || 'N/A'}
                      </td>

                      <td className="px-3 sm:px-6 py-4 font-medium">
                        ${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}
                      </td>

                      <td className="px-3 sm:px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="hidden lg:table-cell px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition"
                            onClick={() => handleViewClick(order)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition"
                            onClick={() => handleEditClick(order)}
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {selectedOrder && isEditOpen && (
      <EditModal
        order={selectedOrder}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    )}

    {selectedOrder && isViewOpen && (
      <ViewModal
        order={selectedOrder}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedOrder(null);
        }}
      />
    )}
    </>
  );
}

export default Orders;
