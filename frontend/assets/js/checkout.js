// frontend/assets/js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const orderItemsContainer = document.getElementById('order-items-container');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const metodoEntregaSelect = document.getElementById('metodo-entrega');
    const direccionEntregaGroup = document.getElementById('direccion-entrega-group');
    const direccionEntregaInput = document.getElementById('direccion-entrega');
    const metodoPagoSelect = document.getElementById('metodo-pago');
    const cardElementContainer = document.getElementById('card-element-container');
    const confirmOrderButton = document.getElementById('confirm-order-button');

    let cartData = null;

    // --- Configuración de Stripe ---
    // Reemplaza 'TU_CLAVE_PUBLICA_DE_STRIPE' con tu clave real
    const stripe = Stripe('pk_test_51SZWCJ3flV6CgDCbFFRTIe1p3Ajf59NxdLoQ1fv62Q7fWm6COFgHVUeZJAOocMYOcLfhIW0lRpKEbmHNb61lfXJh007I2a0yjd'); 
    const elements = stripe.elements();
    const cardElement = elements.create('card', {
        style: { base: { fontSize: '16px' } }
    });
    cardElement.mount('#card-element');
    const cardErrors = document.getElementById('card-errors');

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/carrito', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                     window.location.href = 'login.html';
                }
                throw new Error('No se pudo cargar el resumen del pedido.');
            }

            cartData = await response.json();
            renderOrderSummary(cartData);

        } catch (error) {
            console.error('Error:', error);
            orderItemsContainer.innerHTML = `<p>Error al cargar el resumen. Inténtalo de nuevo.</p>`;
        }
    };

    const renderOrderSummary = (cart) => {
        if (!cart || !cart.items || cart.items.length === 0) {
            orderItemsContainer.innerHTML = '<p>No hay productos en tu pedido.</p>';
            confirmOrderButton.disabled = true;
            return;
        }

        orderItemsContainer.innerHTML = cart.items.map(item => `
            <div class="order-item">
                <span>${item.nombreProducto} (x${item.cantidad})</span>
                <span>S/ ${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
        `).join('');

        summaryTotal.textContent = `S/ ${parseFloat(cart.total).toFixed(2)}`;
    };

    metodoEntregaSelect.addEventListener('change', (e) => {
        if (e.target.value === 'delivery') {
            direccionEntregaGroup.style.display = 'block';
            direccionEntregaInput.required = true;
        } else {
            direccionEntregaGroup.style.display = 'none';
            direccionEntregaInput.required = false;
        }
    });

    metodoPagoSelect.addEventListener('change', (e) => {
        if (e.target.value === 'tarjeta') {
            cardElementContainer.style.display = 'block';
        } else {
            cardElementContainer.style.display = 'none';
        }
    });

    // Mostrar el campo de tarjeta si es la opción por defecto
    if (metodoPagoSelect.value === 'tarjeta') {
        cardElementContainer.style.display = 'block';
    }

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        confirmOrderButton.disabled = true;
        confirmOrderButton.textContent = 'Procesando...';
        cardErrors.textContent = '';

        const formData = new FormData(checkoutForm);
        const metodoPago = formData.get('metodoPago');

        const orderPayload = {
            items: cartData.items,
            total: cartData.total,
            metodoEntrega: formData.get('metodoEntrega'),
            direccionEntrega: formData.get('metodoEntrega') === 'delivery' ? formData.get('direccionEntrega') : null,
            metodoPago: formData.get('metodoPago')
        };

        if (metodoPago === 'tarjeta') {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                cardErrors.textContent = error.message;
                confirmOrderButton.disabled = false;
                confirmOrderButton.textContent = 'Confirmar Pedido';
                return;
            }

            orderPayload.paymentMethodId = paymentMethod.id;
        }

        await createOrder(orderPayload);
    });

    const createOrder = async (orderPayload) => {
        try {
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); // Evita error si no hay JSON
                throw new Error(errorData.error || `Error del servidor: ${response.statusText}`);
            }

            const result = await response.json();

            // Si el backend requiere una acción adicional (como 3D Secure)
            if (result.requiresAction) {
                confirmOrderButton.textContent = 'Autenticando...';
                const { error: confirmationError } = await stripe.handleCardAction(result.clientSecret);

                if (confirmationError) {
                    throw new Error(confirmationError.message);
                }
                // El pago se reintentará en el backend después de la autenticación.
                // Aquí podrías mostrar un mensaje o esperar una confirmación final.
                // Por simplicidad, redirigimos asumiendo que el backend lo manejará.
            }

            alert('¡Pedido procesado exitosamente!');
            localStorage.removeItem('cart'); // Limpiar carrito local si aplica
            window.location.href = '/perfil'; 

        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert(`Error: ${error.message}`);
            confirmOrderButton.disabled = false; // Habilitar el botón en caso de error
            confirmOrderButton.textContent = 'Confirmar Pedido';
        }
    };

    fetchCart();
});