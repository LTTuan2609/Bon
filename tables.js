// tables.js
function renderTables() {
  const grid = document.getElementById("table-grid");
  grid.innerHTML = "";
  tables.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "table-btn";
    btn.innerText = t.name;
    btn.onclick = () => openOverlay(t.id);
    grid.appendChild(btn);
  });
}

function selectTable(tableId) {
  currentTable = tableId;

  if (!ordersGrid[currentTable]) ordersGrid[currentTable] = {};
  if (!ordersList[currentTable]) ordersList[currentTable] = [];

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

function openOverlay(tableId) {
  currentTable = tableId;
  document.getElementById("overlay").style.display = "block";
  renderCategories();
  currentCategory = categories[0].id;
  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}
