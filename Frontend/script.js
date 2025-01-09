document.addEventListener("DOMContentLoaded", () => {
    // Funciones de login y registro
    function showLogin() {
        document.getElementById("register-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    }

    function showRegister() {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("register-form").style.display = "block";
    }


    // Manejo de submenús
    const subvariables = document.querySelectorAll(".tallas, .top-marcas, .color");

    subvariables.forEach((subvariable) => {
        const opciones = subvariable.querySelector(".opciones-tallas, .opciones-marcas, .opciones-color");

        subvariable.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que el clic cierre el submenú
            opciones.style.display = (opciones.style.display === "none" || !opciones.style.display) ? "block" : "none";
        });
    });

    // Cerrar submenús al hacer clic fuera
    document.addEventListener("click", () => {
        subvariables.forEach((subvariable) => {
            const opciones = subvariable.querySelector(".opciones-tallas, .opciones-marcas, .opciones-color");
            opciones.style.display = "none";
        });
        });

    
    // Función de login
    window.login = function() {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            alert("Por favor, completa todos los campos");
            return;
        }

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert("Login exitoso!");
                localStorage.setItem('token', data.token); // Almacenar el token
                localStorage.setItem('userName', data.userName); // Almacenar el nombre del usuario
                localStorage.setItem('isAdmin', data.isAdmin == 1); // Almacenar si es administrador
                showAdminOptions(data.isAdmin == 1); // Mostrar opciones si es administrador
                updateUIAfterLogin(); // Actualizar la interfaz sin recargar la página
            } else {
                alert("Credenciales incorrectas");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error de conexión");
        });
    };

    // Actualizar la interfaz después de iniciar sesión
    function updateUIAfterLogin() {
        const userName = localStorage.getItem('userName');
        document.getElementById('user-name').textContent = userName || "Usuario";

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        showAdminOptions(isAdmin); // Asegurarse de mostrar el panel si es administrador

        // Mostrar el botón de logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.style.display = 'block'; // Hacer visible el botón de logout
        }

        // Ocultar el formulario de login
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");
        if (loginForm) {
            loginForm.style.display = 'none';  // Ocultar el formulario de login
        }
        if (registerForm) {
            registerForm.style.display = 'none';  // Ocultar el formulario de registro si es necesario
        }

        // Mostrar el nombre del usuario (si está autenticado)
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.style.display = 'inline';  // Asegurarse de que el nombre de usuario sea visible
        }
    }

    // Función de logout
    document.addEventListener("DOMContentLoaded", () => {
        const logoutButton = document.getElementById('logout-button');
        const userNameElement = document.getElementById('user-name');

        // Si hay un token, mostramos el botón de logout y el nombre de usuario
        const token = localStorage.getItem('token');
        if (token) {
            const userName = localStorage.getItem('userName');
            userNameElement.textContent = userName || "Usuario";
            logoutButton.style.display = 'block'; // Mostrar el botón logout

            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                alert(`Adiós, ${userName}`);

                // Ocultar el botón de logout al cerrar sesión
                logoutButton.style.display = 'none';
                userNameElement.textContent = 'Usuario'; // Reiniciar el nombre de usuario
                updateUIAfterLogout(); // Llamar a la función que maneja el logout
            });
        } else {
            logoutButton.style.display = 'none'; // Ocultar si no hay token
        }
    });

    // Función para actualizar la UI después de logout
    function updateUIAfterLogout() {
        const userNameElement = document.getElementById('user-name');
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");

        userNameElement.textContent = 'Usuario'; // Resetear nombre de usuario
        userNameElement.style.display = 'none'; // Ocultar el nombre de usuario

        if (loginForm) {
            loginForm.style.display = 'block';  // Mostrar el formulario de login de nuevo
        }
        if (registerForm) {
            registerForm.style.display = 'none';  // Asegurarse de que el formulario de registro no esté visible
        }
    }
    
    
    function showAdminOptions(isAdmin) {
        console.log("isAdmin: ", isAdmin); // Verificar el valor de isAdmin
        const adminPanelButton = document.getElementById('admin-panel-button');
        if (adminPanelButton) {
            if (isAdmin) {
                adminPanelButton.style.display = 'block';  // Mostrar el botón de administrador
                console.log("Panel de administrador mostrado");
            } else {
                adminPanelButton.style.display = 'none';   // Ocultar el botón de administrador
                console.log("Panel de administrador ocultado");
            }
        }
    }
    
    
    // Función de registro
    window.register = function() {
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            alert("Registro exitoso!");
            showLogin();  // Mostrar la vista de login después del registro
        })
        .catch(err => {
            console.error(err);
            alert("Error de registro");
        });
    }
    
    // Verificación de token al cargar la página
    const token = localStorage.getItem('token');
    if (token) {
        console.log("Token enviado en la cabecera:", localStorage.getItem('token'));
        fetch('http://localhost:5000/verify-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log("Código de estado:", response.status); // Registrar el código de estado
                if (!response.ok) {
                    // Intentar leer el cuerpo del error
                    return response.text().then(errorText => {
                        console.error("Error en la respuesta del servidor:", errorText);
                        throw new Error(`Error del servidor: ${response.status}`);
                    });
                }
                return response.json(); // Continuar si no hubo error
            })
            .then(data => {
                if (data.isValid) {
                    const userName = localStorage.getItem('userName');
                    document.getElementById('user-name').textContent = userName || "Usuario"; // Mostrar nombre o un valor predeterminado
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                }
            })
            .catch(err => console.error("Error en la verificación del token:", err.message));
        
}

    // Usar addEventListener para evitar el error de ReferenceError
    const loginLink = document.querySelector('.login');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();  // Evitar recarga de la página
            showLogin();
        });
    }

    const registerLink = document.querySelector('.register');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();  // Evitar recarga de la página
            showRegister();
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const userNameElement = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');
    
    // Recuperar el nombre del usuario desde localStorage
    const userName = localStorage.getItem('userName') || "Usuario";  // Si no hay nombre, usar "Usuario"
    const token = localStorage.getItem('token');  // Verifica si hay un token

    if (token) {
        // Si hay token, mostrar el nombre de usuario
        userNameElement.textContent = userName;
        
        // Mostrar el botón "Cerrar sesión" cuando el mouse pase sobre el nombre
        userNameElement.addEventListener('mouseover', () => {
            logoutButton.style.display = 'block';
        });

        userNameElement.addEventListener('click', () => {
            logoutButton.style.display = logoutButton.style.display === 'block' ? 'none' : 'block';
        });

        // Funcionalidad del botón "Cerrar sesión"
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');  // Eliminar el token
            localStorage.removeItem('userName');  // Eliminar el nombre del usuario
            alert(`Adiós, ${userName}`);
            window.location.href = '/Frontend/index.html';  // Redirige a la página de inicio (ajustar según sea necesario)

        });
    } else {
        // Si no hay token, mostrar "Usuario" y no permitir mostrar el botón de logout
        userNameElement.textContent = "Usuario";
        logoutButton.style.display = 'none';  // Asegurarse de que no se muestra el botón
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const block1 = document.getElementById("block-1");
    const block2 = document.getElementById("block-2");
    const block3 = document.getElementById("block-3");

    // Obtener productos desde el backend
    fetch('http://localhost:5000/productos') 
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("resumen-item");

                // Plantilla para mostrar los datos del producto
                productDiv.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}" class="imagen-resumen">
                        <div class="texto-resumen">
                            <h3>${product.name}</h3>
                        <p>${product.Description}</p>
                            <p><strong>Precio:</strong> $${product.price}</p>
                            <a href="/product/${product.id}" class="ver-detalles">Ver detalles</a>
                            <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                        </div>
                    `;

                // Agregar el producto al bloque correspondiente
                if (product.id >= 1 && product.id <= 4) {
                    block1.appendChild(productDiv);
                } else if (product.id >= 5 && product.id <= 8) {
                    block2.appendChild(productDiv);
                } else if (product.id >= 9 && product.id <= 12) {
                    block3.appendChild(productDiv);
                }
            });
        
             // Agregar eventos a los botones
            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", (event) => {
                    const productId = event.target.dataset.id;
                    addToCart(productId);
                });
            });
        })

            

        .catch(err => console.error('Error al obtener los productos:', err));
});

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualizar el contador del carrito
        const cartCount = document.getElementById("cart-count");
        cartCount.textContent = cart.length;

        alert("Producto añadido al carrito");
    } else {
        alert("Este producto ya está en el carrito");
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cart-button");
    const cartDetails = document.getElementById("cart-details");
    const cartList = document.getElementById("cart-list");
    const cartCount = document.getElementById("cart-count");

    // Mostrar/Ocultar el carrito
    cartButton.addEventListener("click", () => {
        cartDetails.style.display = cartDetails.style.display === "none" ? "block" : "none";
        loadCartItems();
    });

    // Función para cargar los productos del carrito
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartList.innerHTML = "";

        if (cart.length === 0) {
            cartList.innerHTML = "<li>El carrito está vacío</li>";
            return;
        }

        fetch('http://localhost:5000/products') // Cambiar la URL si se usa un backend diferente
            .then(response => response.json())
            .then(products => {
                cart.forEach(productId => {
                    const product = products.find(p => p.id === parseInt(productId));

                    if (product) {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <div>
                                <img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                                <strong>${product.name}</strong> - $${product.price}
                            </div>
                        `;
                        cartList.appendChild(listItem);
                    }
                });

                // Actualiza el contador del carrito
                cartCount.textContent = cart.length;
            })
            .catch(err => console.error("Error al cargar los productos del carrito:", err));
    }

    // Evento para el botón de confirmar compra
    document.getElementById("checkout-button").addEventListener("click", () => {
        alert("Compra confirmada. ¡Gracias por tu compra!");
        localStorage.removeItem("cart"); // Limpia el carrito
        cartList.innerHTML = "<li>El carrito está vacío</li>";
        cartCount.textContent = "0";
        cartDetails.style.display = "none";
    });
});

