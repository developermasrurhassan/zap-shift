// src/Hooks/useUserRole.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import UseAxiosSecure from './UseAxiosSecure';

const useUserRole = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['user-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                console.log('🔍 [useUserRole] Fetching user data for:', user.email);

                let userFromDb = null;
                let userRole = 'user';

                try {
                    const userRes = await axiosSecure.get(`/user`);
                    userFromDb = userRes.data?.data || null;
                    userRole = userFromDb?.role || 'user';
                    console.log('✅ [useUserRole] User data fetched. Role from DB:', userRole);
                } catch (profileError) {
                    console.log('⚠️ [useUserRole] User not found in DB:', profileError.message);

                    // Create user if not exists
                    try {
                        const newUser = {
                            uid: user.uid,
                            email: user.email,
                            name: user.displayName || user.email?.split('@')[0] || 'User',
                            photoURL: user.photoURL || null,
                            role: 'user',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };

                        const createRes = await axiosSecure.post('/users', newUser);

                        if (createRes.data?.success) {
                            userFromDb = createRes.data.data;
                            userRole = userFromDb?.role || 'user';
                            console.log('✅ [useUserRole] User created with role:', userRole);
                        }
                    } catch (createError) {
                        console.error('❌ Failed to create user:', createError);
                    }
                }

                // CRITICAL FIX: Only check rider application if user is NOT admin
                let riderDetails = null;
                let isActiveRider = false;

                // Only fetch rider application if user is not an admin
                if (userRole !== 'admin') {
                    try {
                        const riderRes = await axiosSecure.get(`/riders/my-application`);
                        riderDetails = riderRes.data?.data || null;

                        if (riderDetails) {
                            console.log('✅ [useUserRole] Rider application found:', riderDetails.status);
                            isActiveRider = riderDetails.status === 'active';

                            // If rider is active, override the role to 'rider'
                            if (isActiveRider) {
                                console.log('⚠️ [useUserRole] User is active rider. Setting role to rider');
                                userRole = 'rider';

                                // Update userFromDb role for consistency
                                if (userFromDb) {
                                    userFromDb.role = 'rider';
                                }
                            }
                        } else {
                            // If no rider application, make sure role is not rider
                            if (userRole === 'rider') {
                                console.log('⚠️ [useUserRole] User has rider role but no active application. Resetting...');
                                userRole = 'user';
                                if (userFromDb) {
                                    userFromDb.role = 'user';
                                }
                            }
                        }
                    } catch (riderError) {
                        console.log('ℹ️ [useUserRole] No rider application found');
                    }
                } else {
                    console.log('👑 [useUserRole] User is admin, skipping rider check');
                }

                // Final role determination
                const finalRole = userRole;
                console.log('🎯 [useUserRole] Final role:', finalRole, 'Is active rider:', isActiveRider);

                return {
                    role: finalRole,
                    ...userFromDb,
                    // Only include riderDetails if user is actually a rider
                    riderDetails: userRole === 'rider' ? riderDetails : null,
                    email: user.email,
                    uid: user.uid,
                    name: userFromDb?.name || user.displayName || user.email?.split('@')[0] || 'User',
                    photoURL: userFromDb?.photoURL || user.photoURL || null,
                    isActiveRider: userRole === 'rider' ? isActiveRider : false
                };
            } catch (error) {
                console.error('❌ Error in role fetch:', error);
                return {
                    role: 'user',
                    email: user.email,
                    uid: user.uid,
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    photoURL: user.photoURL || null,
                    isActiveRider: false
                };
            }
        },
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    // Determine if user is rider based on the final role from userData
    const isRider = userData?.role === 'rider';
    const isAdmin = userData?.role === 'admin';
    const isUser = !isAdmin && !isRider;

    console.log('📊 [useUserRole] Return values:', {
        role: userData?.role,
        isRider,
        isAdmin,
        isUser,
        isActiveRider: userData?.isActiveRider
    });

    return {
        userData,
        role: userData?.role || 'user',
        isLoading,
        isAdmin,
        isRider,
        isUser,
        riderDetails: userData?.riderDetails,
        isActiveRider: userData?.isActiveRider || false,
        name: userData?.name || user?.displayName || user?.email?.split('@')[0] || 'User',
        email: userData?.email || user?.email,
        photoURL: userData?.photoURL || user?.photoURL,
        refetch
    };
};

export default useUserRole;