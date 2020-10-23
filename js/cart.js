var myCart = [];

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    // Load Cart
    myCart = JSON.parse(sessionStorage.getItem("myCart"));
    if (myCart == undefined) {
        myCart = [];
    }

    showProducts();
});


// Generate Table
function showProducts() {
    // Currency Selected
    let currencySelected = document.getElementById("currencySelect").value;
    // Table header
    let html_tableBody = ``;

    // For each item in Cart, generate table row.
    // If have more items in myCart than 10, use myCart length, else use 10 slots
    for (let i = 0; i < (myCart.length > 5 ? myCart.length : 5); i++) {
        if (i < myCart.length) {
            // Product
            let prod = myCart[i];

            // Calculate Subtotal
            let subTotal = calculateCostByAmount(prod.unitCost, prod.count, prod.currency);
            
            html_tableBody += `
            <tr align="center">
                <th><img src="` + prod.src + `" width=60></th>
                <th>` + prod.name + `</th>
                <th>` + (prod.currency != "USD" ? prod.unitCost : `-`) + `</th>
                <th>` + (prod.currency == "USD" ? prod.unitCost : `-`) + `</th>
                <th style="width:72px;"><input id="prod_` + i + `" min="1" class="form-control" type="number" value="` + prod.count + `" onChange="modifyProducts(` + i + `, prod_` + i + `.value)"</></th>
                <th id="prodST_` + i + `">` + subTotal + `</th>
                <th><button onClick = "removeProduct(` + i + `)" class="btn btn-danger">X</button></th>
            </tr>
            `;
        }
        else {
            html_tableBody += `
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            `;
        }
    }

    // Update Table
    document.getElementById("st_currency").innerHTML = `Subtotal(` + (currencySelected == 0 ? `USD` : `UYU`) + `)`;
    document.getElementById("cartTable_body").innerHTML = html_tableBody;
    document.getElementById("currencySelect").value = currencySelected;

    // Calculate Costs & Update Table/Costs
    updateTableCosts();
}

// Table : when modify amount of products
function modifyProducts(index, newValue) {
    // Set new amount of product
    myCart[parseInt(index)].count = newValue;
    // Save on session
    sessionStorage.setItem("myCart", JSON.stringify(myCart));
    // Update visual.
    updateProduct_Subtotal(index);
}
// Update when Modify Products Counts
function updateProduct_Subtotal(index) {

    let indexNumber = parseInt(index);
    let prod = myCart[indexNumber];

    document.getElementById("prodST_" + index).innerText = calculateCostByAmount(prod.unitCost, prod.count, prod.currency);

    // Recalculate Totals
    updateTableCosts();
}
// Table : when remove product
function removeProduct(index) {
    // alert("Delete : " + index);
    myCart.splice(index, 1);
    sessionStorage.setItem("myCart", JSON.stringify(myCart));
    document.getElementById("cartTotal").innerText = myCart.length;

    showProducts();
}


// Calculate CostByAmount by unit cost & count of product & currecy
function calculateCostByAmount(cost, count, currency) {
    let dollarCotiz = 40;
    // Multiply UnityCost -> Amount of products.
    let costByAmount = parseInt(cost) * parseInt(count);
    // Get what currency is selected
    let currencySelected = document.getElementById("currencySelect").value;
    // By currencySelected : calculate
    switch (currencySelected) {
        // USD
        case "0":
            if (currency != "USD") {
                costByAmount /= dollarCotiz;
            }
            break;
        // UYU
        case "1":
            if (currency != "UYU") {
                costByAmount *= dollarCotiz;
            }
            break;
    }

    return costByAmount;
}
// Calculate Delivery costs by subtotal
function calculateDeliveryCosts(subtotal) {
    // Find Delivery radio buttons, obtain selected delivery type
    var typeDelivery = document.getElementsByName('deliveryType');
    let porcent = 0;
    for (let i = 0; i < typeDelivery.length; i++) {
        if (typeDelivery[i].checked) {
            switch (typeDelivery[i].value) {
                case "0": porcent = 15; break;
                case "1": porcent = 7; break;
                case "2": porcent = 5; break;
                case "3": porcent = 0; break;
            }
            break;
        }
    }

    return subtotal * (porcent / 100);;
}

