import api from './axios';

export const fetchRestaurants = async (country?: string) => {
    try {
        const response = await api.get('/restaurants', {
            params: { country },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};

export const fetchRestaurantById = async (id: string) => {
    try {
        const response = await api.get(`/restaurants/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching restaurant ${id}:`, error);
        return null;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrder = async (orderData: any) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
