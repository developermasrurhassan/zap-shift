import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import UseAxiosSecure from './UseAxiosSecure';


const useUserRole = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: role, isLoading, refetch } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/users/role?email=${user.email}`);
                return res.data.role || 'user';
            } catch (error) {
                console.error('Error fetching role:', error);
                return 'user';
            }
        }
    });

    return {
        role,
        isLoading,
        isAdmin: role === 'admin',
        isRider: role === 'rider',
        isUser: role === 'user',
        refetch
    };
};

export default useUserRole;