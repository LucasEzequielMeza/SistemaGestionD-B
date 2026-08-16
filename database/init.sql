// Son los tipos de tramite que se van a poder seleccionar al crear un tramite, por ejemplo: LES, CONDLES, TITCONDLES
CREATE TABLE tipos_tramite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

// Insertar los tipos de tramite iniciales, son las opciones que se van a poder seleccionar al crear un tramite
INSERT INTO tipos_tramite (codigo, nombre)
VALUES
    ('LES', 'LES'),
    ('CONDLES', 'CONDLES'),
    ('TITCONDLES', 'TITCONDLES');


// Tabla que contiene los tramites que se van a realizar, con su tipo de tramite, numero de carpeta, nombre del cliente y estado del tramite
CREATE TABLE tramites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_tramite_id UUID NOT NULL,
    numero_carpeta VARCHAR(50) NOT NULL,
    nombre_cliente VARCHAR(200) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'en_proceso',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

// Agregar la relación entre tramites y tipos_tramite
ALTER TABLE tramites
ADD CONSTRAINT fk_tramite_tipo
FOREIGN KEY (tipo_tramite_id)
REFERENCES tipos_tramite(id);