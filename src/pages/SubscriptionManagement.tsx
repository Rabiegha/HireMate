import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import type { RootState } from '../store';

function SubscriptionManagement() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? This will downgrade your account to the free plan at the end of your current billing period.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      toast.success('Subscription canceled successfully. You will be downgraded to the free plan at the end of your billing period.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Subscription Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.subscription_tier === 'free' ? 'Free Plan' :
                 user?.subscription_tier === 'basic' ? 'Basic Plan' :
                 user?.subscription_tier === 'pro' ? 'Pro Plan' : 'Unknown'}
              </p>
            </div>
          </div>

          {user?.subscription_tier !== 'free' && (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </div>

        {user?.subscription_tier === 'free' ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Upgrade Your Plan
                </h3>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  Upgrade to our Basic or Pro plan to unlock more features and increase your usage limits.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Plan Features
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {user?.subscription_tier === 'basic' ? (
                <>
                  <li>✓ 5 Resume Generations</li>
                  <li>✓ 10 Job Match Analyses</li>
                  <li>✓ 5 Interview Practice Sessions</li>
                  <li>✓ Advanced Templates</li>
                  <li>✓ Priority Support</li>
                </>
              ) : (
                <>
                  <li>✓ Unlimited Resume Generations</li>
                  <li>✓ Unlimited Job Match Analyses</li>
                  <li>✓ Unlimited Interview Practice</li>
                  <li>✓ All Templates</li>
                  <li>✓ Priority Support</li>
                  <li>✓ AI Profile Picture Generator</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionManagement;