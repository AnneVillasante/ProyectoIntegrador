document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');

  // --- Lógica para el sistema de pestañas ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Ocultar todos los contenidos y quitar la clase 'active' de los botones
      tabContents.forEach(content => content.classList.remove('active'));
      tabButtons.forEach(btn => btn.classList.remove('active'));

      // Mostrar el contenido de la pestaña seleccionada y marcar el botón como activo
      document.getElementById(targetTab).classList.add('active');
      button.classList.add('active');
    });
  });
  // --- Fin de la lógica de pestañas ---

  // Cargar datos del perfil del usuario
  async function loadProfile() {
    try {
      const response = await fetch('/api/usuarios/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la información del perfil.');
      }

      const user = await response.json();

      // Llenar el formulario con los datos del usuario
      document.getElementById('nombres').value = user.nombres || '';
      document.getElementById('apellidos').value = user.apellidos || '';
      document.getElementById('correo').value = user.correo || '';
      document.getElementById('dni').value = user.dni || '';
      document.getElementById('telefono').value = user.telefono || '';

    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      alert(error.message);
    }
  }

  // Manejar el envío del formulario de perfil
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      nombres: document.getElementById('nombres').value,
      apellidos: document.getElementById('apellidos').value,
      correo: document.getElementById('correo').value,
      dni: document.getElementById('dni').value,
      telefono: document.getElementById('telefono').value,
    };

    try {
      const response = await fetch('/api/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el perfil.');
      }

      alert('Perfil actualizado con éxito.');
      // Opcional: actualizar datos del usuario en localStorage si es necesario
      const localUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...localUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Recarga para que el navbar muestre el nombre actualizado

    } catch (error) {
      console.error('Error en la actualización:', error);
      alert(error.message);
    }
  });

  // Manejar el envío del formulario de contraseña
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contraseñaActual = document.getElementById('contraseñaActual').value;
    const contraseñaNueva = document.getElementById('contraseñaNueva').value;
    const confirmarContraseña = document.getElementById('confirmarContraseña').value;

    if (!contraseñaActual || !contraseñaNueva) {
      alert('Para cambiar la contraseña, debes completar la contraseña actual y la nueva.');
      return;
    }

    if (contraseñaNueva !== confirmarContraseña) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('/api/usuarios/perfil/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contraseñaActual, contraseñaNueva })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al cambiar la contraseña.');
      alert('Contraseña cambiada con éxito.');
      passwordForm.reset();
    } catch (error) {
      alert(error.message);
    }
  });

  // Cargar los datos al iniciar la página
  loadProfile();
});
