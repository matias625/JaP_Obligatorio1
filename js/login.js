//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

});

// Used to go to Index.html if window.location not work.
function Go_Home() {
    // Find my location 
    var myLocation = window.location.href;
    var splited = myLocation.split('/');
    var newDir = myLocation.replace(splited[splited.length - 1], "index.html");

    window.location.replace(newDir);
}

function login(user, pass) {
    if (user.trim() === "") {
        alert("Usuario vacio.");
        return;
    }
    if (pass.trim() === "") {
        alert("Contraseña vacio.");
        return;
    }

    sessionStorage.setItem("loginStatus", "logged");

    window.location = "index.html"; // Go_Home();
}

//function onSignIn(googleUser) {
//    var profile = googleUser.getBasicProfile();
//    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//    console.log('Name: ' + profile.getName());
//    console.log('Image URL: ' + profile.getImageUrl());
//    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//}

//function signOut() {
//    var auth2 = gapi.auth2.getAuthInstance();
//    auth2.signOut().then(function () {
//        console.log('User signed out.');
//    });
//}
