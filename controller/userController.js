class UserController {
    static validateLogin() {
        const tableNumber = document.getElementById("table-number").value.trim();
        const isVIP = document.getElementById("vip-toggle").checked;
        const username = document.getElementById("vip-username").value.trim();
        const password = document.getElementById("vip-password").value.trim();
        const loginButton = document.getElementById("login-button");

        // Enable login button only when required fields are filled
        if (tableNumber && (!isVIP || (username && password))) {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }

    static startSession() {
        const tableNumber = document.getElementById("table-number").value.trim();
        const isVIP = document.getElementById("vip-toggle").checked;
        let user = { table: tableNumber, role: "customer" };

        if (!tableNumber) {
            alert("Please enter your table number.");
            return;
        }

        if (isVIP) {
            const username = document.getElementById("vip-username").value.trim();
            const password = document.getElementById("vip-password").value.trim();

            if (!username || !password) {
                alert("Please enter VIP username and password.");
                return;
            }

            user = { ...user, role: "VIP", name: username };
        }

        sessionStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "/index.html"; // Redirect to main page
    }

    static changeLanguage() {
        const lang = document.getElementById("language-selector").value;
        Language.setLanguage(lang);
        location.reload();
    }
}
