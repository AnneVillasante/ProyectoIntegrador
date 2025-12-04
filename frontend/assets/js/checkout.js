// frontend/assets/js/checkout.js - Módulo de Procesamiento de Pagos

const PaymentHandler = (() => {
    let stripe, cardElement;
    
    /**
     * Inicializa Stripe y monta el elemento de la tarjeta en el contenedor especificado.
     * @param {string} stripePublicKey - Tu clave pública de Stripe.
     * @param {string} cardElementSelector - El selector CSS para el div donde se montará la tarjeta.
     */
    const init = (stripePublicKey, cardElementSelector) => {
        stripe = Stripe(stripePublicKey);
        const elements = stripe.elements({ locale: 'es' });
        cardElement = elements.create('card', {
            style: { base: { fontSize: '16px', '::placeholder': { color: '#aab7c4' } } }
        });
        cardElement.mount(cardElementSelector);
    };
    
    /**
     * Procesa el pago. Crea el método de pago si es con tarjeta y luego envía el pedido al backend.
     * @param {object} orderPayload - El objeto completo con los datos del pedido.
     * @param {string} token - El token de autenticación del usuario.
     * @returns {Promise<object>} - Una promesa que se resuelve con el resultado del pedido.
     */
    const processPayment = async (orderPayload, token) => {
        // Si el pago es con tarjeta, primero crea el paymentMethod de Stripe.
        if (orderPayload.metodoPago === 'card') {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    email: orderPayload.correo,
                },
            });

            if (error) {
                // En lugar de interactuar con el DOM, rechazamos la promesa con el error.
                return Promise.reject(error);
            }
            // Anadimos el ID del método de pago al payload del pedido.
            orderPayload.paymentMethodId = paymentMethod.id;
        } else if (orderPayload.metodoPago === 'efectivo') {
            // Para pago en efectivo, no se necesita un paymentMethodId de Stripe.
            // Simplemente continuamos para crear el pedido en el backend.
            console.log('Procesando pedido con pago en efectivo.');
        }

        // Ahora, crea el pedido en el backend con el payload completo.
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'No se pudo procesar el pedido.');
            }

            const result = await response.json();

            // Manejar 3D Secure si es necesario
            if (result.requiresAction && result.clientSecret) {
                const { error: confirmationError } = await stripe.handleCardAction(result.clientSecret);
                if (confirmationError) {
                    throw new Error(confirmationError.message);
                }
            }
            
            return result; // Devuelve el resultado exitoso.
        } catch (error) {
            // Rechaza la promesa si hay un error en la llamada a la API.
            return Promise.reject(error);
        }
    };

    // Exponer los métodos públicos.
    return {
        init,
        processPayment,
    };
})();

// Hacemos el objeto accesible globalmente para que compra.js pueda usarlo.
window.PaymentHandler = PaymentHandler;