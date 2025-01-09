// Verificar si el usuario tiene un token válido y es administrador
const token = localStorage.getItem('token'); // Suponiendo que se guarda el token en localStorage

if (!token) {
    window.location.href = '/login.html';  // Redirigir al login si no hay token
} else {
    fetch('http://localhost:5000/verify-token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.isValid || !data.user.isAdmin) {
            window.location.href = '/index.html';  // Redirigir si no es admin
        } else {
            // Cargar los datos de los usuarios y productos para el admin
            loadUsers();
            loadProducts();
        }
    })
    .catch(error => {
        console.error('Error verificando el token:', error);
        window.location.href = '/login.html';
    });
}



    // Función para cargar los productos
function loadProducts() {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:5000/productos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
            .then(response => response.json())
            .then(products => {
        const productTable = document.getElementById('product-table');
        productTable.innerHTML = '';  // Limpiar la tabla antes de llenarla

        products.forEach(product => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', product.id);  // Aquí agregamos el atributo data-id
            row.innerHTML = `
                <td><span class="product-name">${product.name}</span><input class="edit-name" type="text" value="${product.name}" style="display:none;"></td>
                <td><span class="product-price">${product.price}</span><input class="edit-price" type="number" value="${product.price}" style="display:none;"></td>
                <td><span class="product-description">${product.description}</span><textarea class="edit-description" style="display:none;">${product.description}</textarea></td>
                <td><span class="product-image-url">${product.image_url}</span><input class="edit-image-url" type="text" value="${product.image_url}" style="display:none;"></td>
                <td>
                    <button onclick="editProduct(${product.id}, this)">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                    <button class="save-btn" onclick="saveProduct(${product.id})" style="display:none;">Guardar Cambios</button>
                </td>
            `;
            productTable.appendChild(row);
        });
        
    })
    .catch(error => {
        console.error('Error cargando productos:', error);
});
}




// Función para editar un producto
function editProduct(productId, button) {
    const row = button.closest('tr');  // Obtener la fila del producto
    const nameField = row.querySelector('.product-name');
    const priceField = row.querySelector('.product-price');
    const descriptionField = row.querySelector('.product-description');
    const imageUrlField = row.querySelector('.product-image-url');
    
    // Mostrar los campos de entrada y ocultar los valores de solo texto
    row.querySelector('.edit-name').style.display = 'inline';
    row.querySelector('.edit-price').style.display = 'inline';
    row.querySelector('.edit-description').style.display = 'inline';
    row.querySelector('.edit-image-url').style.display = 'inline';
    
    nameField.style.display = 'none';
    priceField.style.display = 'none';
    descriptionField.style.display = 'none';
    imageUrlField.style.display = 'none';
    
    // Mostrar el botón de guardar y ocultar el de editar
    row.querySelector('.save-btn').style.display = 'inline';
    button.style.display = 'none';
}

function saveProduct(productId) {
    const row = document.querySelector(`tr[data-id='${productId}']`);  // Aquí seleccionamos la fila usando data-id
    const name = row.querySelector('.edit-name').value;
    const price = row.querySelector('.edit-price').value;
    const description = row.querySelector('.edit-description').value;
    const imageUrl = row.querySelector('.edit-image-url').value;

    const token = localStorage.getItem('token');

    console.log('Datos a guardar:', { name, price, description, imageUrl }); // Depuración

    fetch(`http://localhost:5000/productos/${productId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, description, image_url: imageUrl })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto actualizado:', data);  // Depuración
        alert(data.message);  // Mostrar mensaje de éxito
        loadProducts();  // Recargar productos después de la actualización
    })
    .catch(error => {
        console.error('Error actualizando el producto:', error); // Depuración
    });
}






// Función para eliminar un producto
function deleteProduct(productId) {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:5000/productos/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Recargar la lista de productos después de eliminar
        loadProducts();
    })
    .catch(error => {
        console.error('Error eliminando producto:', error);
    });
}

function updateProduct(productId) {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;
    const image_url = document.getElementById('product-image-url').value;
    
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:5000/productos/${productId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, description, image_url })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadProducts();  // Recargar productos después de la actualización
    })
    .catch(error => {
        console.error('Error actualizando producto:', error);
    });
}

// Función para cargar los usuarios
function loadUsers() {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:5000/usuarios', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const userTable = document.getElementById('user-table').getElementsByTagName('tbody')[0];
        userTable.innerHTML = '';  // Limpiar la tabla antes de llenarla

        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Aseguramos que la fila tenga un atributo `data-id` con el ID del usuario
            row.setAttribute('data-id', user.id);
            
            row.innerHTML = `
                <td><span class="user-name">${user.name}</span><input class="edit-name" type="text" value="${user.name}" style="display:none;"></td>
                <td><span class="user-email">${user.email}</span><input class="edit-email" type="text" value="${user.email}" style="display:none;"></td>
                <td>
                    <button onclick="editUser(${user.id}, this)">Editar</button>
                    <button onclick="deleteUser(${user.id})">Eliminar</button>
                    <button class="save-btn" onclick="saveUser(${user.id})" style="display:none;">Guardar Cambios</button>
                </td>
            `;
            
            userTable.appendChild(row);
        });
        
    })
    .catch(error => {
        console.error('Error cargando usuarios:', error);
    });
}

// Función para editar un usuario
function editUser(userId, button) {
    const row = button.closest('tr');  // Obtener la fila del usuario
    const nameField = row.querySelector('.user-name');
    const emailField = row.querySelector('.user-email');
    
    // Mostrar los campos de entrada y ocultar los valores de solo texto
    row.querySelector('.edit-name').style.display = 'inline';
    row.querySelector('.edit-email').style.display = 'inline';
    
    nameField.style.display = 'none';
    emailField.style.display = 'none';
    
    // Mostrar el botón de guardar y ocultar el de editar
    row.querySelector('.save-btn').style.display = 'inline';
    button.style.display = 'none';
}

function saveUser(userId) {
    const row = document.querySelector(`tr[data-id='${userId}']`);  // Asegúrate de que `data-id` esté configurado en la fila de usuario
    const name = row.querySelector('.edit-name').value;
    const email = row.querySelector('.edit-email').value;

    const token = localStorage.getItem('token');

    console.log('Datos a guardar:', { name, email }); // Depuración

    fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario actualizado:', data);  // Depuración
        alert(data.message);  // Mostrar mensaje de éxito
        loadUsers();  // Recargar usuarios después de la actualización
    })
    .catch(error => {
        console.error('Error actualizando el usuario:', error); // Depuración
    });
}




// Función para eliminar un usuario
function deleteUser(userId) {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Mostrar mensaje de éxito
        loadUsers();  // Recargar la lista de usuarios después de eliminar
    })
    .catch(error => {
        console.error('Error eliminando usuario:', error);
    });
}
