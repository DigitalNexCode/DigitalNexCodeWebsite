import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

// Define the Yoco type
declare global {
  interface Window {
    YocoSDK: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { planName, price, billingType, paymentPlan } = state || {};
  
  const [isYocoReady, setIsYocoReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    script.onload = () => setIsYocoReady(true);
    script.onerror = () => {
        setPaymentMessage({ type: 'error', text: 'Failed to load the payment gateway. Please refresh the page and try again.' });
        setIsYocoReady(false);
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) document.body.removeChild(existingScript);
      if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    };
  }, [state, navigate]);

  const handlePayment = () => {
    if (!isYocoReady || !window.YocoSDK || !yocoPublicKey) {
      setPaymentMessage({ type: 'error', text: 'Payment system is not ready. Please refresh and try again.' });
      return;
    }
    
    setIsProcessing(true);
    setPaymentMessage(null);

    // Set a timeout to prevent being stuck in processing state
    processingTimeoutRef.current = setTimeout(() => {
        setIsProcessing(false);
        setPaymentMessage({ type: 'error', text: 'Payment gateway timed out. Please refresh and try again.' });
    }, 30000); // 30-second timeout

    try {
      const yoco = new window.YocoSDK({ publicKey: yocoPublicKey });
      const nameParts = profile?.full_name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      yoco.showPopup({
        amountInCents,
        currency: 'ZAR',
        name: `DigitalNexCode - ${planName}`,
        description: `Payment for ${planName} plan.`,
        customer: { firstName, lastName, email: user?.email },
        callback: async function (result: any) {
          if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
          if (result.error) {
            setPaymentMessage({ type: 'error', text: `Payment failed: ${result.error.message}` });
            setIsProcessing(false);
          } else {
            setPaymentMessage({ type: 'success', text: 'Payment successful! Saving record...' });
            
            const { error } = await supabase.from('payments').insert({
              user_id: user?.id,
              amount_in_cents: amountInCents,
              plan_name: planName,
              payment_plan: `${paymentPlan} months`,
              yoco_charge_id: result.id,
              status: 'completed'
            });

            if (error) {
              setPaymentMessage({ type: 'error', text: `Payment recorded, but failed to save to your profile: ${error.message}` });
            } else {
              setPaymentMessage({ type: 'success', text: 'Payment successful and recorded! Redirecting...' });
              setTimeout(() => navigate('/'), 3000);
            }
            setIsProcessing(false);
          }
        },
        onClose: () => {
          if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
          setIsProcessing(false);
        }
      });
    } catch (error: any) {
        if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
        setPaymentMessage({ type: 'error', text: `An unexpected error occurred: ${error.message}` });
        setIsProcessing(false);
    }
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

        <div className="bg-gray-100 rounded-lg p-6 mb-6">
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

        {paymentMessage && (
          <div className={`flex items-start p-4 mb-6 rounded-lg ${paymentMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {paymentMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3 mt-0.5" /> : <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />}
            <span className="flex-1">{paymentMessage.text}</span>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handlePayment}
            disabled={!isYocoReady || isProcessing || paymentMessage?.type === 'error'}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-wait"
          >
            {isProcessing ? (
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            ) : (
              <CreditCard className="h-6 w-6 mr-3" />
            )}
            {isProcessing ? 'Processing...' : (isYocoReady ? 'Pay Securely with Yoco' : 'Initializing...')}
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
