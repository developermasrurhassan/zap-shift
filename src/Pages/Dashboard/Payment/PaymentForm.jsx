import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../ErrorPage/Loading';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Get parcel info
    const { isPending, data: parcelData = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    // Create payment mutation
    const confirmPaymentMutation = useMutation({
        mutationFn: async ({ paymentIntentId, parcelId, userEmail }) => {
            return await axiosSecure.post('/confirm-payment', {
                paymentIntentId,
                parcelId,
                userEmail,
                paymentMethod: 'card'
            });
        },
        onSuccess: (data) => {
            console.log('✅ Payment confirmed on server:', data.data);

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['myParcel'] });
            queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });

            // Show success message
            Swal.fire({
                title: 'Payment Successful!',
                html: `
                    <div class="text-center">
                        <div class="text-6xl mb-4">✅</div>
                        <h3 class="text-xl font-bold mb-2">Payment Completed</h3>
                        <p class="text-gray-600 mb-4">Your payment has been processed successfully.</p>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <p class="font-mono text-sm">Payment ID: ${data.data.data.paymentIntentId?.slice(-8)}</p>
                        </div>
                    </div>
                `,
                confirmButtonText: 'View My Parcels',
                showCancelButton: true,
                cancelButtonText: 'View Payment History'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/my-parcel');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate('/dashboard/payment-history');
                }
            });
        },
        onError: (error) => {
            console.error('❌ Error confirming payment:', error);
            Swal.fire({
                title: 'Payment Error',
                text: 'Payment was successful but there was an error updating records. Please contact support.',
                icon: 'error'
            });
        }
    });

    if (isPending) {
        return <Loading />;
    }

    const parcelInfo = parcelData.data;
    const amount = parcelInfo?.price || 0;
    const amountInCents = Math.round(amount * 100); // Convert to cents

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe not loaded');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // Step 1: Get client secret from server
            console.log('🔑 Requesting payment intent...');
            const paymentIntentRes = await axiosSecure.post('/create-checkout-session', {
                amountInCents,
                parcelId,
                userEmail: parcelInfo.userEmail
            });

            if (!paymentIntentRes.data.success) {
                throw new Error(paymentIntentRes.data.error || 'Failed to create payment intent');
            }

            const { clientSecret, paymentIntentId } = paymentIntentRes.data;
            console.log('✅ Got client secret for PaymentIntent:', paymentIntentId);

            // Step 2: Get card element
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // Step 3: Confirm card payment
            console.log('💳 Confirming card payment...');
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: parcelInfo.senderName || 'Customer',
                        email: parcelInfo.userEmail,
                        phone: parcelInfo.senderPhone
                    }
                }
            });

            if (stripeError) {
                console.error('❌ Stripe payment error:', stripeError);
                setError(stripeError.message);
                setIsProcessing(false);
                return;
            }

            // Step 4: Check if payment succeeded
            if (paymentIntent.status === 'succeeded') {
                console.log('✅ Payment succeeded! PaymentIntent:', paymentIntent.id);

                // Step 5: Confirm payment on our server
                console.log('📡 Confirming payment on server...');
                await confirmPaymentMutation.mutateAsync({
                    paymentIntentId: paymentIntent.id,
                    parcelId,
                    userEmail: parcelInfo.userEmail
                });

                // Log success details
                console.log('🎉 Payment Flow Complete:', {
                    paymentIntentId: paymentIntent.id,
                    parcelId,
                    amount: amount,
                    status: paymentIntent.status
                });
            } else {
                throw new Error(`Payment status: ${paymentIntent.status}`);
            }

        } catch (error) {
            console.error('❌ Payment process error:', error);
            setError(error.message || 'Payment failed. Please try again.');

            Swal.fire({
                title: 'Payment Failed',
                text: error.message || 'Something went wrong with the payment',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-lg w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Parcel:</span>
                        <span className="font-semibold">{parcelInfo?.parcelName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-mono text-primary">{parcelInfo?.trackingId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="text-2xl font-bold text-green-600">৳{amount}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Processing...
                        </>
                    ) : (
                        `Pay ৳${amount}`
                    )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Secure payment powered by Stripe</p>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;