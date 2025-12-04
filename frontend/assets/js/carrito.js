document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTitle = document.getElementById('cart-title');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscounts = document.getElementById('summary-discounts'); // Asumiendo que podrías tener descuentos
    const summaryTotal = document.getElementById('summary-total');
    const checkoutButton = document.getElementById('checkout-button');

    // --- ELEMENTOS PARA GESTIÓN DE CLIENTES (MODO VENTA) ---
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

    // Determinar el modo del carrito (para administradores)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.rol === 'Administrador';
    const cartType = isAdmin ? (localStorage.getItem('activeCart') || 'personal') : 'personal';
    let selectedCustomer = null; // Cliente seleccionado para la venta

    if (cartTitle) {
        cartTitle.textContent = cartType === 'venta' ? 'Carrito de Venta Física' : 'Mi Carrito de Compras';
    }

    // Si es admin en modo venta, mostrar el selector de cliente
    if (isAdmin && cartType === 'venta') {
        customerSelectionContainer.style.display = 'block';
        setupCustomerManagement();
    }

    async function fetchCartData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Si no hay token, el usuario no ha iniciado sesión.
                // Podemos mostrar el carrito vacío y redirigir o mostrar un mensaje.
                alert('Debes iniciar sesión para ver tu carrito.');
                window.location.href = '/pages/login.html'; // Redirigir al login
                return;
            }

            // La ruta GET /api/carrito obtiene el carrito del usuario autenticado por su token.
            const apiUrl = `${window.CONFIG.API_URL}/carrito?type=${cartType}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

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
                    <img src="${window.CONFIG.IMG_URL}/${item.imagenProducto}" alt="${item.nombreProducto}" onerror="this.onerror=null;this.src='https://via.placeholder.com/100';">
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

    // --- LÓGICA DE GESTIÓN DE CLIENTES (MODO VENTA) ---

    function setupCustomerManagement() {
        customerSearchInput.addEventListener('input', (e) => searchCustomers(e.target.value));
        document.addEventListener('click', (e) => { // Ocultar resultados si se hace clic fuera
            if (!customerSelectionContainer.contains(e.target)) {
                customerSearchResults.style.display = 'none';
            }
        });
        clearCustomerBtn.addEventListener('click', clearSelectedCustomer);
        openNewCustomerModalBtn.addEventListener('click', () => { newCustomerModal.style.display = 'block'; });
        closeModalBtn.addEventListener('click', () => { newCustomerModal.style.display = 'none'; });
        newCustomerForm.addEventListener('submit', handleNewCustomerSubmit);
    }

    let allCustomers = []; // Caché para no llamar a la API en cada tipeo

    async function searchCustomers(query) {
        if (query.length < 3) {
            customerSearchResults.style.display = 'none';
            return;
        }

        try {
            // Si la caché de clientes está vacía, la llenamos.
            if (allCustomers.length === 0) {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.CONFIG.API_URL}/usuario?rol=Cliente`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('No se pudieron cargar los clientes.');
                allCustomers = await response.json();
            }

            // Filtrar localmente en la caché de clientes.
            const lowerCaseQuery = query.toLowerCase();
            const filteredCustomers = allCustomers.filter(customer =>
                customer.nombres.toLowerCase().includes(lowerCaseQuery) ||
                (customer.apellidos && customer.apellidos.toLowerCase().includes(lowerCaseQuery)) ||
                customer.correo.toLowerCase().includes(lowerCaseQuery)
            );
            renderSearchResults(filteredCustomers);
        } catch (error) {
            console.error('Error buscando clientes:', error);
            customerSearchResults.innerHTML = '<div class="search-result-item">Error al buscar</div>';
            customerSearchResults.style.display = 'block';
        }
    }

    function renderSearchResults(customers) {
        customerSearchResults.innerHTML = '';
        if (customers.length === 0) {
            customerSearchResults.innerHTML = '<div class="search-result-item">No se encontraron clientes.</div>';
        } else {
            customers.forEach(customer => {
                const item = document.createElement('div');
                item.classList.add('search-result-item');
                item.textContent = `${customer.nombres} ${customer.apellidos} (${customer.correo})`;
                item.addEventListener('click', () => selectCustomer(customer));
                customerSearchResults.appendChild(item);
            });
        }
        customerSearchResults.style.display = 'block';
    }

    function selectCustomer(customer) {
        selectedCustomer = customer;
        localStorage.setItem('physicalSaleCustomer', JSON.stringify(customer)); // Guardar cliente para el checkout
        currentCustomerName.textContent = `${customer.nombres} ${customer.apellidos || ''}`.trim();
        currentCustomerInfo.style.display = 'flex';
        customerSearchInput.style.display = 'none';
        customerSearchResults.style.display = 'none';
        customerSearchInput.value = '';
    }

    function clearSelectedCustomer() {
        selectedCustomer = null;
        localStorage.removeItem('physicalSaleCustomer');
        currentCustomerInfo.style.display = 'none';
        customerSearchInput.style.display = 'block';
    }

    async function handleNewCustomerSubmit(e) {
        e.preventDefault();
        modalErrorMessage.style.display = 'none';
        const nombre = document.getElementById('new-customer-nombre').value;
        const apellido = document.getElementById('new-customer-apellido').value;
        const correo = document.getElementById('new-customer-email').value;
        const dni = document.getElementById('new-customer-dni').value;
        const telefono = document.getElementById('new-customer-telefono').value;

        try {
            // [CORRECCIÓN] Usar el endpoint para crear un cliente rápido, no un usuario completo.
            // Esto es consistente con la lógica de venta física.
            const token = localStorage.getItem('token'); // Necesario para la autorización
            const response = await fetch(`${window.CONFIG.API_URL}/clientes/quick-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ nombres: nombre, apellidos: apellido, correo: correo, dni: dni, telefono: telefono })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'No se pudo crear el cliente.');
            
            alert('Cliente creado con éxito.');
            newCustomerModal.style.display = 'none';
            newCustomerForm.reset();
            // El endpoint devuelve un objeto 'cliente', no 'user'.
            selectCustomer(result.cliente);

        } catch (error) {
            modalErrorMessage.textContent = `Error: ${error.message}`;
            modalErrorMessage.style.display = 'block';
        }
    }

    // Al cargar la página, verificar si hay un cliente guardado (modo venta)
    if (isAdmin && cartType === 'venta') {
        const savedCustomer = localStorage.getItem('physicalSaleCustomer');
        if (savedCustomer) {
            selectCustomer(JSON.parse(savedCustomer));
        }
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

        await updateItemQuantity(productId, newQuantity);
    }

    async function removeItem(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                    window.location.href = '/pages/login.html';
                    return;
                }

                const apiUrl = `${window.CONFIG.API_URL}/carrito/${productId}?type=${cartType}`;
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
                window.location.href = '/pages/login.html';
                return;
            }

            const apiUrl = `${window.CONFIG.API_URL}/carrito/${productId}?type=${cartType}`;
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
        checkoutButton.addEventListener('click', (e) => {
            if (cartType === 'venta' && !selectedCustomer) {
                e.preventDefault(); // Detener la navegación
                alert('Por favor, asigna un cliente a la venta antes de continuar.');
                customerSearchInput.focus();
            }
            // Si es carrito personal o si ya hay un cliente, la navegación a compra.html continúa.
        });
    }


    // Carga inicial de los datos del carrito
    fetchCartData();
});