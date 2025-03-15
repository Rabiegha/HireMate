import { serve } from 'https://deno.fresh.dev/std/http/server.ts';
import Stripe from 'https://esm.sh/stripe?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const DOMAIN = Deno.env.get('DOMAIN') || 'http://localhost:5173';

// Replace these with your actual Stripe price IDs after creating the products
const priceIds = {
  basic: 'price_1Oc7TqLglTkHA1XLwbhDnSZo7',
  pro: 'price_1Oc7TqLglTkHA1XLwbhDnSZo8',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { planId, userId, userEmail } = await req.json();

    if (!planId || !userId || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          status: 400,
        }
      );
    }

    if (!priceIds[planId as keyof typeof priceIds]) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan ID' }),
        { 
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          status: 400,
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price: priceIds[planId as keyof typeof priceIds],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${DOMAIN}/dashboard?success=true`,
      cancel_url: `${DOMAIN}/pricing?canceled=true`,
      metadata: {
        userId,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    );
  }
});