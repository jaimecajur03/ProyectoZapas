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
                showAdminOptions(data.isAdmin); // Mostrar opciones si es admin
                window.location.reload(); // Recargar la página para reflejar el cambio
            } else {
                alert("Credenciales incorrectas");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error de conexión");
        });
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

    // Mostrar opciones de administrador
    function showAdminOptions(isAdmin) {
        const adminOptions = document.getElementById("admin-options");
        if (adminOptions) {
            adminOptions.style.display = isAdmin ? "block" : "none";
        }
    }

    // Verificación de token al cargar la página
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:5000/verify-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Redirección o error del servidor');
            }
            return response.json();  // Intenta convertir la respuesta a JSON
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
        .catch(err => console.error(err));
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





