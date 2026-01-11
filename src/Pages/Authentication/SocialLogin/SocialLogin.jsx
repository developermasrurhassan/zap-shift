import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';

const SocialLogin = () => {
    const { signinWithGoogle } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const form = location.state?.from || "/"



    const handleGoogleSignin = () => {

        signinWithGoogle()
            .then(result => {
                const user = result.user;
                console.log(user);
                navigate(form);
                console.log("Signin location state:", location.state);
                console.log("Redirecting to:", form);
            })
            .catch(error => {
                console.log(error);
            });
    }
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