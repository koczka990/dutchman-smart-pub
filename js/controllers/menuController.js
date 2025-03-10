import MenuModel from "../models/menuModel.js";
import MenuView from "../views/menuView.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

class MenuController {
  constructor(app) {
    this.app = app;
    this.model = new MenuModel();
    this.userModel = new UserModel();
    this.view = new MenuView(this);
    this.orderModel = new OrderModel(app.database);
    this.init();
  }

  async init() {
    await this.model.loadMenuData();
  }

  async render() {
    const beverages = this.model.getAllBeverages();
    const foods = this.model.getAllFoods();
    const userInfo = this.userModel.getCurrentUserInfo();
    await this.view.render(beverages, foods, userInfo);
  }

  // Get current user information
  getUserInfo() {
    const userInfo = this.userModel.getCurrentUserInfo();
    console.log("Retrieved user info for order:", userInfo);
    return userInfo;
  }

  // Handle order confirmation
  async handleConfirmOrder(items, userInfo) {
    console.log("Handling order confirmation with user info:", userInfo);

    if (!items || items.length === 0) {
      alert("No items in the order. Please add some items before confirming.");
      return;
    }

    if (!userInfo) {
      console.error("No user information available");
      alert("Session error. Please log in again.");
      this.app.loadView("login");
      return;
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      if (userInfo.isVIP) {
        // Handle VIP order
        if (parseFloat(userInfo.balance) < totalAmount) {
          alert("Insufficient balance. Please add more funds to your account.");
          return;
        }

        // Update VIP user's balance first
        await this.userModel.updateBalance(userInfo.username, -totalAmount);

        // Create order
        const order = await this.orderModel.createOrder({
          items: items,
          tableNumber: userInfo.tableNumber,
          isVIP: true,
          username: userInfo.username,
          totalAmount: totalAmount
        });

        // Update session with new balance
        const updatedUserInfo = {
          ...userInfo,
          balance: parseFloat(userInfo.balance) - totalAmount
        };
        this.userModel.storeUserSession(updatedUserInfo);

        alert(`Order confirmed! Your new balance is $${(parseFloat(userInfo.balance) - totalAmount).toFixed(2)}`);
        this.render();
      } else {
        // Handle regular customer order
        const order = await this.orderModel.createOrder({
          items: items,
          tableNumber: userInfo.tableNumber,
          isVIP: false,
          totalAmount: totalAmount
        });

        alert("Order confirmed! Your order will be delivered to your table shortly.");
      }

      // Clear the order list
      this.view.clearOrderList();
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  }
}

export default MenuController;

// $(document).ready(function () {
//   const menuItems = MenuModel.loadMenuItems();
//   const menuItemsContainer = $("#menu-items");
//   const basketItemsContainer = $("#basket-items");
//   const userInfoContainer = $("#user-info");
//   let basket = [];

//   // Display user info
//   const tableNumber = localStorage.getItem("tableNumber");
//   const username = localStorage.getItem("username");
//   const balance = localStorage.getItem("balance");

//   if (tableNumber) {
//     userInfoContainer.append(`<p>Table Number: ${tableNumber}</p>`);
//   }
//   if (username) {
//     userInfoContainer.append(`<p>Username: ${username}</p>`);
//   }
//   if (balance) {
//     userInfoContainer.append(
//       `<p>Balance: $${parseFloat(balance).toFixed(2)}</p>`
//     );
//   }

//   // Load and display menu items
//   menuItems.forEach((item) => {
//     const menuItem = `
//       <div class="menu-item" data-item-id="${item.id}">
//         <h3>${item.name}</h3>
//         <p>Type: ${item.type}</p>
//         <p>Price: $${item.price.toFixed(2)}</p>
//         <p>Stock: ${item.stock}</p>
//         <div class="quantity-controls">
//           <button class="decrease-btn">-</button>
//           <span class="quantity">0</span>
//           <button class="increase-btn">+</button>
//         </div>
//       </div>
//     `;
//     menuItemsContainer.append(menuItem);
//   });

//   // Drag-and-Drop
//   $(".menu-item").draggable({
//     revert: "invalid",
//     helper: "clone",
//   });

//   $("#basket-items").droppable({
//     accept: ".menu-item",
//     drop: function (event, ui) {
//       const itemId = ui.draggable.data("item-id");
//       const item = menuItems.find((item) => item.id === itemId);
//       addToBasket(item);
//     },
//   });

//   // Quantity Controls
//   $(document).on("click", ".increase-btn", function () {
//     const itemId = $(this).closest(".menu-item").data("item-id");
//     const item = menuItems.find((item) => item.id === itemId);
//     addToBasket(item);
//   });

//   $(document).on("click", ".decrease-btn", function () {
//     const itemId = $(this).closest(".menu-item").data("item-id");
//     const item = menuItems.find((item) => item.id === itemId);
//     removeFromBasket(item);
//   });

//   // Add item to basket
//   function addToBasket(item) {
//     const existingItem = basket.find((basketItem) => basketItem.id === item.id);
//     if (existingItem) {
//       existingItem.quantity++;
//     } else {
//       basket.push({ ...item, quantity: 1 });
//     }
//     updateBasket();
//   }

//   // Remove item from basket
//   function removeFromBasket(item) {
//     const existingItem = basket.find((basketItem) => basketItem.id === item.id);
//     if (existingItem) {
//       existingItem.quantity--;
//       if (existingItem.quantity === 0) {
//         basket = basket.filter((basketItem) => basketItem.id !== item.id);
//       }
//     }
//     updateBasket();
//   }

//   // Update basket UI
//   function updateBasket() {
//     basketItemsContainer.empty();
//     basket.forEach((item) => {
//       const basketItem = `
//         <div class="basket-item" data-item-id="${item.id}">
//           <span>${item.name} (x${item.quantity})</span>
//           <span>$${(item.price * item.quantity).toFixed(2)}</span>
//         </div>
//       `;
//       basketItemsContainer.append(basketItem);
//     });
//   }

//   // Checkout button
//   $("#checkout-btn").click(function () {
//     if (basket.length > 0) {
//       // Save the basket to localStorage (or a model)
//       localStorage.setItem("currentOrder", JSON.stringify(basket));
//       // Redirect to the order page
//       window.location.href = "order.html";
//     } else {
//       alert("Your basket is empty!");
//     }
//   });

//   // Logout button
//   $("#logout-btn").click(function () {
//     localStorage.clear(); // Clear all stored data
//     window.location.href = "index.html";
//   });
// });
