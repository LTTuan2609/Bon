// Overlay
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

// Render sản phẩm
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

// Render danh sách order
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
    li.innerHTML = `${item.name} - ${item.price.toLocaleString()} VND
      <button class="delete-btn" onclick="deleteItem(${index})">X</button>`;

    let startX = 0;

    li.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    li.addEventListener("touchmove", e => {
      let dx = e.touches[0].clientX - startX;

      if (dx < -50) {
        if (swipedItem && swipedItem !== li) swipedItem.classList.remove("swiped");
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

// Tổng tiền
function updateTotal() {
  let total = 0;
  if (ordersList[currentTable]) {
    ordersList[currentTable].forEach(item => total += item.price);
  }
  document.getElementById("total-price").innerText = `Tổng: ${total.toLocaleString()} VND`;
}
