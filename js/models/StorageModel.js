class StorageModel {
  constructor() {
    this.beverages = [];
    this.foods = [];
  }

  async loadStorageData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();

      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  }

  getBeverageNames() {
    if (!this.beverages) return [];
    return this.beverages.map((beverage) => beverage.name);
  }

  getFoodNames() {
    if (!this.foods) return [];
    return this.foods.map((food) => food.name);
  }

  getAllStorageNames() {
    const beverageNames = this.getBeverageNames();
    const foodNames = this.getFoodNames();
    return [...beverageNames, ...foodNames];
  }
}

export default StorageModel;
