import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Calendar
} from 'lucide-react';
import api from "../../../shared/api/axios";
import { useToast } from '../context/ToastContext';
import Table from '../components/Products/Table';
import Button from '../components/Products/common/Button';
import Badge from '../components/Products/common/Badge';
import Input from '../components/Products/Input';
import { formatCurrency } from '../utils/currency';
const OrderList = () => {
    const { addToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [searchTerm, statusFilter, dateFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/orders', {
                params: {
                    customerName: searchTerm,
                    status: statusFilter,
                    date: dateFilter,
                    type: 'Order'
                }
            });
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
            addToast('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await api.delete(`/orders/${id}`);
            addToast('Order deleted successfully', 'success');
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order', error);
            addToast('Failed to delete order', 'error');
        }
    };

    const statusColors = {
        Pending: 'yellow',
        Confirmed: 'blue',
        Preparing: 'pink',
        Delivered: 'green',
        Cancelled: 'red',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your customer orders.</p>
                </div>
                <Link to="/orders/new">
                    <Button>Create New Order</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <input
                        type="date"
                        className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-600 dark:text-gray-300"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-600 dark:text-gray-300"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center font-medium text-gray-500">Loading orders...</div>
            ) : (
                <Table headers={['Customer', 'Total', 'Status', 'Scheduled', 'Actions']}>
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900 dark:text-white">{order.customerName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{order.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                                <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                    {order.paymentStatus}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge color={statusColors[order.orderStatus] || 'gray'}>
                                    {order.orderStatus}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                <div>{order.scheduleDate}</div>
                                <div className="text-xs opacity-75">{order.scheduleTime}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Link to={`/orders/${order._id}`}>
                                        <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-600 shadow-sm border border-transparent hover:border-gray-200">
                                            <Eye size={18} />
                                        </button>
                                    </Link>
                                    <Link to={`/orders/edit/${order._id}`}>
                                        <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-gray-200">
                                            <Edit size={18} />
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(order._id)}
                                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 shadow-sm border border-transparent hover:border-gray-200"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                No orders found matching your criteria.
                            </td>
                        </tr>
                    )}
                </Table>
            )}

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm"><ChevronLeft size={16} /></Button>
                    <Button variant="secondary" size="sm" className="bg-primary-50 border-primary-200 text-primary-600">1</Button>
                    <Button variant="secondary" size="sm">2</Button>
                    <Button variant="secondary" size="sm"><ChevronRight size={16} /></Button>
                </div>
            </div>
        </div>
    );
};

export default OrderList;

