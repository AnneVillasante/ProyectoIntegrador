// frontend/assets/js/config.js
const CONFIG = {
    API_URL: 'http://localhost:4000/api', // Puerto 4000 (Backend)
    IMG_URL: 'http://localhost:4000',     // Base para imágenes
    STRIPE_PUBLIC_KEY: 'pk_test_51SZWCJ3flV6CgDCbFFRTIe1p3Ajf59NxdLoQ1fv62Q7fWm6COFgHVUeZJAOocMYOcLfhIW0lRpKEbmHNb61lfXJh007I2a0yjd'
};

// Exportar para que otros archivos lo usen (si usas módulos) o dejarlo global
window.CONFIG = CONFIG;