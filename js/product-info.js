var product = {};
var comments = [];
var currentStars = 0;
var imageViewer = document.getElementById("myModal");

// Actualiza la galeria de imagenes
function showImagesGallery(array) {

    let htmlContentToAppend = ``;
    let htmlCarouselIndicator = ``;
    let htmlCarouselImages = ``;

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
            <div class="col-lg-3 col-md-4 col-6">
                <div class="d-block mb-4 h-100">
                    <img class="img-fluid img-thumbnail selectableImage" src="` + imageSrc + `" alt="" onclick="showCarousel();">
                </div>
            </div>
            `;

        htmlCarouselIndicator += `
                <li data-target="#demo" data-slide-to="` + i + (i == 0 ? `" class="active` : ``) +`"></li>
            `;

        htmlCarouselImages += `
            <div class="carousel-item` + (i == 0 ? ` active` : ``) + `">
                <img class="d-block w-100" src="` + imageSrc + `" alt="Los Angeles">
            </div>
            `;
    }
    document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    document.getElementById("productIndicatorCarousel").innerHTML = htmlCarouselIndicator;
    document.getElementById("productImageCarousel").innerHTML = htmlCarouselImages;
}

function showCarousel() {
    if (imageViewer == undefined) {
        imageViewer = document.getElementById("myModal");
    }

    imageViewer.style.display = "block";
}
function hideCarousel() {
    imageViewer.style.display = "none";
}

// Actualiza la lista de comentarios
function showComments() {
    let htmlContentToAppend = ``;

    for (let i = 0; i < comments.length; i++) {
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
// Añade nuevo comentario.
function checkStars(stars) {
    currentStars = stars;
}
function addComment(text) {
    if (text.trim() != "") {
        var today = new Date();
        var date = today.getFullYear() + '-' + AddZero(today.getMonth() + 1) + '-' + AddZero(today.getDate());
        var time = AddZero(today.getHours()) + ":" + AddZero(today.getMinutes()) + ":" + AddZero(today.getSeconds());

        let newComment = {};
        newComment.score = currentStars;
        newComment.description = text;
        newComment.user = sessionStorage.getItem("userName").toLowerCase();
        newComment.dateTime = date + ' ' + time;

        comments.push(newComment);

        showComments();
    }
    else {
        alert("Comentario vacio.");
    }
}

function AddZero(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}


// Añadir producto al Carrito
function addToCart() {
    alert("Open Cart");
}

// Utilidad : hace que la primera letra sea mayuscula.
function firstUppercase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            // Product Info
            let productNameHTML = document.getElementById("productName");
            let productPriceHTML = document.getElementById("productPrice");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCountHTML = document.getElementById("productCount");
            let productCategoryHTML = document.getElementById("productCategory");

            productNameHTML.innerHTML = product.name;
            productPriceHTML.innerHTML = product.currency + " " + product.cost;
            productDescriptionHTML.innerHTML = product.description;
            productCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            // Muestro las imagenes en forma de galería
            showImagesGallery(product.images);

            // Productos relacionados
            if (product.relatedProducts.length > 0) {
                
                getJSONData(PRODUCTS_URL).then(function (resultObj) {
                    if (resultObj.status === "ok") {
                        var relatedProducts = resultObj.data;
                        var productRelateds = product.relatedProducts;
                        productRelateds.push(2);
                        let htmlContentToAppend = ``;

                        for (a = 0; a < product.relatedProducts.length; a++) {
                            var myProduct = relatedProducts[productRelateds[a]];
                            htmlContentToAppend += `
                                <div class="col-md-3">
                                    <a href="products.html" class="card mb-4 shadow-sm custom-card"` + (myProduct.cost > product.cost ? ` style="background-color: crimson;"` : ` style="background-color: aqua;"`) + `>
                                        <img class="bd-placeholder-img card-img-top" src="`+ myProduct.imgSrc + `">
                                        <h3 class="m-3" style="color:white;">` + myProduct.name + `</h3>
                                        <div class="card-body">
                                            <p class="card-text" style="color:white;">`+ myProduct.currency + ` ` + myProduct.cost + `</p>
                                        </div>
                                    </a>
                                </div>
                                `;
                        }

                        document.getElementById("relatedProducts").innerHTML = htmlContentToAppend;
                    }
                });               
            }
        }
    });

    // Nuevo Comentario

    // Carga los Comentarios desde el archivo Json
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {    
            comments = resultObj.data;

            comments.sort((x, y) => CommentSort(x, y));

            showComments();
        }
    });
});

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