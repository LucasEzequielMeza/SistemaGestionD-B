import axios from "axios";

const client = axios.create({
    baseURL: "https://sistemagestiond-b.onrender.com/api",
    withCredentials: true,
});

export default client;