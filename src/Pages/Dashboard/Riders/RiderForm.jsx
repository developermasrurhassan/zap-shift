import { useEffect } from 'react';
import { Link } from 'react-router';
import useRider from '../../../Hooks/useRider';
import formIllustration from '../../../assets/other/agent-pending.png';

const RiderForm = () => {
    const {
        register,
        handleSubmit,
        errors,
        submissionError,
        onSubmit,
        isLoading,
        regions,
        districts,
        bikeBrands,
        selectedRegion,
        userName,
        userEmail,
        userPhone,
        setValue // Add this
    } = useRider();

    // Set user data on component mount
    useEffect(() => {
        if (userName) {
            setValue('name', userName);
        }
        if (userEmail) {
            setValue('email', userEmail);
        }
        if (userPhone) {
            setValue('phoneNumber', userPhone);
        }
    }, [userName, userEmail, userPhone, setValue]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6 ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Be a Rider</h1>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                        From personal packages to business shipments—we deliver on time, every time.
                    </p>
                    <Link to="/dashboard" className="btn btn-ghost mt-4">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="lg:flex">
                        {/* Left: Form (60%) */}
                        <div className="lg:w-3/5 p-6 lg:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Tell us about yourself.
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Personal Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Your Name *</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name', {
                                                required: 'Name is required',
                                                minLength: { value: 3, message: 'Minimum 3 characters' }
                                            })}
                                            defaultValue={userName}
                                            readOnly={!!userName}
                                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''} ${userName ? 'bg-gray-100' : ''}`}
                                        />
                                        {errors.name && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.name.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Driving License Number *</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('drivingLicense', {
                                                required: 'Driving license is required',
                                                pattern: {
                                                    value: /^[A-Z0-9\-\s]+$/,
                                                    message: 'Invalid license format'
                                                }
                                            })}
                                            placeholder="BD-123456789"
                                            className={`input input-bordered w-full ${errors.drivingLicense ? 'input-error' : ''}`}
                                        />
                                        {errors.drivingLicense && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.drivingLicense.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Email *</span>
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            defaultValue={userEmail}
                                            readOnly={!!userEmail}
                                            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''} ${userEmail ? 'bg-gray-100' : ''}`}
                                        />
                                        {errors.email && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.email.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Phone Number *</span>
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('phoneNumber', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^01[3-9]\d{8}$/,
                                                    message: 'Invalid Bangladeshi phone number (01XXXXXXXXX)'
                                                }
                                            })}
                                            defaultValue={userPhone}
                                            placeholder="01XXXXXXXXX"
                                            className={`input input-bordered w-full ${errors.phoneNumber ? 'input-error' : ''}`}
                                        />
                                        {errors.phoneNumber && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.phoneNumber.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Region *</span>
                                        </label>
                                        <select
                                            {...register('region', { required: 'Region is required' })}
                                            className={`select select-bordered w-full ${errors.region ? 'select-error' : ''}`}
                                        >
                                            <option value="">Select Region</option>
                                            {regions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        {errors.region && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.region.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">District *</span>
                                        </label>
                                        <select
                                            {...register('district', { required: 'District is required' })}
                                            disabled={!selectedRegion}
                                            className={`select select-bordered w-full ${errors.district ? 'select-error' : ''} ${!selectedRegion ? 'bg-gray-100' : ''}`}
                                        >
                                            <option value="">
                                                {selectedRegion ? 'Select District' : 'First select a region'}
                                            </option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                        {errors.district && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.district.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* NID */}
                                <div className="mb-6">
                                    <label className="label">
                                        <span className="label-text font-medium">NID No. *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('nid', {
                                            required: 'NID is required',
                                            pattern: {
                                                value: /^\d{10,17}$/,
                                                message: '10-17 digit NID required'
                                            }
                                        })}
                                        placeholder="Enter your National ID number"
                                        className={`input input-bordered w-full ${errors.nid ? 'input-error' : ''}`}
                                    />
                                    {errors.nid && (
                                        <label className="label">
                                            <span className="label-text-alt text-red-500">{errors.nid.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Bike Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Bike Brand *</span>
                                        </label>
                                        <select
                                            {...register('bikeBrand', { required: 'Bike brand is required' })}
                                            className={`select select-bordered w-full ${errors.bikeBrand ? 'select-error' : ''}`}
                                        >
                                            <option value="">Select Brand</option>
                                            {bikeBrands.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                        {errors.bikeBrand && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.bikeBrand.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium">Bike Model & Year *</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('bikeModel', {
                                                required: 'Model & year is required',
                                                minLength: { value: 3, message: 'Minimum 3 characters' }
                                            })}
                                            placeholder="e.g., Honda CB Shine 150 2022"
                                            className={`input input-bordered w-full ${errors.bikeModel ? 'input-error' : ''}`}
                                        />
                                        {errors.bikeModel && (
                                            <label className="label">
                                                <span className="label-text-alt text-red-500">{errors.bikeModel.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Registration */}
                                <div className="mb-6">
                                    <label className="label">
                                        <span className="label-text font-medium">Bike Registration Number *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('bikeRegistration', {
                                            required: 'Registration number is required',
                                            pattern: {
                                                value: /^[A-Z]{3,10}-[A-Z]{5}-[A-Z]{2,4}-\d{2}-\d{4}$/i,
                                                message: 'Format: DHAKA-METRO-GA-11-1234'
                                            }
                                        })}
                                        placeholder="DHAKA-METRO-GA-11-1234"
                                        className={`input input-bordered w-full ${errors.bikeRegistration ? 'input-error' : ''}`}
                                    />
                                    {errors.bikeRegistration && (
                                        <label className="label">
                                            <span className="label-text-alt text-red-500">{errors.bikeRegistration.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* About */}
                                <div className="mb-8">
                                    <label className="label">
                                        <span className="label-text font-medium">Tell Us About Yourself *</span>
                                    </label>
                                    <textarea
                                        {...register('about', {
                                            required: 'Please tell us about yourself',
                                            minLength: { value: 50, message: 'Minimum 50 characters' },
                                            maxLength: { value: 500, message: 'Maximum 500 characters' }
                                        })}
                                        rows="4"
                                        placeholder="Share your riding experience, why you want to join, etc."
                                        className={`textarea textarea-bordered w-full ${errors.about ? 'textarea-error' : ''}`}
                                    />
                                    {errors.about && (
                                        <label className="label">
                                            <span className="label-text-alt text-red-500">{errors.about.message}</span>
                                        </label>
                                    )}
                                    <div className="label-text-alt text-gray-500 mt-1">
                                        50-500 characters recommended
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn btn-primary text-black w-full py-3 text-lg ${isLoading ? 'loading' : ''}`}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Application'}
                                </button>
                                {submissionError && <p className="text-red-500 mt-2">{submissionError}</p>}
                            </form>
                        </div>

                        {/* Right: Illustration (40%) */}
                        <div className="lg:w-2/5 bg-linear-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-8xl mb-6">
                                    <img src={formIllustration} alt="Rider Illustration" className="w-full h-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    Join Our Rider Team
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Earn flexible income, set your own schedule, and be part of Bangladesh's fastest growing delivery network.
                                </p>

                                <div className="space-y-4 text-left">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-3 text-xl">✓</span>
                                        <span>Flexible working hours</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-3 text-xl">✓</span>
                                        <span>Weekly payments</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-3 text-xl">✓</span>
                                        <span>24/7 support</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-3 text-xl">✓</span>
                                        <span>Insurance coverage</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-white rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Valid driving license</li>
                                        <li>• National ID card</li>
                                        <li>• Own motorcycle</li>
                                        <li>• Smartphone with internet</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderForm;