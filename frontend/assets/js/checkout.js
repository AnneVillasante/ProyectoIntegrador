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
    const confirmOrderButton = document.getElementById('confirm-order-button');

    let cartData = null;

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

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        confirmOrderButton.disabled = true;
        confirmOrderButton.textContent = 'Procesando...';

        const formData = new FormData(checkoutForm);
        const orderPayload = {
            items: cartData.items,
            total: cartData.total,
            metodoEntrega: formData.get('metodoEntrega'),
            direccionEntrega: formData.get('metodoEntrega') === 'delivery' ? formData.get('direccionEntrega') : null,
            metodoPago: formData.get('metodoPago')
        };

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
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo crear el pedido.');
            }

            const result = await response.json();
            alert('¡Pedido creado exitosamente!');
            // Redirigir a una página de confirmación o al perfil del usuario
            window.location.href = 'perfil.html'; // Asumiendo que tienes una página de perfil

        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert(`Error: ${error.message}`);
            confirmOrderButton.disabled = false;
            confirmOrderButton.textContent = 'Confirmar Pedido';
        }
    });

    fetchCart();
});