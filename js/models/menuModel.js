class MenuModel {
  constructor() {
    // Initialize menu data
    this.drinks = [];
    this.foods = [];
    this.vip_drinks = [];
    this.vip_foods = [];
  }

  // Load menu items from the json files
  async loadMenuData() {
    try {
      // Fetch all necessary data in parallel using Promise.all
      const [
        drinksResponse,
        foodsResponse,
        vipDrinksResponse,
        vipFoodsResponse,
      ] = await Promise.all([
        fetch("/data/drinks.json"),
        fetch("/data/foods.json"),
        fetch("/data/vip_drinks.json"),
        fetch("/data/vip_foods.json"),
      ]);

      // Parse the responses into JSON
      this.drinks = await drinksResponse.json();
      this.foods = await foodsResponse.json();
      this.vip_drinks = await vipDrinksResponse.json();
      this.vip_foods = await vipFoodsResponse.json();
    } catch (error) {
      console.error("Error loading menu data:", error);
    }
  }

  // Getters for menu items

  getAllDrinks() {
    if (!this.drinks) return [];
    return this.drinks.map((drink) => ({
      name: drink.name,
      producer: drink.producer,
      countryoforigin: drink.countryoforigin,
      category: drink.category,
      alcoholstrength: drink.alcoholstrength,
      packaging: drink.packaging,
      priceinclvat: drink.priceinclvat,
      articletype: drink.articletype,
      articleNumber: drink.nr,
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
    // console.log(this.vip_drinks, "vip drinks!!!!!!");
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
