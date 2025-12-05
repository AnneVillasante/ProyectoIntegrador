document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // --- VERIFICACIÓN DE ACCESO ---
    if (!user.rol === 'Administrador' || !token) {
        alert('Acceso denegado. Esta página es solo para administradores.');
        window.location.href = '/';
        return;
    }

    // --- ELEMENTOS DEL DOM ---
    const customerInfoSummary = document.getElementById('customer-info-summary');
    const summaryProductList = document.getElementById('summary-product-list');
    const summaryTotalAmount = document.getElementById('summary-total-amount');
    const paymentOptions = document.querySelectorAll('.payment-method');
    const paymentDetailViews = document.querySelectorAll('.payment-details-view');
    const btnConfirmSale = document.getElementById('btn-confirm-sale');
    const stepPayment = document.getElementById('step-payment');
    const stepConfirmation = document.getElementById('step-confirmation');
    const orderIdPlaceholder = document.getElementById('order-id-placeholder');

    // --- ESTADO ---
    let selectedPaymentMethod = 'efectivo'; // Por defecto
    let saleData = null;

    // --- FUNCIONES ---

    /**
     * Carga los datos de la venta (carrito y cliente) desde localStorage.
     */
    function loadSaleData() {
        const storedSaleData = localStorage.getItem('physicalSaleData');
        if (!storedSaleData) {
            alert('No se encontraron datos de la venta. Volviendo al carrito.');
            window.location.href = '/admin/pos';
            return;
        }
        saleData = JSON.parse(storedSaleData);
        renderSummary();
    }

    /**
     * Muestra el resumen de la venta en la página.
     */
    function renderSummary() {
        const { customer, cart } = saleData;

        // Mostrar info del cliente
        customerInfoSummary.innerHTML = `
            <i class="fas fa-user" style="margin-right: 10px;"></i>
            <div>
                <strong>Cliente:</strong> ${customer.nombres} ${customer.apellidos || ''}<br>
                <small>${customer.correo}</small>
            </div>
        `;

        // Mostrar items del carrito
        if (!cart || cart.items.length === 0) {
            summaryProductList.innerHTML = '<p>El carrito está vacío.</p>';
            btnConfirmSale.disabled = true;
            return;
        }

        summaryProductList.innerHTML = cart.items.map(item => `
            <div class="summary-item">
                <img src="${window.CONFIG.IMG_URL}/${item.imagenProducto}" alt="${item.nombreProducto}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="item-details">
                    <h4>${item.nombreProducto}</h4>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>
                <div class="item-price">
                    <strong>S/ ${(item.precioUnitario * item.cantidad).toFixed(2)}</strong>
                </div>
            </div>
        `).join('');

        // Mostrar total
        summaryTotalAmount.textContent = `S/ ${(parseFloat(cart.total) || 0).toFixed(2)}`;
    }

    /**
     * "Auto-valida" el pago y crea el pedido en el backend.
     */
    async function confirmSale() {
        btnConfirmSale.disabled = true;
        btnConfirmSale.textContent = 'Procesando...';

        const { customer, cart } = saleData;

        const orderPayload = {
            correoCliente: customer.correo,
            items: cart.items,
            total: cart.total,
            metodoEntrega: 'tienda',
            direccionEntrega: null,
            metodoPago: selectedPaymentMethod
        };

        try {
            const response = await fetch(`${window.CONFIG.API_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo crear el pedido.');
            }

            const result = await response.json();
            
            // Limpiar el carrito de venta del admin
            await fetch(`${window.CONFIG.API_URL}/carritos?type=venta`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Limpiar datos temporales
            localStorage.removeItem('physicalSaleData');

            // Mostrar confirmación
            orderIdPlaceholder.textContent = `#${result.pedido.idPedido}`;
            stepPayment.classList.remove('active');
            stepConfirmation.classList.add('active');

        } catch (error) {
            alert(`Error al registrar la venta: ${error.message}`);
            btnConfirmSale.disabled = false;
            btnConfirmSale.textContent = 'Confirmar Venta y Pago';
        }
    }

    // --- EVENT LISTENERS ---

    paymentOptions.forEach(method => {
        method.addEventListener('click', () => {
            paymentOptions.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            selectedPaymentMethod = method.dataset.method;

            paymentDetailViews.forEach(view => view.classList.remove('active'));
            const activeView = document.getElementById(`payment-view-${selectedPaymentMethod}`);
            if (activeView) {
                activeView.classList.add('active');
            }
        });
    });

    btnConfirmSale.addEventListener('click', confirmSale);

    // --- INICIALIZACIÓN ---
    loadSaleData();
});