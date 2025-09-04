document.addEventListener("DOMContentLoaded", () => {
  // ======= Helpers =======
  const $ = (sel) => document.querySelector(sel);
  const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  // ======= State =======
  const STORAGE_KEY = 'pwa-tables-v1';
  let state = {
    nextId: 1,
    tables: [] // {id, name, items:[{id, name, price, qty}]}
  };

  // ======= Persistence =======
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { state = JSON.parse(raw); } catch (e) { console.warn('Failed parse state', e); }
    }
    if (!state.tables || state.tables.length === 0) {
      // tạo 5 bàn mặc định
      state.tables = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Bàn ${i + 1}`, items: [] }));
      state.nextId = 6;
      save();
    } else {
      // sync nextId
      const maxId = state.tables.reduce((m, t) => Math.max(m, t.id), 0);
      state.nextId = Math.max(state.nextId || 1, maxId + 1);
    }
  }

  function tableTotal(t) { return t.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0); }
  function grandTotal() { return state.tables.reduce((s, t) => s + tableTotal(t), 0); }

  // ======= Render Grid =======
  const grid = $('#grid');
function render() {
  // tổng all
  const grandEl = $('#grandTotal');


  if (grandEl) grandEl.textContent = fmt.format(grandTotal());

  if (!grid) return;
  grid.innerHTML = '';

  state.tables.forEach(t => {
    const card = document.createElement('button');
    card.className = 'table-card';
    card.innerHTML = `
      <div class="table-icon" aria-hidden="true">🍽️</div>
      <div class="table-name">${t.name}</div>
      <div class="table-total">${fmt.format(tableTotal(t))}</div>
      <button class="delete-card" aria-label="Xóa bàn">✕</button>
    `;

    // Click vào card mở modal (ngoại trừ nút xóa)
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-card')) return;
      openModal(t.id);
    });

    // Click vào nút xóa
    const delBtn = card.querySelector('.delete-card');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // tránh mở modal
      if (!confirm(`Xóa bàn "${t.name}"?`)) return;
      state.tables = state.tables.filter(tb => tb.id !== t.id);
      save();
      render();
    });
    if (t.items.length > 0) card.classList.add('has-items');
    else card.classList.add('no-items');

    grid.appendChild(card);
  });
}

  // ======= Add Table =======
  const addTableBtn = $('#addTable');
  if (addTableBtn) {
    addTableBtn.addEventListener('click', () => {
      const t = { id: state.nextId++, name: `Bàn ${state.tables.length + 1}`, items: [] };
      state.tables.push(t);
      save();
      render();
    });
  }

  // ======= Reset All =======
  const resetBtn = $('#resetAll');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Xóa toàn bộ dữ liệu trên máy này?')) {
        localStorage.removeItem(STORAGE_KEY);
        load();
        render();
      }
    });
  }

  // ======= Modal Logic & Elements =======
  let currentId = null;
  const modal = $('#modal');
  const modalTitle = $('#modalTitle');
  const itemList = $('#itemList');
  const tableTotalEl = $('#tableTotal');
  const addItemForm = $('#addItemForm');
  const itemName = $('#itemName');
  const itemPrice = $('#itemPrice');
  const itemQty = $('#itemQty');
  const closeModalBtn = $('#closeModal');
  const clearTableBtn = $('#clearTable');

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (clearTableBtn) {
    clearTableBtn.addEventListener('click', () => {
      const t = state.tables.find(x => x.id === currentId);
      if (!t) return;
      if (t.items.length === 0) return closeModal();
      if (confirm('Thanh toán và xóa toàn bộ món của bàn này?')) {
        t.items = [];
        save();
        render();
        renderModal(t);
      }
    });
  }

  function openModal(id) {
    currentId = id;
    const t = state.tables.find(x => x.id === id);
    if (!t) return;
    renderModal(t);
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function renderModal(t) {
    if (!modalTitle || !itemList || !tableTotalEl) return;
    modalTitle.textContent = t.name;
    // danh sách món
    itemList.innerHTML = '';
    t.items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `
  <div class="item-content">
    <div class="name">${it.name}</div>
    <div class="price">${fmt.format(it.price)}</div>
    <div class="qty">x ${it.qty}</div>
    <div class="sub">${fmt.format(it.price * it.qty)}</div>
  </div>
  <button class="del" aria-label="Xóa">✕</button>
`;
const content = li.querySelector('.item-content');

let startX = 0;
li.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

li.addEventListener('touchmove', e => {
  const dx = e.touches[0].clientX - startX;
  if (dx < -30) li.classList.add('swiped'); // kéo sang trái >30px
  if (dx > 0) li.classList.remove('swiped'); // kéo ngược sang phải
});
      const delBtn = li.querySelector('.del');
      delBtn.addEventListener('click', () => {
        t.items = t.items.filter(x => x.id !== it.id);
        save();
        render();
        renderModal(t);
      });
      itemList.appendChild(li);
    });
    tableTotalEl.textContent = fmt.format(tableTotal(t));
  }
	
  // Thêm món
  if (addItemForm) {
    addItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = state.tables.find(x => x.id === currentId);
      if (!t) return;
      const name = (itemName.value || '').trim();
      const price = Math.max(0, Math.round(Number(itemPrice.value) || 0)) * 1000;
      const qty = Math.max(1, Math.round(Number(itemQty.value) || 1));
      if (!name || price <= 0) {
        alert('Vui lòng nhập tên và giá hợp lệ.');
        return;
      }
      t.items.push({ id: Date.now() + Math.random(), name, price, qty });
      itemName.value = '';
      itemPrice.value = '';
      itemQty.value = 1;
      save();
      render();
      renderModal(t);
    });
  }

  // Đóng modal khi bấm nền tối
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  // ======= Init =======
  load();
  render();
}); // end DOMContentLoaded
