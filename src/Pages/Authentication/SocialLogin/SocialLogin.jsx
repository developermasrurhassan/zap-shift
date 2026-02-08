import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import UseAxios from '../../../Hooks/UseAxios';

const SocialLogin = () => {
    const { signinWithGoogle } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const form = location.state?.from || "/"
    const axiosInstance = UseAxios();



    const handleGoogleSignin = () => {
        signinWithGoogle()
            .then(async (result) => {
                const user = result.user;
                console.log("✅ Google user object:", user); // Check what properties exist

                const userInfo = {
                    uid: user.uid,
                    name: user.displayName || 'Google User', // ✅ Use displayName, not name
                    email: user.email,
                    photoURL: user.photoURL || '', // ✅ Add photoURL if available
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };

                console.log("📤 Sending to backend:", userInfo);

                try {
                    const res = await axiosInstance.post('/users', userInfo);
                    console.log("✅ Backend response:", res.data);
                    navigate(form);
                } catch (error) {
                    console.error("❌ Backend error:", error.response?.data || error.message);
                    // Handle specific backend errors
                    if (error.response?.status === 400 &&
                        error.response?.data?.message?.includes('already exists')) {
                        // User exists, just log them in
                        navigate(form);
                    }
                }
            })
            .catch(error => {
                console.error("❌ Google signin error:", error.message);
            });
    };
    return (
        <div>
            {/* Google Sign In */}
            <button
                onClick={handleGoogleSignin}
                className="btn btn-outline w-full border-2 border-black hover:border-primary text-black hover:bg-primary   transition-all duration-300 transform hover:-translate-y-1 rounded-full py-4"
            >
                <FaGoogle className="mr-3" />
                Continue with Google
            </button>
        </div>
    );
};

export default SocialLogin;