'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from '@/hooks/useCart';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GroupedCartItem {
  id: number;
  title: string;
  description: string;
  retailPrice: string;
  wholesalePrice: string;
  image: string;
  longDescription: string;
  quantity: number;
}

export default function CartPage() {
  const { cart, removeFromCart, addToCart, fetchCart } = useCart();
  const [groupedCart, setGroupedCart] = useState<GroupedCartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const groupedItems = cart.reduce((acc, item) => {
      const existingItem = acc.find(i => i.title === item.title);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        acc.push({ ...item, quantity: item.quantity || 1 });
      }
      return acc;
    }, [] as GroupedCartItem[]);

    setGroupedCart(groupedItems);
  }, [cart]);

  const handleIncrement = async (item: GroupedCartItem) => {
    await addToCart({ ...item, quantity: 1 });
    fetchCart();
  };

  const handleDecrement = async (item: GroupedCartItem) => {
    if (item.quantity > 1) {
      await addToCart({ ...item, quantity: -1 });
    } else {
      await removeFromCart(item.id);
    }
    fetchCart();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {groupedCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {groupedCart.map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <Image src={item.image} alt={item.title} width={50} height={50} className="mr-4" />
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.retailPrice}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Button onClick={() => handleDecrement(item)} className="p-1">
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button onClick={() => handleIncrement(item)} className="p-1">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Total</h2>
        <p className="text-2xl font-bold">
          ₹{groupedCart.reduce((total, item) => total + (parseFloat(item.retailPrice.replace('₹', '')) * item.quantity), 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}