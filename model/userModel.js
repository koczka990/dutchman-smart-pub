class User {
    constructor(id, name, role = "customer", balance = 0) {
        this.id = id;
        this.name = name;
        this.role = role; // "customer", "VIP", "waiter", "bartender"
        this.balance = balance;
    }

    static login(userId) {
        const users = Database.load("users") || [];
        const user = users.find(u => u.id === userId);
        if (user) {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            return user;
        }
        return null;
    }

    static logout() {
        sessionStorage.removeItem("currentUser");
    }

    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem("currentUser"));
    }

    static updateBalance(userId, amount) {
        let users = Database.load("users") || [];
        let user = users.find(u => u.id === userId);
        if (user) {
            user.balance += amount;
            Database.save("users", users);
        }
    }

    static addUser(user) {
        let users = Database.load("users") || [];
        users.push(user);
        Database.save("users", users);
    }
}