document.getElementById("view-cart-button").addEventListener("click", () => {
    window.location.href = "cart.html";
});


document.addEventListener("DOMContentLoaded", () => {
    // Actualizar el contador del carrito al cargar la página
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
});


//Administrador
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin'); // Verifica si el usuario es admin

    // Mostrar el panel de admin solo si el usuario tiene permisos
    if (isAdmin === "true") {
        document.getElementById("admin-panel").style.display = "block";
        loadAdminProducts();
    }

    // Cargar productos para administración
    function loadAdminProducts() {
        fetch('http://localhost:5000/productos') // Ajustar la URL según backend
            .then(response => response.json())
            .then(products => {
                const adminProductList = document.getElementById("product-list-admin");
                adminProductList.innerHTML = ""; // Limpia el contenedor

                products.forEach(product => {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("admin-product-item");

                    productDiv.innerHTML = `
                        <div>
                            <img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                            <strong>${product.name}</strong> - $${product.price}
                            <button class="delete-product" data-id="${product.id}">Eliminar</button>
                        </div>
                    `;

                    adminProductList.appendChild(productDiv);
                });

                // Añadir evento a los botones de eliminar
                document.querySelectorAll(".delete-product").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const productId = event.target.dataset.id;
                        deleteProduct(productId);
                    });
                });
            })
            .catch(err => console.error("Error al cargar productos:", err));
    }

    // Función para eliminar un producto
    function deleteProduct(productId) {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:5000/productos/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo eliminar el producto');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || "Producto eliminado correctamente");
                loadAdminProducts(); // Recargar la lista de productos
            })
            .catch(err => console.error("Error al eliminar producto:", err));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        document.getElementById('admin-link').style.display = 'inline-block';
    }
});

// Mostrar el botón "Panel de Administrador" solo si el usuario es admin
function showAdminButton() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminButtonContainer = document.getElementById("admin-button-container");

    if (isAdmin) {
        // Mostrar el botón si es admin
        adminButtonContainer.style.display = "block";

        // Añadir el evento para redirigir al panel de administración
        const adminButton = document.getElementById("admin-panel-button");
        adminButton.addEventListener("click", () => {
            window.location.href = "admin.html"; // Redirigir a la página de administración
        });
    }
}

// Llamar a la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", showAdminButton);