// - - Update Table & Costs - -
function updateTableCosts() {
    // Foreach item on Cart, obtain count & subtotal
    let amountProducts = 0;
    let subtotal = 0;
    for (let i = 0; i < myCart.length; i++) {
        let prod = myCart[i];
        // Calculate Subtotal
        amountProducts += parseInt(prod.count);
        subtotal += calculateCostByAmount(prod.unitCost, prod.count, prod.currency);
    }
    // Calculate Delivery Cost
    let deliveryCost = calculateDeliveryCosts(subtotal);
    // Calculate Total Cost
    let total = subtotal + deliveryCost;

    // Update Table
    document.getElementById("totalAmount").innerText = amountProducts;
    document.getElementById("totalMoney").innerText = subtotal.toFixed(2);
    document.getElementById("comissionText").innerText = deliveryCost.toFixed(2);
    document.getElementById("totalCostText").innerText = total.toFixed(2);
}

// - - Delivery Info - -
function getDeliveryType() {
    var typeDelivery = document.getElementsByName('deliveryType');
    for (let i = 0; i < typeDelivery.length; i++) {
        if (typeDelivery[i].checked) {
            return i;
        }
    }
}
function checkDeliveryInfo() {
    // Check Delivery Info
    let checkDelivery = true;
    // City
    let elemDelCity = document.getElementById("deliveryCity");
    if (elemDelCity.value.trim().length > 3) {
        if (elemDelCity.classList.contains("is-invalid")) {
            elemDelCity.classList.remove("is-invalid");
        }
    }
    else {
        if (elemDelCity.classList.contains("is-invalid") == false) {
            elemDelCity.classList.add("is-invalid");
        }
        checkDelivery = false;
    }
    // Adress
    let elemDelAdress = document.getElementById("deliveryAdress");
    if (elemDelAdress.value.trim().length > 3) {
        if (elemDelAdress.classList.contains("is-invalid")) {
            elemDelAdress.classList.remove("is-invalid");
        }
    }
    else {
        if (elemDelAdress.classList.contains("is-invalid") == false) {
            elemDelAdress.classList.add("is-invalid");
        }
        checkDelivery = false;
    }
    // Adress Number
    let elemDelAdNum = document.getElementById("deliveryAdressNumber");
    if (elemDelAdNum.value.trim().length > 3) {
        if (elemDelAdNum.classList.contains("is-invalid")) {
            elemDelAdNum.classList.remove("is-invalid");
        }
    }
    else {
        if (elemDelAdNum.classList.contains("is-invalid") == false) {
            elemDelAdNum.classList.add("is-invalid");
        }
        checkDelivery = false;
    }

    return checkDelivery;
}

