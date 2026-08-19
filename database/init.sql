-- =========================================================
-- TIPOS DE TRÁMITE
-- =========================================================

-- Son los tipos de trámite que se pueden seleccionar
-- al crear un trámite.
CREATE TABLE tipos_tramite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Insertamos los tres tipos de trámite iniciales
INSERT INTO tipos_tramite (codigo, nombre)
VALUES
    ('LES', 'LES'),
    ('CONDLES', 'CONDLES'),
    ('TITCONDLES', 'TITCONDLES');


-- =========================================================
-- USUARIOS
-- =========================================================

-- Usuarios que utilizarán el sistema
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TRÁMITES
-- =========================================================

-- Tabla que contiene los trámites realizados
CREATE TABLE tramites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Tipo de trámite seleccionado
    tipo_tramite_id UUID NOT NULL,
    -- Usuario responsable del trámite
    user_id UUID NOT NULL,
    -- Número de carpeta
    numero_carpeta VARCHAR(50) NOT NULL UNIQUE,
    -- Nombre completo del cliente
    nombre_cliente VARCHAR(200) NOT NULL,
    -- Estado actual del trámite
    estado VARCHAR(30) NOT NULL DEFAULT 'en_proceso',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- RECORDATORIOS
-- =========================================================

CREATE TABLE recordatorios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Usuario que creó el recordatorio
    user_id UUID NOT NULL,
    -- Texto del recordatorio
    descripcion VARCHAR(255) NOT NULL,
    -- Día en que ocurre el evento
    fecha_evento DATE NOT NULL,
    -- Hora en que ocurre el evento
    hora_evento TIME NOT NULL,
    -- Cuántos minutos antes quiero recibir la notificación
    minutos_antes INTEGER NOT NULL DEFAULT 5,
    -- Permite saber si el recordatorio ya fue atendido
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recordatorio_usuario
        FOREIGN KEY (user_id)
        REFERENCES usuarios(id)
);

-- =========================================================
-- RELACIONES
-- =========================================================

-- Relación entre trámites y tipos de trámite
ALTER TABLE tramites
ADD CONSTRAINT fk_tramite_tipo
FOREIGN KEY (tipo_tramite_id)
REFERENCES tipos_tramite(id);


-- Relación entre trámites y usuarios
ALTER TABLE tramites
ADD CONSTRAINT fk_tramite_usuario
FOREIGN KEY (user_id)
REFERENCES usuarios(id);