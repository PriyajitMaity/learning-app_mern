import axios from "axios";

const accessApi =axios.create({
    baseURL: "http://localhost:5000",
});
accessApi.interceptors.request.use((config) =>{
    const accessToken =JSON.parse(sessionStorage.getItem('accessToken')) || '';
    if(accessToken){
        config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config;
},(err) =>Promise.reject(err))
export default accessApi;
