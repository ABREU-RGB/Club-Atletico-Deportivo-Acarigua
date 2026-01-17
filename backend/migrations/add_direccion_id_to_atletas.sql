-- Script para agregar la columna direccion_id a la tabla atletas
-- Ejecutar en la base de datos club_atletico_db

-- 1. Agregar la columna direccion_id a la tabla atletas
ALTER TABLE atletas 
ADD COLUMN direccion_id INT NULL AFTER direccion;

-- 2. (Opcional) Agregar foreign key
-- ALTER TABLE atletas 
-- ADD CONSTRAINT fk_atletas_direccion 
-- FOREIGN KEY (direccion_id) REFERENCES direcciones(direccion_id);

-- Nota: La columna 'direccion' antigua (tipo text) se mantiene por compatibilidad
-- Los nuevos registros usarán direccion_id en lugar de direccion
