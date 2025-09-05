// state.js
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
