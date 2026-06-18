import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../services/cartService';

const getLocalCart = () => {
  const local = localStorage.getItem('cart');
  return local ? JSON.parse(local) : { items: [], total: 0 };
};

const saveLocalCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return getLocalCart();
      } else {
        const backendCart = await cartService.getCart();
        return {
          items: backendCart.items || [],
          total: backendCart.total || 0,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener el carrito');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        const cart = getLocalCart();
        const existing = cart.items.find(
          (i) => i.idProducto === itemData.idProducto && i.talle === itemData.talle
        );

        if (existing) {
          existing.cantidad += itemData.cantidad;
        } else {
          cart.items.push({
            idItem: Date.now(),
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
        return cart;
      } else {
        const apiRequest = {
          idProducto: itemData.idProducto,
          idProdTalle: itemData.idProdTalle,
          cantidad: itemData.cantidad,
        };
        const updatedCart = await cartService.addItem(apiRequest);
        return {
          items: updatedCart.items || [],
          total: updatedCart.total || 0,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al agregar producto');
    }
  }
);

export const updateQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async ({ idItem, idProducto, talle, cantidad }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
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
        }
        return cart;
      } else {
        const updatedCart = await cartService.updateQuantity(idItem, cantidad);
        return {
          items: updatedCart.items || [],
          total: updatedCart.total || 0,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al actualizar cantidad');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (idItem, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        const cart = getLocalCart();
        cart.items = cart.items.filter((i) => i.idItem !== idItem);
        cart.total = cart.items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
        saveLocalCart(cart);
        return cart;
      } else {
        await cartService.removeItem(idItem);
        const updatedCart = await cartService.getCart();
        return {
          items: updatedCart.items || [],
          total: updatedCart.total || 0,
        };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al eliminar producto');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        const emptyCart = { items: [], total: 0 };
        saveLocalCart(emptyCart);
        return emptyCart;
      } else {
        await cartService.clearCart();
        return { items: [], total: 0 };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error al vaciar el carrito');
    }
  }
);

export const mergeLocalCartThunk = createAsyncThunk(
  'cart/mergeLocalCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const local = getLocalCart();
      if (local.items.length === 0) return { items: [], total: 0 };

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
      localStorage.removeItem('cart');
      const updatedCart = await cartService.getCart();
      return {
        items: updatedCart.items || [],
        total: updatedCart.total || 0,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al fusionar carritos');
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };
    
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Error en el carrito';
    };

    builder
      // Fetch Cart
      .addCase(fetchCartThunk.pending, handlePending)
      .addCase(fetchCartThunk.fulfilled, handleFulfilled)
      .addCase(fetchCartThunk.rejected, handleRejected)
      // Add To Cart
      .addCase(addToCartThunk.pending, handlePending)
      .addCase(addToCartThunk.fulfilled, handleFulfilled)
      .addCase(addToCartThunk.rejected, handleRejected)
      // Update Quantity
      .addCase(updateQuantityThunk.pending, handlePending)
      .addCase(updateQuantityThunk.fulfilled, handleFulfilled)
      .addCase(updateQuantityThunk.rejected, handleRejected)
      // Remove From Cart
      .addCase(removeFromCartThunk.pending, handlePending)
      .addCase(removeFromCartThunk.fulfilled, handleFulfilled)
      .addCase(removeFromCartThunk.rejected, handleRejected)
      // Clear Cart
      .addCase(clearCartThunk.pending, handlePending)
      .addCase(clearCartThunk.fulfilled, handleFulfilled)
      .addCase(clearCartThunk.rejected, handleRejected)
      // Merge Local Cart
      .addCase(mergeLocalCartThunk.pending, handlePending)
      .addCase(mergeLocalCartThunk.fulfilled, handleFulfilled)
      .addCase(mergeLocalCartThunk.rejected, handleRejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
