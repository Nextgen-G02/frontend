import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/orders';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const orderApi = {
    getAllOrders: async (params) => {
        try {
            const response = await axios.get(API_URL, { 
                ...getHeaders(),
                params 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    createOrder: async (orderData) => {
        try {
            const response = await axios.post(API_URL, orderData, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    updateOrder: async (id, orderData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, orderData, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/status`, { orderStatus: status }, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    deleteOrder: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    }
};

export default orderApi;
