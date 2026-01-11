import { Link } from 'react-router';
import logo from '../../../assets/logo.png';
const ZapShiftLogo = () => {
    return (
        <div className="flex items-end text-xl md:text-3xl font-extrabold">
            <img className=' md:mb-3' src={logo} alt="Company Logo" />
            <Link to="/" className='-ml-3'>ZapShift</Link>
        </div>
    );
};

export default ZapShiftLogo;