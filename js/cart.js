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

function modifyProducts(index, newValue) {
    // Set new amount of product
    myCart[parseInt(index)].count = newValue;
    // Save on session
    sessionStorage.setItem("myCart", JSON.stringify(myCart));
    // Update visual.
    updateProduct_Subtotal(index);
}

// Generate Table
function showProducts() {
    // Currency Selected
    let currencySelected = document.getElementById("currencySelect").value;
    // Table header
    let htmlContentToAppend = `
            <tr align="center">
                <th colspan="2">Producto</th>
                <th>Precio (UYU)</th>
                <th>Precio (USD)</th>
                <th>Cantidad</th>
                <th>Subtotal (` + (currencySelected == 0 ? `USD` : `UYU`) + `)</th>
                <th></th>
            </tr>
        `; // baseTableHTML;

    // If have more items in myCart than 10, use myCart length, else use 10 slots
    for (let i = 0; i < (myCart.length > 6 ? myCart.length : 6); i++) {
        if (i < myCart.length) {
            // Product
            let prod = myCart[i];

            // Calculate Subtotal
            let subTotal = calculateSubtotal(prod.unitCost, prod.count, prod.currency);
            
            htmlContentToAppend += `
            <tr align="center">
                <th><img src="` + prod.src + `" width=60></th>
                <th>` + prod.name + `</th>
                <th>` + (prod.currency != "USD" ? prod.unitCost : `-`) + `</th>
                <th>` + (prod.currency == "USD" ? prod.unitCost : `-`) + `</th>
                <th style="width:72px;"><input id="prod_` + i + `" class="form-control" type="number" value="` + prod.count + `" onChange="modifyProducts(` + i + `, prod_` + i + `.value)"</></th>
                <th id="prodST_` + i + `">` + subTotal + `</th>
                <th><button onClick = "removeProduct(` + i + `)" class="btn btn-danger">X</button></th>
            </tr>
            `;
        }
        else {
            htmlContentToAppend += `
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

    htmlContentToAppend += `
            <tr align="center">
                <th colspan="3"></th>
                <th>Subtotal (` + (currencySelected == 0 ? `USD` : `UYU`) + `)</th>
                <th id="totalAmount"></th>
                <th id="totalMoney"></th>
                <th></th>
            </tr>
        `;
    // Set Table HTML
    document.getElementById("cartTable").innerHTML = htmlContentToAppend;
    document.getElementById("currencySelect").value = currencySelected;

    calculateTotals();
}
// Update when Modify Products Counts
function updateProduct_Subtotal(index) {

    let indexNumber = parseInt(index);
    let prod = myCart[indexNumber];

    document.getElementById("prodST_" + index).innerText = calculateSubtotal(prod.unitCost, prod.count, prod.currency);

    // Recalculate Totals
    calculateTotals();
}
// Calculate Subtotal
// cost = numeric string , count = numeric string , currency = string
function calculateSubtotal(cost, count, currency) {
    let dollarCotiz = 40;
    // Multiply UnityCost -> Amount of products.
    let subTotal = parseInt(cost) * parseInt(count);
    // Get what currency is selected
    let currencySelected = document.getElementById("currencySelect").value;
    // By currencySelected : calculate
    switch (currencySelected) {
        // USD
        case "0":
            if (currency != "USD") {
                subTotal /= dollarCotiz;
            }
            break;
        // UYU
        case "1":
            if (currency != "UYU") {
                subTotal *= dollarCotiz;
            }
            break;
    }

    return subTotal;
}
// Calculate Totals
function calculateTotals() {
    let amountProducts = 0;
    let subtotal = 0;

    for (let i = 0; i < myCart.length; i++) {
        let prod = myCart[i];
        // Calculate Subtotal
        amountProducts += parseInt(prod.count);
        subtotal += calculateSubtotal(prod.unitCost, prod.count, prod.currency);
    }

    var typeDelivery = document.getElementsByName('deliveryType');
    let porcent = 0;
    for (let i = 0; i < typeDelivery.length; i++) {
        if (typeDelivery[i].checked) {
            porcent = typeDelivery[i].value;
            break;
        }
    }

    let extra = subtotal * (porcent / 100);
    let total = subtotal + extra;

    document.getElementById("totalAmount").innerText = amountProducts;
    document.getElementById("totalMoney").innerText = subtotal.toFixed(2);

    // Cost
    document.getElementById("productCostText").innerText = subtotal.toFixed(2);
    document.getElementById("comissionText").innerText = extra.toFixed(2);
    document.getElementById("totalCostText").innerText = total.toFixed(2);
}


function removeProduct(index) {
    // alert("Delete : " + index);
    myCart.splice(index, 1);
    sessionStorage.setItem("myCart", JSON.stringify(myCart));
    document.getElementById("cartTotal").innerText = myCart.length;

    showProducts();
}