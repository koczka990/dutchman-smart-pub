class PaymentModel {
    constructor() {
        // Initialize any required properties
    }

    updateTable(table, remainingItems) {
        console.log(`✅ Updating table: ${table} with remaining items:`, remainingItems);
        localStorage.setItem(`table_${table}`, JSON.stringify(remainingItems));
    }

    getTableOrders(table) {
        const storedOrders = localStorage.getItem(`table_${table}`);
        return storedOrders ? JSON.parse(storedOrders) : [];
    }

    updateOrder(tableNumber, remainingItems) {
        console.log(`✅ Updating order for table ${tableNumber} with remaining items:`, remainingItems);
        
        // Update the order details in localStorage
        localStorage.setItem("orderDetails", JSON.stringify(remainingItems));
        
        // Also update in the database if needed
        // This would typically involve an API call to update the order in a real database
    }

    deleteOrder(tableNumber) {
        console.log(`✅ Deleting order for table ${tableNumber}`);
        
        // In a real application, this would make an API call to delete the order from the database
        // For now, we'll just clear the localStorage
        localStorage.removeItem("orderDetails");
        localStorage.removeItem("selectedTable");
    }

    getOrderDetails(tableNumber) {
        // Get order details from localStorage
        const orderDetails = localStorage.getItem("orderDetails");
        return orderDetails ? JSON.parse(orderDetails) : [];
    }
}

export default PaymentModel;