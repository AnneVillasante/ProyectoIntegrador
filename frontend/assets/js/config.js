// frontend/assets/js/config.js

// frontend/assets/js/config.js
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Si es local, usa localhost:4000. Si está en la nube, usa la URL de producción de Render.
// NOTA: Cuando subas el backend a Render, te darán una URL (ej: https://lunaria-api.onrender.com)
// Debes cambiar la URL de abajo por la tuya real de Render cuando la tengas.

const API_BASE_URL = isLocalhost 
    ? 'http://localhost:4000' 
    : window.location.origin; 

const CONFIG = {
    API_URL: `${API_BASE_URL}/api`,
    IMG_URL: API_BASE_URL, // Cloudinary ya trae http, pero por si acaso
    STRIPE_PUBLIC_KEY: 'pk_test_51SZWCJ3flV6CgDCbFFRTIe1p3Ajf59NxdLoQ1fv62Q7fWm6COFgHVUeZJAOocMYOcLfhIW0lRpKEbmHNb61lfXJh007I2a0yjd'
};

window.CONFIG = CONFIG;
