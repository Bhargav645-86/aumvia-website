'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SuppliersTab, PurchaseOrdersTab, AnalyticsTab } from './components';
import { ItemModal, SupplierModal, PurchaseOrderModal, WasteLogModal } from './modals';

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalValue: number;
  reorderLevel: number;
  supplierId: string;
  expiryDate?: string;
  lastRestocked: string;
}

interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  paymentTerms: string;
  rating: number;
}

interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  items: { itemId: string; itemName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: string;
  orderDate: string;
  expectedDelivery?: string;
}

interface WasteLog {
  _id: string;
  itemName: string;
  quantity: number;
  unit: string;
  totalCost: number;
  reason: string;
  date: string;
  notes: string;
}

interface Analytics {
  totalValue: number;
  totalItems: number;
  lowStockCount: number;
  lowStockItems: any[];
  expiringCount: number;
  expiringItems: any[];
  wasteAnalytics: {
    totalCost: number;
    totalLogs: number;
    byReason: any[];
    topWastedItems: any[];
  };
  categoryDistribution: any[];
}

const COLORS = ['#4A0E8B', '#0B6E4F', '#D4AF37', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

export default function InventoryManagementHub() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'ledger' | 'suppliers' | 'orders' | 'analytics'>('ledger');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'item' | 'supplier' | 'po' | 'waste' | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const businessId = 'default'; // In production, get from session

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  async function loadData() {
    setLoading(true);
    try {
      // Initialize sample data if needed
      const itemsResponse = await fetch(`/api/inventory/items?businessId=${businessId}`);
      const itemsData = await itemsResponse.json();
      
      if (itemsData.length === 0) {
        await fetch('/api/inventory/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId })
        });
        // Reload after seeding
        await loadAllData();
      } else {
        await loadAllData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllData() {
    const [itemsRes, suppliersRes, ordersRes, wasteRes, analyticsRes] = await Promise.all([
      fetch(`/api/inventory/items?businessId=${businessId}`),
      fetch(`/api/inventory/suppliers?businessId=${businessId}`),
      fetch(`/api/inventory/purchase-orders?businessId=${businessId}`),
      fetch(`/api/inventory/waste-logs?businessId=${businessId}`),
      fetch(`/api/inventory/analytics?businessId=${businessId}`)
    ]);

    setItems(await itemsRes.json());
    setSuppliers(await suppliersRes.json());
    setPurchaseOrders(await ordersRes.json());
    setWasteLogs(await wasteRes.json());
    setAnalytics(await analyticsRes.json());
  }

  async function handleSaveItem(formData: any) {
    try {
      const url = '/api/inventory/items';
      const method = editingItem ? 'PUT' : 'POST';
      const data = editingItem ? { ...formData, _id: editingItem._id } : { ...formData, businessId };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await loadAllData();
        setShowModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/items?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  async function handleSaveSupplier(formData: any) {
    try {
      const response = await fetch('/api/inventory/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, businessId })
      });

      if (response.ok) {
        await loadAllData();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  }

  async function handleSavePO(formData: any) {
    try {
      const response = await fetch('/api/inventory/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, businessId })
      });

      if (response.ok) {
        await loadAllData();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving purchase order:', error);
    }
  }

  async function handleUpdatePOStatus(orderId: string, status: string) {
    try {
      const response = await fetch('/api/inventory/purchase-orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: orderId, status })
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
    }
  }

  async function handleSaveWaste(formData: any) {
    try {
      const response = await fetch('/api/inventory/waste-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, businessId, recordedBy: session?.user?.name || 'Manager' })
      });

      if (response.ok) {
        await loadAllData();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving waste log:', error);
    }
  }

  function handleExportCSV() {
    const csv = [
      ['Item Name', 'Category', 'Quantity', 'Unit', 'Cost Per Unit', 'Total Value', 'Reorder Level', 'Status'],
      ...items.map(item => [
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.costPerUnit.toFixed(2),
        item.totalValue.toFixed(2),
        item.reorderLevel,
        item.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-semibold">Loading inventory system...</div>
        </div>
      </div>
    );
  }

  if (!session || !['business', 'manager'].includes(session.user?.role || '')) {
    redirect('/login');
  }

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">📦 Inventory Management Hub</h1>
              <p className="text-gray-600">Real-time stock tracking, supplier management, and waste analytics</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
            >
              Export CSV
            </button>
          </div>

          {/* KPI Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600">
                <div className="text-sm text-gray-600 mb-1">Total Inventory Value</div>
                <div className="text-3xl font-bold text-indigo-900">£{analytics.totalValue.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                <div className="text-sm text-gray-600 mb-1">Total Items</div>
                <div className="text-3xl font-bold text-green-600">{analytics.totalItems}</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-500">
                <div className="text-sm text-gray-600 mb-1">Low Stock Alerts</div>
                <div className="text-3xl font-bold text-amber-500">{analytics.lowStockCount}</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                <div className="text-sm text-gray-600 mb-1">Waste Cost (30d)</div>
                <div className="text-3xl font-bold text-red-600">£{analytics.wasteAnalytics.totalCost.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Stock Ledger ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'suppliers'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Suppliers ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Analytics & Alerts
          </button>
        </div>

        {/* Stock Ledger Tab */}
        {activeTab === 'ledger' && (
          <StockLedgerTab
            items={filteredItems}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            onAdd={() => {
              setEditingItem(null);
              setModalType('item');
              setShowModal(true);
            }}
            onEdit={(item) => {
              setEditingItem(item);
              setModalType('item');
              setShowModal(true);
            }}
            onDelete={handleDeleteItem}
          />
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <SuppliersTab
            suppliers={suppliers}
            onAdd={() => {
              setModalType('supplier');
              setShowModal(true);
            }}
          />
        )}

        {/* Purchase Orders Tab */}
        {activeTab === 'orders' && (
          <PurchaseOrdersTab
            orders={purchaseOrders}
            onAdd={() => {
              setModalType('po');
              setShowModal(true);
            }}
            onUpdateStatus={handleUpdatePOStatus}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab
            analytics={analytics}
            wasteLogs={wasteLogs}
            onLogWaste={() => {
              setModalType('waste');
              setShowModal(true);
            }}
          />
        )}

        {/* Modals */}
        {showModal && modalType === 'item' && (
          <ItemModal
            item={editingItem}
            suppliers={suppliers}
            onSave={handleSaveItem}
            onClose={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
          />
        )}

        {showModal && modalType === 'supplier' && (
          <SupplierModal
            onSave={handleSaveSupplier}
            onClose={() => setShowModal(false)}
          />
        )}

        {showModal && modalType === 'po' && (
          <PurchaseOrderModal
            suppliers={suppliers}
            items={items}
            onSave={handleSavePO}
            onClose={() => setShowModal(false)}
          />
        )}

        {showModal && modalType === 'waste' && (
          <WasteLogModal
            items={items}
            onSave={handleSaveWaste}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

function StockLedgerTab({ items, searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, categories, onAdd, onEdit, onDelete }: any) {
  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <button
            onClick={onAdd}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: InventoryItem) => {
          const isLowStock = item.quantity <= item.reorderLevel;
          const isExpiringSoon = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

          return (
            <div
              key={item._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-l-4 ${
                isExpired ? 'border-red-600' : isLowStock || isExpiringSoon ? 'border-amber-500' : 'border-green-500'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-1">{item.name}</h3>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">£{item.totalValue.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Total Value</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className={`text-lg font-bold ${
                      isLowStock ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost/Unit:</span>
                    <span className="text-sm font-semibold text-gray-900">£{item.costPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reorder Level:</span>
                    <span className="text-sm font-semibold text-gray-900">{item.reorderLevel} {item.unit}</span>
                  </div>
                  {item.expiryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expiry:</span>
                      <span className={`text-sm font-semibold ${
                        isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-900'
                      }`}>
                        {new Date(item.expiryDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {isExpired && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">⚠️ Expired</span>
                  )}
                  {isLowStock && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">🔔 Low Stock</span>
                  )}
                  {isExpiringSoon && !isExpired && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">⏰ Expiring Soon</span>
                  )}
                  {!isLowStock && !isExpiringSoon && !isExpired && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ In Stock</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Found</h3>
          <p className="text-gray-600 mb-4">Add your first inventory item to get started</p>
          <button
            onClick={onAdd}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Add First Item
          </button>
        </div>
      )}
    </div>
  );
}