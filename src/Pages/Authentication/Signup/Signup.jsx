import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
import { FaTimesCircle } from "react-icons/fa";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa6";

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const { createUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/incompatible-library
    const password = watch("password", "");

    const onSubmit = async (data) => {
        console.log(data);
        setSignupError("");

        try {
            const result = await createUser(data.email, data.password);
            const user = result.user;
            console.log("User created:", user);
            navigate("/signin");

            // Optional: Add user display name
            // await updateProfile(user, { displayName: data.name });

        } catch (error) {
            console.log("Error:", error.message);
            setSignupError(error.message);
        }
    };



    // Password validation checks


    return (
        <div className=" flex items-center justify-center p-4">
            <div className="card w-full max-w-md ">
                <div className="card-body ">
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
                                            message: 'Name must be at least 4 characters'
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: 'Name should contain only letters'
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
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: 'Password should contain at least one lowercase letter, one uppercase letter, one number, and one special character'
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

                        </div>

                        {
                            errors.password && (
                                <p className="text-error">
                                    {errors.password.message}
                                </p>
                            )
                        }

                        {errors.confirmPassword && (
                            <p className="text-error">
                                {errors.confirmPassword.message}
                            </p>
                        )}

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