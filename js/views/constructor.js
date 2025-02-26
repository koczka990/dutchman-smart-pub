/*
Create constructors for the different HTML expressions you need
Use the more primitive to create the more complex.

Also create test cases for the various constructor.
*/

// The function creates a div with all necessary selection attributes.
// If id or class is not needed just replace the content here with "".
//
function createDiv(idTag, classTag, text) {
    if (idTag != "") {
        idTag = "id='" + idTag + "'";
    }
    if (classTag != "") {
        classTag = " class='" + classTag + "'";
    }
    return "<div " + idTag + classTag + ">" + text + "</div>";
}

// The function creates a button with all necessary selection attributes.
// If id or class is not needed just replace the content here with "".
//
function createButton(idTag, classTag, text) {
    if (idTag != "") {
        idTag = "id='" + idTag + "'";
    }
    if (classTag != "") {
        classTag = " class='" + classTag + "'";
    }
    return "<button " + idTag + classTag + ">" + text + "</button>";
}

// Create an HTML categoryItem from a category ID.
// It returns an HTML structure that contains a typical category item display
function createCategoryItem (categoryID) {
    category = getCategory(categoryID);
    name = category['name'];
    categoryItem = createButton('categoryItem' + categoryID,"categoryItem", name );
    return categoryItem;
}

// todo: constructors for menu items and orders
/*// Function used to create an HTML menuitem from an article number.
// It returns an HTML structure that contains a typical menu item display
//
function createMenuItem (artNr) {
    beverage = getBeverage(artNr);  // a json structure for the beer.
    name = beverage['name'];
    price = beverage['priceinclvat'];
    a = createDiv('name' + artNr,"beverageName", name );
    b = createDiv('price' + artNr, "beveragePrice", "Price: " + price)
    all = a + b;
    bevD = createDiv(artNr + "menu", "menuitem", all);
    return bevD;
}

// Function used to create an order from an orderlist.
// The result is an order as it should be displayed in
// HTML
//
function createOrder(orderList) {
    tempString = "";
    for (item in orderList){
        tempTemp = createMenuItem(orderList[item]);
        tempString = tempString + tempTemp;
    }
    bevD = createDiv("orderMenu", "", tempString)
    return bevD;
}*/

// a = createDiv("div345", "beverage", "Highlands Bitter");
// b = createMenuItem("3445")
// c = createOrder(["3445", "3450", "2344"]);
