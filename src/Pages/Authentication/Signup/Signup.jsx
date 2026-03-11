import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
import { FaTimesCircle } from "react-icons/fa";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa6";
import axios from "axios";
import useAxios from "../../../Hooks/useAxios";
import { auth } from '../../../Pages/Authentication/firebase/firebase.init';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupError, setSignupError] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const password = watch("password", "");

    const onSubmit = async (data) => {
        console.log("Form data:", data);
        setSignupError("");

        // 🔴 Validate image is uploaded - prevents submission without picture
        if (!profilePic) {
            setSignupError("Please upload a profile picture");
            return; // Function stops here, no API call is made
        }

        try {
            // 1. Create user in Firebase Auth
            console.log("Creating Firebase user...");
            const result = await createUser(data.email, data.password);
            const user = result.user;
            console.log("✅ Firebase user created:", user.uid);

            // 2. Update Firebase Auth profile with displayName and photoURL
            console.log("Updating Firebase profile...");
            await updateUserProfile({
                displayName: data.name,
                photoURL: profilePic
            });
            console.log("✅ Firebase profile updated");

            // Get the updated user after profile update
            const updatedUser = auth.currentUser;

            // 3. Save user to your backend database
            const userInfo = {
                uid: updatedUser.uid,
                name: data.name,
                email: data.email,
                photoURL: profilePic,
                role: 'user',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            console.log('📤 Saving user to database:', userInfo);

            const userResponse = await axiosInstance.post('/users', userInfo);
            console.log("✅ User saved to database:", userResponse.data);

            // 4. Navigate to signin
            navigate("/signin");

        } catch (error) {
            console.error("❌ Signup Error:", error);

            // Better error messages
            if (error.code === 'auth/email-already-in-use') {
                setSignupError("Email already in use. Please use a different email.");
            } else if (error.code === 'auth/weak-password') {
                setSignupError("Password is too weak. Please use at least 6 characters.");
            } else if (error.code === 'auth/invalid-email') {
                setSignupError("Invalid email address format.");
            } else if (error.response?.status === 400) {
                setSignupError(error.response?.data?.message || "Bad request. Please check your input data.");
            } else {
                setSignupError(error.message || "Signup failed. Please try again.");
            }
        }
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        console.log("Selected image:", image);

        // Check file size (max 2MB)
        if (image.size > 2 * 1024 * 1024) {
            setSignupError("Image size should be less than 2MB");
            return;
        }

        // Check file type
        if (!image.type.startsWith('image/')) {
            setSignupError("Please upload an image file");
            return;
        }

        // Check if API key is available
        const apiKey = import.meta.env.VITE_IMAGEBB_API_KEY;
        console.log("ImageBB API Key loaded:", !!apiKey);

        if (!apiKey) {
            setSignupError("Image upload service is not configured properly.");
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const imageUrl = res.data.data.url;
            console.log("✅ Image uploaded successfully:", imageUrl);
            setProfilePic(imageUrl);
            setSignupError(""); // Clear any previous errors

        } catch (error) {
            console.error("❌ Image upload failed:", error);
            if (error.response?.data?.error?.message) {
                setSignupError(`Image upload failed: ${error.response.data.error.message}`);
            } else {
                setSignupError("Failed to upload image. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="card w-full max-w-md">
                <div className="card-body">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-primary mb-2">
                            Create Account
                        </h2>
                        <p className="text-base-content/70">
                            Join our community today
                        </p>
                    </div>

                    {/* Error Message */}
                    {signupError && (
                        <div className="alert alert-error mb-6">
                            <FaTimesCircle />
                            <span>{signupError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Picture Field - NO REACT-HOOK-FORM VALIDATION */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Profile Picture *</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 z-10 top-1/2 transform -translate-y-1/2 group-focus-within:text-primary transition-colors">
                                    <FaUser />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="input input-bordered w-full pl-10 transition-all focus:border-primary"
                                />
                            </div>

                            {/* Image Preview - Only shows when uploaded */}
                            {profilePic ? (
                                <div className="mt-2">
                                    <img
                                        src={profilePic}
                                        alt="Profile preview"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                    />
                                    <p className="text-xs text-success mt-1">✓ Image uploaded successfully</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">Upload a profile picture (required)</p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    className={`input input-bordered w-full pl-10 transition-all ${errors.name ? 'input-error' : 'focus:border-primary'}`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.name.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email Address</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className={`input input-bordered w-full pl-10 transition-all ${errors.email ? 'input-error' : 'focus:border-primary'}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className={`input input-bordered w-full pl-10 pr-10 transition-all ${errors.password ? 'input-error' : 'focus:border-primary'}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-error text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Confirm Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    className={`input input-bordered w-full pl-10 pr-10 transition-all ${errors.confirmPassword ? 'input-error' : 'focus:border-primary'}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-3 p-0">
                                <input
                                    type="checkbox"
                                    {...register('terms', { required: 'You must accept the terms' })}
                                    className="checkbox checkbox-primary"
                                />
                                <span className="label-text">
                                    I agree to the <Link to="/terms" className="link link-primary hover:underline">Terms & Conditions</Link>
                                </span>
                            </label>
                            {errors.terms && (
                                <label className="label p-0">
                                    <span className="label-text-alt text-error">{errors.terms.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full text-black hover:text-primary hover:bg-transparent hover:border-primary border-2 transition-all duration-300 transform hover:-translate-y-1 rounded-full py-4 text-lg font-semibold"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="loading loading-spinner"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider my-8">OR</div>

                    <div>
                        <SocialLogin />
                    </div>

                    {/* Login Link */}
                    <div className="text-center mt-8 space-y-2">
                        <p className="text-base-content/70">
                            Already have an account?{' '}
                            <Link to="/signin" className="link link-primary font-semibold hover:underline">
                                Signin here
                            </Link>
                        </p>
                        <p>
                            <Link to="/forgot-password" className="link link-hover text-sm text-base-content/70">
                                Forgot Password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;