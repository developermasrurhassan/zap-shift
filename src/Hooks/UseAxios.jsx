import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://zap-shift-server-mu-ashy.vercel.app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
const UseAxios = () => {
    return axiosInstance
};

export default UseAxios;