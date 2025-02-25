class OrderView {
    constructor() {
        this.orderList = [];
    }

    render() {
        const orderContainer = document.getElementById("order-container");

        orderContainer.innerHTML = `
            <!-- Order Section -->
            <div class="order-container">
              <div class="customer-container">
                <h3>Customer Information</h3>
                <label for="customer-name">Customer Name:</label>
                <input type="text" id="customer-name" name="customer-name">
                <br><br>
                <label for="table-select">Table Number:</label>
                <select name="table" id="table-select">
                  <option value="">--Choose a table--</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>

              <h3>Order Details</h3>  
              <ul class="order-list" id="order-list"></ul>

              <hr>
              <h3>Order Summary</h3>
              <div class="order-summary">
                <h4><span>Subtotal:</span> <span id="subtotal">$0.00</span></h4>
                <h4><span>Tax(10%):</span> <span id="tax">$0.00</span></h4>
                <hr>
                <h4><span>Total:</span> <span id="total">$0.00</span></h4>
              </div>

              <button id="confirm-btn" type="button">Confirm</button>
              <button id="clear-btn" type="button">Clear</button>
            </div>
        `;

        this.setupOrderEventListeners();
    }

    addToOrder(name, price) {
        const orderList = document.getElementById("order-list");

        // Check if item already exists
        let existingItem = this.orderList.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.orderList.push({ name, price, quantity: 1 });
        }

        this.updateOrderList();
    }

    updateOrderList() {
        const orderList = document.getElementById("order-list");
        orderList.innerHTML = this.orderList
            .map(item => `
              <li>
                <span>${item.name}</span>
                <span class="order-btn">
                  <button class="decrease-btn" data-name="${item.name}">-</button>
                  <span>${item.quantity}</span>
                  <button class="increase-btn" data-name="${item.name}">+</button>
                </span>
              </li>
            `).join("");

        this.updateTotal();
        this.setupOrderEventListeners();
    }

    setupOrderEventListeners() {
        document.querySelectorAll(".increase-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const name = event.target.getAttribute("data-name");
                this.orderList.find(item => item.name === name).quantity += 1;
                this.updateOrderList();
            });
        });

        document.querySelectorAll(".decrease-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const name = event.target.getAttribute("data-name");
                const item = this.orderList.find(item => item.name === name);
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    this.orderList = this.orderList.filter(i => i.name !== name);
                }
                this.updateOrderList();
            });
        });
    }

    updateTotal() {
        const subtotal = this.orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
        document.getElementById("total").textContent = `$${total.toFixed(2)}`;
    }
}

export default OrderView;