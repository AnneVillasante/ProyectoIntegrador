export async function listarCategorias() {
  const res = await fetch(`${window.CONFIG.API_URL}/categorias`);
  return await res.json();
}

export async function crearCategoria(data) {
  await fetch(`${window.CONFIG.API_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
