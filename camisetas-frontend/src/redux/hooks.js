import { useSelector, useDispatch } from 'react-redux';
import { 
  loginThunk, 
  registerThunk, 
  logoutThunk, 
  clearError, 
  fetchProfileThunk 
} from './authSlice';
import {
  fetchCartThunk,
  addToCartThunk,
  updateQuantityThunk,
  removeFromCartThunk,
  clearCartThunk,
  mergeLocalCartThunk,
  resetCart as resetCartAction,
} from './cartSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = async (credentials) => {
    return dispatch(loginThunk(credentials)).unwrap();
  };

  const register = async (userData) => {
    return dispatch(registerThunk(userData)).unwrap();
  };

  const logout = () => {
    dispatch(logoutThunk());
  };

  const dispatchClearError = () => {
    dispatch(clearError());
  };

  const fetchProfile = async () => {
    return dispatch(fetchProfileThunk()).unwrap();
  };

  return {
    token: auth.token,
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    register,
    logout,
    clearError: dispatchClearError,
    fetchProfile,
  };
};

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const fetchCart = async () => {
    return dispatch(fetchCartThunk()).unwrap();
  };

  const addToCart = async (itemData) => {
    return dispatch(addToCartThunk(itemData)).unwrap();
  };

  const updateQuantity = async (idItem, idProducto, talle, cantidad) => {
    return dispatch(updateQuantityThunk({ idItem, idProducto, talle, cantidad })).unwrap();
  };

  const removeFromCart = async (idItem) => {
    return dispatch(removeFromCartThunk(idItem)).unwrap();
  };

  const clearCart = async () => {
    return dispatch(clearCartThunk()).unwrap();
  };

  const mergeLocalCart = async () => {
    return dispatch(mergeLocalCartThunk()).unwrap();
  };

  const resetCart = () => {
    dispatch(resetCartAction());
  };

  return {
    items: cart.items,
    total: cart.total,
    isLoading: cart.isLoading,
    error: cart.error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    mergeLocalCart,
    resetCart,
  };
};
