-- ============ ESQUEMA USUARIOS ============
CREATE SCHEMA IF NOT EXISTS usuarios;
USE usuarios;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(60) NOT NULL,
    email VARCHAR(200) NOT NULL,
    date_birth DATE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('ADM', 'USR') NOT NULL
);

-- ============ ESQUEMA CARROS ============
CREATE SCHEMA IF NOT EXISTS carros;
USE carros;

CREATE TABLE carros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Make VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    Price DECIMAL(10,2),
    Mileage INT,
    Body_Type VARCHAR(50),
    Cylinders INT,
    Transmission VARCHAR(50),
    Fuel_Type VARCHAR(50),
    Color VARCHAR(30),
    Description TEXT,
    salestatus ENUM('disponible','no_disponible') NOT NULL
);

-- ============ ESQUEMA COMPRASYVISTAS ============
CREATE SCHEMA IF NOT EXISTS comprasyvistas;
USE comprasyvistas;

CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    metodo_pago VARCHAR(50),
    total DECIMAL(10,2)
);

CREATE TABLE visitas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    fecha_hora DATETIME
);

-- ============ ESQUEMA CONTRATOS ============
CREATE SCHEMA IF NOT EXISTS contratos;
USE contratos;

CREATE TABLE contratos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    precio_final DECIMAL(10,2),
    fecha_contrato DATE,
    estado ENUM('firmado','no_firmado') NOT NULL
);

-- ============ ESQUEMA CREDITO ============
CREATE SCHEMA IF NOT EXISTS credito;
USE credito;

-- Aquí las tablas de crédito
