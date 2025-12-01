document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Si no hay token, redirigir al login, ya que la compra requiere autenticación
        window.location.href = '/login';
        return;
    }
    
    // Elementos de los pasos
    const steps = {
        summary: document.getElementById('step-summary'),
        customerData: document.getElementById('step-customer-data'),
        payment: document.getElementById('step-payment'),
        confirmation: document.getElementById('step-confirmation')
    };
    
    // Indicadores de progreso
    const progressSteps = {
        step1: document.getElementById('progress-step-1'),
        step2: document.getElementById('progress-step-2'),
        step3: document.getElementById('progress-step-3')
    };

    // --- Elementos del DOM ---
    const btnToCustomerData = document.getElementById('btn-to-customer-data');
    const btnBackToSummary = document.getElementById('btn-back-to-summary');
    const btnToPayment = document.getElementById('btn-to-payment');
    const btnBackToCustomerData = document.getElementById('btn-back-to-customer-data');
    const btnFinalizePurchase = document.getElementById('btn-finalize-purchase');
    const customerDataForm = document.getElementById('customer-data-form');

    const summaryProductList = document.getElementById('summary-product-list');
    const summaryTotalAmount = document.getElementById('summary-total-amount');
    const customerEmailInput = document.getElementById('customer-email');
    const customerPhoneInput = document.getElementById('customer-phone');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    const deliveryAddressInput = document.getElementById('delivery-address');
    const orderIdPlaceholder = document.getElementById('order-id-placeholder');

    // Elementos de pago
    const paymentOptions = document.querySelectorAll('.payment-method');
    const cardElementContainer = document.getElementById('card-element-container');
    const cardElementDiv = document.getElementById('card-element');
    const cardErrors = document.getElementById('card-errors');

    // --- LÓGICA DE NAVEGACIÓN ---
    const navigateToStep = (stepName) => {
        Object.values(steps).forEach(step => step.classList.remove('active'));
        steps[stepName].classList.add('active');

        progressSteps.step1.classList.toggle('active', stepName === 'summary' || stepName === 'customerData' || stepName === 'payment' || stepName === 'confirmation');
        progressSteps.step2.classList.toggle('active', stepName === 'customerData' || stepName === 'payment' || stepName === 'confirmation');
        progressSteps.step3.classList.toggle('active', stepName === 'payment' || stepName === 'confirmation');
    };

    btnToCustomerData.addEventListener('click', () => navigateToStep('customerData'));
    btnBackToSummary.addEventListener('click', () => navigateToStep('summary'));
    btnToPayment.addEventListener('click', () => {
        // Añadimos una clase para que el CSS pueda mostrar los errores de validación
        customerDataForm.classList.add('was-validated');
        if (customerDataForm.checkValidity()) {
            navigateToStep('payment');
        } else {
            // El feedback visual lo dará el CSS, no necesitamos un alert.
        }
    });
    btnBackToCustomerData.addEventListener('click', () => navigateToStep('customerData'));

    // --- CARGA DE DATOS ---
    const loadCartAndUserData = async () => {
        try {
            // Cargar carrito
            const cartResponse = await fetch(`${window.CONFIG.API_URL}/carrito`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!cartResponse.ok) throw new Error('Error al cargar el carrito');
            cartData = await cartResponse.json();

            // Cargar datos del usuario
            const userResponse = await fetch(`${window.CONFIG.API_URL}/usuario/perfil`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!userResponse.ok) throw new Error('Error al cargar datos del usuario');
            const userData = await userResponse.json();

            renderSummary();
            populateUserData(userData);

        } catch (error) {
            console.error(error);
            summaryProductList.innerHTML = `<p style="color: #ff6b6b;">${error.message}. No se pudo cargar el resumen.</p>`;
        }
    };

    const renderSummary = () => {
        if (!cartData || cartData.items.length === 0) {
            summaryProductList.innerHTML = '<p>Tu carrito está vacío. No puedes continuar.</p>';
            btnToCustomerData.disabled = true;
            return;
        }

        summaryProductList.innerHTML = cartData.items.map(item => `
            <div class="summary-item">
                <img src="${window.CONFIG.IMG_URL}/${item.imagenProducto.replace(/\\/g, '/')}" alt="${item.nombreProducto}" onerror="this.src='../assets/img/placeholder.png'">
                <div class="item-details">
                    <h4>${item.nombreProducto}</h4>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>
                <div class="item-price">
                    <strong>S/ ${(item.precioUnitario * item.cantidad).toFixed(2)}</strong>
                </div>
            </div>
        `).join('');

        summaryTotalAmount.textContent = `S/ ${(parseFloat(cartData.total) || 0).toFixed(2)}`;
    };

    const populateUserData = (user) => {
        customerEmailInput.value = user.correo || '';
        customerPhoneInput.value = user.telefono || '';
    };

    // --- LÓGICA DE FORMULARIOS ---

    document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            deliveryAddressSection.classList.toggle('hidden', e.target.value !== 'delivery');
            deliveryAddressInput.required = (e.target.value === 'delivery');
        });
    });

    paymentOptions.forEach(method => {
        method.addEventListener('click', () => {
            paymentOptions.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            selectedPaymentMethod = method.dataset.method;

            // Mostrar/ocultar el formulario de tarjeta
            cardElementContainer.classList.toggle('hidden', selectedPaymentMethod !== 'card');
        });
    });

    // --- FINALIZAR COMPRA ---
    btnFinalizePurchase.addEventListener('click', async () => {
        if (!selectedPaymentMethod) {
            alert('Por favor, selecciona un método de pago.');
            return;
        }

        // Validar datos del cliente una última vez
        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        if (deliveryMethod === 'delivery' && !deliveryAddressInput.value) {
            alert('Por favor, ingresa tu dirección de envío.');
            navigateToStep('customerData');
            customerDataForm.classList.add('was-validated'); // Marcar para mostrar errores
            return;
        }

        btnFinalizePurchase.disabled = true;
        btnFinalizePurchase.textContent = 'Procesando...';
        cardErrors.textContent = '';

        const orderPayload = {
            items: cartData.items,
            total: cartData.total,
            metodoEntrega: document.querySelector('input[name="deliveryMethod"]:checked').value,
            direccionEntrega: deliveryAddressInput.value,
            metodoPago: selectedPaymentMethod,
            correo: customerEmailInput.value,
            telefono: customerPhoneInput.value
        };

        try {
            // Llamar al módulo de pago para procesar el pedido
            const result = await window.PaymentHandler.processPayment(orderPayload, token);
            
            // Si el pago es exitoso, mostrar la confirmación
            orderIdPlaceholder.textContent = `#${result.pedido.idPedido}`;
            navigateToStep('confirmation');

        } catch (error) {
            alert(`Error al finalizar la compra: ${error.message}`);
            btnFinalizePurchase.disabled = false;
            btnFinalizePurchase.textContent = 'Finalizar Compra';
            // Mostrar errores de tarjeta si existen
            if (error.message) {
                cardErrors.textContent = error.message;
            }
        }
    });

    // Iniciar carga de datos al cargar la página
    loadCartAndUserData();

    // Inicializar el manejador de pagos (Stripe)
    if (window.PaymentHandler) {
        window.PaymentHandler.init(window.CONFIG.STRIPE_PUBLIC_KEY, '#card-element');
    }
});
