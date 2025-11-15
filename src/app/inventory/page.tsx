'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  value: number;
  expiryDate?: Date;
  supplierId: string;
  reorderThreshold: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  terms: string;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: { itemId: string; quantity: number }[];
  status: 'pending' | 'approved' | 'received';
}

interface WasteLog {
  id: string;
  itemId: string;
  quantity: number;
  reason: string;
  date: Date;
}

export default function InventoryHub() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'ledger' | 'suppliers' | 'alerts' | 'reporting'>('ledger');
  const [stock, setStock] = useState<StockItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'addStock' | 'addSupplier' | 'createPO' | 'logWaste' | null>(null);

  useEffect(() => {
    // Mock data
    setStock([
      { id: '1', name: 'Coffee Beans', category: 'Beverages', quantity: 50, unit: 'kg', value: 250, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), supplierId: '1', reorderThreshold: 20 },
      { id: '2', name: 'Milk', category: 'Food', quantity: 10, unit: 'liters', value: 50, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), supplierId: '1', reorderThreshold: 5 },
    ]);
    setSuppliers([
      { id: '1', name: 'Fresh Supplies Co.', contact: 'supplier@example.com', terms: 'Net 30' },
    ]);
    setPos([
      { id: '1', supplierId: '1', items: [{ itemId: '1', quantity: 20 }], status: 'pending' },
    ]);
    setWasteLogs([
      { id: '1', itemId: '2', quantity: 2, reason: 'Spoilage', date: new Date() },
    ]);

    // Generate alerts
    const newAlerts = stock.filter(item => item.quantity <= item.reorderThreshold).map(item => `Reorder ${item.name} (${item.quantity} ${item.unit} left)`);
    setAlerts(newAlerts);
  }, [stock]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'business') redirect('/login');

  const handleAddStock = () => setModalType('addStock');
  const handleAddSupplier = () => setModalType('addSupplier');
  const handleCreatePO = () => setModalType('createPO');
  const handleLogWaste = () => setModalType('logWaste');

  const handleSaveStock = (newItem: StockItem) => {
    setStock([...stock, newItem]);
    setShowModal(false);
  };

  const handleSaveSupplier = (newSupplier: Supplier) => {
    setSuppliers([...suppliers, newSupplier]);
    setShowModal(false);
  };

  const handleSavePO = (newPO: PurchaseOrder) => {
    setPos([...pos, newPO]);
    setShowModal(false);
  };

  const handleSaveWaste = (newWaste: WasteLog) => {
    setWasteLogs([...wasteLogs, newWaste]);
    setShowModal(false);
  };

  const totalValue = stock.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">📦 Inventory Management Hub</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTab('ledger')} className={`px-4 py-2 rounded ${activeTab === 'ledger' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Stock Ledger</button>
          <button onClick={() => setActiveTab('suppliers')} className={`px-4 py-2 rounded ${activeTab === 'suppliers' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Suppliers & POs</button>
          <button onClick={() => setActiveTab('alerts')} className={`px-4 py-2 rounded ${activeTab === 'alerts' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Alerts & Analytics</button>
          <button onClick={() => setActiveTab('reporting')} className={`px-4 py-2 rounded ${activeTab === 'reporting' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Reporting</button>
        </div>

        {/* Stock Ledger */}
        {activeTab === 'ledger' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Real-Time Stock Ledger</h2>
              <button onClick={handleAddStock} className="bg-green-500 text-white px-4 py-2 rounded">Add Stock Item</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stock.map(item => (
                <div key={item.id} className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Quantity: {item.quantity} {item.unit}</p>
                  <p>Value: £{item.value}</p>
                  {item.expiryDate && <p>Expiry: {item.expiryDate.toLocaleDateString()}</p>}
                  <p className={item.quantity <= item.reorderThreshold ? 'text-red-500' : 'text-green-500'}>
                    Status: {item.quantity <= item.reorderThreshold ? 'Low Stock' : 'In Stock'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suppliers & POs */}
        {activeTab === 'suppliers' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Supplier Database & POs</h2>
              <div>
                <button onClick={handleAddSupplier} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Supplier</button>
                <button onClick={handleCreatePO} className="bg-purple-500 text-white px-4 py-2 rounded">Create PO</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Suppliers</h3>
                <ul>
                  {suppliers.map(sup => (
                    <li key={sup.id} className="mb-2">{sup.name} - {sup.contact} ({sup.terms})</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Purchase Orders</h3>
                <ul>
                  {pos.map(po => (
                    <li key={po.id} className="mb-2">PO {po.id} - Supplier {po.supplierId} ({po.status})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Alerts & Analytics */}
        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Smart Reorder Alerts & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Alerts</h3>
                <ul>
                  {alerts.map((alert, i) => (
                    <li key={i} className="mb-2 text-amber-600">{alert}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Waste & Shrinkage</h3>
                <button onClick={handleLogWaste} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Log Waste</button>
                <ul>
                  {wasteLogs.map(log => (
                    <li key={log.id} className="mb-2">{log.quantity} {stock.find(s => s.id === log.itemId)?.unit} of {stock.find(s => s.id === log.itemId)?.name} - {log.reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Reporting */}
        {activeTab === 'reporting' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Stock Value Reporting</h2>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-lg">Total Inventory Value: £{totalValue}</p>
              <p className="mt-4">Future: POS Sync and Recipe Costing integrations coming soon.</p>
              <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Export Report</button>
            </div>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              {modalType === 'addStock' && (
                <>
                  <h3>Add Stock Item</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newItem: StockItem = {
                      id: Date.now().toString(),
                      name: formData.get('name') as string,
                      category: formData.get('category') as string,
                      quantity: parseInt(formData.get('quantity') as string),
                      unit: formData.get('unit') as string,
                      value: parseFloat(formData.get('value') as string),
                      supplierId: formData.get('supplierId') as string,
                      reorderThreshold: parseInt(formData.get('reorderThreshold') as string),
                    };
                    handleSaveStock(newItem);
                  }}>
                    <input name="name" placeholder="Name" className="w-full p-2 border rounded mb-2" required />
                    <input name="category" placeholder="Category" className="w-full p-2 border rounded mb-2" required />
                    <input name="quantity" type="number" placeholder="Quantity" className="w-full p-2 border rounded mb-2" required />
                    <input name="unit" placeholder="Unit" className="w-full p-2 border rounded mb-2" required />
                    <input name="value" type="number" step="0.01" placeholder="Value" className="w-full p-2 border rounded mb-2" required />
                    <input name="supplierId" placeholder="Supplier ID" className="w-full p-2 border rounded mb-2" required />
                    <input name="reorderThreshold" type="number" placeholder="Reorder Threshold" className="w-full p-2 border rounded mb-2" required />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
                  </form>
                </>
              )}
              {modalType === 'addSupplier' && (
                <>
                  <h3>Add Supplier</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newSupplier: Supplier = {
                      id: Date.now().toString(),
                      name: formData.get('name') as string,
                      contact: formData.get('contact') as string,
                      terms: formData.get('terms') as string,
                    };
                    handleSaveSupplier(newSupplier);
                  }}>
                    <input name="name" placeholder="Name" className="w-full p-2 border rounded mb-2" required />
                    <input name="contact" placeholder="Contact" className="w-full p-2 border rounded mb-2" required />
                    <input name="terms" placeholder="Terms" className="w-full p-2 border rounded mb-2" required />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
                  </form>
                </>
              )}
              {modalType === 'createPO' && (
                <>
                  <h3>Create Purchase Order</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newPO: PurchaseOrder = {
                      id: Date.now().toString(),
                      supplierId: formData.get('supplierId') as string,
                      items: [{ itemId: formData.get('itemId') as string, quantity: parseInt(formData.get('quantity') as string) }],
                      status: 'pending',
                    };
                    handleSavePO(newPO);
                  }}>
                    <input name="supplierId" placeholder="Supplier ID" className="w-full p-2 border rounded mb-2" required />
                    <input name="itemId" placeholder="Item ID" className="w-full p-2 border rounded mb-2" required />
                    <input name="quantity" type="number" placeholder="Quantity" className="w-full p-2 border rounded mb-2" required />
                    <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Create</button>
                  </form>
                </>
              )}
              {modalType === 'logWaste' && (
                <>
                  <h3>Log Waste</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newWaste: WasteLog = {
                      id: Date.now().toString(),
                      itemId: formData.get('itemId') as string,
                      quantity: parseInt(formData.get('quantity') as string),
                      reason: formData.get('reason') as string,
                      date: new Date(),
                    };
                    handleSaveWaste(newWaste);
                  }}>
                    <input name="itemId" placeholder="Item ID" className="w-full p-2 border rounded mb-2" required />
                    <input name="quantity" type="number" placeholder="Quantity" className="w-full p-2 border rounded mb-2" required />
                    <input name="reason" placeholder="Reason" className="w-full p-2 border rounded mb-2" required />
                    <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Log</button>
                  </form>
                </>
              )}
              <button onClick={() => setShowModal(false)} className="mt-4 text-red-500">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}