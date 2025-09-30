// Demo data
const PRODUCTS = [
  {id:1,name:"Polera básica",category:"Ropa",price:35.00,stock:15},
  {id:2,name:"Tenis deportivo",category:"Calzado",price:70.00,stock:8},
  {id:3,name:"Disfraz superhéroe",category:"Disfraz",price:55.00,stock:5},
  {id:4,name:"Gorra casual",category:"Accesorio",price:15.00,stock:20}
];

const PROMOS = [
  {id:1,title:"10% en Ropa",desc:"Válido del 1 al 15 de mes",code:"ROPA10"},
  {id:2,title:"Envío gratis",desc:"En compras mayores a 100",code:"ENVIOGRATIS"}
];

// Render products on catalog
function renderCatalog(list = PRODUCTS){
  const container = document.getElementById('productList') || document.getElementById('adminProductList');
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h4>${p.name}</h4><p>${p.category} • S/ ${p.price.toFixed(2)}</p><p>Stock: ${p.stock}</p>`;
    container.appendChild(div);
  });
}

// Render promotions
function renderPromos(){
  const pcontainer = document.getElementById('promoList');
  if(!pcontainer) return;
  pcontainer.innerHTML = '';
  PROMOS.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h4>${p.title}</h4><p>${p.desc}</p><small> Código: ${p.code}</small>`;
    pcontainer.appendChild(div);
  });
}

// Filter products
function filterProducts(){
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const cat = document.getElementById('category')?.value || '';
  const filtered = PRODUCTS.filter(p=>(p.name.toLowerCase().includes(q) && (cat? p.category===cat:true)));
  renderCatalog(filtered);
}

function login(e){
  e.preventDefault();
  alert('Login demo (simulado). En proyecto real: POST /auth/login');
  window.location = 'index.html';
}

function saveProduct(e){
  e.preventDefault();
  const name = document.getElementById('p_name').value;
  const category = document.getElementById('p_category').value;
  const price = parseFloat(document.getElementById('p_price').value);
  const stock = parseInt(document.getElementById('p_stock').value,10);
  PRODUCTS.push({id:Date.now(),name,category,price,stock});
  renderCatalog();
  renderCatalog(PRODUCTS); // actualiza admin y catalogo
  alert('Producto guardado (demo). En backend real: POST /api/products');
}

// Report prototype: populate table
function renderReport(){
  const tbody = document.querySelector('#reportTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const units = Math.floor(Math.random()*50);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${units}</td><td>S/ ${(units*p.price).toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

function exportReport(){
  alert('Exportar reportes demo. En implementación: generar PDF en backend o usar jsPDF.');
}

// init
document.addEventListener('DOMContentLoaded',()=>{
  renderCatalog();
  renderPromos();
  renderReport();
});

