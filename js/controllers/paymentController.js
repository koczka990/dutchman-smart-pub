import PaymentModel from "../models/paymentModel.js";
import PaymentView from "../views/paymentView.js";
import OrderModel from "../models/orderModel.js";

class PaymentController {
    constructor(app) {
        this.app = app;
        this.paymentModel = new PaymentModel();
        this.paymentView = new PaymentView();
        this.orderModel = new OrderModel(app.database);
        this.selectedTable = null;
        this.selectedItems = [];

        this.init();
    }

    async init() {
        // Any initialization logic
    }

    render() {
        // Get order details from localStorage (via OrderModel)
        this.selectedTable = localStorage.getItem("selectedTable");
        this.selectedItems = JSON.parse(localStorage.getItem("orderDetails") || "[]");
        
        if (!this.selectedTable || !this.selectedItems.length) {
            alert("No order details found! Returning to menu.");
            this.app.loadView("menu");
            return;
        }
        
        // Render the payment view
        this.paymentView.render(this.selectedTable, this.selectedItems, () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        // Process payment button
        const confirmPaymentBtn = document.getElementById("confirm-payment");
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener("click", () => {
                this.processPayment();
            });
        }
        
        // Return to menu button (shown after all items are paid)
        const returnToMenuBtn = document.getElementById("return-to-menu");
        if (returnToMenuBtn) {
            returnToMenuBtn.addEventListener("click", () => {
                this.app.loadView("menu");
            });
        }
    }

    processPayment() {
        // Get selected items and discount
        const selectedIndices = this.paymentView.getSelectedItems();
        const discountPercent = this.paymentView.getDiscount();
        
        if (selectedIndices.length === 0) {
            alert("Please select at least one item to pay for.");
            return;
        }
        
        // Calculate total with discount
        let subtotal = 0;
        const selectedItems = selectedIndices.map(index => this.selectedItems[index]);
        
        selectedItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;
        
        // Confirm payment
        const confirmMessage = `Process payment of $${total.toFixed(2)} for ${selectedItems.length} item(s)?`;
        if (confirm(confirmMessage)) {
            // Remove paid items from the list
            this.selectedItems = this.selectedItems.filter((_, index) => !selectedIndices.includes(index));
            
            // Update the order in the model
            this.paymentModel.updateOrder(this.selectedTable, this.selectedItems);
            
            // If all items are paid for, complete the order
            if (this.selectedItems.length === 0) {
                this.completeOrder();
            } else {
                // Otherwise, update the view with remaining items
                this.paymentView.renderOrders(this.selectedItems);
                alert("Payment processed successfully!");
            }
        }
    }
    
    completeOrder() {
        // Delete the order from the database
        this.paymentModel.deleteOrder(this.selectedTable);
        
        // Show completion message
        this.paymentView.showPaymentComplete();
    }
}

export default PaymentController;