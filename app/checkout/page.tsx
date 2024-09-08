'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from 'qrcode.react';
import { Label } from "@/components/ui/label";
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);

  const total = cart.reduce((sum, tea) => sum + parseFloat(tea.retailPrice.replace('₹', '')), 0);

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'upi') {
      // In a real app, you'd call your backend API to initiate the payment
      // and get the UPI payment details
      try {
        const response = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: total, paymentMethod: 'upi' }),
        });
        const data = await response.json();
        if (data.success) {
          setShowQR(true);
        } else {
          alert('Failed to initiate payment. Please try again.');
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Payment method not supported yet.');
    }
  };

  const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=SreeRajalakshmiEnterprises&am=${total.toFixed(2)}&cu=INR&tn=TeaPayment`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="upi">UPI (PhonePe, Google Pay, etc.)</option>
          </select>
        </div>
        {paymentMethod === 'upi' && (
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={handleUpiIdChange}
            />
          </div>
        )}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
          Pay ₹{total.toFixed(2)}
        </Button>
      </form>
      {showQR && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Scan QR Code to Pay</h2>
          <div className="inline-block p-4 bg-white rounded-lg shadow-md">
            <QRCodeSVG value={upiPaymentUrl} size={256} />
          </div>
          <p className="mt-4">Or use this UPI ID: {upiId}</p>
          <Button 
            onClick={async () => {
              // In a real app, you'd call your backend API to verify the payment
              try {
                const response = await fetch('/api/verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ amount: total, paymentMethod: 'upi' }),
                });
                const data = await response.json();
                if (data.success) {
                  alert('Payment confirmed! Thank you for your purchase.');
                  // Clear the cart and redirect to a thank you page
                } else {
                  alert('Payment verification failed. Please try again or contact support.');
                }
              } catch (error) {
                console.error('Error verifying payment:', error);
                alert('An error occurred. Please try again or contact support.');
              }
            }} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirm Payment
          </Button>
        </div>
      )}
    </div>
  );
}