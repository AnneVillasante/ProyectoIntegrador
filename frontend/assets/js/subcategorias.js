export async function listarsubCategorias() {
  const res = await fetch('/api/subcategorias');
  return await res.json();
}

export async function crearsubCategoria(data) {
  await fetch('/api/subcategorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
