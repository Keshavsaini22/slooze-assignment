import api from '../lib/axios';

export interface Restaurant {
    id: string;
    name: string;
    address: string;
    country: string;
    cuisine?: string;
    image?: string;
    menuItems: MenuItem[];
    createdAt: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    dietaryType: 'VEG' | 'NON_VEG' | 'EGG';
    image?: string;
    restaurantId: string;
}

export interface FetchRestaurantsOptions {
    page?: number;
    limit?: number;
    search?: string;
    dietary?: string;
}

export const RestaurantService = {
    async getAll(options: FetchRestaurantsOptions = {}) {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);
        if (options.dietary) params.append('dietary', options.dietary);

        const response = await api.get(`/restaurants?${params.toString()}`);
        return response.data;
    },

    async getOne(id: string) {
        const response = await api.get(`/restaurants/${id}`);
        return response.data;
    },

    async getMenu(id: string, options: FetchRestaurantsOptions = {}) {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);
        if (options.dietary) params.append('dietary', options.dietary);

        const response = await api.get(`/restaurants/${id}/menu?${params.toString()}`);
        return response.data;
    }
};
