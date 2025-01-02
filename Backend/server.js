// Importar dependencias
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();  // Cargar variables de entorno

// Crear la aplicación Express
const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'D4NG3R0U5CRYP4%';  // Clave secreta para JWT

// Middleware
app.use(express.json());
app.use(cors());


app.use(cors({
    origin: 'http://localhost:5000', // Reemplazar con el origen del frontend
}));


// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Usuario de MySQL (por defecto "root")
    password: '',           // Contraseña de MySQL (si no tienes contraseña, déjalo vacío)
    database: 'sportja'     // Nombre de tu base de datos
});

// Conectar a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de registro
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error en el servidor" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "El usuario ya está registrado" });
            }

            // Hashear la contraseña
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error al hashear la contraseña" });
                }

                // Insertar el nuevo usuario en la base de datos
                db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Error al registrar el usuario" });
                    }

                    res.status(201).json({ message: "Usuario registrado exitosamente" });
                });
            });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error en el servidor, por favor intente nuevamente más tarde" });
    }
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isPasswordValid) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error al verificar la contraseña" });
            }

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Credenciales incorrectas" });
            }

            // Generar un token JWT
            const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, isAdmin: user.isAdmin });
        });
    });
});

// Ruta para verificar si el token es válido
app.get('/verify-token', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ isValid: true, isAdmin: decoded.isAdmin });
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
        console.log("Token recibido:", token);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
