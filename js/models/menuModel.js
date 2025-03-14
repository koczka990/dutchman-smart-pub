class MenuModel {
  constructor() {
    this.beverages = [];
    this.foods = [];
    this.vip_drinks = [];
    this.vip_foods = [];
  }

  // Load menu items from the json files
  async loadMenuData() {
    try {
      const beveragesResponse = await fetch("/data/beverages.json");
      this.beverages = await beveragesResponse.json();
      console.log(this.beverages);
      const foodsResponse = await fetch("/data/foods.json");
      this.foods = await foodsResponse.json();
      console.log(this.foods);
      const vipDrinksResponse = await fetch("/data/vip_drinks.json");
      this.vip_drinks = await vipDrinksResponse.json();
      console.log(this.vip_drinks);
      const vipFoodsResponse = await fetch("/data/vip_foods.json");
      this.vip_foods = await vipFoodsResponse.json();
      console.log(this.foods);
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  }

  getAllBeverages() {
    if (!this.beverages) return [];
    return this.beverages.map((beverage) => ({
      name: beverage.name,
      producer: beverage.producer,
      countryoforigin: beverage.countryoforigin,
      category: beverage.category,
      alcoholstrength: beverage.alcoholstrength,
      packaging: beverage.packaging,
      priceinclvat: beverage.priceinclvat,
      articletype: beverage.articletype,
      articleNumber: beverage.nr,
    }));
  }

  getAllFoods() {
    if (!this.foods) return [];
    return this.foods.map((food) => ({
      name: food.name,
      priceinclvat: food.priceinclvat,
      category: food.category,
      producer: food.producer,
      articletype: food.articletype,
      packaging: food.packaging,
      articleNumber: food.nr,
    }));
  }

  getAllVipDrinks() {
    if (!this.vip_drinks) return [];
    console.log(this.vip_drinks, "vip drinks!!!!!!");
    return this.vip_drinks.map((vipDrink) => ({
      name: vipDrink.name,
      producer: vipDrink.producer,
      countryoforigin: vipDrink.countryoforigin,
      category: vipDrink.category,
      alcoholstrength: vipDrink.alcoholstrength,
      packaging: vipDrink.packaging,
      priceinclvat: vipDrink.priceinclvat,
      articletype: vipDrink.articletype,
      articleNumber: vipDrink.nr,
    }));
  }

  getAllVipFoods() {
    if (!this.vip_foods) return [];
    return this.vip_foods.map((vipFood) => ({
      name: vipFood.name,
      priceinclvat: vipFood.priceinclvat,
      category: vipFood.category,
      producer: vipFood.producer,
      articletype: vipFood.articletype,
      packaging: vipFood.packaging,
      articleNumber: vipFood.nr,
    }));
  }
}

export default MenuModel;
