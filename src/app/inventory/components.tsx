// Inventory Management Components

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4A0E8B', '#0B6E4F', '#D4AF37', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

export function SuppliersTab({ suppliers, onAdd }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Supplier Database</h2>
        <button
          onClick={onAdd}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          style={{ backgroundColor: '#D4AF37' }}
        >
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((supplier: any) => (
          <div key={supplier._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">{supplier.name}</h3>
                <p className="text-gray-600 text-sm">{supplier.contactPerson}</p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(supplier.rating) ? 'text-yellow-500' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <span className="w-6 mr-2">📧</span>
                <span className="text-sm">{supplier.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-6 mr-2">📞</span>
                <span className="text-sm">{supplier.phone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-6 mr-2">💳</span>
                <span className="text-sm">{supplier.paymentTerms}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PurchaseOrdersTab({ orders, onAdd, onUpdateStatus }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Purchase Orders</h2>
        <button
          onClick={onAdd}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          style={{ backgroundColor: '#D4AF37' }}
        >
          Create PO
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">{order.orderNumber}</h3>
                <p className="text-gray-600">{order.supplier?.name || 'Unknown Supplier'}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">£{order.totalAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-600">Total Amount</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Items:</h4>
              <div className="space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{item.itemName} × {item.quantity}</span>
                    <span className="font-semibold">£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  Order Date: {new Date(order.orderDate).toLocaleDateString('en-GB')}
                </div>
                {order.expectedDelivery && (
                  <div className="text-sm text-gray-600">
                    Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-GB')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'received' ? 'bg-green-100 text-green-700' :
                  order.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {order.status.toUpperCase()}
                </span>

                {order.status === 'pending' && (
                  <button
                    onClick={() => onUpdateStatus(order._id, 'approved')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    Approve
                  </button>
                )}

                {order.status === 'approved' && (
                  <button
                    onClick={() => onUpdateStatus(order._id, 'received')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    Mark Received
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Purchase Orders</h3>
            <p className="text-gray-600">Create your first purchase order</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalyticsTab({ analytics, wasteLogs, onLogWaste }: any) {
  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-indigo-900">🔔 Low Stock Alerts</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
              {analytics.lowStockCount}
            </span>
          </div>
          <div className="space-y-2">
            {analytics.lowStockItems.length > 0 ? (
              analytics.lowStockItems.map((item: any) => (
                <div key={item._id} className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-red-600 font-bold">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Reorder at: {item.reorderLevel} {item.unit}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">All items sufficiently stocked</p>
            )}
          </div>
        </div>

        {/* Expiring Items */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-indigo-900">⏰ Expiring Soon</h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
              {analytics.expiringCount}
            </span>
          </div>
          <div className="space-y-2">
            {analytics.expiringItems.length > 0 ? (
              analytics.expiringItems.map((item: any) => (
                <div key={item._id} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-red-600 font-bold">
                      {new Date(item.expiryDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Quantity: {item.quantity} {item.unit}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">No items expiring soon</p>
            )}
          </div>
        </div>
      </div>

      {/* Waste Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-indigo-900">📉 Waste Analytics (Last 30 Days)</h3>
          <button
            onClick={onLogWaste}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
          >
            Log Waste
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Waste by Reason */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Waste by Reason</h4>
            {analytics.wasteAnalytics.byReason.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.wasteAnalytics.byReason}
                    dataKey="cost"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `£${entry.cost.toFixed(2)}`}
                  >
                    {analytics.wasteAnalytics.byReason.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `£${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No waste logged</p>
            )}
          </div>

          {/* Top Wasted Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Top Wasted Items</h4>
            {analytics.wasteAnalytics.topWastedItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.wasteAnalytics.topWastedItems}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="itemName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `£${value.toFixed(2)}`} />
                  <Bar dataKey="cost" fill="#D32F2F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No waste logged</p>
            )}
          </div>
        </div>

        {/* Recent Waste Logs */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Recent Waste Logs</h4>
          <div className="space-y-2">
            {wasteLogs.slice(0, 5).map((log: any) => (
              <div key={log._id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{log.itemName}</div>
                  <div className="text-sm text-gray-600">
                    {log.quantity} {log.unit} • {log.reason} • {new Date(log.date).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <div className="text-lg font-bold text-red-600">£{log.totalCost.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-indigo-900 mb-6">📊 Inventory Value by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.categoryDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value: any) => `£${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="value" fill="#4A0E8B" name="Total Value (£)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
