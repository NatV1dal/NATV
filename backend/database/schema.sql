
-- ==============================================
-- NATV - BASE DE DATOS
-- ==============================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom_rol VARCHAR(50) NOT NULL UNIQUE
);

-- 2. CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom_categoria VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descrip_cate TEXT,
    icono_cat VARCHAR(255),
    color_cat VARCHAR(10)
);

-- 3. ESTADOS
CREATE TABLE IF NOT EXISTS estados (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom_estado VARCHAR(50) NOT NULL UNIQUE,
    descrip_estado TEXT,
    color_estado VARCHAR(10),
    orden_estado INTEGER
);

-- 4. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_user INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    nom_user VARCHAR(100) NOT NULL,
    app_user VARCHAR(100) NOT NULL,
    apm_user VARCHAR(100),
    fecha_nacimiento DATE,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
);

-- 5. SERVICIOS
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    nom_servicio VARCHAR(150) NOT NULL,
    descrip_servicio TEXT,
    caracteristicas_serv TEXT,
    precio_refe NUMERIC(10,2),
    img_servicio VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_servicio_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
);

-- 6. FAVORITOS
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,

    CONSTRAINT fk_favorito_usuario
        FOREIGN KEY (id_user)
        REFERENCES usuarios(id_user),

    CONSTRAINT fk_favorito_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicios(id_servicio),

    CONSTRAINT uq_favorito_usuario_servicio
        UNIQUE (id_user, id_servicio)
);

-- 7. SOLICITUDES
CREATE TABLE IF NOT EXISTS solicitudes (
    id_solicitud INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    num_pedido VARCHAR(20) UNIQUE,
    descripcion TEXT,
    urgencia VARCHAR(20),
    contacto_preferido VARCHAR(50),
    fecha_solicitud DATE DEFAULT CURRENT_DATE,
    fecha_entrega DATE,

    CONSTRAINT fk_solicitud_usuario
        FOREIGN KEY (id_user)
        REFERENCES usuarios(id_user),

    CONSTRAINT fk_solicitud_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicios(id_servicio),

    CONSTRAINT fk_solicitud_estado
        FOREIGN KEY (id_estado)
        REFERENCES estados(id_estado)
);

-- 8. ARCHIVOS_REFERENCIA
CREATE TABLE IF NOT EXISTS archivos_referencia (
    id_archivo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_solicitud INTEGER NOT NULL,
    archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50),
    fecha_subida DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_archivo_solicitud
        FOREIGN KEY (id_solicitud)
        REFERENCES solicitudes(id_solicitud)
);


-- 9. COTIZACION
CREATE TABLE IF NOT EXISTS cotizacion (
    id_cotizacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_solicitud INTEGER NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    mensaje_cliente TEXT,
    archivo_pdf VARCHAR(255),
    fecha_envio DATE,

    CONSTRAINT fk_cotizacion_solicitud
        FOREIGN KEY (id_solicitud)
        REFERENCES solicitudes(id_solicitud),

    CONSTRAINT chk_cotizacion_version
        CHECK (version >= 1),

    CONSTRAINT uq_cotizacion_version
        UNIQUE (id_solicitud, version)
);

