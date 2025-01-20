import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ICheckoutItem } from '../../Interfaces/ICheckoutItem';

const PUB_KEY = import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_STRIPE_TEST_PUB_KEY
    : import.meta.env.VITE_STRIPE_PROD_PUB_KEY

const stripePromise = loadStripe(PUB_KEY);

const checkoutEndpoint = `${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`;

export default function CheckoutButton({ salesItems }: { salesItems: ICheckoutItem[] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(checkoutEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ salesItems }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe.js failed to load');
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (err: any) {
            setError(err.message ?? "An error occurred");
            console.error('Error during checkout:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <button
                className='bg-edcPurple-60 rounded-md p-2 w-full border-2 border-white text-white'
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Checkout'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};
