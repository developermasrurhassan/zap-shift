import { Link } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="card bg-white shadow-2xl p-8 md:p-12 text-center max-w-md w-full">
                <div className="text-7xl text-error mb-4 flex justify-center">
                    <FaExclamationTriangle />
                </div>
                <h1 className="text-5xl font-bold text-error mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Forbidden</h2>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page.
                    Please contact your administrator if you believe this is a mistake.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn btn-outline">
                        Go Home
                    </Link>
                    <Link to="/dashboard" className="btn btn-primary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;