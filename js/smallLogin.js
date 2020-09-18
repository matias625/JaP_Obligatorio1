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
    }
    else { 
        sessionStorage.setItem("redirect", window.location);
        window.location = "login.html"; // .replace(newDir);
    }
}

setTimeout("redirectFunc()", 0);

// Ask user to Log Out
function disconnectUser() {
    if (confirm("¿Quieres salir?")) {
        // Clean Storage
        sessionStorage.clear();
        // Go to Login Window
        window.location = "login.html";
    }
}