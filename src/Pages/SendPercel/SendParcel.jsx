import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router'; // ADD THIS IMPORT
import {
    FaTruck,
    FaBox,
    FaFileAlt,
    FaWeightHanging,
    FaUser,
    FaMapMarkerAlt,
    FaPhone,
    FaHome,
    FaClipboardList,
    FaArrowRight,
    FaPaperPlane,
    FaCalendarAlt,
    FaClock,
    FaInfoCircle,
    FaShieldAlt,
    FaCreditCard,
    FaCheckCircle,
    FaMailBulk,
    FaEnvelope
} from 'react-icons/fa';
import { districts } from './DistrictData';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const SendParcel = () => {
    // State management
    const [parcelType, setParcelType] = useState('document');
    const [isSameAsSender, setIsSameAsSender] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [submittedData, setSubmittedData] = useState(null);
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate(); // ADD THIS

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            parcelType: 'document',
            parcelName: '',
            weight: '',
            senderName: '',
            senderAddress: '',
            senderPhone: '',
            senderEmail: '',
            senderDistrict: '',
            senderPickupLocation: '',
            senderInstructions: '',
            receiverName: '',
            receiverAddress: '',
            receiverPhone: '',
            receiverEmail: '',
            receiverDistrict: '',
            receiverDeliveryLocation: '',
            receiverInstructions: '',
            deliveryDate: '',
            deliveryTime: '',
            insurance: false,
            paymentMethod: 'cash'
        }
    });

    // Watch specific form values
    const watchParcelType = watch('parcelType');
    const watchSenderDistrict = watch('senderDistrict');
    const watchReceiverDistrict = watch('receiverDistrict');
    const watchWeight = watch('weight');
    const watchInsurance = watch('insurance');

    // SweetAlert helper functions
    const showValidationAlert = (message) => {
        Swal.fire({
            title: 'Validation Error!',
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
        });
    };

    const showSuccessAlert = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonText: 'Great!',
            confirmButtonColor: '#3085d6'
        });
    };

    const showConfirmAlert = (title, text) => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });
    };

    // Pricing & Delivery Logic
    const isDhakaDistrict = (district) => {
        const dhakaDistricts = [
            'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail',
            'Manikganj', 'Munshiganj', 'Narsingdi'
        ];
        return dhakaDistricts.includes(district);
    };

    const getDeliveryCharge = () => {
        if (!watchReceiverDistrict) return 0;
        return isDhakaDistrict(watchReceiverDistrict) ? 60 : 120;
    };

    const calculatePrice = () => {
        const weight = parseFloat(watchWeight) || 0;
        const basePrice = parcelType === 'document' ? 50 : 100;
        const weightPrice = weight * (parcelType === 'document' ? 10 : 20);
        const deliveryCharge = getDeliveryCharge();
        const insurancePrice = watchInsurance ? 50 : 0;
        return basePrice + weightPrice + deliveryCharge + insurancePrice;
    };

    // Form Handlers
    const handleParcelTypeChange = (type) => {
        setParcelType(type);
        setValue('parcelType', type);
    };

    const copySenderToReceiver = () => {
        const senderFields = [
            'senderName', 'senderAddress', 'senderPhone', 'senderEmail', 'senderDistrict'
        ];

        senderFields.forEach(field => {
            const senderValue = watch(field);
            const receiverField = field.replace('sender', 'receiver');
            setValue(receiverField, senderValue);
        });
        setIsSameAsSender(true);

        Swal.fire({
            title: 'Copied!',
            text: 'Sender information copied to receiver details.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const copyTrackingId = () => {
        navigator.clipboard.writeText(submittedData.trackingId)
            .then(() => {
                Swal.fire({
                    title: 'Copied!',
                    text: 'Tracking ID copied to clipboard.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(() => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to copy tracking ID.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    // Reset form functions (keep as is)

    // API Functions
    const submitParcelData = async (data) => {
        try {
            const loadingAlert = Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we schedule your parcel.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const finalData = {
                ...data,
                price: calculatePrice(),
                trackingId: `TRK${Date.now().toString().slice(-8)}`,
                status: 'pending',
                submittedAt: new Date().toISOString(),
                userId: user?.uid || 'anonymous',
                userEmail: user?.email || 'anonymous'
            };

            const response = await axiosSecure.post('/parcels', finalData);

            if (response.data.success) {
                setSubmittedData(finalData);
                setCurrentStep(4);
                loadingAlert.close();
                showSuccessAlert('Success!', 'Parcel request submitted successfully.');
                console.log('✅ Parcel submitted successfully:', response.data);
            } else {
                throw new Error(response.data.error || 'Failed to submit parcel');
            }
        } catch (error) {
            console.error('❌ Error submitting parcel:', error);
            Swal.fire({
                title: 'Submission Failed!',
                text: error.message || 'Failed to submit parcel. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // UPDATED handleOnlinePayment function
    const handleOnlinePayment = async (data) => {
        try {
            const paymentAmount = calculatePrice();
            const paymentMethod = data.paymentMethod;

            // Simplified method labels
            const methodLabels = {
                'card': 'Card',
                'mobile_banking': 'Mobile Banking',
                'bank': 'Bank'
            };

            const loadingAlert = Swal.fire({
                title: 'Creating Parcel...',
                text: 'Please wait while we create your parcel.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Create parcel with pending payment
                const finalData = {
                    ...data,
                    price: paymentAmount,
                    trackingId: `TRK${Date.now().toString().slice(-8)}`,
                    status: 'pending',
                    paymentStatus: 'pending',
                    paymentMethod: paymentMethod,
                    submittedAt: new Date().toISOString(),
                    userId: user?.uid || 'anonymous',
                    userEmail: user?.email || 'anonymous'
                };

                const response = await axiosSecure.post('/parcels', finalData);

                if (response.data.success) {
                    loadingAlert.close();

                    const paymentResult = await Swal.fire({
                        title: 'Complete Your Payment',
                        html: `
                        <div class="text-left">
                            <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p class="font-semibold">Payment Summary</p>
                                <div class="mt-2 space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span>Tracking ID:</span>
                                        <span class="font-semibold font-mono">${finalData.trackingId}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span class="font-semibold">${methodLabels[paymentMethod] || paymentMethod}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Amount:</span>
                                        <span class="font-bold text-lg">৳${paymentAmount}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <p class="text-sm text-gray-600 mb-3">Choose how you want to proceed:</p>
                                
                                <div class="space-y-3">
                                    <div class="p-3 border border-green-300 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition" id="payNowOption">
                                        <p class="font-semibold text-green-700 flex items-center gap-2">
                                            <span class="text-xl">💳</span> Pay Now
                                        </p>
                                        <p class="text-sm text-gray-600 mt-1">
                                            Complete payment now to confirm your booking
                                        </p>
                                    </div>
                                    
                                    <div class="p-3 border border-yellow-300 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition" id="payLaterOption">
                                        <p class="font-semibold text-yellow-700 flex items-center gap-2">
                                            <span class="text-xl">⏰</span> Pay on Pickup
                                        </p>
                                        <p class="text-sm text-gray-600 mt-1">
                                            Submit parcel now, pay when pickup agent arrives
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
                                <p>💡 <strong>Tip:</strong> Pay now to confirm your booking instantly!</p>
                            </div>
                        </div>
                    `,
                        showCancelButton: true,
                        confirmButtonText: 'Continue',
                        cancelButtonText: 'Cancel',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#6b7280',
                        showCloseButton: true,
                        allowEscapeKey: true,
                        allowOutsideClick: false,
                        didOpen: () => {
                            document.getElementById('payNowOption').addEventListener('click', () => {
                                Swal.close({ isConfirmed: true, isPayNow: true });
                            });

                            document.getElementById('payLaterOption').addEventListener('click', () => {
                                Swal.close({ isConfirmed: true, isPayNow: false });
                            });
                        }
                    });

                    if (paymentResult.dismiss === Swal.DismissReason.cancel) {
                        await axiosSecure.delete(`/parcels/${response.data.data._id}`);
                        Swal.fire('Cancelled', 'Parcel creation cancelled.', 'info');
                        return;
                    }

                    if (paymentResult.isConfirmed) {
                        if (paymentResult.isPayNow) {
                            // Redirect to payment page
                            navigate(`/payment/${response.data.data._id}`, {
                                state: {
                                    parcel: response.data.data,
                                    amount: paymentAmount,
                                    trackingId: finalData.trackingId
                                }
                            });
                        } else {
                            // Mark as pay on pickup
                            await axiosSecure.patch(`/parcels/${response.data.data._id}/payment`, {
                                paymentMethod: 'cash',
                                paymentStatus: 'pending'
                            });

                            setSubmittedData(finalData);
                            setCurrentStep(4);

                            Swal.fire({
                                title: 'Parcel Scheduled! ⏰',
                                html: `
                                <div class="text-center">
                                    <div class="text-5xl mb-4">📦</div>
                                    <p class="font-semibold text-lg">Pay When Pickup Agent Arrives</p>
                                    <p class="mt-2 text-sm">Our agent will collect payment during pickup.</p>
                                    
                                    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p class="font-semibold">Payment Instructions:</p>
                                        <p class="text-sm mt-1">Have ৳${paymentAmount} ready in cash or mobile banking</p>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <div class="font-mono font-bold text-primary">${finalData.trackingId}</div>
                                        <p class="text-xs text-gray-500">Tracking ID</p>
                                    </div>
                                </div>
                            `,
                                icon: 'success',
                                confirmButtonText: 'Got It!'
                            });
                        }
                    }
                } else {
                    throw new Error('Failed to create parcel');
                }
            } catch (error) {
                loadingAlert.close();
                throw error;
            }

        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to process payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const onSubmit = async (data) => {
        console.log('📦 Parcel Data:', data);
        const paymentMethod = data.paymentMethod;

        if (paymentMethod === 'cash') {
            await submitParcelData(data);
        } else {
            await handleOnlinePayment(data);
        }
    };

    // Define which fields to validate for each step
    const stepFields = {
        1: ['parcelType', 'parcelName', 'weight'],
        2: [
            'senderName',
            'senderPhone',
            'senderEmail',
            'senderAddress',
            'senderDistrict',
            'senderPickupLocation',
            'deliveryDate',
            'deliveryTime'
        ],
        3: [
            'receiverName',
            'receiverPhone',
            'receiverEmail',
            'receiverAddress',
            'receiverDistrict',
            'receiverDeliveryLocation'
        ]
    };

    // Progress steps
    const steps = [
        { id: 1, title: 'Parcel Details', icon: FaBox },
        { id: 2, title: 'Sender Info', icon: FaUser },
        { id: 3, title: 'Receiver Info', icon: FaUser },
        { id: 4, title: 'Confirmation', icon: FaCheckCircle }
    ];

    const nextStep = async () => {
        if (currentStep < 4) {
            const fieldsToValidate = stepFields[currentStep];
            const isValid = await trigger(fieldsToValidate);

            if (isValid) {
                if (currentStep === 2 && watchReceiverDistrict) {
                    const isInsideDhaka = isDhakaDistrict(watchReceiverDistrict);
                    const message = isInsideDhaka
                        ? 'Delivery charge: ৳60 (Inside Dhaka)'
                        : 'Delivery charge: ৳120 (Outside Dhaka)';

                    Swal.fire({
                        title: 'Delivery Charge Info',
                        text: message,
                        icon: 'info',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6'
                    });
                }
                setCurrentStep(currentStep + 1);
            } else {
                const firstError = document.querySelector('.input-error, .textarea-error, .select-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                showValidationAlert('Please fill all required fields correctly.');
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // The rest of your JSX remains the same...
    // [Keep all the JSX from your original code - it's correct]

    return (
        <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-primary/20 rounded-2xl">
                            <FaTruck className="text-5xl text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
                        Send A Parcel
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Enter your parcel details for safe and fast delivery across Bangladesh
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-base-300 -z-10">
                            <div
                                className="h-1 bg-primary transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            />
                        </div>

                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center mb-6 md:mb-0 relative">
                                <button
                                    onClick={() => !submittedData && setCurrentStep(step.id)}
                                    disabled={submittedData || step.id > currentStep}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${step.id === currentStep
                                        ? 'bg-primary text-white scale-110 ring-4 ring-primary/30'
                                        : step.id < currentStep
                                            ? 'bg-success text-white'
                                            : 'bg-base-300 text-base-content/50'
                                        } ${!submittedData && step.id <= currentStep ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                                >
                                    <step.icon />
                                </button>
                                <span className={`mt-3 font-semibold ${step.id === currentStep ? 'text-primary' : 'text-base-content/70'}`}>
                                    {step.title}
                                </span>
                                <span className="text-sm text-base-content/50">Step {step.id}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-base-100 shadow-2xl border border-base-300"
                >
                    <div className="card-body p-6 md:p-8">
                        {!submittedData ? (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: PARCEL DETAILS */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-primary mb-2">
                                                    Parcel Information
                                                </h2>
                                                <p className="text-base-content/70">
                                                    Tell us about what you're sending
                                                </p>
                                            </div>

                                            {/* Parcel Type Selection */}
                                            <div className="space-y-4">
                                                <label className="block text-lg font-semibold flex items-center gap-2">
                                                    <FaFileAlt className="text-primary" />
                                                    Parcel Type
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { type: 'document', icon: FaFileAlt, label: 'Document', desc: 'Letters, papers, files', color: 'primary' },
                                                        { type: 'non-document', icon: FaBox, label: 'Non-Document', desc: 'Packages, goods, items', color: 'secondary' }
                                                    ].map((item) => (
                                                        <div
                                                            key={item.type}
                                                            onClick={() => handleParcelTypeChange(item.type)}
                                                            className={`card cursor-pointer transition-all duration-300 hover:scale-[1.02] ${parcelType === item.type
                                                                ? `border-2 border-${item.color} bg-${item.color}/10`
                                                                : 'border border-base-300 hover:border-primary/50'
                                                                }`}
                                                        >
                                                            <div className="card-body items-center text-center p-6">
                                                                <item.icon className={`text-3xl mb-3 ${parcelType === item.type ? `text-${item.color}` : 'text-base-content/50'
                                                                    }`} />
                                                                <h3 className="card-title text-lg mb-1">{item.label}</h3>
                                                                <p className="text-sm text-base-content/70">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <input type="hidden" {...register('parcelType')} />
                                            </div>

                                            {/* Parcel Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Parcel Name */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaBox className="text-primary" />
                                                            Parcel Name/Description
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('parcelName', {
                                                            required: 'Parcel name is required',
                                                            minLength: { value: 3, message: 'Minimum 3 characters' }
                                                        })}
                                                        className={`input input-bordered w-full ${errors.parcelName ? 'input-error' : ''}`}
                                                        placeholder="Girl/Boy Friend er jonno gift pathao tai na?"
                                                    />
                                                    {errors.parcelName && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.parcelName.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Weight Input */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaWeightHanging className="text-primary" />
                                                            Weight (kg)
                                                        </span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            min="0.1"
                                                            max="50"
                                                            {...register('weight', {
                                                                required: 'Weight is required',
                                                                min: { value: 0.1, message: 'Minimum 0.1 kg' },
                                                                max: { value: 50, message: 'Maximum 50 kg' }
                                                            })}
                                                            className={`input input-bordered w-full pr-12 ${errors.weight ? 'input-error' : ''}`}
                                                            placeholder="0.5"
                                                        />
                                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50">
                                                            kg
                                                        </span>
                                                    </div>
                                                    {errors.weight && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.weight.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price Preview with Delivery Charge */}
                                            <div className="bg-base-200 rounded-xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-lg">Estimated Cost</h3>
                                                    <div className="badge text-black badge-primary">Preview</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Base Price ({parcelType === 'document' ? 'Document' : 'Package'})</span>
                                                        <span className="font-semibold">৳{parcelType === 'document' ? '50' : '100'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Weight ({watchWeight || 0} kg × ৳{parcelType === 'document' ? '10' : '20'})</span>
                                                        <span className="font-semibold">
                                                            ৳{(parseFloat(watchWeight) || 0) * (parcelType === 'document' ? 10 : 20)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Delivery Charge</span>
                                                        <span className="font-semibold">
                                                            ৳{watchReceiverDistrict ? (isDhakaDistrict(watchReceiverDistrict) ? '60' : '120') : '0'}
                                                            {watchReceiverDistrict && (
                                                                <span className="text-xs ml-2 text-base-content/50">
                                                                    ({isDhakaDistrict(watchReceiverDistrict) ? 'Inside Dhaka' : 'Outside Dhaka'})
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Insurance</span>
                                                        <span className="font-semibold">৳{watchInsurance ? '50' : '0'}</span>
                                                    </div>
                                                    <div className="divider my-2"></div>
                                                    <div className="flex justify-between text-lg font-bold text-primary">
                                                        <span>Total Estimated</span>
                                                        <span>৳{calculatePrice()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: SENDER DETAILS */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-primary mb-2">
                                                    Sender Details
                                                </h2>
                                                <p className="text-base-content/70">
                                                    Where should we pick up from?
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Sender Name */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaUser className="text-primary" />
                                                            Your Name
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('senderName', {
                                                            required: 'Name is required',
                                                            minLength: { value: 3, message: 'Minimum 3 characters' }
                                                        })}
                                                        className={`input input-bordered w-full ${errors.senderName ? 'input-error' : ''}`}
                                                        placeholder="natok na kore nijer name ta lekhen"
                                                    />
                                                    {errors.senderName && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderName.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Sender Phone */}
                                                <div className="form-control relative">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaPhone className="text-primary" />
                                                            Sender Phone
                                                        </span>
                                                    </label>
                                                    <div className="absolute left-3 top-11 transform -translate-y-1/2 text-gray-400 z-10">
                                                        +880
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        {...register('senderPhone', {
                                                            required: 'Sender phone is required',
                                                            pattern: {
                                                                value: /^[0-9]{11}$/,
                                                                message: 'Must be 11 digits starting with 01'
                                                            }
                                                        })}
                                                        className={`input input-bordered pl-16 w-full ${errors.senderPhone ? 'input-error' : ''}`}
                                                        placeholder="01XXXXXXXXX"
                                                        maxLength={11}
                                                    />
                                                    {errors.senderPhone && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderPhone.message}
                                                            </span>
                                                        </label>
                                                    )}


                                                </div>


                                                {/* sender email */}
                                                <div className="form-control ">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaEnvelope className="text-primary" />
                                                            Sender Email
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="email"
                                                        {...register('senderEmail', {
                                                            required: 'Sender Email is required',
                                                            pattern: {
                                                                value: /^\S+@\S+\.\S+$/,
                                                                message: 'Must be include a valid email'
                                                            }
                                                        })}
                                                        className={`input input-bordered  w-full ${errors.senderPhone ? 'input-error' : ''}`}
                                                        placeholder="example@gmail.com"

                                                    />
                                                    {errors.senderEmail && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderEmail.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Sender Address */}
                                                <div className="form-control md:col-span-2">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaHome className="text-primary" />
                                                            Full Address
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        {...register('senderAddress', {
                                                            required: 'Address is required',
                                                            minLength: { value: 10, message: 'Please provide detailed address' }
                                                        })}
                                                        className={`textarea textarea-bordered w-full ${errors.senderAddress ? 'textarea-error' : ''}`}
                                                        rows="3"
                                                        placeholder="House/Apartment, Road, Area"
                                                    />
                                                    {errors.senderAddress && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderAddress.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Sender District - FIXED DUPLICATE KEYS */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-primary" />
                                                            District
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register('senderDistrict', {
                                                            required: 'District is required'
                                                        })}
                                                        className={`select select-bordered w-full ${errors.senderDistrict ? 'select-error' : ''}`}
                                                    >
                                                        <option value="">Select District</option>
                                                        {districts.map((district, index) => (
                                                            // Using index to ensure unique keys
                                                            <option key={`sender-district-${index}`} value={district}>
                                                                {district}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.senderDistrict && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderDistrict.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Pickup Location */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-primary" />
                                                            Pickup Location
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('senderPickupLocation', {
                                                            required: 'Pickup location is required'
                                                        })}
                                                        className={`input input-bordered w-full ${errors.senderPickupLocation ? 'input-error' : ''}`}
                                                        placeholder="Office, Home, Shop"
                                                    />
                                                    {errors.senderPickupLocation && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.senderPickupLocation.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Pickup Instructions */}
                                                <div className="form-control md:col-span-2">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaClipboardList className="text-primary" />
                                                            Special Instructions (Optional)
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        {...register('senderInstructions')}
                                                        className="textarea textarea-bordered w-full"
                                                        rows="2"
                                                        placeholder="e.g., Call before coming, Ring bell twice, Leave with security"
                                                    />
                                                </div>
                                            </div>

                                            {/* Delivery Schedule */}
                                            <div className="bg-base-200 rounded-xl p-6">
                                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                    <FaClock className="text-primary" />
                                                    Preferred Pickup Schedule
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Pickup Date */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-semibold flex items-center gap-2">
                                                                <FaCalendarAlt className="text-primary" />
                                                                Pickup Date
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            {...register('deliveryDate', {
                                                                required: 'Pickup date is required'
                                                            })}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className={`input input-bordered w-full ${errors.deliveryDate ? 'input-error' : ''}`}
                                                        />
                                                    </div>
                                                    {/* Time Slot */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-semibold flex items-center gap-2">
                                                                <FaClock className="text-primary" />
                                                                Preferred Time
                                                            </span>
                                                        </label>
                                                        <select
                                                            {...register('deliveryTime', {
                                                                required: 'Time is required'
                                                            })}
                                                            className={`select select-bordered w-full ${errors.deliveryTime ? 'select-error' : ''}`}
                                                        >
                                                            <option value="">Select Time Slot</option>
                                                            <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                                                            <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                                                            <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                                                            <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: RECEIVER DETAILS */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-primary mb-2">
                                                    Receiver Details
                                                </h2>
                                                <p className="text-base-content/70">
                                                    Where should we deliver to?
                                                </p>
                                            </div>

                                            {/* Copy Sender Info Button */}
                                            <div className="alert bg-primary/10 border-primary/20">
                                                <FaInfoCircle className="text-primary" />
                                                <div className="flex-1">
                                                    <span className="text-sm">
                                                        Receiver details same as sender?
                                                        <button
                                                            type="button"
                                                            onClick={copySenderToReceiver}
                                                            className="btn btn-sm btn-primary text-black ml-3"
                                                        >
                                                            Copy Sender Info
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Receiver Name */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaUser className="text-primary" />
                                                            Receiver Name
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('receiverName', {
                                                            required: 'Receiver name is required',
                                                            minLength: { value: 3, message: 'Minimum 3 characters' }
                                                        })}
                                                        className={`input input-bordered w-full ${errors.receiverName ? 'input-error' : ''}`}
                                                        placeholder="nijer Gf/bf er name likhen vondo"
                                                    />
                                                    {errors.receiverName && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverName.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Receiver Phone */}
                                                <div className="form-control relative">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaPhone className="text-primary" />
                                                            Receiver Phone
                                                        </span>
                                                    </label>
                                                    <div className="absolute left-3 top-11 transform -translate-y-1/2 text-gray-400 z-10">
                                                        +880
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        {...register('receiverPhone', {
                                                            required: 'Receiver phone is required',
                                                            pattern: {
                                                                value: /^[0-9]{11}$/,
                                                                message: 'Must be 11 digits starting with 01'
                                                            }
                                                        })}
                                                        className={`input pl-16 input-bordered w-full ${errors.receiverPhone ? 'input-error' : ''}`}
                                                        placeholder="01XXXXXXXXX"
                                                        maxLength={11}
                                                    />
                                                    {errors.receiverPhone && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverPhone.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* receiver email */}
                                                <div className="form-control ">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaEnvelope className="text-primary" />
                                                            Receiver Email
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="email"
                                                        {...register('receiverEmail', {
                                                            required: 'Receiver Email is required',
                                                            pattern: {
                                                                value: /^\S+@\S+\.\S+$/,
                                                                message: 'Must be include a valid email'
                                                            }
                                                        })}
                                                        className={`input input-bordered  w-full ${errors.receiverPhone ? 'input-error' : ''}`}
                                                        placeholder="example@gmail.com"

                                                    />
                                                    {errors.receiverEmail && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverEmail.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Receiver Address */}
                                                <div className="form-control md:col-span-2">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaHome className="text-primary" />
                                                            Receiver Address
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        {...register('receiverAddress', {
                                                            required: 'Receiver address is required',
                                                            minLength: { value: 10, message: 'Please provide detailed address' }
                                                        })}
                                                        className={`textarea textarea-bordered w-full ${errors.receiverAddress ? 'textarea-error' : ''}`}
                                                        rows="3"
                                                        placeholder="nijer premik/premikar er address janen na? chi chi lojja lojja"
                                                    />
                                                    {errors.receiverAddress && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverAddress.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Receiver District - FIXED DUPLICATE KEYS */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-primary" />
                                                            Receiver District
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register('receiverDistrict', {
                                                            required: 'Receiver district is required'
                                                        })}
                                                        className={`select select-bordered w-full ${errors.receiverDistrict ? 'select-error' : ''}`}
                                                    >
                                                        <option value="">Select District</option>
                                                        {districts.map((district, index) => (
                                                            // Using index to ensure unique keys
                                                            <option key={`receiver-district-${index}`} value={district}>
                                                                {district}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.receiverDistrict && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverDistrict.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Delivery Location */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-primary" />
                                                            Delivery Location
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('receiverDeliveryLocation', {
                                                            required: 'Delivery location is required'
                                                        })}
                                                        className={`input input-bordered w-full ${errors.receiverDeliveryLocation ? 'input-error' : ''}`}
                                                        placeholder="Office, Home, Shop, sabdhan! ekbar shashuri jodi butte pare chadu khbr ase tmr"
                                                    />
                                                    {errors.receiverDeliveryLocation && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.receiverDeliveryLocation.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Receiver Instructions */}
                                                <div className="form-control md:col-span-2">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <FaClipboardList className="text-primary" />
                                                            Delivery Instructions (Optional)
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        {...register('receiverInstructions')}
                                                        className="textarea textarea-bordered w-full"
                                                        rows="2"
                                                        placeholder="gift pathao valo kotha, delivary man re instruction thik moto dio na hoy tmr shashurir mair to tumi khaba na vondo, tmr premik/premika khabe"
                                                    />
                                                </div>
                                            </div>

                                            {/* Additional Options */}
                                            <div className="bg-base-200 rounded-xl p-6">
                                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                    <FaShieldAlt className="text-primary" />
                                                    Additional Options
                                                </h3>
                                                <div className="space-y-4">
                                                    {/* Insurance Option */}
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            {...register('insurance')}
                                                            className="checkbox checkbox-primary"
                                                        />
                                                        <div>
                                                            <span className="font-semibold">Add Insurance Coverage (+৳50)</span>
                                                            <p className="text-sm text-base-content/70">
                                                                Protect your parcel against loss or damage up to ৳5000
                                                            </p>
                                                        </div>
                                                    </label>

                                                    {/* Payment Method */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-semibold flex items-center gap-2">
                                                                <FaCreditCard className="text-primary" />
                                                                Payment Method
                                                            </span>
                                                        </label>
                                                        <div className="flex flex-wrap gap-4">
                                                            {['cash', 'card', 'mobile_banking'].map((method) => (
                                                                <label key={method} className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        {...register('paymentMethod')}
                                                                        value={method}
                                                                        className="radio radio-primary"
                                                                    />
                                                                    <span className="capitalize">{method.replace('_', ' ')}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Final Price Summary with Delivery Charge Breakdown */}
                                            <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                                                <h3 className="font-bold text-lg mb-4">Final Price Summary</h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Parcel Type</span>
                                                        <span className="font-semibold">
                                                            {parcelType === 'document' ? 'Document' : 'Non-Document'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Weight</span>
                                                        <span className="font-semibold">{watchWeight || 0} kg</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Delivery Charge</span>
                                                        <span className="font-semibold">
                                                            ৳{getDeliveryCharge()}
                                                            <span className="text-xs ml-2 text-base-content/50">
                                                                ({watchReceiverDistrict ? (isDhakaDistrict(watchReceiverDistrict) ? 'Inside Dhaka' : 'Outside Dhaka') : 'Select district'})
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Insurance</span>
                                                        <span className="font-semibold">
                                                            {watchInsurance ? 'Yes (+৳50)' : 'No'}
                                                        </span>
                                                    </div>
                                                    <div className="divider my-2"></div>
                                                    <div className="flex justify-between text-xl font-bold text-primary">
                                                        <span>Total Amount</span>
                                                        <span>৳{calculatePrice()}</span>
                                                    </div>
                                                    <p className="text-sm text-base-content/70 mt-2">
                                                        *Payment to be collected at pickup
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-10 pt-6 border-t border-base-300">
                                    {/* Previous Button */}
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="btn btn-outline"
                                    >
                                        Previous
                                    </button>

                                    {/* Next/Submit Button */}
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="btn btn-primary text-black"
                                        >
                                            Next Step
                                            <FaArrowRight className="ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-success"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="loading loading-spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="mr-2" />
                                                    Submit Parcel Request
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            /* SUCCESS SCREEN */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                {/* Success Icon */}
                                <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheckCircle className="text-success text-5xl" />
                                </div>

                                {/* Success Message */}
                                <h2 className="text-3xl font-bold text-success mb-4">
                                    Parcel Request Submitted!
                                </h2>
                                <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
                                    Your parcel has been scheduled for pickup. Our delivery executive will contact you soon,
                                    <span className="block italic mt-2">(রাখাল বাজায় বাঁশি, জান পাখি, তোমাকে আমি ভালোবাসি)</span>
                                </p>

                                {/* Tracking Information Card */}
                                <div className="card bg-base-200 max-w-md mx-auto mb-8">
                                    <div className="card-body">
                                        <h3 className="card-title justify-center mb-4">
                                            Tracking Information
                                        </h3>
                                        <div className="space-y-3">
                                            {/* Tracking ID with Copy Button */}
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">Tracking ID:</span>
                                                <div className="flex items-center gap-2">
                                                    <code className="font-mono text-primary font-bold">
                                                        {submittedData.trackingId}
                                                    </code>
                                                    <button
                                                        onClick={copyTrackingId}
                                                        className="btn btn-xs btn-ghost"
                                                        title="Copy Tracking ID"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Submitted Time (UTC Format) */}
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Submitted At (UTC):</span>
                                                <span className="text-sm font-mono">
                                                    {new Date(submittedData.submittedAt).toUTCString()}
                                                </span>
                                            </div>

                                            {/* Delivery Charge */}
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Delivery Charge:</span>
                                                <span className="font-semibold">
                                                    ৳{getDeliveryCharge()}
                                                    <span className="text-xs ml-2 text-base-content/50">
                                                        ({isDhakaDistrict(submittedData.receiverDistrict) ? 'Inside Dhaka' : 'Outside Dhaka'})
                                                    </span>
                                                </span>
                                            </div>

                                            {/* Total Amount */}
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Total Amount:</span>
                                                <span className="font-bold text-success">৳{submittedData.price}</span>
                                            </div>

                                            {/* Status */}
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Status:</span>
                                                <span className="badge text-black badge-primary">Pending Pickup</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="btn btn-outline">
                                        Download Receipt
                                    </button>
                                    <button className="btn btn-primary text-black">
                                        Track This Parcel
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="btn btn-ghost"
                                    >
                                        Send Another Parcel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
                >
                    {[
                        {
                            icon: FaShieldAlt,
                            title: 'Safe & Secure',
                            desc: 'All parcels are insured and tracked'
                        },
                        {
                            icon: FaClock,
                            title: 'Fast Delivery',
                            desc: 'Same-day pickup & next-day delivery'
                        },
                        {
                            icon: FaTruck,
                            title: 'Nationwide Coverage',
                            desc: 'Service available in all 64 districts'
                        }
                    ].map((feature, index) => (
                        <div key={index} className="card bg-base-100 border border-base-300">
                            <div className="card-body items-center text-center">
                                <feature.icon className="text-3xl text-primary mb-3" />
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="text-base-content/70">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SendParcel;