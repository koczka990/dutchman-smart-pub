/*
Create constructors for the different HTML expressions you need
Use the more primitive to create the more complex.

Also create test cases for the various constructor.
*/
class Constructor {
    // The method creates a div with all necessary selection attributes.
    createDiv(text, idTag = "", classTag = "") {
        if (idTag !== "") {
            idTag = "id='" + idTag + "'";
        }
        if (classTag !== "") {
            classTag = " class='" + classTag + "'";
        }
        return "<div " + idTag + classTag + ">" + text + "</div>";
    }

    // The method creates a button with all necessary selection attributes.
    createButton(text, idTag = "", classTag = "") {
        if (idTag !== "") {
            idTag = "id='" + idTag + "'";
        }
        if (classTag !== "") {
            classTag = " class='" + classTag + "'";
        }
        return "<button " + idTag + classTag + ">" + text + "</button>";
    }

    // The method creates a select option with all necessary selection attributes.
    createSelectOption(value, text, selected = false, idTag = "", classTag = "", translateTag = "") {
        if (idTag !== "") {
            idTag = "id='" + idTag + "'";
        }
        if (classTag !== "") {
            classTag = " class='" + classTag + "'";
        }
        if (translateTag !== "") {
            translateTag = " data-translate-key='" + translateTag + "'";
        }
        const valueTag = "value='" + value + "'";
        if (selected) {
            return "<option " + idTag + classTag + translateTag + valueTag + " selected>" + text + "</option>";
        }
        return "<option " + idTag + classTag + translateTag + valueTag + ">" + text + "</option>";
    }

    // Create an HTML categoryItem from a category ID.
    // It returns an HTML structure that contains a typical category item display
    createCategoryItem(categoryID) {
        const category = getCategory(categoryID);
        const name = category['name'];
        return this.createButton(name, 'categoryItem' + categoryID, "categoryItem");
    }

    // todo: constructors for menu items and orders
    /*// Method used to create an HTML menuitem from an article number.
    // It returns an HTML structure that contains a typical menu item display
    //
    createMenuItem(artNr) {
      const beverage = getBeverage(artNr);  // a json structure for the beer.
      const name = beverage['name'];
      const price = beverage['priceinclvat'];
      const a = this.createDiv('name' + artNr, "beverageName", name);
      const b = this.createDiv('price' + artNr, "beveragePrice", "Price: " + price);
      const all = a + b;
      const bevD = this.createDiv(artNr + "menu", "menuitem", all);
      return bevD;
    }

    // Method used to create an order from an orderlist.
    // The result is an order as it should be displayed in
    // HTML
    //
    createOrder(orderList) {
      let tempString = "";
      for (const item in orderList) {
        const tempTemp = this.createMenuItem(orderList[item]);
        tempString = tempString + tempTemp;
      }
      const bevD = this.createDiv("orderMenu", "", tempString);
      return bevD;
    }*/
}

export default Constructor;