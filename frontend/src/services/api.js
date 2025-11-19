import axios from "axios";

// Create axios instance
export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// 🔐 Add token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Safe logging (NO optional chaining)
        const method = config.method ? config.method.toUpperCase() : "UNKNOWN";
        const url = config.url || "";
        console.log(`🔄 Making ${method} request to: ${url}`);

        return config;
    },
    (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
    }
);

// 📥 Response logging
api.interceptors.response.use(
    (response) => {
        console.log(`✅ Response received: ${response.status}`, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error("❌ Response error:", error.response.data);
        } else {
            console.error("❌ Network/Unknown error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;