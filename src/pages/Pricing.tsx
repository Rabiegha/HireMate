import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getStripe } from '../lib/stripe';
import { toast } from 'sonner';
import type { RootState } from '../store';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '1 Resume Generation',
      '1 Job Match Analysis',
      '1 Interview Practice Session',
      'Basic Templates',
    ],
    cta: 'Get Started',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    features: [
      '5 Resume Generations',
      '10 Job Match Analyses',
      '5 Interview Practice Sessions',
      'Advanced Templates',
      'Priority Support',
    ],
    cta: 'Subscribe Now',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    features: [
      'Unlimited Resume Generations',
      'Unlimited Job Match Analyses',
      'Unlimited Interview Practice',
      'All Templates',
      'Priority Support',
      'AI Profile Picture Generator',
    ],
    cta: 'Go Pro',
  },
];

function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname, planId } });
      return;
    }

    if (planId === 'free') {
      try {
        const { error } = await supabase
          .from('users')
          .update({ subscription_tier: 'free' })
          .eq('id', user.id);

        if (error) throw error;
        toast.success('Successfully subscribed to Free plan!');
        navigate('/dashboard');
      } catch (error: any) {
        toast.error('Failed to update subscription', {
          description: error.message,
        });
      }
      return;
    }

    try {
      setLoading(planId);

      // Check if Edge Functions are available
      const { data: healthCheck, error: healthError } = await supabase.functions.invoke(
        'health-check',
        { body: {} }
      );

      if (healthError || !healthCheck?.healthy) {
        throw new Error('Subscription service is temporarily unavailable. Please try again later.');
      }

      const { data, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            planId,
            userId: user.id,
            userEmail: user.email,
          },
        }
      );

      if (checkoutError) {
        throw new Error(checkoutError.message || 'Failed to create checkout session');
      }

      if (!data?.sessionId) {
        throw new Error('No session ID returned from checkout');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Payment system is not available. Please try again later.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription', {
        description: error.message || 'Please try again later or contact support if the issue persists.',
        duration: 5000,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
              plan.popular ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="bg-blue-500 text-white text-center py-1.5 text-sm font-medium">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-300">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                data-plan-id={plan.id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
          Please{' '}
          <button
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
            className="text-blue-600 hover:underline"
          >
            sign in
          </button>
          {' '}to subscribe to a plan
        </p>
      )}
    </div>
  );
}

export default Pricing;