import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios';

// Set production API URL or default to local for development
const API_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
