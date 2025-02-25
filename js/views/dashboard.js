import MenuView from "./MenuView.js";
import OrderView from "./OrderView.js";

class DashboardView {
    constructor() {
        this.orderView = new OrderView();
        //this.menuView = new MenuView((name, price) => this.orderView.updateOrder(name, price));
    }

    render() {
        const appContent = document.getElementById("app-content");

        appContent.innerHTML = `
          <div class="dashboard-container">
            <!-- Menu Section -->
            <div id="menu-container"></div>

            <!-- Order Section -->
            <div id="order-container"></div>
          </div>
        `;

        //this.menuView.render();
        this.orderView.render();
    }
}

export default DashboardView;