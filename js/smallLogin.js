document.addEventListener("DOMContentLoaded", function (e) {
    // Get User NickName
    let userName = sessionStorage.getItem("userName");
    // Get User Info
    let userInfo = get_user(userName, sessionStorage.getItem("userPass"))
    // Found User Info?
    if (userInfo != undefined) {
        // Get User Name
        userName = userInfo.name;
        // If User Name have more chars than 18 : split by "space".
        if (userName.length > 18) {
            userName = userName.split(' ')[0];
        }
        document.getElementById("userImg").src = userInfo.image;
    } else {
        // If User NickName have more chars than 18 : reduce it to 18 and add "..."
        if (userName.length > 18) {
            userName = userName.slice(0, 18) + "...";
        }
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

function get_user(user, pass) {
    let loadedUsers = JSON.parse(localStorage.getItem("myUsers"));
    let selectedUser = -1;

    if (loadedUsers != undefined) {
        for (let a = 0; a < loadedUsers.length; a++) {
            if (loadedUsers[a].user == user &&
                loadedUsers[a].pass == pass) {
                selectedUser = a;
                break;
            }
        }
    }
   
    // Find user in the list? return user data
    if (selectedUser >= 0) {
        return loadedUsers[selectedUser];
    }
    // User not found : return nothing
    else {
        return undefined;
    }
}