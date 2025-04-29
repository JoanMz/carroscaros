ENUM tipo de usuario (ADM, USR)
CREATE TABLE usuarios (
    id INT PRIMARY KEY,
    user_name VARCHAR(60) NOT NULL,
    email VARCHAR(200) NOT NULL,
    date_birth DATE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('ADM', 'USR')
);
