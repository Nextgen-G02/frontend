import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Eye, Filter, CheckCircle, XCircle, Mail, Phone, Calendar, IndianRupee } from 'lucide-react';

export default function AdminCustomCakes() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState('');
    const [paymentRequired, setPaymentRequired] = useState('Half');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/custom-cakes/admin/all`);
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to fetch custom cake requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        if (status === 'Approved' && (!estimatedPrice || estimatedPrice <= 0)) {
            toast.error("Please enter a valid estimated price to approve.");
            return;
        }

        try {
            const payload = {
                status,
                estimatedPrice: status === 'Approved' ? Number(estimatedPrice) : undefined,
                paymentRequired: status === 'Approved' ? 'Full' : undefined,
                reason: status === 'Rejected' ? rejectReason : undefined
            };

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/custom-cakes/admin/${selectedRequest._id}/status`, payload);
            
            toast.success(`Request marked as ${status}`);
            setIsModalOpen(false);
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status. " + (error.response?.data?.message || ""));
        }
    };

    const openModal = (req) => {
        setSelectedRequest(req);
        setEstimatedPrice(req.estimatedPrice > 0 ? req.estimatedPrice : '');
        setPaymentRequired(req.paymentRequired || 'Half');
        setRejectReason('');
        setIsModalOpen(true);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              req.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending Review': return 'bg-amber-100 text-amber-800';
            case 'Approved': return 'bg-blue-100 text-blue-800';
            case 'Rejected': return 'bg-rose-100 text-rose-800';
            case 'Confirmed': return 'bg-emerald-100 text-emerald-800';
            case 'Preparing': return 'bg-purple-100 text-purple-800';
            case 'Ready': return 'bg-teal-100 text-teal-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Custom Cake Requests</h2>
                    <p className="text-sm text-gray-500">Review, price, and approve customer cake requests.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={20} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:border-indigo-500 text-sm bg-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Customer</th>
                                <th className="py-3 px-4 font-semibold">Needed By</th>
                                <th className="py-3 px-4 font-semibold">Cake Specs</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Payment</th>
                                <th className="py-3 px-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-8 text-center text-gray-500">Loading requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan="6" className="py-8 text-center text-gray-500">No custom cake requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-semibold text-gray-900">{req.customerName}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {req.email}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> {req.phone}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1 text-gray-700">
                                                <Calendar size={14} className="text-gray-400"/>
                                                {new Date(req.scheduleDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-900">{req.flavor}</p>
                                            <p className="text-xs text-gray-500">{req.size}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyles(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className={`font-semibold ${req.paymentStatus === 'Paid' ? 'text-green-600' : req.paymentStatus === 'Partially Paid' ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {req.paymentStatus}
                                            </p>
                                            {req.estimatedPrice > 0 && <p className="text-xs text-gray-500">Rs. {req.estimatedPrice}</p>}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button 
                                                onClick={() => openModal(req)}
                                                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <Eye size={14} /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row">
                        
                        {/* Image/Description Column */}
                        <div className="w-full lg:w-5/12 p-4 md:p-6 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Design Vision</h3>
                            
                            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 mb-6 flex items-center justify-center">
                                {selectedRequest.referenceImage ? (
                                    <img src={selectedRequest.referenceImage} alt="Reference" className="w-full h-full object-contain" />
                                ) : (
                                    <p className="text-gray-400 text-sm">No reference image provided</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Description</h4>
                                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{selectedRequest.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Quantity</h4>
                                        <p className="text-sm font-semibold text-gray-900">{selectedRequest.quantity}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Needed By</h4>
                                        <p className="text-sm font-semibold text-gray-900">{new Date(selectedRequest.scheduleDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action/Approval Column */}
                        <div className="w-full lg:w-7/12 p-4 md:p-6 lg:p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedRequest.customerName}</h3>
                                    <p className="text-sm text-gray-500">{selectedRequest.email} | {selectedRequest.phone}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">Current Status</h4>
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                    <span className={`text-sm font-bold ${selectedRequest.paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-500'}`}>
                                        Payment: {selectedRequest.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {(selectedRequest.status === 'Pending Review' || selectedRequest.status === 'Approved') && (
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 block">Estimated Price (Rs.) *</label>
                                        <input 
                                            type="number" 
                                            value={estimatedPrice}
                                            onChange={(e) => setEstimatedPrice(e.target.value)}
                                            placeholder="Enter total price quote"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 block">Payment Requirement *</label>
                                        <div className="flex gap-4">
                                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">Full 100% Payment</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 block">Rejection Reason (If rejecting)</label>
                                        <input 
                                            type="text" 
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Why are we rejecting this request?"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status Update Buttons */}
                            <div className="mt-8 pt-4 border-t border-gray-200">
                                {selectedRequest.status === 'Pending Review' ? (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleAction('Rejected')}
                                            className="flex-1 bg-white border border-rose-200 text-rose-600 py-2.5 rounded-lg font-bold hover:bg-rose-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleAction('Approved')}
                                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Approve & Email Quote
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleAction('Preparing')} className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Mark Preparing</button>
                                        <button onClick={() => handleAction('Ready')} className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Mark Ready</button>
                                        <button onClick={() => handleAction('Delivered')} className="bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Mark Delivered</button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
