'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, tea) => sum + parseFloat(tea.retailPrice.replace('₹', '')), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((tea, index) => (
            <div key={index} className="flex justify-between items-center mb-4 p-4 border rounded">
              <div>
                <h3 className="font-bold">{tea.title}</h3>
                <p>{tea.retailPrice}</p>
              </div>
              <Button onClick={() => removeFromCart(index)} className="bg-red-600 hover:bg-red-700 text-white">
                Remove
              </Button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
            <Link href="/checkout">
              <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}