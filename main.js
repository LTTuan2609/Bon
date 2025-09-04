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
let currentCategory = null;
let orders = JSON.parse(localStorage.getItem('orders')) || {};
let ordersGrid = JSON.parse(localStorage.getItem('ordersGrid')) || {};
let ordersList = JSON.parse(localStorage.getItem('ordersList')) || {};
let swipedItem = null; // lưu li đang swipe
// Render grid bàn
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

  // Render theo dữ liệu bàn này
  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

// Overlay món
function openOverlay(tableId) {
  currentTable = tableId;
  document.getElementById("overlay").style.display = "block";
  renderCategories();
  currentCategory = categories[0].id;
  renderProducts(currentCategory);
  renderOrderList(); // ← thêm dòng này
  updateTotal();
}



function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}

// Render category tabs
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

// Render sản phẩm grid theo category
function renderProducts(categoryId) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  const gridQty = ordersGrid[currentTable] || {};

  products.filter(p => p.category === categoryId).forEach(p => {
    const qty = gridQty[p.id] || 0;
    const btn = document.createElement("button");
    btn.className = "product-btn";
    btn.innerHTML = `${p.name}<br>${p.price.toLocaleString()} VND` + (qty>0?`<span class="qty">${qty}</span>`:'');
    btn.onclick = () => addToOrder(p.id);
    grid.appendChild(btn);
  });
}


// Thêm món vào bàn
function addToOrder(productId) {
  const product = products.find(p => p.id === productId);
  if (!ordersGrid[currentTable]) ordersGrid[currentTable] = {};

  if (!ordersGrid[currentTable][productId]) ordersGrid[currentTable][productId] = 0;
  ordersGrid[currentTable][productId] += 1;

  // Thêm dòng riêng lẻ vào ordersList
  if (!ordersList[currentTable]) ordersList[currentTable] = [];
  ordersList[currentTable].push({ ...product });

  localStorage.setItem('ordersGrid', JSON.stringify(ordersGrid));
  localStorage.setItem('ordersList', JSON.stringify(ordersList));

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}




// Cập nhật tổng tiền
function updateTotal() {
  let total = 0;
  if (ordersList[currentTable]) {
    ordersList[currentTable].forEach(item => {
      total += item.price;
    });
  }
  document.getElementById("total-price").innerText = `Tổng: ${total.toLocaleString()} VND`;
}

function renderOrderList() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  const order = ordersList[currentTable] || [];

  if (order.length === 0) {
    list.innerHTML = "<li>Chưa có món nào</li>";
    return;
  }

  order.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ${item.price.toLocaleString()} VND
      <button class="delete-btn" onclick="deleteItem(${index})">X</button>
    `;

    let startX = 0;

    li.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    li.addEventListener("touchmove", e => {
      let dx = e.touches[0].clientX - startX;

      if (dx < -50) {
        // Ẩn item cũ nếu có
        if (swipedItem && swipedItem !== li) {
          swipedItem.classList.remove("swiped");
        }
        li.classList.add("swiped");
        swipedItem = li;
      }

      if (dx > 20) {
        li.classList.remove("swiped");
        if (swipedItem === li) swipedItem = null;
      }
    });

    list.appendChild(li);
  });
}



function deleteItem(index) {
  if (!ordersList[currentTable]) return;

  const item = ordersList[currentTable][index];

  // Giảm số lượng trên grid
  if (ordersGrid[currentTable] && ordersGrid[currentTable][item.id]) {
    ordersGrid[currentTable][item.id] -= 1;
    if (ordersGrid[currentTable][item.id] <= 0) delete ordersGrid[currentTable][item.id];
  }

  // Xóa dòng trong list
  ordersList[currentTable].splice(index, 1);

  localStorage.setItem('ordersGrid', JSON.stringify(ordersGrid));
  localStorage.setItem('ordersList', JSON.stringify(ordersList));

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

// Khởi tạo
renderTables();
