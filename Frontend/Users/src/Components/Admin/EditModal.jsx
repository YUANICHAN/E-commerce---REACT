import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function EditModal({ order, isOpen, onClose, onSave }) {
  const [status, setStatus] = useState(order?.status || '');
  const [coords, setCoords] = useState({
    lat: order?.location_lat ? parseFloat(order.location_lat) : 37.7749,
    lng: order?.location_lng ? parseFloat(order.location_lng) : -122.4194
  });

  useEffect(() => {
    if (order) {
      setStatus(order.status || '');
      setCoords({
        lat: order.location_lat ? parseFloat(order.location_lat) : 37.7749,
        lng: order.location_lng ? parseFloat(order.location_lng) : -122.4194
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in fade-in duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-blue-50 sticky top-0">
          <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase text-gray-500">Order Number</p>
              <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Customer</p>
              <p className="text-sm font-semibold text-gray-900">{order.customer_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Payment Method</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">{order.payment_method || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Amount</p>
              <p className="text-sm font-semibold text-gray-900">${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Date</p>
              <p className="text-sm font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Status</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Order Location</p>
              <span className="text-xs text-gray-500">Powered by OpenStreetMap</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={coords.lat}
                  onChange={(e) => setCoords((c) => ({ ...c, lat: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={coords.lng}
                  onChange={(e) => setCoords((c) => ({ ...c, lng: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={12}
                style={{ height: '240px', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker
                  position={[coords.lat, coords.lng]}
                  draggable
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      setCoords({ lat, lng });
                    },
                  }}
                >
                  <Popup>
                    Order: {order.order_number} <br /> Customer: {order.customer_name}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...order, status, location_lat: coords.lat, location_lng: coords.lng })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
