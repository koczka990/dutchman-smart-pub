class PaymentView {
    constructor() {
        this.appContent = document.getElementById("app-content");
    }

    async render(orderItems, selectedTable, spitBill, callback) {
        this.orders = orderItems;

        try {
            const response = await fetch("js/html/payment.html");
            const html = await response.text();
            this.appContent.innerHTML = html;
            // Populate order details
            this.renderOrders(selectedTable, this.orders, spitBill);
            if (callback) callback();
        } catch (error) {
            console.error("Error loading payment.html:", error);
        }
    }

    renderOrders(selectedTable, orders, splitBill) {
        let orderList = document.getElementById("order-list");

        if (!orderList) {
            setTimeout(() => this.renderOrders(selectedTable, orders, splitBill), 500);
            return;
        }

        orderList.innerHTML = orders.length === 0
            ? "<p>No orders yet.</p>"
            : orders.map((order, index) => `
                <div class="order-item">
                    <span>${order.name} x${order.quantity} - $${(order.price * order.quantity).toFixed(2)}</span>
                    ${splitBill ? `<input type="checkbox" class="order-checkbox" data-index="${index}">` : ""}
                </div>
            `).join("");

        this.updateTotal(orders.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    }

    updateTotal(total) {
        const totalAmount = document.getElementById("total-amount");
        if (!totalAmount) {
            return;
        }
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }
}

export default PaymentView;
