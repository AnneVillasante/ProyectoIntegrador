document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const profileImageUpload = document.getElementById('profileImageUpload');
  const profileImagePreview = document.getElementById('profileImagePreview');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const profileFields = profileForm.querySelectorAll('input');
  let originalProfileData = {};


  // --- Lógica para el sistema de pestañas ---
  const tabButtons = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.form'); // Apuntamos a la clase .form

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

  // --- Lógica para edición de perfil ---
  function toggleEditMode(isEditing) {
    profileFields.forEach(field => {
      // El campo de correo no debe ser editable
      if (field.name !== 'correo') {
        field.readOnly = !isEditing;
      }
    });

    // El input para subir foto también se controla aquí
    profileImageUpload.disabled = !isEditing;

    editProfileBtn.hidden = isEditing;
    saveProfileBtn.hidden = !isEditing;
    cancelEditBtn.hidden = !isEditing;

    if (isEditing) {
      // Enfocar el primer campo editable
      document.getElementById('nombres').focus();
    }
  }

  // Cargar datos del perfil del usuario
  async function loadProfile() {
    try {

      const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la información del perfil.');
      }

      
      const user = await response.json();

      originalProfileData = {
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
        dni: user.dni || '',
        telefono: user.telefono || ''
      };

      // Llenar el formulario con los datos del usuario
      for (const key in originalProfileData) {
        document.getElementById(key).value = originalProfileData[key];
      }

      if (user.foto_perfil) {
        profileImagePreview.src = `/uploads/${user.foto_perfil}`;
      }


    } catch (error) {
      console.error('Error al cargar el perfil:', error);
            alert(error.message);
    }
  }

  editProfileBtn.addEventListener('click', () => {
    toggleEditMode(true);
  });

  cancelEditBtn.addEventListener('click', () => {
    // Restaurar valores originales
    for (const key in originalProfileData) {
      document.getElementById(key).value = originalProfileData[key];
    }
    toggleEditMode(false);
  });

  // --- Fin lógica de edición ---

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
      const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
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
      toggleEditMode(false); // Volver al modo de solo lectura

      // Opcional: actualizar datos del usuario en localStorage si es necesario
      const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
      const updatedUser = { ...userFromStorage, ...result.user }; // Usar datos del servidor
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Notificar a otros componentes (como el navbar) que el perfil ha cambiado
      window.dispatchEvent(new CustomEvent('profile:updated'));

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
      const response = await fetch('http://localhost:4000/api/usuarios/perfil/password', {
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

  // Manejar la selección de la imagen de perfil
  profileImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Previsualizar imagen
    const reader = new FileReader();
    reader.onload = (event) => {
      profileImagePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Subir imagen al servidor
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch('http://localhost:4000/api/usuarios/perfil/foto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al subir la imagen.');
      
      alert('Foto de perfil actualizada con éxito.');
    } catch (error) {
      alert(error.message);
    }
  });

  
  // Cargar los datos al iniciar la página
  loadProfile();

  // Asegurarse de que el formulario esté en modo no editable al cargar
  toggleEditMode(false);
});