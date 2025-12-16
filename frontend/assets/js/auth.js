async function loginUser(credentials) {
  const res = await fetch(`${window.CONFIG.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btnLogin');
  const btnRegister = document.getElementById('btnRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authContainer = document.querySelector('.auth-container');

  if (!loginForm || !registerForm || !btnLogin || !btnRegister || !authContainer) {
    logger.error('Faltan elementos en login.html');
    return;
  }

  function showLogin() {
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    
    // Cambiar a modo login (más compacto)
    authContainer.classList.remove('register-mode');
    authContainer.classList.add('login-mode');
  }
  
  function showRegister() {
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    
    // Cambiar a modo registro (más espacio)
    authContainer.classList.remove('login-mode');
    authContainer.classList.add('register-mode');
  }

  btnLogin.addEventListener('click', showLogin);
  btnRegister.addEventListener('click', showRegister);

  async function apiPost(path, body) {
    const res = await fetch(`${window.CONFIG.API_URL}/auth${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch (e) { return { status: res.status, raw: text }; }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginEmail').value.trim();
    const contrasena = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('button[type="submit"]');
    
    if (!identifier || !contrasena) return alert('Rellena todos los campos');
    
    btn.disabled = true;
    try {
      const resp = await apiPost('/login', { correo: identifier, contrasena });
      if (resp.success) {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        window.location.href = '/';
      } else {
        alert(resp.error || 'Error en login');
      }
    } catch (err) {
      logger.error(err);
      alert('Error de conexión');
    } finally { 
      btn.disabled = false; 
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener valores de los nuevos campos
    const nombres = document.getElementById('regNombres').value.trim();
    const apellidos = document.getElementById('regApellidos').value.trim();
    const correo = document.getElementById('regEmail').value.trim();
    const telefono = document.getElementById('regTelefono').value.trim();
    const dni = document.getElementById('regDni').value.trim();
    const contrasena = document.getElementById('regPassword').value;
    const contrasenaConfirm = document.getElementById('regPasswordConfirm').value;
    
    const btn = registerForm.querySelector('button[type="submit"]');
    
    // Validaciones básicas
    if (!nombres || !apellidos || !correo || !telefono || !dni || !contrasena || !contrasenaConfirm) {
      return alert('Rellena todos los campos');
    }
    
    if (contrasena !== contrasenaConfirm) {
      return alert('Las contrasenas no coinciden');
    }
    
    btn.disabled = true;
    
    try {
      const resp = await apiPost('/register', {
        nombres,
        apellidos,
        correo,
        telefono,
        dni,
        contrasena,
        rol: 'Cliente'
      });
      
      if (resp.success) {
        alert('Registro exitoso. Inicia sesión.');
        showLogin();
        registerForm.reset();
      } else {
        alert(resp.error || 'Error al registrar');
      }
    } catch (err) {
      logger.error(err);
      alert('Error de conexión');
    } finally { 
      btn.disabled = false; 
    }
  });

  // Inicializar en modo login
  showLogin();
});