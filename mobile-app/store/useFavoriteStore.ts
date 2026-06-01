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
      const items = (response || []).map((item: any) => item.property);
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