var product = {};
var comments = [];
var currentStars = 0;
var myCart = [];

// Cart Element
// - Name
// - Amount
// - Cost
// - Currency

// Añadir producto al Carrito
function addToCart() {

    let htmlCartAmount = document.getElementById("cartAmount").value;

    if (htmlCartAmount != undefined) {
        let index = myCart.findIndex(x => { return x.name == product.name; });

        if (index >= 0) {
            myCart[index].amount = htmlCartAmount;
        }
        else {
            // Generate Cart Element
            var newElement = {};
            newElement.name = product.name;
            newElement.cost = product.cost;
            newElement.currency = product.currency;
            newElement.amount = htmlCartAmount;

            myCart.push(newElement);
        }

        sessionStorage.setItem("myCart", JSON.stringify(myCart));

        alert("Objeto enviado al carrito");
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    // Get Product Json
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            // Product Loaded
            product = resultObj.data;

            // HTML elements
            let productNameHTML = document.getElementById("productName");
            let productPriceHTML = document.getElementById("productPrice");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCountHTML = document.getElementById("productCount");
            let productCategoryHTML = document.getElementById("productCategory");
            // Configure Elements
            productNameHTML.innerHTML = product.name;
            productPriceHTML.innerHTML = product.currency + " " + product.cost;
            productDescriptionHTML.innerHTML = product.description;
            productCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            // Configure Images/Carousel
            showImagesGallery(product.images);

            // My Cart
            myCart = JSON.parse(sessionStorage.getItem("myCart"));
            if (myCart == undefined) {
                myCart = [];
                document.getElementById("cartAmount").value = 1;
            }
            else {
                let index = myCart.findIndex(x => { return x.name == product.name; });
                if (index >= 0) {
                    document.getElementById("cartAmount").value = myCart[index].amount;
                }
            }

            // Related Products
            if (product.relatedProducts.length > 0) {
                // Get List Product Json
                getJSONData(PRODUCTS_URL).then(function (resultObject) {
                    if (resultObject.status === "ok") {
                        // List Products Loaded
                        let listProducts = resultObject.data;
                        // Save Product related temporaly
                        let productRelateds = product.relatedProducts;
                        // Add Product index 2 to list for test Change Color by Price
                        productRelateds.push(2);

                        let htmlContentToAppend = ``;
                        // For each related product
                        for (let a = 0; a < productRelateds.length; a++) {
                            // Find product in List Product
                            let myProduct = listProducts[productRelateds[a]];
                            // Write Product Card
                            htmlContentToAppend += `
                                <div class="col-md-3">
                                    <a href="products.html" class="card mb-4 shadow-sm custom-card"` + (myProduct.cost > product.cost ? ` style="background-color: crimson;"` : ` style="background-color: aqua;"`) + `>
                                        <img class="bd-placeholder-img card-img-top" src="`+ myProduct.imgSrc + `">
                                        <h3 class="m-3" style="color:white;">` + myProduct.name + `</h3>
                                        <div class="card-body">
                                            <p class="card-text" style="color:white;">` + myProduct.currency + ` ` + myProduct.cost + `</p>
                                        </div>
                                    </a>
                                </div>
                                `;
                        }
                        // Configure Element
                        document.getElementById("relatedProducts").innerHTML = htmlContentToAppend;
                    }
                });
            }
        }
    });

    // New Comment
    document.getElementById("userComment").innerText = "Usuario: " + sessionStorage.getItem("userName");

    // Get Comments Json
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {    
            // Comments Loaded
            comments = resultObj.data;
            // Sort comments
            comments.sort((x, y) => CommentSort(x, y));
            // Show Comments on page
            showComments();
        }
    });
});

// Actualiza la galeria de imagenes
function showImagesGallery(array) {
    let htmlCarouselIndicator = ``;
    let htmlCarouselImages = ``;

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlCarouselIndicator += `
                <li data-target="#demo" data-slide-to="` + i + (i == 0 ? `" class="active` : ``) + `"></li>
            `;

        htmlCarouselImages += `
            <div class="carousel-item` + (i == 0 ? ` active` : ``) + `">
                <img class="d-block w-100" src="` + imageSrc + `" alt="Los Angeles">
            </div>
            `;
    }
    document.getElementById("productIndicatorCarousel").innerHTML = htmlCarouselIndicator;
    document.getElementById("productImageCarousel").innerHTML = htmlCarouselImages;
}

function CommentSort(x, y) {
    if (x.dateTime > y.dateTime) {
        return 1;
    }
    else if (x.dateTime < y.dateTime) {
        return -1;
    }
    else {
        return 0;
    }
}

// Show Comments on page
function showComments() {
    let htmlContentToAppend = ``;

    for (let i = 0; i < comments.length; i++) {
        // juan_pedro -> Juan Pedro
        let name = comments[i].user.split("_");
        let finalName = "";
        for (let a = 0; a < name.length; a++) {
            finalName += firstUppercase(name[a]);
            if (a < name.length - 1) {
                finalName += " ";
            }
        }

        let starText = `<div class="starBg">`;

        for (a = 0; a < 5; a++) {
            if (a < comments[i].score) {
                starText += `<label class="starSelected">★</label>`;
            }
            else {
                starText += `<label class="star">★</label>`;
            }
        }
        starText += `</div>`;

        htmlContentToAppend += `
                    <dt><div class="newComment"><label>` + finalName + ` - ` + comments[i].dateTime + `</label>` + starText + `</div></dt>
                    <dd>` + comments[i].description + `</dd>
                    <hr class="my-3">
                `;
    }

    document.getElementById("listComments").innerHTML = htmlContentToAppend;
}

// Add New Comment
function checkStars(stars) {
    currentStars = stars;
}
function addComment(text) {
    // Check if areaText is NOT empty
    if (text.trim() != "") {
        // Get Current DateTime
        var today = new Date();
        var date = today.getFullYear() + '-' + AddZero(today.getMonth() + 1) + '-' + AddZero(today.getDate());
        var time = AddZero(today.getHours()) + ":" + AddZero(today.getMinutes()) + ":" + AddZero(today.getSeconds());
        // Generate New comment
        let newComment = {};
        newComment.score = currentStars;
        newComment.description = text;
        newComment.user = sessionStorage.getItem("userName").toLowerCase();
        newComment.dateTime = date + ' ' + time;
        // Add comment to list
        comments.push(newComment);
        // Show Comments on page
        showComments();
    }
    else {
        alert("Comentario vacio.");
    }
}
// Utility
function AddZero(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}
// Utility : first letter Uppercase
function firstUppercase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}