// Bàn
const tables = [
  { id: 1, name: "Bàn 1" },
  { id: 2, name: "Bàn 2" },
  { id: 3, name: "Bàn 3" },
  { id: 4, name: "Bàn 4" },
  { id: 5, name: "Bàn 5" },
  { id: 6, name: "Bàn 6" },
  { id: 7, name: "Bàn 7" },
  { id: 8, name: "Bàn 8" }
];

let currentTable = null;

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

  // Khởi tạo nếu bàn chưa có dữ liệu
  if (!ordersGrid[currentTable]) ordersGrid[currentTable] = {};
  if (!ordersList[currentTable]) ordersList[currentTable] = [];

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

renderTables();
