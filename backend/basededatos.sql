USE galeria_arte;

-- Tabla de usuarios (para login)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuario') DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de artistas
CREATE TABLE IF NOT EXISTS artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE,
    biografia TEXT,
    imagen VARCHAR(255),
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de obras
CREATE TABLE IF NOT EXISTS obras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    artista_id INT,
    descripcion TEXT,
    tecnica VARCHAR(100),
    dimensiones VARCHAR(50),
    anio INT,
    precio DECIMAL(10, 2),
    estado ENUM('disponible', 'vendida', 'reservada', 'en_exposicion') DEFAULT 'disponible',
    imagen VARCHAR(255),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE SET NULL
);

-- Tabla de exposiciones
CREATE TABLE IF NOT EXISTS exposiciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    ubicacion VARCHAR(200),
    curador VARCHAR(100),
    imagen VARCHAR(255),
    estado ENUM('programada', 'activa', 'finalizada') DEFAULT 'programada',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla relacional: obras en exposiciones
CREATE TABLE IF NOT EXISTS obras_exposiciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    exposicion_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    FOREIGN KEY (exposicion_id) REFERENCES exposiciones(id) ON DELETE CASCADE
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    ciudad VARCHAR(100),
    pais VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    cliente_id INT NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    fecha_venta DATE NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    notas TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
);

-- Insertar usuario administrador de prueba (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@elan.com', 'admin123', 'administrador');

-- Insertar artistas de prueba
INSERT INTO artistas (nombre, apellido, nacionalidad, fecha_nacimiento, biografia, imagen) VALUES
('Vincent', 'Van Gogh', 'Holandés', '1853-03-30', 'Pintor postimpresionista neerlandés', 'Yayoi.jpg'),
('Frida', 'Kahlo', 'Mexicana', '1907-07-06', 'Pintora mexicana conocida por sus autorretratos','Frida.jpg'),
('Pablo', 'Picasso', 'Español', '1881-10-25', 'Pintor y escultor español, creador del cubismo', 'Pablo.jpg'),
('Leonardo', 'da Vinci', 'Italiano', '1452-04-15', 'Polímata del Renacimiento italiano', 'DaVinci.jpg'),
('Claude', 'Monet', 'Francés', '1840-11-14', 'Fundador de la pintura impresionista francesa', 'https://picsum.photos/300/400?random=5');

-- Insertar obras de prueba
INSERT INTO obras (titulo, artista_id, descripcion, tecnica, dimensiones, anio, precio, estado, imagen) VALUES
('La noche estrellada', 1, 'Una de las obras más reconocidas de Van Gogh', 'Óleo sobre lienzo', '73 x 92 cm', 1889, 150000.00, 'disponible', 'Yayoi.jpg'),
('Las dos Fridas', 2, 'Autorretrato doble de Frida Kahlo', 'Óleo sobre lienzo', '173 x 173 cm', 1939, 200000.00, 'en_exposicion', 'pintura2.jpg'),
('Guernica', 3, 'Mural de Picasso sobre la Guerra Civil Española', 'Óleo sobre lienzo', '349 x 776 cm', 1937, 500000.00, 'disponible', 'pintura3.jpg'),
('La Mona Lisa', 4, 'El retrato más famoso del mundo', 'Óleo sobre tabla', '77 x 53 cm', 1503, 1000000.00, 'vendida', 'pintura4.jpg'),
('Impresión, sol naciente', 5, 'Obra que dio nombre al impresionismo', 'Óleo sobre lienzo', '48 x 63 cm', 1872, 180000.00, 'disponible', 'Pablo.jpg'),
('Girasoles', 1, 'Serie de pinturas de girasoles', 'Óleo sobre lienzo', '92 x 73 cm', 1888, 120000.00, 'reservada', 'DaVinci.jpg'),
('Autorretrato con collar de espinas', 2, 'Autorretrato de Frida Kahlo', 'Óleo sobre lienzo', '61 x 47 cm', 1940, 175000.00, 'disponible', 'pintura7.jpg'),
('Las señoritas de Avignon', 3, 'Obra revolucionaria del protocubismo', 'Óleo sobre lienzo', '243 x 233 cm', 1907, 350000.00, 'en_exposicion', 'pintura8.jpg');

-- Insertar exposiciones de prueba
INSERT INTO exposiciones (titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, curador, imagen, estado) VALUES
('Impresionismo del Siglo XIX', 'Colección de obras impresionistas', '2024-01-15', '2024-03-30', 'Sala Principal', 'Elías Montreux', 'https://picsum.photos/600/400?random=21', 'activa'),
('Arte Mexicano Contemporáneo', 'Exposición de arte moderno mexicano', '2024-02-01', '2024-04-15', 'Sala 2', 'Valentina Moreau', 'https://picsum.photos/600/400?random=22', 'programada'),
('Cubismo: Revolución Visual', 'Obras cubistas de Picasso y contemporáneos', '2024-03-10', '2024-05-20', 'Sala Principal', 'Elías Montreux', 'https://picsum.photos/600/400?random=23', 'programada');

-- Insertar clientes de prueba
INSERT INTO clientes (nombre, apellido, email, telefono, direccion, ciudad, pais) VALUES
('Carlos', 'Martínez', 'carlos.martinez@email.com', '+52 444 123 4567', 'Av. Carranza 123', 'San Luis Potosí', 'México'),
('Ana', 'García', 'ana.garcia@email.com', '+52 477 234 5678', 'Blvd. Mariano Escobedo 456', 'León', 'México'),
('Roberto', 'López', 'roberto.lopez@email.com', '+52 461 345 6789', 'Calle Hidalgo 789', 'Celaya', 'México');

-- Insertar ventas de prueba
INSERT INTO ventas (obra_id, cliente_id, precio_venta, fecha_venta, metodo_pago, notas) VALUES
(4, 1, 1000000.00, '2024-01-20', 'transferencia', 'Venta histórica de La Mona Lisa'),
(6, 2, 120000.00, '2024-02-10', 'tarjeta', 'Cliente frecuente, descuento aplicado');

-- Insertar relaciones obras-exposiciones
INSERT INTO obras_exposiciones (obra_id, exposicion_id) VALUES
(1, 1), -- La noche estrellada en Impresionismo
(5, 1), -- Impresión, sol naciente en Impresionismo
(2, 2), -- Las dos Fridas en Arte Mexicano
(7, 2), -- Autorretrato en Arte Mexicano
(3, 3), -- Guernica en Cubismo
(8, 3); -- Las señoritas de Avignon en Cubismo