import api from '../lib/axios';

export interface OrderItem {
    id: string;
    menuItemId: string;
    quantity: number;
    price: number;
    menuItem?: {
        name: string;
        image?: string;
    };
}

export interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    restaurantId: string;
    restaurant?: {
        name: string;
        image?: string;
    };
    items: OrderItem[];
    payment?: {
        method: string;
        status: string;
        amount: number;
    };
    address?: string;
}

export const OrderService = {
    async getAll() {
        const response = await api.get('/orders');
        return response.data;
    },

    async create(orderData: { restaurantId: string; items: { menuItemId: string; quantity: number }[] }) {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    async getOne(id: string) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async cancel(id: string) {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    },

    async updatePaymentMethod(orderId: string, method: string) {
        const response = await api.put(`/payments/${orderId}`, { method });
        return response.data;
    }
};
