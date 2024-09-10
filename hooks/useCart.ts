import { useState, useEffect } from 'react';
import { Tea } from '@/types/tea';

const API_URL = 'https://sretea.onrender.com/api';

export function useCart() {
  const [cart, setCart] = useState<Tea[]>([]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (tea: Tea) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tea),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItemQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  return { cart, addToCart, removeFromCart, fetchCart, updateCartItemQuantity };
}