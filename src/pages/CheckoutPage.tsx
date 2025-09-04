import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { CreditCard, Lock } from 'lucide-react';

// Define the Yoco type
declare global {
  interface Window {
    YocoSDK: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth(); // Get user and profile
  const { planName, price, billingType, paymentPlan } = state || {};
  const [isYocoReady, setIsYocoReady] = useState(false);

  const amountInCents = (billingType === 'once-off' ? price / paymentPlan : price) * 100;
  const yocoPublicKey = import.meta.env.VITE_YOCO_PUBLIC_KEY;

  useEffect(() => {
    if (!state) {
      navigate('/pricing');
    }

    const scriptId = 'yoco-sdk-script';
    if (document.getElementById(scriptId)) {
      setIsYocoReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    script.onload = () => {
      setIsYocoReady(true);
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [state, navigate]);

  const handlePayment = () => {
    if (!isYocoReady || !window.YocoSDK) {
      alert('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    if (!yocoPublicKey) {
      alert('Yoco public key is not configured.');
      return;
    }

    const yoco = new window.YocoSDK({
      publicKey: yocoPublicKey,
    });

    const nameParts = profile?.full_name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    yoco.showPopup({
      amountInCents,
      currency: 'ZAR',
      name: `DigitalNexCode - ${planName}`,
      description: `Payment for ${planName} plan.`,
      customer: {
        firstName,
        lastName,
        email: user?.email,
      },
      callback: async function (result: any) {
        if (result.error) {
          alert("Payment failed: " + result.error.message);
        } else {
          // Payment successful, save to Supabase
          const { error } = await supabase.from('payments').insert({
            user_id: user?.id,
            amount_in_cents: amountInCents,
            plan_name: planName,
            payment_plan: `${paymentPlan} months`,
            yoco_charge_id: result.id,
            status: 'completed'
          });

          if (error) {
            alert('Payment was successful, but failed to save record: ' + error.message);
          } else {
            alert('Payment successful and recorded!');
            navigate('/');
          }
        }
      }
    });
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Checkout</h1>
        <p className="text-center text-gray-600 mb-8">You are logged in as {user?.email}</p>

        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{planName} ({billingType})</span>
            </div>
            {billingType === 'once-off' && paymentPlan > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Plan:</span>
                <span className="font-medium">Over {paymentPlan} months</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold text-blue-600 border-t pt-4 mt-4">
              <span>Total Due Today:</span>
              <span>R{(amountInCents / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handlePayment}
            disabled={!isYocoReady}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-wait"
          >
            <CreditCard className="h-6 w-6 mr-3" />
            {isYocoReady ? 'Pay Securely with Yoco' : 'Initializing Payment...'}
          </button>
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center">
            <Lock className="h-3 w-3 mr-1" /> All transactions are secure and encrypted.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
