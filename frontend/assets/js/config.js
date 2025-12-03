// frontend/assets/js/config.js

// Determina la URL base de la API dinámicamente usando el hostname del navegador.
// Esto permite que funcione tanto en localhost como en un dominio de producción.
const API_HOSTNAME = window.location.hostname;
const API_PORT = 4000; // Puerto del backend

const CONFIG = {
    API_URL: `http://${API_HOSTNAME}:${API_PORT}/api`,
    IMG_URL: `http://${API_HOSTNAME}:${API_PORT}`,
    STRIPE_PUBLIC_KEY: 'pk_test_51SZWCJ3flV6CgDCbFFRTIe1p3Ajf59NxdLoQ1fv62Q7fWm6COFgHVUeZJAOocMYOcLfhIW0lRpKEbmHNb61lfXJh007I2a0yjd'
};

// Exportar para que otros archivos lo usen (si usas módulos) o dejarlo global
window.CONFIG = CONFIG;