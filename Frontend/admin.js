document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el usuario es admin, si no, redirigir
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        window.location.href = "index.html";  // Si no es admin, redirigir al home
    }

    // Cargar usuarios
    loadUsers();
    // Cargar productos
    loadProducts();
});

// Cargar usuarios
function loadUsers() {
    fetch('http://localhost:5000/usuarios') // Ajusta la URL según tu backend
        .then(response => response.json())
        .then(users => {
            const usersTableBody = document.getElementById("users-table").getElementsByTagName("tbody")[0];
            usersTableBody.innerHTML = "";  // Limpiar la tabla antes de agregar los usuarios

            users.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Editar</button>
                        <button onclick="deleteUser(${user.id})">Eliminar</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al cargar usuarios:", error));
}

// Cargar productos
function loadProducts() {
    fetch('http://localhost:5000/productos') // Ajusta la URL según tu backend
        .then(response => response.json())
        .then(products => {
            const productsTableBody = document.getElementById("products-table").getElementsByTagName("tbody")[0];
            productsTableBody.innerHTML = "";  // Limpiar la tabla antes de agregar los productos

            products.forEach(product => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Editar</button>
                        <button onclick="deleteProduct(${product.id})">Eliminar</button>
                    </td>
                `;
                productsTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Editar usuario
function editUser(userId) {
    // Aquí se debe agregar la lógica para editar un usuario
    console.log("Editar usuario:", userId);
}

// Eliminar usuario
function deleteUser(userId) {
    fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Usuario eliminado correctamente");
        loadUsers();  // Recargar la lista de usuarios
    })
    .catch(err => console.error("Error al eliminar usuario:", err));
}

// Editar producto
function editProduct(productId) {
    // Aquí se debe agregar la lógica para editar un producto
    console.log("Editar producto:", productId);
}

// Eliminar producto
function deleteProduct(productId) {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    fetch(`http://localhost:5000/productos/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,  // Asegúrate de incluir el token en el encabezado
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Producto eliminado correctamente");
        loadProducts();  // Recargar la lista de productos
    })
    .catch(err => console.error("Error al eliminar producto:", err));
}

