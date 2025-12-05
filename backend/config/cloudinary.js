// annevillasante/proyectointegrador/ProyectoIntegrador-mant-progreso/backend/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// 1. CONFIGURACIÓN REMOTA (CLOUDINARY)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = ({ folderName = 'perfiles' }) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: `lunaria_threads/${folderName}`,
        allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
});

// 2. CONFIGURACIÓN LOCAL (DISCO)
const diskStorage = ({ folderName = 'perfiles' }) => multer.diskStorage({
    destination: (req, file, cb) => {
        // Guarda en la carpeta de uploads del backend
        const uploadPath = path.join(__dirname, '..', 'uploads', folderName);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nombre de archivo con timestamp para evitar colisiones
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname.replace(ext, '')}${ext}`);
    }
});

// ⭐ FUNCIÓN DE INTUICIÓN DE ENTORNO ⭐
const isProduction = () => {
    // Es producción si NODE_ENV está en 'production' Y se ha configurado Cloudinary
    return process.env.NODE_ENV === 'production' && process.env.CLOUDINARY_CLOUD_NAME;
};


// 3. SELECCIÓN DE ALMACENAMIENTO DINÁMICO
const getStorage = (options) => {
    // Si la aplicación NO está en modo 'production', usa el disco local.
    // Usamos la función isProduction para la lógica
    if (!isProduction()) {
        console.log("🛠️ Usando almacenamiento local (DEV)");
        return diskStorage(options);
    } else {
        console.log("☁️ Usando Cloudinary (PROD)");
        return cloudinaryStorage(options);
    }
};

// 4. EXPORTACIONES CORREGIDAS
module.exports = {
    cloudinary,
    // Renombramos 'getStorage' a 'createStorage' para solucionar el TypeError.
    createStorage: getStorage,
    // Exportamos la función de chequeo de entorno para usarla en los controladores.
    isProduction, 
};
