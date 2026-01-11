import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, } from "react-router";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";

const Signin = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { signInUser } = useAuth(); // Assuming you have signInUser method in useAuth
    const [showPassword, setShowPassword] = useState(false);
    const [signinError, setSigninError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const form = location.state?.from || "/";

    const onSubmit = async (data) => {
        console.log(data);
        setSigninError("");

        try {
            const result = await signInUser(data.email, data.password);
            const user = result.user;
            console.log("User created:", user)
            navigate(form);
            console.log("Signin location state:", location.state);
            console.log("Redirecting to:", form);
            // Optional: Add user display name
            // await updateProfile(user, { displayName: data.name });

        } catch (error) {
            console.log("Error:", error.message);
            setSigninError(error.message);
        }
    };
















    return (
        <div className="flex items-center justify-center p-4">
            <div className="card w-full max-w-md">
                <div className="card-body">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-primary mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-base-content/70">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {signinError && (
                        <div className="alert alert-error mb-6">
                            <FaTimesCircle />
                            <span>{signinError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                        required: 'Password is required'
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
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="label cursor-pointer justify-start gap-3 p-0">
                                <input
                                    type="checkbox"
                                    {...register('rememberMe')}
                                    className="checkbox checkbox-primary checkbox-sm"
                                />
                                <span className="label-text text-sm">
                                    Remember me
                                </span>
                            </label>

                            <Link to="/forgot-password" className="link link-primary text-sm hover:underline">
                                Forgot Password?
                            </Link>
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
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider my-8">OR</div>

                    {/* Social Login */}
                    <div>
                        <SocialLogin />
                    </div>

                    {/* Signup Link */}
                    <div className="text-center mt-8 space-y-2">
                        <p className="text-base-content/70">
                            Don't have an account?{' '}
                            <Link to="/signup" className="link link-primary font-semibold hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Signin;