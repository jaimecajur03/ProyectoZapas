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
                showAdminOptions(data.isAdmin); // Mostrar opciones si es admin
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
    const token = localStorage.getItem("token");
    if (token) {
        fetch('http://localhost:5000/verify-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                document.getElementById("login").textContent = `Hola, ${data.name}`;
                showAdminOptions(data.isAdmin);
            } else {
                localStorage.removeItem("token");
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


