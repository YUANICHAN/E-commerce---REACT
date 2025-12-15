import React, { useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar.jsx";
import Header from "../../Components/Admin/Header.jsx";
import EditModal from "../../Components/Admin/EditModal.jsx";
import { Eye, Edit } from "lucide-react";

function Orders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([
    { id: "#12345", customer: "John Doe", product: "Wireless Headphones", amount: 299.99, status: "Shipped", date: "2023-10-15", location: { lat: 34.0522, lng: -118.2437 } },
    { id: "#12346", customer: "Jane Smith", product: "Smart Watch", amount: 199.99, status: "Processing", date: "2023-10-14", location: { lat: 40.7128, lng: -74.006 } },
    { id: "#12347", customer: "Bob Johnson", product: "Bluetooth Speaker", amount: 79.99, status: "Delivered", date: "2023-10-13", location: { lat: 41.8781, lng: -87.6298 } },
    { id: "#12348", customer: "Alice Brown", product: "HD Camera", amount: 899.99, status: "Pending", date: "2023-10-12", location: { lat: 29.7604, lng: -95.3698 } },
    { id: "#12349", customer: "Chris Lee", product: "Gaming Keyboard", amount: 129.99, status: "Delivered", date: "2023-10-11", location: { lat: 47.6062, lng: -122.3321 } },
    { id: "#12350", customer: "Maria Lopez", product: "Mechanical Mouse", amount: 59.99, status: "Shipped", date: "2023-10-10", location: { lat: 33.4484, lng: -112.074 } },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

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

  const handleSave = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setIsEditOpen(false);
    setSelectedOrder(null);
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

  const ViewModal = ({ order, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl animate-in fade-in duration-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-blue-50">
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
              <p className="text-xs uppercase text-gray-500">Order ID</p>
              <p className="font-semibold">{order.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Customer</p>
              <p className="font-semibold">{order.customer}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Product</p>
              <p className="font-semibold">{order.product}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Amount</p>
              <p className="font-semibold">${order.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Date</p>
              <p className="font-semibold">{order.date}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Location</p>
              <p className="font-semibold">
                {order.location
                  ? `${order.location.lat.toFixed(4)}, ${order.location.lng.toFixed(4)}`
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
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
                        {order.id}
                      </td>

                      <td className="hidden sm:table-cell px-6 py-4">
                        {order.customer}
                      </td>

                      <td className="hidden md:table-cell px-6 py-4">
                        {order.product}
                      </td>

                      <td className="px-3 sm:px-6 py-4 font-medium">
                        ${order.amount.toFixed(2)}
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
                        {order.date}
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
