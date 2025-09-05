// orders.js
function addToOrder(productId) {
  const product = products.find(p => p.id === productId);
  if (!ordersGrid[currentTable]) ordersGrid[currentTable] = {};

  if (!ordersGrid[currentTable][productId]) ordersGrid[currentTable][productId] = 0;
  ordersGrid[currentTable][productId] += 1;

  if (!ordersList[currentTable]) ordersList[currentTable] = [];
  ordersList[currentTable].push({ ...product });

  localStorage.setItem('ordersGrid', JSON.stringify(ordersGrid));
  localStorage.setItem('ordersList', JSON.stringify(ordersList));

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}

function updateTotal() {
  let total = 0;
  if (ordersList[currentTable]) {
    ordersList[currentTable].forEach(item => {
      total += item.price;
    });
  }
  document.getElementById("total-price").innerText =
    `Tổng: ${total.toLocaleString()} VND`;
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

  if (ordersGrid[currentTable] && ordersGrid[currentTable][item.id]) {
    ordersGrid[currentTable][item.id] -= 1;
    if (ordersGrid[currentTable][item.id] <= 0) delete ordersGrid[currentTable][item.id];
  }

  ordersList[currentTable].splice(index, 1);

  localStorage.setItem('ordersGrid', JSON.stringify(ordersGrid));
  localStorage.setItem('ordersList', JSON.stringify(ordersList));

  renderProducts(currentCategory);
  renderOrderList();
  updateTotal();
}
