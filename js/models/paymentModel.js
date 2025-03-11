class PaymentModel {
    constructor() {
    }

    updateTable(table, remainingItems) {
        console.log(`✅ Updating table: ${table} with remaining items:`, remainingItems);
        localStorage.setItem(`table_${table}`, JSON.stringify(remainingItems));
    }

    getTableOrders(table) {
        const storedOrders = localStorage.getItem(`table_${table}`);
        return storedOrders ? JSON.parse(storedOrders) : [];
    }
}

export default PaymentModel;