var baseTableHTML = "";
var myCart = [];

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    let productTable = document.getElementById("cartTable");
    baseTableHTML = productTable.innerHTML;

    // Load Cart
    myCart = JSON.parse(sessionStorage.getItem("myCart"));
    if (myCart == undefined) {
        myCart = [];
    }

    showProducts();

});

function showProducts() {
    let htmlContentToAppend = baseTableHTML;

    let amountProducts = 0;
    let UYmoney = 0;
    let dollars = 0;

    for (let i = 0; i < 10; i++) {
        if (i < myCart.length) {
            htmlContentToAppend += `
            <tr align="center">
                <th>` + myCart[i].name + `</th>
                <th>` + myCart[i].amount + `</th>
                <th>` + (myCart[i].currency != "USD" ? myCart[i].cost : ``) + `</th>
                <th>` + (myCart[i].currency == "USD" ? myCart[i].cost : ``) + `</th>
                <th><button onClick = "removeProduct(` + i + `)" class="btn btn-danger">X</button></th>
            </tr>
            `;
            amountProducts += parseInt(myCart[i].amount);

            if (myCart[i].currency == "USD") {
                dollars += parseInt(myCart[i].cost) * parseInt(myCart[i].amount);
            }
            else {
                UYmoney += parseInt(myCart[i].cost) * parseInt(myCart[i].amount);
            }
        }
        else {
            htmlContentToAppend += `
            <tr>
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
                <th>Total</th>
                <th>` + amountProducts + `</th>
                <th>$ ` + UYmoney + `</th>
                <th>USD ` + dollars + `</th>                
                <th></th>
            </tr>
        `;

    document.getElementById("cartTable").innerHTML = htmlContentToAppend;
}

function removeProduct(index) {
    // alert("Delete : " + index);
    myCart.splice(index, 1);
    sessionStorage.setItem("myCart", JSON.stringify(myCart));

    showProducts();
}