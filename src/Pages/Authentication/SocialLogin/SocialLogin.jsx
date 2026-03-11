import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import useAuth from '../../../Hooks/useAuth';
import useAxios from '../../../Hooks/useAxios';

const SocialLogin = () => {
    const { signinWithGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/dashboard";
    const axiosInstance = useAxios();

    const handleGoogleSignin = async () => {
        try {
            const result = await signinWithGoogle();
            const user = result.user;

            console.log("✅ Google user data:", {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            });

            // Prepare user info for database
            const userInfo = {
                uid: user.uid,
                name: user.displayName || 'Google User',
                email: user.email,
                photoURL: user.photoURL || '',
                role: 'user',
                emailVerified: user.emailVerified,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            console.log("📤 Sending to backend:", userInfo);

            try {
                // Try to create new user
                const res = await axiosInstance.post('/users', userInfo);
                console.log("✅ New user created in database:", res.data);
                toast.success('Account created successfully!');
                navigate(from, { replace: true });

            } catch (postError) {
                console.error("❌ POST error:", postError.response?.data || postError.message);

                // If user already exists (400 error), UPDATE their information
                if (postError.response?.status === 400 &&
                    postError.response?.data?.message?.includes('already exists')) {

                    try {
                        // Update existing user's information
                        const updateRes = await axiosInstance.patch(`/users/${user.uid}`, {
                            lastLogin: new Date().toISOString(),
                            photoURL: user.photoURL, // Update photoURL (important for Google users)
                            name: user.displayName,   // Update name in case it changed
                            emailVerified: user.emailVerified
                        });

                        console.log("✅ Existing user updated:", updateRes.data);
                        toast.success('Welcome back!');
                        navigate(from, { replace: true });

                    } catch (updateError) {
                        console.error("❌ Failed to update existing user:", updateError);
                        toast.error('Login successful but failed to update profile');
                        navigate(from, { replace: true }); // Still navigate even if update fails
                    }

                } else {
                    // Handle other errors
                    toast.error(postError.response?.data?.message || 'Login failed');
                }
            }

        } catch (error) {
            console.error("❌ Google signin error:", error);

            // Handle specific Firebase errors
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in popup was closed');
            } else if (error.code === 'auth/cancelled-popup-request') {
                // Ignore - user just cancelled
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error('An account already exists with the same email address but different sign-in credentials.');
            } else {
                toast.error(error.message || 'Failed to sign in with Google');
            }
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleGoogleSignin}
                className="btn btn-outline w-full border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-white hover:bg-primary transition-all duration-300 transform hover:-translate-y-1 rounded-full py-4 flex items-center justify-center gap-3"
            >
                <FaGoogle className="text-lg" />
                <span>Continue with Google</span>
            </button>
        </div>
    );
};

export default SocialLogin;