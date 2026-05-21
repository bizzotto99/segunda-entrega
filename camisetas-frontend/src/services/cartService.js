import { fetchApi } from './api';

export const cartService = {
  getCart: async () => {
    return await fetchApi('/carrito', {
      method: 'GET',
    });
  },

  addItem: async (itemData) => {
    // itemData = { idProducto, idProdTalle, cantidad }
    return await fetchApi('/carrito/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  removeItem: async (idItem) => {
    await fetchApi(`/carrito/items/${idItem}`, {
      method: 'DELETE',
    });
  },

  updateQuantity: async (idItem, cantidad) => {
    return await fetchApi(`/carrito/items/${idItem}?cantidad=${cantidad}`, {
      method: 'PUT',
    });
  },

  clearCart: async () => {
    await fetchApi('/carrito', {
      method: 'DELETE',
    });
  }
};
