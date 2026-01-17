-- Script para crear la tabla direcciones
-- Este script debe ejecutarse en la base de datos club_atletico_db

CREATE TABLE IF NOT EXISTS direcciones (
    direccion_id INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(100) DEFAULT '',
    estado VARCHAR(100) DEFAULT '',
    municipio VARCHAR(100) DEFAULT '',
    localidad VARCHAR(200) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agregar columna direccion_id a atletas si no existe
-- (Ejecutar solo si la columna no existe)
-- ALTER TABLE atletas ADD COLUMN direccion_id INT NULL;
-- ALTER TABLE atletas ADD FOREIGN KEY (direccion_id) REFERENCES direcciones(direccion_id);
