document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscounts = document.getElementById('summary-discounts'); // Asumiendo que podrías tener descuentos
    const summaryTotal = document.getElementById('summary-total');
    const checkoutButton = document.getElementById('checkout-button');

    // --- Simulación de datos del backend ---
    // En un caso real, harías un fetch a tu API.
    // Reemplaza esta función con tu llamada fetch real.
    async function fetchCartData() {
        try {
            // AJUSTA ESTA URL: Apunta a tu endpoint real del backend.
            // Por ejemplo, si necesitas el ID del cliente: /api/carrito/cliente/1
            const response = await fetch('/api/carrito/1'); // Usando 1 como ID de carrito de ejemplo
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            const cartData = await response.json();
            renderCart(cartData);
        } catch (error) {
            console.error('Error al obtener los datos del carrito:', error);
            showEmptyCart(); // Muestra el carrito vacío en caso de error
        }
    }

    function renderCart(cart) {
        if (!cart || !cart.items || cart.items.length === 0) {
            showEmptyCart();
            return;
        }

        hideEmptyCart();
        cartItemsContainer.innerHTML = ''; // Limpiar el contenedor

        cart.items.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.dataset.idProducto = item.idProducto;

            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.imagenProducto || 'https://via.placeholder.com/100'}" alt="${item.nombreProducto}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.nombreProducto}</h4>
                    <p>Precio: $${parseFloat(item.precioUnitario).toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.idProducto}">-</button>
                    <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.idProducto}">
                    <button class="quantity-btn increase-btn" data-id="${item.idProducto}">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <strong>$${parseFloat(item.subtotal).toFixed(2)}</strong>
                </div>
                <div class="cart-item-remove">
                    <button class="remove-btn" data-id="${item.idProducto}" title="Eliminar producto">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        updateSummary(cart);
        addEventListenersToItems();
    }

    function updateSummary(cart) {
        const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
        const discounts = 0; // Lógica de descuentos a implementar en el futuro
        const total = subtotal - discounts;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryDiscounts.textContent = `-$${discounts.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;

        // Habilitar o deshabilitar el botón de compra
        checkoutButton.disabled = cart.items.length === 0;
    }

    function showEmptyCart() {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        document.querySelector('.cart-summary').style.display = 'none'; // Ocultar resumen
    }

    function hideEmptyCart() {
        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'block'; // Mostrar resumen
    }

    function addEventListenersToItems() {
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', () => handleQuantityChange(btn.dataset.id, -1));
        });

        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', () => handleQuantityChange(btn.dataset.id, 1));
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => removeItem(btn.dataset.id));
        });
    }

    async function handleQuantityChange(productId, change) {
        const itemElement = document.querySelector(`.cart-item[data-id-producto='${productId}']`);
        const input = itemElement.querySelector('.quantity-input');
        let newQuantity = parseInt(input.value) + change;

        if (newQuantity < 1) {
            removeItem(productId); // Si la cantidad es menor a 1, eliminar el producto
            return;
        }

        // Aquí harías una llamada PUT/POST a tu backend para actualizar la cantidad
        console.log(`Actualizando producto ${productId} a cantidad ${newQuantity}`);
        // Ejemplo: await fetch(`/api/carrito/item/${productId}`, { method: 'PUT', body: JSON.stringify({ cantidad: newQuantity }), headers: {'Content-Type': 'application/json'} });
        
        // Después de la llamada exitosa, volver a cargar los datos
        fetchCartData();
    }

    async function removeItem(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
            console.log(`Eliminando producto ${productId}`);
            // Aquí harías una llamada DELETE a tu backend
            // Ejemplo: await fetch(`/api/carrito/item/${productId}`, { method: 'DELETE' });

            // Después de la llamada exitosa, volver a cargar los datos
            fetchCartData();
        }
    }

    // Event listener para el botón de continuar compra
    checkoutButton.addEventListener('click', () => {
        if (!checkoutButton.disabled) {
            window.location.href = 'compra.html'; // Redirigir a la página de compra
        }
    });

    // Carga inicial de los datos del carrito
    fetchCartData();
});