import axios from "axios";

const api = axios.create({
    baseURL: "https://financeflow-backend-iy2t.onrender.com"
    });
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    console.log("API REQUEST:", config.url);
    console.log("TOKEN EXISTS:", !!token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("AUTH HEADER ADDED");
    }

    return config;
});

export default api;