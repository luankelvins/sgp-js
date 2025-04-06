import axios from "axios";

export const api = axios.create({
    baseURL: "https://tarefas-api.onrender.com" 
});