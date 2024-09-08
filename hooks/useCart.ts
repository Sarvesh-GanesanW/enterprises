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
        body: JSON.stringify({
          title: tea.title,
          description: tea.description,
          retailPrice: tea.retailPrice,
          wholesalePrice: tea.wholesalePrice,
          image: tea.image,
          longDescription: tea.longDescription
        }),
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

  return { cart, addToCart, removeFromCart, fetchCart };
}