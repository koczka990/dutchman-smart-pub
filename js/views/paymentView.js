class PaymentView {
    constructor() {
        this.appContent = document.getElementById("app-content");
    }

    async render(selectedTable, orders, callback) {
        this.orders = orders;

        try {
            const response = await fetch("js/html/payment.html");
            const html = await response.text();
            this.appContent.innerHTML = html;
            
            // Display table number
            const tableNumberElement = document.getElementById("display-table-number");
            if (tableNumberElement) tableNumberElement.textContent = selectedTable;
            
            // Populate order details
            this.renderOrders(orders);
            
            // Setup event listeners
            this.setupEventListeners();
            
            if (callback) callback();
        } catch (error) {
            console.error("Error loading payment.html:", error);
        }
    }

    renderOrders(orders) {
        let orderList = document.getElementById("order-list");

        if (!orderList) {
            setTimeout(() => this.renderOrders(orders), 500);
            return;
        }

        if (orders.length === 0) {
            orderList.innerHTML = "<p>No items to pay for.</p>";
            this.showPaymentComplete();
            return;
        }

        orderList.innerHTML = orders.map((order, index) => `
            <div class="order-item" data-index="${index}" data-price="${order.price}" data-quantity="${order.quantity}">
                <input type="checkbox" class="order-checkbox" data-index="${index}" checked>
                <span class="item-details">${order.name} x${order.quantity} - $${(order.price * order.quantity).toFixed(2)}</span>
            </div>
        `).join("");

        this.updateTotals();
    }

    setupEventListeners() {
        // Check/uncheck all buttons
        const checkAllBtn = document.getElementById("check-all-btn");
        const uncheckAllBtn = document.getElementById("uncheck-all-btn");
        
        if (checkAllBtn) {
            checkAllBtn.addEventListener("click", () => {
                document.querySelectorAll(".order-checkbox").forEach(checkbox => {
                    checkbox.checked = true;
                });
                this.updateTotals();
            });
        }
        
        if (uncheckAllBtn) {
            uncheckAllBtn.addEventListener("click", () => {
                document.querySelectorAll(".order-checkbox").forEach(checkbox => {
                    checkbox.checked = false;
                });
                this.updateTotals();
            });
        }
        
        // Discount input
        const discountInput = document.getElementById("discount-input");
        if (discountInput) {
            discountInput.addEventListener("input", () => {
                this.updateTotals();
            });
        }
        
        // Individual checkboxes
        document.querySelectorAll(".order-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                this.updateTotals();
            });
        });
    }

    updateTotals() {
        const discountInput = document.getElementById("discount-input");
        const discountPercent = parseFloat(discountInput?.value || 0);
        
        // Calculate subtotal of checked items
        let subtotal = 0;
        document.querySelectorAll(".order-item").forEach(item => {
            const checkbox = item.querySelector(".order-checkbox");
            if (checkbox && checkbox.checked) {
                const price = parseFloat(item.dataset.price);
                const quantity = parseInt(item.dataset.quantity);
                subtotal += price * quantity;
            }
        });
        
        // Calculate discount amount
        const discountAmount = subtotal * (discountPercent / 100);
        
        // Calculate final total
        const total = subtotal - discountAmount;
        
        // Update UI
        const subtotalElement = document.getElementById("subtotal-amount");
        const discountAmountElement = document.getElementById("discount-amount");
        const totalElement = document.getElementById("total-amount");
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (discountAmountElement) discountAmountElement.textContent = `$${discountAmount.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    getSelectedItems() {
        const selectedIndices = [];
        document.querySelectorAll(".order-checkbox").forEach(checkbox => {
            if (checkbox.checked) {
                selectedIndices.push(parseInt(checkbox.dataset.index));
            }
        });
        return selectedIndices;
    }
    
    getDiscount() {
        const discountInput = document.getElementById("discount-input");
        return parseFloat(discountInput?.value || 0);
    }
    
    showPaymentComplete() {
        // Hide payment controls
        const paymentControls = document.getElementById("payment-controls");
        if (paymentControls) paymentControls.classList.add("hidden");
        
        // Show payment complete message
        const paymentComplete = document.getElementById("payment-complete");
        if (paymentComplete) paymentComplete.classList.remove("hidden");
    }
}

export default PaymentView;
