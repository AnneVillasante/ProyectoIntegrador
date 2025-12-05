document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTitle = document.getElementById('cart-title');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscounts = document.getElementById('summary-discounts');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutButton = document.getElementById('checkout-button');

    // --- ESTADO ---
    // Este archivo ahora solo maneja el carrito personal.
    const cartType = 'personal';

    // --- ELEMENTOS PARA CUPÓN DE DESCUENTO ---
    const couponCodeInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponFeedback = document.getElementById('coupon-feedback');
    let appliedDiscount = 0; // Almacena el descuento aplicado

    if (cartTitle) {
        cartTitle.textContent = 'Mi Carrito de Compras';
    }

    // El carrito personal siempre tiene gestión de cupones.
    setupCouponManagement();

    async function fetchCartData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión para ver tu carrito.');
                window.location.href = '/login';
                return;
            }

            const apiUrl = `${window.CONFIG.API_URL}/carritos?type=${cartType}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            const cartData = await response.json(); // cartData se declara aquí
            renderCart(cartData);
        } catch (error) {
            console.error('Error al obtener los datos del carrito:', error);
            showEmptyCart();
        }
    }

    function renderCart(cart) {
        if (!cart || !cart.items || cart.items.length === 0) {
            showEmptyCart();
            return;
        }

        hideEmptyCart();
        cartItemsContainer.innerHTML = '';

        cart.items.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.dataset.idProducto = item.idProducto;
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${window.CONFIG.IMG_URL}/${item.imagenProducto}" alt="${item.nombreProducto}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.nombreProducto}</h4>
                    <p>Precio: S/ ${parseFloat(item.precioUnitario).toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.idProducto}">-</button>
                    <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.idProducto}">
                    <button class="quantity-btn increase-btn" data-id="${item.idProducto}">+</button>
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

            // Solución para el error de CSP y 404: Asignar onerror desde JS
            const imgElement = cartItemElement.querySelector('img');
            imgElement.onerror = () => {
                imgElement.src = 'https://via.placeholder.com/100';
            };
        });

        updateSummary(cart);
        addEventListenersToItems();
    }

    function updateSummary(cart) {
        const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
        const total = subtotal - appliedDiscount;

        summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        summaryDiscounts.textContent = `-S/ ${appliedDiscount.toFixed(2)}`;
        summaryTotal.textContent = `S/ ${total.toFixed(2) > 0 ? total.toFixed(2) : '0.00'}`;

        // Habilitar o deshabilitar el botón de compra
        if (cart.items.length === 0) {
            checkoutButton.classList.add('disabled');
        } else {
            checkoutButton.classList.remove('disabled');
        }
    }

    function showEmptyCart() {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        document.querySelector('.cart-summary').style.display = 'none';
    }

    function hideEmptyCart() {
        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'block';
    }

    // --- LÓGICA DE GESTIÓN DE CUPONES ---
    function setupCouponManagement() {
        if (!applyCouponBtn) return;

        applyCouponBtn.addEventListener('click', async () => {
            const code = couponCodeInput.value.trim().toUpperCase();
            if (!code) {
                showCouponFeedback('Por favor, ingresa un código de cupón.', 'error');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                // Endpoint de ejemplo. Debes crearlo en tu backend.
                const response = await fetch(`${window.CONFIG.API_URL}/cupones/validar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ codigo_cupon: code })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'El cupón no es válido o ha expirado.');
                }

                // El backend debería devolver el monto del descuento
                const { descuento, mensaje } = result;
                appliedDiscount = parseFloat(descuento);

                showCouponFeedback(mensaje || '¡Cupón aplicado con éxito!', 'success');
                
                // Deshabilitar el input y el botón para evitar múltiples aplicaciones
                couponCodeInput.disabled = true;
                applyCouponBtn.disabled = true;
                applyCouponBtn.textContent = 'Aplicado';

                // Recargar datos del carrito para que el resumen se actualice
                fetchCartData();

            } catch (error) {
                showCouponFeedback(error.message, 'error');
            }
        });
    }

    function showCouponFeedback(message, type) {
        couponFeedback.textContent = message;
        couponFeedback.className = `feedback-message ${type}`; // 'success' o 'error'
        couponFeedback.style.display = 'block';
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
            await removeItem(productId);
            return;
        }

        await updateItemQuantity(productId, newQuantity);
    }

    async function removeItem(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                    window.location.href = '/login';
                    return;
                }

                const apiUrl = `${window.CONFIG.API_URL}/carritos/${productId}?type=${cartType}`;
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

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
            if (!token) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                window.location.href = '/login';
                return;
            }

            const apiUrl = `${window.CONFIG.API_URL}/carritos/${productId}?type=${cartType}`;
            const response = await fetch(apiUrl, {
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

    // --- LÓGICA DE CHECKOUT ---
    if (checkoutButton) {
        // No se necesita lógica especial aquí, el botón simplemente navega a /compra
    }


    // Carga inicial de los datos del carrito
    fetchCartData();
});