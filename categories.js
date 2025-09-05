// categories.js
function renderCategories() {
  const container = document.getElementById("category-tabs");
  container.innerHTML = "";
  categories.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.name;
    btn.onclick = () => {
      currentCategory = c.id;
      renderProducts(c.id);
    };
    if (c.id === currentCategory) btn.classList.add("active");
    container.appendChild(btn);
  });
}

function renderProducts(categoryId) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  const gridQty = ordersGrid[currentTable] || {};

  products.filter(p => p.category === categoryId).forEach(p => {
    const qty = gridQty[p.id] || 0;
    const btn = document.createElement("button");
    btn.className = "product-btn";
    btn.innerHTML =
      `${p.name}<br>${p.price.toLocaleString()} VND` +
      (qty > 0 ? `<span class="qty">${qty}</span>` : "");
    btn.onclick = () => addToOrder(p.id);
    grid.appendChild(btn);
  });
}
