let ordersGrid = JSON.parse(localStorage.getItem('ordersGrid')) || {};
let ordersList = JSON.parse(localStorage.getItem('ordersList')) || {};
let swipedItem = null;

// Thêm món
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

// Xóa món
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
