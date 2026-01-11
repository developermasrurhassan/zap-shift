import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { auth } from "../../Pages/Authentication/firebase/firebase.init";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    //social signin provider
    const googleProvider = new GoogleAuthProvider();
    //signup user with email and password
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }

    //signin user with email and password
    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }

    //social signin
    const signinWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }

    //logout
    const logOut = () => {
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
        logOut,
        names: 'masrur',
        profession: 'web developer'
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext >
    );
};

export default AuthProvider;