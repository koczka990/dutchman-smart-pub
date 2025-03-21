class StorageView {
  constructor(controller) {
    this.controller = controller;
    // Callback functions
    this.onReorder = () => {};
    this.onUndo = () => {};
    this.onRedo = () => {};
  }

  // storageItems: Array of objects with name, stock, and reorderThreshold properties
  // orderHistory: Array of objects with name and time properties
  async render(storageItems, orderHistory) {
    this.appContent = document.getElementById("app-content");

    try {
      const response = await fetch("js/html/storage.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      // Fill in the table contents with storage items
      this.renderStorageTableItems(storageItems);

      // Fill in the order log with order history
      this.renderOrderHistoryLog(orderHistory);

      // Attach event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Error loading login.html:", error);
    }
  }

  setupEventListeners() {
    // Reorder button event listeners
    document.querySelectorAll(".reorder-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.target.getAttribute("data-item");
        // Call the reorderItem method with the item name
        this.onReorder(itemName);
      });
    });

    // Undo button event listener
    document.getElementById("undo-btn")?.addEventListener("click", () => {
      this.onUndo();
    });

    // Redo button event listener
    document.getElementById("redo-btn")?.addEventListener("click", () => {
      this.onRedo();
    });
  }

  // Fill in the table with storage items
  renderStorageTableItems(storageItems) {
    const storageList = document.getElementById("storage-list");
    if (!storageList) return;

    storageList.innerHTML = storageItems
      .map(
        (item) => `
        <tr class="${item.stock <= item.reorderThreshold ? "low-stock" : ""}">
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>
                ${
                  item.stock <= item.reorderThreshold
                    ? `<button class="reorder-btn" data-item="${item.name}" data-translate-key="reorder-btn">Reorder</button>`
                    : '<span data-translate-key="✔ In Stock">✔ In Stock</span>'
                }
            </td>
        </tr>
    `
      )
      .join("");
  }

  // Fill in the order log with order history
  renderOrderHistoryLog(orderHistory) {
    const orderLog = document.getElementById("order-log");
    if (!orderLog) return;

    if (orderHistory.length === 0) {
      orderLog.innerHTML = "<li data-translate-key='No orders placed yet'>No orders placed yet</li>";
    } else
      orderLog.innerHTML = orderHistory
        .map((order) =>
          `<li>
            <span data-translate-key="✅ Reordered">
              ${this.controller.app.languageSwitcher.translate("✅ Reordered")}
            </span> 
            &nbsp;${order.name} - ${order.time}
          </li>`)
        .join("");
  }
}

export default StorageView;
