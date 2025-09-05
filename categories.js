let currentCategory = null;

// Giả sử categories và products đã có dữ liệu
// VD:
const categories = [
  { id: 1, name: "Đồ uống" },
  { id: 2, name: "Món ăn" }
];
const products = [
  { id: 1, name: "Cà phê", price: 20000, category: 1 },
  { id: 2, name: "Trà sữa", price: 25000, category: 1 },
  { id: 3, name: "Phở", price: 50000, category: 2 }
];

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
