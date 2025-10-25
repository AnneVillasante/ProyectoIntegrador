ALTER TABLE Usuario
    -- Agregar nueva columna apellidos
    ADD COLUMN apellidos VARCHAR(100) NOT NULL AFTER nombres;
ALTER TABLE Usuario
    -- Agregar DNI (único)
    ADD COLUMN dni VARCHAR(15) NOT NULL AFTER correo;
    ALTER TABLE Usuario
MODIFY COLUMN dni VARCHAR(15) NOT NULL UNIQUE;
ALTER TABLE Usuario
    -- Agregar teléfono (igual, si lo deseas UNIQUE también puedes hacerlo)
    ADD COLUMN telefono VARCHAR(15) NOT NULL AFTER dni;
ALTER TABLE Usuario
    -- Agregar foto de perfil (URL de imagen o BASE64 — flexible)
    ADD COLUMN fotoPerfil VARCHAR(255) NULL AFTER telefono;

-- Alterar DNI y telefono con digitos validos en Perú.
ALTER TABLE Usuario
  MODIFY COLUMN dni VARCHAR(8) NOT NULL,
  MODIFY COLUMN telefono VARCHAR(9) NOT NULL,

ALTER TABLE producto
ADD COLUMN imagen VARCHAR(255) AFTER nombre;  -- o donde quieras colocarla

ALTER TABLE campaña
ADD COLUMN imagen VARCHAR(255) AFTER nombre;
