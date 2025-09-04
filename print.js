function printInvoice(tableId) {
  const order = ordersList[tableId];
  if (!order || order.length === 0) {
    alert("Bàn chưa có món!");
    return;
  }

  let content = `<h2>HÓA ĐƠN BÀN ${tableId}</h2><hr>`;
  let total = 0;

  order.forEach(item => {
    content += `${item.name} : ${item.price.toLocaleString()} VND <br>`;
    total += item.price;
  });

  content += `<hr><b>Tổng: ${total.toLocaleString()} VND</b>`;

  const w = window.open("", "_blank");
  w.document.write(content);
  w.document.close();
  w.print();
}

