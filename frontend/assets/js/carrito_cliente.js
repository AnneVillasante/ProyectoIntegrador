document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTitle = document.getElementById('cart-title');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscounts = document.getElementById('summary-discounts');
    const summaryTotal = document.getElementById('summary-total');
    const proceedToPaymentButton = document.getElementById('proceed-to-payment-button');
    const customerSelectionContainer = document.getElementById('customer-selection-container');
    const customerSearchInput = document.getElementById('customer-search-input');
    const customerSearchResults = document.getElementById('customer-search-results');
    const currentCustomerInfo = document.getElementById('current-customer-info');
    const currentCustomerName = document.getElementById('current-customer-name');
    const clearCustomerBtn = document.getElementById('clear-customer-btn');
    const openNewCustomerModalBtn = document.getElementById('open-new-customer-modal');
    const newCustomerModal = document.getElementById('new-customer-modal');
    const newCustomerForm = document.getElementById('new-customer-form');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalErrorMessage = document.getElementById('modal-error-message');
    
    // --- ELEMENTOS PARA CUPÓN DE DESCUENTO ---
    const couponCodeInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponFeedback = document.getElementById('coupon-feedback');
    let appliedDiscount = 0; // Almacena el descuento aplicado

    // --- ESTADO ---
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const isAdmin = user.rol === 'Administrador';
    const cartType = 'venta'; // Esta página es exclusivamente para ventas físicas
    let selectedCustomer = null;
    let cartData = null;

    // --- VERIFICACIÓN DE ACCESO ---
    if (!isAdmin || !token) {
        alert('Acceso denegado. Esta página es solo para administradores.');
        window.location.href = '/';
        return;
    }

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Obtiene los datos del carrito de venta desde el backend.
     */
    async function fetchCartData() {
        try { // Ajustado a la nueva ruta plural
            const apiUrl = `${window.CONFIG.API_URL}/carritos?type=${cartType}`;
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            cartData = await response.json();
            renderCart(cartData);
        } catch (error) {
            console.error('Error al obtener los datos del carrito:', error);
            showEmptyCart();
        }
    }

    /**
     * Renderiza los items del carrito en el DOM.
     * @param {object} cart - El objeto del carrito con sus items.
     */
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
                    <button class="remove-btn" data-id="${item.idProducto}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
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

    /**
     * Actualiza el resumen de la compra (subtotal, total, etc.).
     * @param {object} cart - El objeto del carrito.
     */
    function updateSummary(cart) {
        const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
        const total = subtotal - appliedDiscount;

        summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        summaryDiscounts.textContent = `-S/ ${appliedDiscount.toFixed(2)}`;
        summaryTotal.textContent = `S/ ${total.toFixed(2) > 0 ? total.toFixed(2) : '0.00'}`;

        if (cart.items.length === 0) {
            proceedToPaymentButton.classList.add('disabled');
        } else {
            proceedToPaymentButton.classList.remove('disabled');
        }
    }

    /**
     * Finaliza la venta creando un pedido en el backend.
     */
    function proceedToPayment() {
        if (!selectedCustomer) {
            alert('Por favor, selecciona un cliente para la venta.');
            return;
        }
        if (!cartData || cartData.items.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        // Guardar los datos necesarios en localStorage para la siguiente página
        const saleData = {
            customer: selectedCustomer,
            cart: { ...cartData, total: parseFloat(summaryTotal.textContent.replace('S/ ', '')) }
        };
        localStorage.setItem('physicalSaleData', JSON.stringify(saleData));

        // Redirigir a la nueva página de pago
        window.location.href = '/admin/pos/pago';
    }

    /**
     * ✅ Nueva función para limpiar explícitamente el carrito de venta del admin.
     * Esto es necesario porque el pedido se crea para otro cliente, y el carrito
     * del admin no se vacía automáticamente.
     */
    async function clearAdminCart() {
        try {
            // Llama al endpoint genérico de carritos, pero con método DELETE.
            // La función apiCallToCart ya incluye el token y el tipo de carrito.
            await apiCallToCart('', 'DELETE');
        } catch (error) {
            console.error('No se pudo limpiar el carrito del administrador:', error);
            // Aunque falle, la venta fue exitosa. Se puede recargar para forzar la limpieza.
            window.location.reload();
        }
    }
    // --- LÓGICA DE GESTIÓN DE CLIENTES ---

    /**
     * Busca clientes en el backend según el texto introducido.
     */
    async function searchCustomers(query) {
        if (query.length < 3) {
            customerSearchResults.style.display = 'none';
            return;
        }
        try {
            const response = await fetch(`${window.CONFIG.API_URL}/clientes?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                // Intenta obtener más detalles del error desde el backend
                const errorData = await response.json().catch(() => null); // Intenta parsear JSON, si falla, no hay cuerpo
                const errorMessage = errorData?.error || `Error en la búsqueda (Status: ${response.status})`;
                throw new Error(errorMessage);
            }
            const customers = await response.json();
            renderSearchResults(customers);
        } catch (error) {
            console.error('Error buscando clientes:', error);
            customerSearchResults.innerHTML = `<div class="search-result-item">Error: ${error.message}</div>`;
            customerSearchResults.style.display = 'block';
        }
    }

    /**
     * Muestra los resultados de la búsqueda de clientes.
     */
    function renderSearchResults(customers) {
        customerSearchResults.innerHTML = '';
        if (customers.length === 0) {
            customerSearchResults.innerHTML = '<div class="search-result-item">No se encontraron clientes.</div>';
        } else {
            customers.forEach(customer => { // customer aquí tiene 'email'
                const item = document.createElement('div');
                item.classList.add('search-result-item');
                item.textContent = `${customer.nombres} ${customer.apellidos} (${customer.correo})`;
                item.addEventListener('click', () => selectCustomer(customer));
                customerSearchResults.appendChild(item);
            });
        }
        customerSearchResults.style.display = 'block';
    }

    /**
     * Asigna un cliente a la venta actual.
     */
    function selectCustomer(customer) {
        selectedCustomer = customer;
        currentCustomerName.textContent = `${customer.nombres} ${customer.apellidos || ''}`.trim();
        currentCustomerInfo.style.display = 'flex';
        customerSearchInput.style.display = 'none';
        customerSearchResults.style.display = 'none';
        customerSearchInput.value = '';
    }

    /**
     * Limpia el cliente seleccionado para poder buscar otro.
     */
    function clearSelectedCustomer() {
        selectedCustomer = null;
        currentCustomerInfo.style.display = 'none';
        customerSearchInput.style.display = 'block';
    }

    /**
     * Maneja la creación de un nuevo cliente desde el modal.
     */
    async function handleNewCustomerSubmit(e) {
        e.preventDefault();
        modalErrorMessage.style.display = 'none';
        const nombres = document.getElementById('new-customer-nombres').value;
        const apellidos = document.getElementById('new-customer-apellidos').value;
        const correo = document.getElementById('new-customer-email').value;
        const dni = document.getElementById('new-customer-dni').value;
        const telefono = document.getElementById('new-customer-telefono').value;

        try {
            // [CAMBIO] Usamos el nuevo endpoint para crear un cliente sin usuario
            const response = await fetch(`${window.CONFIG.API_URL}/clientes/quick-create`, { // Esta ruta ahora es correcta
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ nombres: nombres, apellidos: apellidos, correo: correo, dni: dni, telefono: telefono })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'No se pudo crear el cliente.');
            
            // alert('Cliente creado con éxito.'); // Quitado para una mejor UX
            newCustomerModal.style.display = 'none';
            newCustomerForm.reset();
            // Seleccionamos automáticamente al nuevo cliente creado
            selectCustomer(result.cliente);

        } catch (error) {
            modalErrorMessage.textContent = `Error: ${error.message}`;
            modalErrorMessage.style.display = 'block';
        }
    }

    /**
     * Resetea la UI a su estado inicial para una nueva venta.
     */
    function resetSaleUI() {
        clearSelectedCustomer();
        // fetchCartData() se llama automáticamente dentro de apiCallToCart (en clearAdminCart),
        // por lo que no es necesario llamarlo de nuevo aquí.
    }

    // --- FUNCIONES AUXILIARES Y DE EVENTOS ---

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

    function addEventListenersToItems() {
        document.querySelectorAll('.decrease-btn').forEach(btn => btn.addEventListener('click', () => handleQuantityChange(btn.dataset.id, -1)));
        document.querySelectorAll('.increase-btn').forEach(btn => btn.addEventListener('click', () => handleQuantityChange(btn.dataset.id, 1)));
        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', () => removeItem(btn.dataset.id)));
    }

    async function handleQuantityChange(productId, change) {
        const itemElement = document.querySelector(`.cart-item[data-id-producto='${productId}']`);
        const input = itemElement.querySelector('.quantity-input');
        let newQuantity = parseInt(input.value) + change;

        if (newQuantity < 1) {
            await removeItem(productId);
        } else {
            await updateItemQuantity(productId, newQuantity);
        }
    }

    async function updateItemQuantity(productId, quantity) {
        await apiCallToCart(`/${productId}`, 'PUT', { cantidad: quantity });
    }

    async function removeItem(productId) {
        if (confirm('¿Eliminar este producto del carrito de venta?')) {
            await apiCallToCart(`/${productId}`, 'DELETE');
        }
    }

    async function apiCallToCart(endpoint = '', method = 'GET', body = null) {
        try {
            const apiUrl = `${window.CONFIG.API_URL}/carritos${endpoint}?type=${cartType}`; // Ajustado a la nueva ruta plural
            const options = {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            };
            if (body) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
            const response = await fetch(apiUrl, options);
            if (!response.ok) throw new Error('Error en la operación del carrito.');
            fetchCartData(); // Recargar todo el carrito para mantener la consistencia
        } catch (error) {
            console.error(`Error en API call (${method}) al carrito:`, error);
            alert('Hubo un error al actualizar el carrito.');
        }
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
    // --- INICIALIZACIÓN ---
    fetchCartData();

    // Event Listeners de la sección de clientes
    customerSearchInput.addEventListener('input', (e) => searchCustomers(e.target.value));
    document.addEventListener('click', (e) => { // Ocultar resultados si se hace clic fuera
        if (!customerSelectionContainer.contains(e.target)) {
            customerSearchResults.style.display = 'none';
        }
    });
    clearCustomerBtn.addEventListener('click', clearSelectedCustomer);

    // Event Listeners del Modal
    openNewCustomerModalBtn.addEventListener('click', () => { newCustomerModal.style.display = 'flex'; });
    closeModalBtn.addEventListener('click', () => { newCustomerModal.style.display = 'none'; });
    // Cierra el modal si se hace clic fuera del contenido
    newCustomerModal.addEventListener('click', (e) => {
        if (e.target === newCustomerModal) {
            newCustomerModal.style.display = 'none';
        }
    });
    newCustomerForm.addEventListener('submit', handleNewCustomerSubmit);

    // Event Listener del botón para proceder al pago
    proceedToPaymentButton.addEventListener('click', proceedToPayment);

    // Inicializar la gestión de cupones
    setupCouponManagement();
});