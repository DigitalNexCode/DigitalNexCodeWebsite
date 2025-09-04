import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PricingProps {
  onBookConsultation: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onBookConsultation }) => {
  const [billingType, setBillingType] = useState<'once-off' | 'monthly'>('once-off');
  const [paymentPlan, setPaymentPlan] = useState<number>(1); // 1, 3, or 6 months
  const { user } = useAuth();
  const navigate = useNavigate();

  const pricingPlans = {
    'once-off': [
      { name: 'Basic Website', price: 6500, description: 'Perfect for small businesses & startups.', features: ['Responsive Website Design', 'Up to 5 Pages', 'Contact Form', 'Basic SEO', '3 Months Support'], popular: false },
      { name: 'Standard Website', price: 7200, description: 'Ideal for growing businesses.', features: ['Everything in Basic', 'Up to 10 Pages', 'CMS Integration', 'Advanced SEO', '6 Months Support'], popular: true },
      { name: 'Premium Website', price: 8200, description: 'For advanced features & e-commerce.', features: ['Everything in Standard', 'E-commerce Functionality', 'Priority Support', '12 Months Support'], popular: false }
    ],
    'monthly': [
      { name: 'Basic Maintenance', price: 1150, description: 'Ongoing site maintenance.', features: ['Secure Website Hosting', 'Regular Backups & Updates', 'Security Monitoring', 'Email Support'], popular: false },
      { name: 'Standard Maintenance', price: 1450, description: 'Enhanced support & content updates.', features: ['Everything in Basic', 'Minor Content Updates', 'Performance Monitoring', 'Priority Support'], popular: true },
      { name: 'Premium Maintenance', price: 1550, description: 'Comprehensive site management.', features: ['Everything in Standard', 'Monthly Feature Enhancements', 'Advanced Analytics', '24/7 Support'], popular: false }
    ]
  };

  const handleGetStarted = (plan: any) => {
    const checkoutState = {
      planName: plan.name,
      price: plan.price,
      billingType,
      paymentPlan: billingType === 'once-off' ? paymentPlan : 1,
    };
    if (user) {
      navigate('/checkout', { state: checkoutState });
    } else {
      navigate('/login', { state: { from: '/pricing', checkoutState } });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transparent Pricing</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">Choose the perfect plan for your needs. No hidden fees, ever.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Website Development Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Clear, upfront pricing for our web development and maintenance packages.</p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setBillingType('once-off')} className={`px-6 py-2 rounded-md font-medium transition-colors ${billingType === 'once-off' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Once-off Projects</button>
              <button onClick={() => setBillingType('monthly')} className={`px-6 py-2 rounded-md font-medium transition-colors ${billingType === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Monthly Maintenance</button>
            </div>
          </div>
          
          {billingType === 'once-off' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Need flexibility? Choose a payment plan.</h3>
              <div className="flex justify-center gap-4">
                {[1, 3, 6].map(months => (
                  <button key={months} onClick={() => setPaymentPlan(months)} className={`px-6 py-2 rounded-lg border-2 transition-colors ${paymentPlan === months ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold' : 'border-gray-300 hover:border-blue-400'}`}>
                    {months === 1 ? 'Pay In Full' : `Pay over ${months} months`}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans[billingType].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-8 flex flex-col ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}
              >
                {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Star size={14}/> Popular</div>}
                <div className="flex-grow">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      R{billingType === 'once-off' ? (plan.price / paymentPlan).toFixed(2) : plan.price}
                      <span className="text-lg text-gray-500 font-normal">
                        {billingType === 'monthly' || paymentPlan > 1 ? '/month' : ''}
                      </span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start"><Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" /><span>{feature}</span></li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleGetStarted(plan)} className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}>Get Started</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Custom & Enterprise Solutions</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                    Need a custom software application, complex system integration, or strategic technology consulting? We provide tailored quotes to fit your unique requirements. Let's discuss your project and build a solution that drives results.
                </p>
                <button
                    onClick={onBookConsultation}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center text-lg"
                >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Book a Free Consultation
                </button>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
