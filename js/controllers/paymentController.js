import PaymentModel from "../models/paymentModel.js";
import PaymentView from "../views/paymentView.js";
import OrderModel from "../models/orderModel.js";
import StorageModel from "../models/storageModel.js";

class PaymentController {
    constructor(app) {
        this.app = app;
        this.paymentModel = new PaymentModel();
        this.paymentView = new PaymentView();
        this.orderModel = new OrderModel(app.database);
        this.storageModel = new StorageModel(app.database);
        this.selectedTable = null;
        this.selectedItems = [];

        this.init();
    }

    async init() {
        // Load storage data
        await this.storageModel.loadJSONStorage();
    }

    render() {
        return new Promise((resolve) => {
            // Get order details from localStorage (via OrderModel)
            this.selectedTable = localStorage.getItem("selectedTable");
            this.selectedItems = JSON.parse(localStorage.getItem("orderDetails") || "[]");
            
            if (!this.selectedTable || !this.selectedItems.length) {
                alert("No order details found! Returning to menu.");
                this.app.loadView("menu");
                resolve();
                return;
            }
            
            // Render the payment view
            this.paymentView.render(this.selectedTable, this.selectedItems, () => {
                this.setupEventListeners();
                resolve();
            });
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
        
        // Get the expanded items from the view
        const expandedItems = this.paymentView.expandedItems;
        
        // Calculate total with discount
        let subtotal = 0;
        const selectedExpandedItems = selectedIndices.map(index => expandedItems[index]);
        
        selectedExpandedItems.forEach(item => {
            subtotal += parseFloat(item.price);
        });
        
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;
        
        // Confirm payment
        const confirmMessage = `Process payment of $${total.toFixed(2)} for ${selectedExpandedItems.length} item(s)?`;
        if (confirm(confirmMessage)) {
            // Create a copy of the original items
            const remainingItems = [...this.selectedItems];
            
            // For each selected expanded item, decrement the quantity and update stock
            selectedExpandedItems.forEach(expandedItem => {
                // Find the matching original item
                const originalItem = remainingItems.find(item => item.name === expandedItem.name);
                if (originalItem) {
                    // Decrement the quantity
                    originalItem.quantity -= 1;
                    
                    // Update stock in storage
                    const product = 
                        this.storageModel.drinks.find(b => b.name === expandedItem.name) ||
                        this.storageModel.foods.find(f => f.name === expandedItem.name) ||
                        this.storageModel.vip_drinks.find(v => v.name === expandedItem.name) ||
                        this.storageModel.vip_foods.find(v => v.name === expandedItem.name);

                    if (product) {
                        this.storageModel.updateStock(product.nr, -1); // Decrease stock by 1
                    }
                    
                    // If quantity reaches 0, remove the item
                    if (originalItem.quantity <= 0) {
                        const index = remainingItems.indexOf(originalItem);
                        if (index > -1) {
                            remainingItems.splice(index, 1);
                        }
                    }
                }
            });
            
            // Update the order in the model
            this.paymentModel.updateOrder(this.selectedTable, remainingItems);
            
            // Update the controller's items
            this.selectedItems = remainingItems;
            
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