// - - Pay Method - -
function checkPayMethod() {
    // What method is selected?
    let tabSelected = document.getElementById("nav-card-tab").classList.contains("active") ? 0 : 1;

    let allFilled = true;
    let returnedText = "";
    // have all elements filled
    switch (tabSelected) {
        // Credit Card
        case 0:
            // Card Number
            let cNumber = document.getElementById("ccard-number");
            if (cNumber.checkValidity() == false) {
                if (cNumber.classList.contains("is-invalid") == false) {
                    cNumber.classList.add("is-invalid");
                }
                allFilled = false;
            } else {
                if (cNumber.classList.contains("is-invalid")) {
                    cNumber.classList.remove("is-invalid");
                }
            }
            // Card Security
            let cSecurity = document.getElementById("ccard-cvc");
            if (cSecurity.checkValidity() == false) {
                if (cSecurity.classList.contains("is-invalid") == false) {
                    cSecurity.classList.add("is-invalid");
                }
                allFilled = false;
            }
            else {
                if (cSecurity.classList.contains("is-invalid")) {
                    cSecurity.classList.remove("is-invalid");
                }
            }
            // Card Date
            let cDate = document.getElementById("ccard-date");
            // Today Date
            let cardDate = new Date(cDate.value);
            let today = new Date();
            // Card date = null? OR Card Year < Today Year OR Card Month < Today Month
            if (cDate.value == "" ||
                cardDate.getFullYear() < today.getFullYear() ||
                cardDate.getMonth() + 1 < today.getMonth()) {
                if (cDate.classList.contains("is-invalid") == false) {
                    cDate.classList.add("is-invalid");
                }
                allFilled = false;
            }
            else {
                if (cDate.classList.contains("is-invalid")) {
                    cDate.classList.remove("is-invalid");
                }
            }

            if (allFilled) {
                returnedText = cNumber.value + " | " + cDate.value;
            }

            break;
        // Bank Transfer
        case 1:
            returnedText = "Transferencia de banco.";
            break;
    }

    return returnedText;
}
function acceptPayMethod() {
    let textToAppend = checkPayMethod();

    if (textToAppend != "") {
        // have all filled ? close modal : mark not completed
        document.getElementById("txtPayMethod").innerText = textToAppend;

        let elemPayMeth = document.getElementById("btnPayMethod");
        elemPayMeth.style.display = "none";

        $('#contidionsModal').modal('hide')
    }
}

// - - Finish Pay - -
function finishBuy() {
    if (myCart.length == 0) {
        // Message Cart is Empty
        return;
    }    

    let allAlright = true;

    // Check Delivery Info
    if (checkDeliveryInfo() == false) {
        allAlright = false;
    }

    // Check Pay Method
    if (checkPayMethod() == "") {
        let elemPayMeth = document.getElementById("btnPayMethod");
        elemPayMeth.style.display = "block";

        allAlright = false;
    }

    if (allAlright == false) {
        return;
    }

    // Obtain Costs
    let subtotal = 0;
    for (let i = 0; i < myCart.length; i++) {
        let prod = myCart[i];
        // Calculate Subtotal
        subtotal += calculateCostByAmount(prod.unitCost, prod.count, prod.currency);
    }
    // Calculate Delivery Cost
    let deliveryCost = calculateDeliveryCosts(subtotal);
    // Calculate Total Cost
    let total = subtotal + deliveryCost;

    // Send To Server
    let toServer = {};
    toServer.orderId = getOrderId();
    toServer.products = myCart;
    toServer.deliveryType = getDeliveryType();
    toServer.toPay = total;
    toServer.adress = getAdress();
    toServer.payMethod = getPayMethod();

    document.getElementById("orderID").innerText = `Orden Nº: ${toServer.orderId}`;;

    let currency = document.getElementById("currencySelect").value == "0" ? "USD" : "UYU";

    document.getElementById("orderTotal").innerText = `Total: ${currency} ${toServer.toPay.toFixed(2)}`;

    // If all succeed then Send Message
    $("#buyCompleted").toast('show');
}

// - - Gets - -
function getOrderId() {
    let min = 0;
    let max = 9999;
    // Send Products in cart
    // Receive identifier receipt
    let random = Math.floor(Math.random() * (max - min + 1) + min);

    return random;
}
function getAdress() {
    // Region
    let elemDelDepart = document.getElementById("deliveryDepartment");
    // City
    let elemDelCity = document.getElementById("deliveryCity");
    // Adress
    let elemDelAdress = document.getElementById("deliveryAdress");
    // Adress Number
    let elemDelAdNum = document.getElementById("deliveryAdressNumber");

    return `${elemDelDepart.value}|${elemDelCity.value}|${elemDelAdress.value}|${elemDelAdNum.value}`;
}
function getPayMethod() {
    // What method is selected?
    let tabSelected = document.getElementById("nav-card-tab").classList.contains("active") ? 0 : 1;

    let returnedText = "";
    // have all elements filled
    switch (tabSelected) {
        // Credit Card
        case 0:
            returnedText = "CreditCard"
            break;
        // Bank Transfer
        case 1:
            returnedText = "BankTransfer";
            break;
    }

    return returnedText;
}