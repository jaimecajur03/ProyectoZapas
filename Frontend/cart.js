document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cart-list");
    const emptyMessage = document.getElementById("empty-message");
    const checkoutButton = document.getElementById("checkout-button");

    if (cart.length === 0) {
        // Si el carrito está vacío
        emptyMessage.style.display = "block";
        checkoutButton.style.display = "none";
    } else {
        // Si hay productos en el carrito
        emptyMessage.style.display = "none";
        checkoutButton.style.display = "block";

        // Obtener los detalles de los productos desde el backend
        fetch("http://localhost:5000/products") // Cambia esta URL a la de tu backend
            .then(response => response.json())
            .then(products => {
                cart.forEach(productId => {
                    const product = products.find(p => p.id == productId);
                    if (product) {
                        // Crear elemento para mostrar el producto
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <div class="cart-item">
                                <img src="${product.image_url}" alt="${product.name}" class="cart-item-img">
                                <div class="cart-item-details">
                                    <h3>${product.name}</h3>
                                    <p>Precio: $${product.price}</p>
                                </div>
                            </div>
                        `;
                        cartList.appendChild(listItem);
                    }
                });
            })
            .catch(err => console.error("Error al obtener productos:", err));
    }

    // Botón de confirmar compra
    checkoutButton.addEventListener("click", () => {
        alert("Compra confirmada. ¡Gracias por tu compra!");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
});
});

