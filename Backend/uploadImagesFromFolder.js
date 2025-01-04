const fs = require('fs');
const path = require('path');
const db = require('./db'); // Archivo de conexión a la base de datos

// Carpeta donde están las imágenes
const imagesFolder = path.join(__dirname, 'images-to-upload');

// Revisa si la carpeta existe
if (!fs.existsSync(imagesFolder)) {
    console.error('La carpeta de imágenes no existe.');
    process.exit(1);
}

// Lee todas las imágenes de la carpeta
fs.readdir(imagesFolder, (err, files) => {
    if (err) {
        console.error('Error al leer la carpeta:', err);
        return;
    }

    // Filtra los archivos que son imágenes
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    if (imageFiles.length === 0) {
        console.log('No hay imágenes para subir.');
        return;
    }

    // Itera sobre cada archivo e inserta en la base de datos
    imageFiles.forEach(file => {
        const filePath = path.join(imagesFolder, file);

        // Copia el archivo a la carpeta de destino del servidor
        const destinationPath = path.join(__dirname, 'uploads', file);
        fs.copyFile(filePath, destinationPath, err => {
            if (err) {
                console.error(`Error al copiar el archivo ${file}:`, err);
                return;
            }

            // Guarda la ruta en la base de datos
            const imageUrl = `/uploads/${file}`;
            const query = 'INSERT INTO productos (image_url) VALUES (?)';

            db.query(query, [imageUrl], (err, result) => {
                if (err) {
                    console.error(`Error al guardar la imagen ${file} en la base de datos:`, err);
                    return;
                }

                console.log(`Imagen ${file} subida exitosamente y guardada en la base de datos.`);
            });
        });
    });
});
