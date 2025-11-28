export async function listarCategorias() {
  const res = await fetch('/api/categorias');
  return await res.json();
}

export async function crearCategoria(data) {
  await fetch('/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
