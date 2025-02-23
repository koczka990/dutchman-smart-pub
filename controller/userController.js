class UserController {
    static startSession() {
        const tableNumber = document.getElementById("table-number").value;
        const userType = document.getElementById("user-type").value;

        if (!tableNumber.trim()) {
            alert("Please enter your table number.");
            return;
        }

        let user = { table: tableNumber, role: "customer" };

        if (userType === "VIP") {
            const vipUsername = document.getElementById("vip-username").value.trim();
            if (!vipUsername) {
                alert("Please enter your VIP username.");
                return;
            }
            user = { ...user, role: "VIP", name: vipUsername };
        }

        sessionStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "index.html"; 
    }

    static loadUser() {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("user-info").innerText = user.role === "VIP" 
            ? `VIP: ${user.name} (Table ${user.table})` 
            : `Table ${user.table}`;

        if (user.role === "VIP") {
            document.getElementById("logout-btn").classList.remove("hidden");
        }
    }

    static logout() {
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }

    static loadMenu() {
        const menuItems = Menu.getMenu();
        const menuContainer = document.getElementById("menu-items");
        menuContainer.innerHTML = "";

        menuItems.forEach(item => {
            let itemElement = document.createElement("div");
            itemElement.className = "menu-item";
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.price} SEK</p>
                <button onclick="UserController.addToOrder(${item.id})">Add to Order</button>
            `;
            menuContainer.appendChild(itemElement);
        });
    }

    static changeLanguage() {
        const lang = document.getElementById("language-selector").value;
        Language.setLanguage(lang);
        location.reload();
    }
}
