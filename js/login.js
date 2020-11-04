//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {    
    // Normal Login
    document.getElementById("logButton").addEventListener("click", login);
    // Google Login
    startApp();
});

// Used to go to Index.html if window.location not work.
function Go_Home() {
    // Find my location 
    var myLocation = window.location.href;
    var splited = myLocation.split('/');
    var newDir = myLocation.replace(splited[splited.length - 1], "index.html");

    window.location.replace(newDir);
}

function login() {
    // Get Inputs
    let inputUser = document.getElementById("user");
    let inputPass = document.getElementById("pass");
    let user = inputUser.value.trim()
    let pass = inputPass.value.trim();

    let needReturn = false;
    if (user.length < 4) { // === "") {
        if (inputUser.classList.contains("is-invalid") == false) {
            inputUser.classList.add("is-invalid");
        }
        needReturn = true;
    }
    else {
        if (inputUser.classList.contains("is-invalid")) {
            inputUser.classList.remove("is-invalid");
        }
    }
    if (pass.length < 4) { //  === "") {
        if (inputPass.classList.contains("is-invalid") == false) {
            inputPass.classList.add("is-invalid");
        }
        needReturn = true;
    }
    else {
        if (inputPass.classList.contains("is-invalid")) {
            inputPass.classList.remove("is-invalid");
        }
    }
    if (needReturn) {
        return;
    }

    sessionStorage.setItem("loginStatus", "logged");
    sessionStorage.setItem("userName", user);
    sessionStorage.setItem("userPass", pass);

    if (sessionStorage.getItem("redirect") != null) {
        window.location = sessionStorage.getItem("redirect"); // Go_Home();
    }
    else {
        window.location = "index.html"; // Go_Home();
    }    
}


// - - - Google - - - -
var googleUser = {};
var startApp = function () {
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '50588719926-ff0nu6kpfru24kh566nbucihkts96gto.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        attachSignin(document.getElementById('customBtn'));
    });
};

function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            //document.getElementById('name').innerText = "Signed in: " +
            //    googleUser.getBasicProfile().getName();

            login(googleUser.getBasicProfile().getName(), "pass");

        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}





function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
