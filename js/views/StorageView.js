class StorageView {
  constructor() {
    this.appContent = document.getElementById("app-content");
  }

  async render(storageItems) {
    this.inventory = storageItems;

    try {
      const response = await fetch("js/html/storage.html");
      const html = await response.text();
      this.appContent.innerHTML = html;

      // Fill in the table contents
      this.populateStorageTable();

      // Call function to enable tab switching
      this.setupEventListeners();
    } catch (error) {
      console.error("Error loading login.html:", error);
    }
  }

  populateStorageTable() {
    const storageList = document.getElementById("storage-list");
    if (!storageList) return;

    storageList.innerHTML = this.inventory
      .map(
        (item) => `
        <tr class="${
          item.stock <= item.reorderThreshold ? "low-stock" : ""
        }">
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

    this.setupEventListeners(); // Re-attach event listeners
  }

  setupEventListeners() {
    document.querySelectorAll(".reorder-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.target.getAttribute("data-item");
        this.reorderItem(itemName);
      });
    });
  }

  reorderItem(itemName) {
    const orderLog = document.getElementById("order-log");
    orderLog.innerHTML =
      `<li data-translate-key="Item">✅ Reordered ${itemName} - ${new Date().toLocaleTimeString()}</li>` +
      orderLog.innerHTML;
    alert(`Reordered ${itemName}!`);
  }
}

export default StorageView;
