export async function listarsubCategorias() {
  const res = await fetch(`${window.CONFIG.API_URL}/subcategorias`);
  return await res.json();
}

export async function crearsubCategoria(data) {
  await fetch(`${window.CONFIG.API_URL}/subcategorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
