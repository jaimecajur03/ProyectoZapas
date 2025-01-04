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
app.use('/img', express.static('/img'));


app.use(cors({
    origin: 'http://127.0.0.1:5500'
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

            // Enviar el token y el nombre del usuario en la respuesta
            res.json({ token, userName: user.name, isAdmin: user.isAdmin });
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

app.post('/verify-token', (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ valid: true, name: decoded.name });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token inválido" });
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Ruta para obtener los productos
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ message: 'Error al obtener productos' });
        }
        
        res.json(results);  // Devolvemos los productos en formato JSON
    });
});



// Productos del ID 1 al 4
app.get('/products/block1', (req, res) => {
    const query = 'SELECT id, name, description, image_url FROM products WHERE id BETWEEN 1 AND 4';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener los productos del bloque 1" });
            return;
        }
        res.json(results);
    });
});

// Productos del ID 5 al 8
app.get('/products/block2', (req, res) => {
    const query = 'SELECT id, name, description, image_url FROM products WHERE id BETWEEN 5 AND 8';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener los productos del bloque 2" });
            return;
        }
        res.json(results);
    });
});

// Productos del ID 9 al 12
app.get('/products/block3', (req, res) => {
    const query = 'SELECT id, name, description, image_url FROM products WHERE id BETWEEN 9 AND 12';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener los productos del bloque 3" });
            return;
        }
        res.json(results);
    });
});





app.post('/add-product', (req, res) => {
    const { name, price, description, image_url } = req.body;

    if (!name || !price || !description || !image_url) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const query = 'INSERT INTO productos (name, price, description, image_url) VALUES (?, ?, ?, ?)';
    db.query(query, [name, price, description, image_url], (err, results) => {
        if (err) {
            console.error('Error al añadir producto:', err);
            return res.status(500).json({ message: "Error al añadir producto" });
        }
        res.status(201).json({ message: "Producto añadido exitosamente", productId: results.insertId });
    });
});










const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Ruta para subir imágenes
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const imagePath = `/uploads/${req.file.filename}`; // Ruta relativa de la imagen

    // Si también quieres guardar la ruta en la base de datos:
    const query = 'INSERT INTO productos (image_url) VALUES (?)';
    db.query(query, [imagePath], (err, result) => {
        if (err) {
            console.error('Error al guardar la ruta de la imagen:', err);
            return res.status(500).json({ message: 'Error al guardar en la base de datos' });
        }

        res.status(200).json({ message: 'Imagen subida exitosamente', imagePath });
    });
});


