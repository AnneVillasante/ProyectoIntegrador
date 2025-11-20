// Alternar entre formularios
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const yearSpan = document.getElementById('year');

btnLogin.addEventListener('click', () => {
  btnLogin.classList.add('active');
  btnRegister.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});

btnRegister.addEventListener('click', () => {
  btnRegister.classList.add('active');
  btnLogin.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
});

// Mostrar año en footer
yearSpan.textContent = new Date().getFullYear();

// Ejemplo de validación básica (puedes conectarlo a backend después)
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  if (!email || !pass) {
    alert('Por favor, complete todos los campos.');
    return;
  }
  alert(`Inicio de sesión exitoso para: ${email}`);
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value.trim();
  if (!name || !email || !pass) {
    alert('Por favor, complete todos los campos.');
    return;
  }
  alert(`Cuenta registrada para: ${name}`);
});
