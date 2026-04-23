import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock 
} from 'lucide-react';
import api from "../../../shared/api/axios";
import { useToast } from '../context/ToastContext';
import Button from '../components/Products/common/Button';
import Card from '../components/Products/common/Card';
import { formatCurrency } from '../utils/currency';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    scheduleDate: '',
    scheduleTime: '',
    type: 'Order',
    items: []
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products', error);
      addToast('Failed to fetch products', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    const existingItemIndex = formData.items.findIndex(item => item.productName === product.pName);
    
    if (existingItemIndex > -1) {
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      const newItem = {
        productName: product.pName || product.productName,
        category: product.pCategory || product.category,
        quantity: quantity,
        price: product.price
      };
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    
    setSelectedProduct('');
    setQuantity(1);
    addToast('Item added to order', 'success');
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      addToast('Please add at least one item', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/orders', formData);
      addToast('Order created successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order', error);
      addToast(error.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Order</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Customer Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User size={16} /> Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                  placeholder="Enter phone"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin size={16} /> Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                  placeholder="Enter delivery address"
                ></textarea>
              </div>
            </div>
          </Card>

          <Card title="Order Items">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-end pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex-1 min-w-[200px] space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Product</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.pName} - {formatCurrency(p.price)}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24 space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                  />
                </div>
                <Button type="button" onClick={addItem} variant="secondary">
                  <Plus size={18} /> Add
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                      <th className="py-3 text-xs font-semibold text-gray-500 uppercase">Item</th>
                      <th className="py-3 text-xs font-semibold text-gray-500 uppercase text-center">Qty</th>
                      <th className="py-3 text-xs font-semibold text-gray-500 uppercase text-right">Price</th>
                      <th className="py-3 text-xs font-semibold text-gray-500 uppercase text-right">Total</th>
                      <th className="py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3">
                          <div className="font-medium text-gray-900 dark:text-white">{item.productName}</div>
                          <div className="text-xs text-gray-500">{item.category}</div>
                        </td>
                        <td className="py-3 text-center dark:text-gray-300">{item.quantity}</td>
                        <td className="py-3 text-right dark:text-gray-300">{formatCurrency(item.price)}</td>
                        <td className="py-3 text-right font-bold dark:text-white">{formatCurrency(item.price * item.quantity)}</td>
                        <td className="py-3 text-right">
                          <button 
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.items.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">No items added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Scheduling Info">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CalendarIcon size={16} /> Delivery Date
                </label>
                <input
                  type="date"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock size={16} /> Delivery Time
                </label>
                <input
                  type="time"
                  name="scheduleTime"
                  value={formData.scheduleTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Package size={16} /> Order Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                >
                  <option value="Order">Standard Order</option>
                  <option value="DirectSale">Direct Sale</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Order Summary">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Items Count</span>
                <span>{formData.items.length}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(calculateTotal())}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={loading || formData.items.length === 0}
              >
                {loading ? 'Processing...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;

