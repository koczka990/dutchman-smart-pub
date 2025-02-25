import MenuModel from "../models/menuModel.js";

class StorageView {
    constructor() {
        const menuItems = MenuModel.loadMenuItems() || [];

        this.inventory = [ //temporary, will be deleted later
            { name: "IPA Beer", quantity: 10, reorderThreshold: 5 },
            { name: "Lager Beer", quantity: 7, reorderThreshold: 5 },
            { name: "Pizza", quantity: 3, reorderThreshold: 2 },
            { name: "Cheese Platter", quantity: 5, reorderThreshold: 3 },
        ];

        // this.inventory = menuItems.length > 0 ? menuItems.map(item => ({
        //     name: item.name,
        //     quantity: Math.floor(Math.random() * 20), // temporary, should be fetched from db
        //     reorderThreshold: 5 // can be changed later
        // })) : this.getFallbackInventory();
    }

    // Fallback inventory when database is empty
    getFallbackInventory() {
        return [
            { name: "Sample Beer", quantity: 10, reorderThreshold: 5 },
            { name: "Sample Pizza", quantity: 5, reorderThreshold: 3 }
        ];
    }

    render() {
        const appContent = document.getElementById("app-content");

        appContent.innerHTML = `
      <div class="storage-container">
        <h2 class="storage-title">Storage Management</h2>

        <!-- Storage Wrapper -->
        <div class="storage-wrapper">
          <div class="storage-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Reorder</th>
                </tr>
              </thead>
              <tbody id="storage-list">
              </tbody>
            </table>
          </div>

          <!-- Recent Orders -->
          <div class="order-history">
            <h3>Recent Orders</h3>
            <ul id="order-log">
              <li>No orders yet.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

        this.populateStorageTable();
        this.setupEventListeners();
    }

    populateStorageTable() {
        const storageList = document.getElementById("storage-list");
        if (!storageList) return;

        storageList.innerHTML = this.inventory.map(item => `
        <tr class="${item.quantity <= item.reorderThreshold ? 'low-stock' : ''}">
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>
                ${item.quantity <= item.reorderThreshold
            ? `<button class="reorder-btn" data-item="${item.name}">Reorder</button>`
            : '✔ In Stock'}
            </td>
        </tr>
    `).join("");

        this.setupEventListeners(); // Re-attach event listeners
    }

    setupEventListeners() {
        document.querySelectorAll(".reorder-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const itemName = event.target.getAttribute("data-item");
                this.reorderItem(itemName);
            });
        });
    }

    reorderItem(itemName) {
        const orderLog = document.getElementById("order-log");
        orderLog.innerHTML = `<li>✅ Reordered ${itemName} - ${new Date().toLocaleTimeString()}</li>` + orderLog.innerHTML;
        alert(`Reordered ${itemName}!`);
    }
}

export default StorageView;