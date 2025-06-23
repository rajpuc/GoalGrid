import axios from "axios";

const axiosInstance = axios.create({
    // baseURL:"http://localhost:5050/api/v1",
    baseURL:"https://goalgrid-1.onrender.com/api/v1",
    withCredentials:true,
})

export default axiosInstance;