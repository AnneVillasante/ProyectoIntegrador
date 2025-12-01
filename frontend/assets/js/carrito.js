document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const API_BASE = 'http://localhost:4000/api';
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscounts = document.getElementById('summary-discounts'); // Asumiendo que podrías tener descuentos
    const summaryTotal = document.getElementById('summary-total');
    const checkoutButton = document.getElementById('checkout-button');

    async function fetchCartData() {
        try {
<<<<<<< HEAD
            // AJUSTA ESTA URL: Apunta a tu endpoint real del backend.
            // Por ejemplo, si necesitas el ID del cliente: /api/carrito/cliente/1
<<<<<<< HEAD
            const response = await fetch(`${window.CONFIG.API_URL}/carrito/1`); // Usando 1 como ID de carrito de ejemplo
=======
            const response = await fetch('/api/carrito/1'); // Usando 1 como ID de carrito de ejemplo
>>>>>>> progreso
=======
            const token = localStorage.getItem('token'); // Obtener el token del usuario logueado
            if (!token) {
                // Si no hay token, el usuario no ha iniciado sesión.
                // Podemos mostrar el carrito vacío y redirigir o mostrar un mensaje.
                alert('Debes iniciar sesión para ver tu carrito.');
                window.location.href = 'login.html'; // Redirigir al login
                return;
            }

            // La ruta GET /api/carrito obtiene el carrito del usuario autenticado por su token.
            const response = await fetch(`${API_BASE}/carrito`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

>>>>>>> progreso
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
<<<<<<< HEAD
                    <img src="${window.CONFIG.IMG_URL}${item.imagenProducto}" alt="${item.nombreProducto}" onerror="this.onerror=null;this.src='https://via.placeholder.com/100';">
=======
                    <img src="${item.imagenProducto || 'https://via.placeholder.com/100'}" alt="${item.nombreProducto}">
>>>>>>> progreso
                </div>
                <div class="cart-item-details">
                    <h4>${item.nombreProducto}</h4>
                    <p>Precio: $${parseFloat(item.precioUnitario).toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.idProducto}" aria-label="Disminuir cantidad">-</button>
                    <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.idProducto}">
                    <button class="quantity-btn increase-btn" data-id="${item.idProducto}" aria-label="Aumentar cantidad">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <strong>S/ ${parseFloat(item.subtotal).toFixed(2)}</strong>
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

        summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        summaryDiscounts.textContent = `-S/ ${discounts.toFixed(2)}`;
        summaryTotal.textContent = `S/ ${total.toFixed(2)}`;

        // Habilitar o deshabilitar el botón de compra usando clases CSS
        if (cart.items.length === 0) {
            checkoutButton.classList.add('disabled');
        } else {
            checkoutButton.classList.remove('disabled');
        }
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

<<<<<<< HEAD
        // Aquí harías una llamada PUT/POST a tu backend para actualizar la cantidad
        console.log(`Actualizando producto ${productId} a cantidad ${newQuantity}`);
<<<<<<< HEAD
        // Ejemplo: await fetch(`${window.CONFIG.API_URL}/carrito/item/${productId}`, { method: 'PUT', body: JSON.stringify({ cantidad: newQuantity }), headers: {'Content-Type': 'application/json'} });
=======
        // Ejemplo: await fetch(`/api/carrito/item/${productId}`, { method: 'PUT', body: JSON.stringify({ cantidad: newQuantity }), headers: {'Content-Type': 'application/json'} });
>>>>>>> progreso
        
        // Después de la llamada exitosa, volver a cargar los datos
        fetchCartData();
=======
        await updateItemQuantity(productId, newQuantity);
>>>>>>> progreso
    }

    async function removeItem(productId) {
<<<<<<< HEAD
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            console.log(`Eliminando producto ${productId}`);
            // Aquí harías una llamada DELETE a tu backend
            // Ejemplo: await fetch(`${window.CONFIG.API_URL}/carrito/item/${productId}`, { method: 'DELETE' });
=======
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
<<<<<<< HEAD
            console.log(`Eliminando producto ${productId}`);
            // Aquí harías una llamada DELETE a tu backend
            // Ejemplo: await fetch(`/api/carrito/item/${productId}`, { method: 'DELETE' });
>>>>>>> progreso
=======
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE}/carrito/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
>>>>>>> progreso

                if (!response.ok) {
                    throw new Error('No se pudo eliminar el producto.');
                }
                
                // Recargar los datos del carrito para reflejar el cambio
                fetchCartData();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                alert('Hubo un error al eliminar el producto del carrito.');
            }
        }
    }

    async function updateItemQuantity(productId, quantity) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/carrito/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cantidad: quantity })
            });

            if (!response.ok) {
                throw new Error('No se pudo actualizar la cantidad.');
            }

            // Recargar los datos del carrito para reflejar el cambio
            fetchCartData();
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            alert('Hubo un error al actualizar la cantidad del producto.');
        }
    }

    // Carga inicial de los datos del carrito
    fetchCartData();
});