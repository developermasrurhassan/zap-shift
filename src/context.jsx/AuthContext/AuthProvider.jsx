import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { auth } from "../../Pages/Authentication/firebase/firebase.init";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    //social signin provider
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
        prompt: "select_account",
    });
    //signup user with email and password
    const createUser = async (email, password) => {
        setLoading(true);
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    //signin user with email and password
    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUserProfile = profileInfo => {
        return updateProfile(auth.currentUser, profileInfo);
    }
    //social signin
    const signinWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }

    //logout
    const logOut = () => {
        setLoading(true)
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => { unSubscribe(); }


    }, []);

    //user info for use on others components
    const authInfo = {
        user,
        loading,
        signinWithGoogle,
        createUser,
        signInUser,
        updateUserProfile,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider >
    );
};

export default AuthProvider;