import { Link, Outlet } from 'react-router';
import AuthImage from '../../assets/authImage.png'
import ZapShiftLogo from '../../Pages/SharedComponent/Logo/ZapShiftLogo';
const AuthLayout = () => {
    return (
        <div className=''>
            <header className='py-8'>
                <Link to="/"><ZapShiftLogo /></Link>
            </header>
            <div className="hero ">
                <div className="hero-content flex-col  lg:flex-row-reverse">
                    <div className=' flex-1'>
                        <img
                            src={AuthImage}
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='flex-1'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;