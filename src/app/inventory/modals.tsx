// Inventory Management Modals

import { useState } from 'react';

export function ItemModal({ item, suppliers, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    quantity: item?.quantity || 0,
    unit: item?.unit || 'kg',
    costPerUnit: item?.costPerUnit || 0,
    reorderLevel: item?.reorderLevel || 0,
    supplierId: item?.supplierId || (suppliers[0]?._id || ''),
    expiryDate: item?.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., Coffee Beans"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., Beverages"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="liters">liters</option>
                <option value="pieces">pieces</option>
                <option value="bottles">bottles</option>
                <option value="boxes">boxes</option>
                <option value="units">units</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cost/Unit (£) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level *</label>
              <input
                type="number"
                step="0.01"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier *</label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {suppliers.map((supplier: any) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                Total Value: <span className="font-bold text-green-600">£{(formData.quantity * formData.costPerUnit).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"
            >
              {item ? 'Update Item' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SupplierModal({ onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30',
    rating: 4,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">Add New Supplier</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person *</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms *</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Prepayment">Prepayment</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Add Supplier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PurchaseOrderModal({ suppliers, items, onSave, onClose }: any) {
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]?._id || '');
  const [orderItems, setOrderItems] = useState<any[]>([{ itemId: '', itemName: '', quantity: 0, unitPrice: 0 }]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');

  function addOrderItem() {
    setOrderItems([...orderItems, { itemId: '', itemName: '', quantity: 0, unitPrice: 0 }]);
  }

  function updateOrderItem(index: number, field: string, value: any) {
    const updated = [...orderItems];
    updated[index][field] = value;

    // Auto-fill item details when item is selected
    if (field === 'itemId') {
      const selectedItem = items.find((item: any) => item._id === value);
      if (selectedItem) {
        updated[index].itemName = selectedItem.name;
        updated[index].unitPrice = selectedItem.costPerUnit;
      }
    }

    setOrderItems(updated);
  }

  function removeOrderItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      supplierId: selectedSupplier,
      items: orderItems.filter(item => item.itemId && item.quantity > 0),
      expectedDelivery: expectedDelivery || null,
      notes,
    });
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">Create Purchase Order</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier *</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                {suppliers.map((supplier: any) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">Order Items *</label>
              <button
                type="button"
                onClick={addOrderItem}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {orderItems.map((orderItem, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <select
                      value={orderItem.itemId}
                      onChange={(e) => updateOrderItem(index, 'itemId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Item</option>
                      {items.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={orderItem.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={orderItem.unitPrice}
                      onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-center font-semibold">
                      £{(orderItem.quantity * orderItem.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="w-full px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Additional notes or instructions..."
            />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-3xl font-bold text-green-600">£{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Create Purchase Order
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function WasteLogModal({ items, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    itemId: items[0]?._id || '',
    quantity: 0,
    reason: 'expired',
    notes: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  const selectedItem = items.find((item: any) => item._id === formData.itemId);
  const wasteCost = selectedItem ? formData.quantity * selectedItem.costPerUnit : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-red-600">Log Waste</h2>
          <p className="text-gray-600 text-sm mt-1">Record inventory waste to track losses</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item *</label>
            <select
              value={formData.itemId}
              onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {items.map((item: any) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.quantity} {item.unit} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity Wasted *</label>
            <input
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
              min="0"
              max={selectedItem?.quantity || 0}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            {selectedItem && (
              <p className="text-xs text-gray-600 mt-1">
                Unit: {selectedItem.unit} (Max: {selectedItem.quantity})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason *</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="expired">Expired</option>
              <option value="damaged">Damaged</option>
              <option value="spoilage">Spoilage</option>
              <option value="contaminated">Contaminated</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Additional details about the waste..."
            />
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Estimated Waste Cost:</span>
              <span className="text-2xl font-bold text-red-600">£{wasteCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              Log Waste
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
