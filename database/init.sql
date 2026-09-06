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
    activo BOOLEAN NOT NULL DEFAULT TRUE,
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
-- DOCUMENTOS
-- =========================================================

-- Documentos que pueden formar parte de un trámite
CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Nombre del documento
    nombre VARCHAR(100) NOT NULL UNIQUE,
    -- Indica si este documento debe cargarse en LEX
    se_carga_lex BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- DOCUMENTOS POR TIPO DE TRÁMITE
-- =========================================================

-- Indica qué documentos corresponden a cada tipo de trámite
CREATE TABLE tipo_tramite_documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Tipo de trámite al que pertenece el documento
    tipo_tramite_id UUID NOT NULL,
    -- Documento que corresponde para ese tipo de trámite
    documento_id UUID NOT NULL,
    -- Indica si el documento es obligatorio
    obligatorio BOOLEAN NOT NULL DEFAULT TRUE,
    -- Relación con la tabla tipos_tramite
    CONSTRAINT fk_tipo_tramite_documento_tipo
        FOREIGN KEY (tipo_tramite_id)
        REFERENCES tipos_tramite(id),
    -- Relación con la tabla documentos
    CONSTRAINT fk_tipo_tramite_documento_documento
        FOREIGN KEY (documento_id)
        REFERENCES documentos(id),
    -- Evita repetir el mismo documento para un mismo tipo de trámite
    CONSTRAINT uq_tipo_tramite_documento
        UNIQUE (tipo_tramite_id, documento_id)
);


-- =========================================================
-- DOCUMENTOS DE LOS TRÁMITES
-- =========================================================

-- Guarda los documentos correspondientes a cada trámite
CREATE TABLE tramite_documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Trámite al que pertenece el documento
    tramite_id UUID NOT NULL,
    -- Documento que estamos controlando
    documento_id UUID NOT NULL,
    -- Estado actual del documento
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    -- Observaciones realizadas sobre el documento
    observaciones VARCHAR(500),
    -- Fecha y hora en que se recibió el documento
    recibido_at TIMESTAMP,
    -- Fecha y hora en que se cargó el documento en LEX
    cargado_lex_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Relación con la tabla tramites
    CONSTRAINT fk_tramite_documento_tramite
        FOREIGN KEY (tramite_id)
        REFERENCES tramites(id),
    -- Relación con la tabla documentos
    CONSTRAINT fk_tramite_documento_documento
        FOREIGN KEY (documento_id)
        REFERENCES documentos(id),
    -- Evita repetir el mismo documento dentro de un mismo trámite
    CONSTRAINT uq_tramite_documento
        UNIQUE (tramite_id, documento_id)
);

-- =========================================================
-- DOCUMENTOS PARA CONDLES
-- =========================================================

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    TRUE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'CONDLES'
AND d.nombre IN (
    'Pacto',
    'Planilla',
    'Autoriza',
    'Orden médica',
    'Foto DM',
    'SV',
    'DM marcado',
    'Croquis',
    'Testigos',
    'Mapa',
    'Documentación tercero',
    'DNI',
    'Licencia',
    'DEN tercero',
    'CC tercero'
);


-- Denuncia del seguro del cliente.
-- Se solicita, pero no es obligatoria.

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    FALSE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'CONDLES'
AND d.nombre = 'Denuncia SEG';


-- =========================================================
-- DOCUMENTOS PARA LES
-- =========================================================

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    TRUE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'LES'
AND d.nombre IN (
    'Pacto',
    'Planilla', 
    'Autoriza',
    'Orden médica',
    'SV',
    'DM marcado',
    'Croquis',
    'Testigos',
    'Mapa',
    'Documentación tercero',
    'DNI',
    'DEN tercero',
    'CC tercero'
);


-- Relato de los hechos o declaración testimonial.
-- Se solicitan según corresponda al caso.

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    FALSE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'LES'
AND d.nombre IN (
    'Relato de los hechos',
    'Declaración testimonial'
);


-- =========================================================
-- DOCUMENTOS PARA TITCONDLES
-- =========================================================

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    TRUE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'TITCONDLES'
AND d.nombre IN (
    'DNI',
    'Licencia',
    'Cédula',
    'Constancia médica',
    'Presupuesto',
    'CC',
    'DEN tercero',
    'CC tercero',
    'Pacto',
    'Planilla',
    'Autoriza',
    'Orden médica',
    'Foto DM',
    'Denuncia SEG',
    'SV',
    'DM marcado',
    'Croquis',
    'Testigos',
    'Mapa',
    'Documentación tercero'
);


-- Declaración testimonial.
-- Se solicita solamente si hubo intervención policial.

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    FALSE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo = 'TITCONDLES'
AND d.nombre = 'Declaración testimonial';

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

INSERT INTO documentos (nombre, se_carga_lex)
VALUES ('Poder', FALSE);

INSERT INTO tipo_tramite_documentos (
    tipo_tramite_id,
    documento_id,
    obligatorio
)
SELECT
    tt.id,
    d.id,
    TRUE
FROM tipos_tramite tt
CROSS JOIN documentos d
WHERE tt.codigo IN ('LES', 'CONDLES', 'TITCONDLES')
AND d.nombre = 'Poder';

DELETE FROM tipo_tramite_documentos
WHERE documento_id = (
    SELECT id
    FROM documentos
    WHERE nombre = 'Declaración testimonial'
);

UPDATE tipo_tramite_documentos
SET obligatorio = TRUE
WHERE documento_id = (
    SELECT id
    FROM documentos
    WHERE nombre = 'Relato de los hechos'
)
AND tipo_tramite_id IN (
    SELECT id
    FROM tipos_tramite
    WHERE codigo IN ('LES', 'CONDLES')
);