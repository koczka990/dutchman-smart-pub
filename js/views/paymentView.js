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
            orderList.innerHTML = "<p class='no-items-message'>No items to pay for.</p>";
            this.showPaymentComplete();
            return;
        }

        // Create an expanded array where each item with quantity > 1 is expanded into individual items
        const expandedItems = [];
        orders.forEach(order => {
            // For each item, create 'quantity' number of individual items
            for (let i = 0; i < order.quantity; i++) {
                expandedItems.push({
                    name: order.name,
                    price: order.price,
                    originalIndex: expandedItems.length // Keep track of the index in the expanded array
                });
            }
        });

        // Render each individual item
        orderList.innerHTML = expandedItems.map((item, index) => `
            <div class="payment-item" data-index="${index}" data-price="${item.price}">
                <div class="payment-item-checkbox" data-index="${index}">
                    <div class="checkbox-indicator selected"></div>
                </div>
                <div class="payment-item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${parseFloat(item.price).toFixed(2)}</span>
                </div>
            </div>
        `).join("");

        // Store the expanded items for later use
        this.expandedItems = expandedItems;

        this.updateTotals();
        this.setupItemClickEvents();
    }

    setupItemClickEvents() {
        // Make the entire payment item clickable
        document.querySelectorAll(".payment-item").forEach(item => {
            item.addEventListener("click", () => {
                const index = item.dataset.index;
                const checkbox = item.querySelector(`.payment-item-checkbox[data-index="${index}"]`);
                const indicator = checkbox.querySelector(".checkbox-indicator");
                
                // Toggle selected state
                if (indicator.classList.contains("selected")) {
                    indicator.classList.remove("selected");
                } else {
                    indicator.classList.add("selected");
                }
                
                this.updateTotals();
            });
        });
    }

    setupEventListeners() {
        // Check/uncheck all buttons
        const checkAllBtn = document.getElementById("check-all-btn");
        const uncheckAllBtn = document.getElementById("uncheck-all-btn");
        
        if (checkAllBtn) {
            checkAllBtn.addEventListener("click", () => {
                document.querySelectorAll(".checkbox-indicator").forEach(indicator => {
                    indicator.classList.add("selected");
                });
                this.updateTotals();
            });
        }
        
        if (uncheckAllBtn) {
            uncheckAllBtn.addEventListener("click", () => {
                document.querySelectorAll(".checkbox-indicator").forEach(indicator => {
                    indicator.classList.remove("selected");
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
    }

    updateTotals() {
        const discountInput = document.getElementById("discount-input");
        const discountPercent = parseFloat(discountInput?.value || 0);
        
        // Calculate subtotal of checked items
        let subtotal = 0;
        document.querySelectorAll(".payment-item").forEach(item => {
            const index = item.dataset.index;
            const checkbox = item.querySelector(`.payment-item-checkbox[data-index="${index}"]`);
            const indicator = checkbox.querySelector(".checkbox-indicator");
            
            if (indicator.classList.contains("selected")) {
                const price = parseFloat(item.dataset.price);
                subtotal += price; // Each item now represents a single unit
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
        document.querySelectorAll(".payment-item").forEach(item => {
            const index = parseInt(item.dataset.index);
            const checkbox = item.querySelector(`.payment-item-checkbox[data-index="${index}"]`);
            const indicator = checkbox.querySelector(".checkbox-indicator");
            
            if (indicator.classList.contains("selected")) {
                selectedIndices.push(index);
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
