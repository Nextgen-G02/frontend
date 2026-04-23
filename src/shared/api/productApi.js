import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

const productApi = {
    getProducts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data.data; // Backend returns { success: true, data: [...] }
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
};

export default productApi;
