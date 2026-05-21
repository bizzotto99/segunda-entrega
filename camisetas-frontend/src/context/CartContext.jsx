import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext(null);

// Helpers para LocalStorage
const getLocalCart = () => {
  const local = localStorage.getItem('cart');
  return local ? JSON.parse(local) : { items: [], total: 0 };
};

const saveLocalCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el carrito cuando cambie el token (login/logout/inicio)
  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        // Invitado: Carga desde localStorage
        const localCart = getLocalCart();
        setItems(localCart.items || []);
        setTotal(localCart.total || 0);
      } else {
        // Autenticado: Carga desde la API del backend
        const backendCart = await cartService.getCart();
        setItems(backendCart.items || []);
        setTotal(backendCart.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar carrito:", err);
      setError(err.message || 'Error al obtener el carrito');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (itemData) => {
    // itemData = { idProducto, idProdTalle, talle, cantidad, nombreProducto, precioUnitario, fotoUrl }
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        // Lógica local para invitados
        const cart = getLocalCart();
        const existing = cart.items.find(
          (i) => i.idProducto === itemData.idProducto && i.talle === itemData.talle
        );

        if (existing) {
          existing.cantidad += itemData.cantidad;
        } else {
          cart.items.push({
            idItem: Date.now(), // ID temporal local
            idProducto: itemData.idProducto,
            idProdTalle: itemData.idProdTalle,
            nombreProducto: itemData.nombreProducto,
            fotoUrl: itemData.fotoUrl,
            talle: itemData.talle,
            cantidad: itemData.cantidad,
            precioUnitario: itemData.precioUnitario,
          });
        }

        cart.total = cart.items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
        saveLocalCart(cart);
        setItems(cart.items);
        setTotal(cart.total);
      } else {
        // Lógica backend para autenticados
        const apiRequest = {
          idProducto: itemData.idProducto,
          idProdTalle: itemData.idProdTalle,
          cantidad: itemData.cantidad,
        };
        const updatedCart = await cartService.addItem(apiRequest);
        setItems(updatedCart.items || []);
        setTotal(updatedCart.total || 0);
      }
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      setError(err.message || 'Error al agregar producto');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (idItem, idProducto, talle, cantidad) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        // Invitado
        const cart = getLocalCart();
        const item = cart.items.find((i) => i.idItem === idItem);
        if (item) {
          if (cantidad <= 0) {
            cart.items = cart.items.filter((i) => i.idItem !== idItem);
          } else {
            item.cantidad = cantidad;
          }
          cart.total = cart.items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
          saveLocalCart(cart);
          setItems(cart.items);
          setTotal(cart.total);
        }
      } else {
        // Autenticado
        const updatedCart = await cartService.updateQuantity(idItem, cantidad);
        setItems(updatedCart.items || []);
        setTotal(updatedCart.total || 0);
      }
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      setError(err.message || 'Error al actualizar cantidad');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (idItem) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        // Invitado
        const cart = getLocalCart();
        cart.items = cart.items.filter((i) => i.idItem !== idItem);
        cart.total = cart.items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
        saveLocalCart(cart);
        setItems(cart.items);
        setTotal(cart.total);
      } else {
        // Autenticado
        await cartService.removeItem(idItem);
        // El backend devuelve vacío, así que recargamos el carrito completo
        const updatedCart = await cartService.getCart();
        setItems(updatedCart.items || []);
        setTotal(updatedCart.total || 0);
      }
    } catch (err) {
      console.error("Error al eliminar del carrito:", err);
      setError(err.message || 'Error al eliminar producto');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        // Invitado
        const emptyCart = { items: [], total: 0 };
        saveLocalCart(emptyCart);
        setItems([]);
        setTotal(0);
      } else {
        // Autenticado
        await cartService.clearCart();
        setItems([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
      setError(err.message || 'Error al vaciar el carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const mergeLocalCart = async () => {
    const local = getLocalCart();
    if (local.items.length === 0) return;

    setIsLoading(true);
    try {
      for (const item of local.items) {
        try {
          await cartService.addItem({
            idProducto: item.idProducto,
            idProdTalle: item.idProdTalle,
            cantidad: item.cantidad,
          });
        } catch (e) {
          console.error("Error migrando ítem local al backend:", e);
        }
      }
      // Limpiar carrito local
      localStorage.removeItem('cart');
      // Recargar carrito final desde backend
      await fetchCart();
    } catch (err) {
      console.error("Error general en mergeLocalCart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCart = () => {
    setItems([]);
    setTotal(0);
    setError(null);
  };

  return (
    <CartContext.Provider value={{ items, total, isLoading, error, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, mergeLocalCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
