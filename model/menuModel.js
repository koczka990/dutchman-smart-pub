class Menu {
    static getMenu() {
        return Database.load("menu") || [];
    }

    static addItem(item) {
        let menu = this.getMenu();
        menu.push(item);
        Database.save("menu", menu);
    }

    static removeItem(itemId) {
        let menu = this.getMenu().filter(item => item.id !== itemId);
        Database.save("menu", menu);
    }

    static updateStock(itemId, quantity) {
        let menu = this.getMenu();
        let item = menu.find(i => i.id === itemId);
        if (item) {
            item.stock = quantity;
            Database.save("menu", menu);
        }
    }

    static getLowStockItems() {
        return this.getMenu().filter(item => item.stock < 5);
    }
}
