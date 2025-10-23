async function loginUser(credentials) {
  const res = await fetch('http://localhost:4000/api/auth/login', {
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

  if (!loginForm || !registerForm || !btnLogin || !btnRegister) {
    console.error('Faltan elementos en login.html');
    return;
  }

  function showLogin() {
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  }
  function showRegister() {
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  }

  btnLogin.addEventListener('click', showLogin);
  btnRegister.addEventListener('click', showRegister);

  const API_BASE = 'http://localhost:4000/api/auth';

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch (e) { return { status: res.status, raw: text }; }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginEmail').value.trim(); // correo o nombre
    const contraseña = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('button[type="submit"]');
    if (!identifier || !contraseña) return alert('Rellena todos los campos');
    btn.disabled = true;
    try {
      const resp = await apiPost('/login', { correo: identifier, contraseña });
      if (resp.success) {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        window.location.href = '/';
      } else {
        alert(resp.error || 'Error en login');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally { btn.disabled = false; }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('regName').value.trim();
    const correo = document.getElementById('regEmail').value.trim();
    const contraseña = document.getElementById('regPassword').value;
    const btn = registerForm.querySelector('button[type="submit"]');
    if (!nombre || !correo || !contraseña) return alert('Rellena todos los campos');
    btn.disabled = true;
    try {
      const resp = await apiPost('/register', { nombre, correo, contraseña });
      if (resp.success) {
        alert('Registro exitoso. Inicia sesión.');
        showLogin();
      } else {
        alert(resp.error || 'Error al registrar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally { btn.disabled = false; }
  });

  showLogin();
});