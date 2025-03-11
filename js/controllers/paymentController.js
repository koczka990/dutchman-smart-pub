import PaymentModel from "../models/paymentModel.js";
import PaymentView from "../views/paymentView.js";

class PaymentController {
    constructor(app) {
        this.app = app;
        this.paymentModel = new PaymentModel();
        this.paymentView = new PaymentView();
        this.selectedTable = null;
        this.selectedItems = [];
        this.splitBill = false;

        if (!window.location.pathname.includes("payment.html")) {
            console.warn("🚨 PaymentController should only run inside payment.html. Aborting initialization.");
            return;
        }

        this.init();
    }

    async init() {
    }

    render() {
        this.selectedTable = localStorage.getItem("selectedTable");
        this.selectedItems = JSON.parse(localStorage.getItem("orderDetails") || "[]");
        this.loadStoredData();

        if (!this.selectedTable) {
            alert("No table selected! Returning to menu.");
            this.app.loadView("menu");
            return;
        }
        //this.setupEventListeners();
        this.paymentView.render(this.selectedTable, this.selectedItems, this.splitBill);
    }

    loadStoredData() {
        this.selectedTable = localStorage.getItem("selectedTable");

        if (!this.selectedTable) {
            alert("No table selected! Returning to menu.");
            this.app.loadView("menu");
            return;
        }

        const storedOrders = localStorage.getItem("orderDetails");
        console.log("🔍 Raw storedOrders:", storedOrders);
        console.log("🔍 type storedOrders:", typeof storedOrders);
        let parsedOrders = JSON.parse(storedOrders || "[]");
        this.selectedItems = Array.isArray(parsedOrders) ? parsedOrders : [parsedOrders];

        console.log("🔍 type after parsing:", typeof this.selectedItems);

        this.paymentView.renderOrders(this.selectedTable, this.selectedItems, this.splitBill);
        this.paymentView.updateTotal(
            this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        );
    }

    setupEventListeners() {
        document.getElementById("table-select").value = this.selectedTable;

        document.getElementById("split-bill").addEventListener("change", (e) => {
            this.splitBill = e.target.checked;
            this.paymentView.renderOrders(this.selectedTable, this.selectedItems, this.splitBill);
        });

        document.getElementById("confirm-payment").addEventListener("click", () => {

            if (this.splitBill) {
                this.selectedItems = this.selectedItems.filter((item, index) =>
                    !document.querySelector(`.order-checkbox[data-index="${index}"]`)?.checked
                );
            } else {
                this.selectedItems = [];
            }

            this.paymentModel.updateTable(this.selectedTable, this.selectedItems);
            this.paymentView.renderOrders(this.selectedTable, this.selectedItems, this.splitBill);
            this.paymentView.updateTotal(0);

            alert("✅ Payment successful!");
            this.app.loadView("menu");
        });
    }
}

export default PaymentController;