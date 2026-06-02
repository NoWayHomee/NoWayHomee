import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { Property } from '../components/PropertyCard';

interface FavoriteState {
  favorites: Property[];
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (property: Property) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  fetchFavorites: async () => {
    try {
      const response: any = await apiClient.get('/favorites');
      const items = (response || []).map((item: any) => {
        const p = item.property;
        return {
          id: p.id,
          title: p.name,
          location: p.district ? `${p.district}, ${p.city}` : p.city,
          price: Number(p.minPrice) || 0,
          rating: Number(p.avgRating) || 0,
          reviews: Number(p.totalReviews) || 0,
          imageUrl: p.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        };
      });
      set({ favorites: items });
    } catch (error) {
      console.warn('Error fetching favorites:', error);
    }
  },
  toggleFavorite: async (property) => {
    const exists = get().favorites.some((p) => p.id === property.id);
    
    if (exists) {
      set({ favorites: get().favorites.filter((p) => p.id !== property.id) });
      try {
        await apiClient.delete(`/favorites/${property.id}`);
      } catch (error) {
        console.warn('Error removing favorite:', error);
        set({ favorites: [...get().favorites, property] });
      }
    } else {
      set({ favorites: [...get().favorites, property] });
      try {
        await apiClient.post('/favorites', { propertyId: property.id });
      } catch (error) {
        console.warn('Error adding favorite:', error);
        set({ favorites: get().favorites.filter((p) => p.id !== property.id) });
      }
    }
  },
  isFavorite: (id) => get().favorites.some((p) => p.id === id),
}));