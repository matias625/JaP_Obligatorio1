document.addEventListener("DOMContentLoaded", function (e) {
    // User Name
    let userName = sessionStorage.getItem("userName");
    if (userName.length > 18) {
        userName = userName.slice(0, 18) + "...";
    }
    document.getElementById("userName").innerText = userName;
    // My Cart
    var tmpCart = JSON.parse(sessionStorage.getItem("myCart"));
    if (tmpCart == undefined) {
        // Load Json
        getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function (resultObj) {
            if (resultObj.status === "ok") {
                // Cart Data
                tmpCart = resultObj.data.articles;
                // Save Cart to Session
                sessionStorage.setItem("myCart", JSON.stringify(tmpCart));
                // Change Cart Element on Dropdown
                document.getElementById("cartTotal").innerText = tmpCart.length;
            }
        });
    }
    else {
        // Change Cart Element on Dropdown
        document.getElementById("cartTotal").innerText = tmpCart.length;
    }
});

// Login
function redirectFunc() {
    // Find my location 
    //var myLocation = window.location.href;
    //var splited = myLocation.split('/');
    //var newDir = myLocation.replace(splited[splited.length - 1], "login.html");

    if (sessionStorage.getItem("loginStatus") == "logged") {
        let userName = sessionStorage.getItem("userName");
        if (userName.length > 18) {
            userName = userName.slice(0, 18) + "...";
        }

        document.getElementById("userName").innerText = userName;

        // My Cart        
        let myCart = JSON.parse(sessionStorage.getItem("myCart"));
        if (myCart == undefined) {
            // Load Json
            getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function (resultObj) {
                if (resultObj === "ok") {
                    // Cart Data
                    myCart = resultObj.data;
                    // Change Cart Element on Dropdown
                    document.getElementById("cartTotal").innerText = myCart.length;
                }
            });
        }
        else {
            // Change Cart Element on Dropdown
            document.getElementById("cartTotal").innerText = myCart.length;
        }
    }
    else { 
        sessionStorage.setItem("redirect", window.location);
        window.location = "login.html"; // .replace(newDir);
    }
}

// Ask user to Log Out
function disconnectUser() {
    if (confirm("¿Quieres salir?")) {
        // Clean Storage
        sessionStorage.clear();
        // Go to Login Window
        window.location = "login.html";
    }
}