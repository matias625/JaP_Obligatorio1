var userInfo;
var savedImageBase64 = "";

// User : Matias / Pass : Password
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    let userName = sessionStorage.getItem("userName");
    let userPass = sessionStorage.getItem("userPass");

    // Load Local Storage Users
    userInfo = get_user(userName, userPass);

    editMode_Update();

    document.getElementById("userImage").addEventListener("change", editMode_ImageURL);
    document.getElementById("btnEdit").addEventListener("click", editMode_Enter);
    document.getElementById("btnSave").addEventListener("click", editMode_Save);
    document.getElementById("btnCancel").addEventListener("click", editMode_Cancel);

    document.getElementById("userImagePreview").onload = function () {
        let imgUserImagePreview = document.getElementById("userImagePreview");
        imgUserImagePreview.crossOrigin = "Anonymous";
        // Save Image
        var imgCanvas = document.createElement("canvas");
        var imgContext = imgCanvas.getContext("2d");
        // Make sure canvas is as big as the picture
        imgCanvas.width = imgUserImagePreview.width;
        imgCanvas.height = imgUserImagePreview.height;
        // Draw image into canvas element
        imgContext.drawImage(imgUserImagePreview, 0, 0, imgUserImagePreview.width, imgUserImagePreview.height);
        // Get canvas contents as a data URL
        savedImageBase64 = imgCanvas.toDataURL("image/png");

        if (savedImageBase64 != undefined && savedImageBase64 != "") {
            let imgUserImagePreviewTwo = document.getElementById("userImagePreview2");
            imgUserImagePreviewTwo.src = savedImageBase64;
        }
    };
});

// Pass values to inputs
function editMode_Update() {
    let inputUserName = document.getElementById("userNamed");
    let inputUserLastName = document.getElementById("userLastName");
    let inputUserAge = document.getElementById("userAge");
    let inputUserEmail = document.getElementById("userEmail");
    let inputUserTel = document.getElementById("userTel");
    let imgUserImage = document.getElementById("userImage");
    let imgUserImagePreview = document.getElementById("userImagePreview");

    // If user info was found: update info
    if (userInfo != undefined) {
        inputUserName.value = userInfo.name;
        inputUserLastName.value = userInfo.lastName;
        inputUserAge.value = userInfo.age;
        inputUserEmail.value = userInfo.email;
        inputUserTel.value = userInfo.tel;
        imgUserImage.value = userInfo.image;
        if (userInfo.image != "") {
            imgUserImagePreview.src = userInfo.image;
        }   
    }
    // If NOT was found : empty all slots
    else {
        inputUserName.value = "";
        inputUserLastName.value = "";
        inputUserAge.value = "";
        inputUserEmail.value = "";
        inputUserTel.value = "";
        imgUserImage.value = "";
    }
}

function editMode_Enter() {
    // Get Inputs
    let inputUserName = document.getElementById("userNamed");
    let inputUserLastName = document.getElementById("userLastName");
    let inputUserAge = document.getElementById("userAge");
    let inputUserEmail = document.getElementById("userEmail");
    let inputUserTel = document.getElementById("userTel");
    let imgUserImage = document.getElementById("userImage");

    // Enable Inputs
    inputUserName.disabled = false;
    inputUserLastName.disabled = false;
    inputUserAge.disabled = false;
    inputUserEmail.disabled = false;
    inputUserTel.disabled = false;
    imgUserImage.disabled = false;

    // Show Editor
    showHide_Buttons(true);
}

function checkEditInputs() {
    // Check Delivery Info
    let allchecked = true;
    // Get Inputs
    let inputUserName = document.getElementById("userNamed");
    let inputUserLastName = document.getElementById("userLastName");
    let inputUserAge = document.getElementById("userAge");
    let inputUserEmail = document.getElementById("userEmail");
    let inputUserTel = document.getElementById("userTel");
    let imgUserImage = document.getElementById("userImage");

    // Name
    if (inputUserName.value.trim().length > 3) {
        if (inputUserName.classList.contains("is-invalid")) {
            inputUserName.classList.remove("is-invalid");
        }
    }
    else {
        if (inputUserName.classList.contains("is-invalid") == false) {
            inputUserName.classList.add("is-invalid");
        }
        allchecked = false;
    }
    // Last Name
    if (inputUserLastName.value.trim().length > 3) {
        if (inputUserLastName.classList.contains("is-invalid")) {
            inputUserLastName.classList.remove("is-invalid");
        }
    }
    else {
        if (inputUserLastName.classList.contains("is-invalid") == false) {
            inputUserLastName.classList.add("is-invalid");
        }
        allchecked = false;
    }
    // Age
    if (inputUserAge.value != "" && parseInt(inputUserAge.value) >= 18) {
        if (inputUserAge.classList.contains("is-invalid")) {
            inputUserAge.classList.remove("is-invalid");
        }
    }
    else {
        if (inputUserAge.classList.contains("is-invalid") == false) {
            inputUserAge.classList.add("is-invalid");
        }
        allchecked = false;
    }
    // Email
    if (inputUserEmail.checkValidity()) {
        if (inputUserEmail.classList.contains("is-invalid")) {
            inputUserEmail.classList.remove("is-invalid");
        }
    }
    else {
        if (inputUserEmail.classList.contains("is-invalid") == false) {
            inputUserEmail.classList.add("is-invalid");
        }
        allchecked = false;
    }
    // Telephone
    if (inputUserTel.checkValidity()) {
        if (inputUserTel.classList.contains("is-invalid")) {
            inputUserTel.classList.remove("is-invalid");
        }
    }
    else {
        if (inputUserTel.classList.contains("is-invalid") == false) {
            inputUserTel.classList.add("is-invalid");
        }
        allchecked = false;
    }
    // Image URL
    if (imgUserImage.checkValidity()) {
        if (imgUserImage.classList.contains("is-invalid")) {
            imgUserImage.classList.remove("is-invalid");
        }
    }
    else {
        if (imgUserImage.classList.contains("is-invalid") == false) {
            imgUserImage.classList.add("is-invalid");
        }
        allchecked = false;
    }

    return allchecked;
}

function editMode_Save() {
    if (checkEditInputs() == false) {
        return;
    }

    // Get Inputs
    let inputUserName = document.getElementById("userNamed");
    let inputUserLastName = document.getElementById("userLastName");
    let inputUserAge = document.getElementById("userAge");
    let inputUserEmail = document.getElementById("userEmail");
    let inputUserTel = document.getElementById("userTel");
    let imgUserImage = document.getElementById("userImage");

    // Save Inputs
    let userName = sessionStorage.getItem("userName");
    let userPass = sessionStorage.getItem("userPass");
    create_user(userName, userPass, inputUserName.value, inputUserLastName.value, inputUserAge.value,
        inputUserEmail.value, inputUserTel.value, imgUserImage.value, savedImageBase64);

    // Disable Inputs
    inputUserName.disabled = true;
    inputUserLastName.disabled = true;
    inputUserAge.disabled = true;
    inputUserEmail.disabled = true;
    inputUserTel.disabled = true;
    imgUserImage.disabled = true;

    // Hide Editor
    showHide_Buttons(false);

    // User Superior Right
    let userSRName = inputUserName.value;
    if (userSRName.length > 18) {
        userSRName = userSRName.split(' ')[0];
    }
    document.getElementById("userName").innerText = userSRName;
    document.getElementById("userImg").src = userInfo.image;
}
function editMode_Cancel() {
    // Get Inputs
    let inputUserName = document.getElementById("userNamed");
    let inputUserLastName = document.getElementById("userLastName");
    let inputUserAge = document.getElementById("userAge");
    let inputUserEmail = document.getElementById("userEmail");
    let inputUserTel = document.getElementById("userTel");
    let imgUserImage = document.getElementById("userImage");
    let imgUserImagePreview = document.getElementById("userImagePreview");

    // Update Inputs
    // If user info was found: update info
    if (userInfo != undefined) {
        inputUserName.value = userInfo.name;
        inputUserLastName.value = userInfo.lastName;
        inputUserAge.value = userInfo.age;
        inputUserEmail.value = userInfo.email;
        inputUserTel.value = userInfo.tel;
        imgUserImage.value = userInfo.image;
        if (userInfo.image != "") {
            imgUserImagePreview.src = userInfo.image;
        }  
    }
    // If NOT was found : empty all slots
    else {
        inputUserName.value = "";
        inputUserLastName.value = "";
        inputUserAge.value = "";
        inputUserEmail.value = "";
        inputUserTel.value = "";
        imgUserImage.value = "";
        imgUserImagePreview.src = "";
    }

    // Disable Inputs
    inputUserName.disabled = true;
    inputUserLastName.disabled = true;
    inputUserAge.disabled = true;
    inputUserEmail.disabled = true;
    inputUserTel.disabled = true;
    imgUserImage.disabled = true;

    // Hide Editor
    showHide_Buttons(false);
}

function create_user(user, pass,
    name, lastName, age, email, telephone, image, imageBase64) {

    let loadedUsers = JSON.parse(localStorage.getItem("myUsers"));
    let selectedUser = -1;

    if (loadedUsers != undefined) {
        for (let a = 0; a < loadedUsers.length; a++) {
            if (loadedUsers[a].user == user) {
                selectedUser = a;
                break;
            }
        }
    } else {
        loadedUsers = [];
    }

    // Create user info
    let newInfo = {};
    newInfo.user = user;
    newInfo.pass = pass;
    newInfo.name = name;
    newInfo.lastName = lastName;
    newInfo.age = age;
    newInfo.email = email;
    newInfo.tel = telephone;
    newInfo.image = image;
    newInfo.imageBase64 = imageBase64;

    // Find user in the list? overwrite data
    if (selectedUser >= 0) {
        loadedUsers[selectedUser] = newInfo;
    }
    // User not found : create new one
    else {
        loadedUsers.push(newInfo);
    }
    // Pass Info To Current
    userInfo = newInfo;
    // Save on Local Storage
    localStorage.setItem("myUsers", JSON.stringify(loadedUsers));
}

function editMode_ImageURL() {
    let imgUserImage = document.getElementById("userImage");
    let imgUserImagePreview = document.getElementById("userImagePreview");

    imgUserImagePreview.src = imgUserImage.value;
}

function showHide_Buttons(editMode) {
    // Get Buttons
    let btnEdit = document.getElementById("btnEdit");
    let btnSave = document.getElementById("btnSave");
    let btnCancel = document.getElementById("btnCancel");

    // 
    if (editMode) {
        // Hide Button Edit
        btnEdit.classList.remove("d-block");
        btnEdit.classList.add("d-none");
        // Show Button Save/Cancel
        btnSave.classList.remove("d-none");
        btnSave.classList.add("d-block");
        btnCancel.classList.remove("d-none");
        btnCancel.classList.add("d-block");
    }
    // Show Edit / Hide Save/Cancel
    else {
        // Show Button Edit
        btnEdit.classList.remove("d-none");
        btnEdit.classList.add("d-block");
        // Hide Button Save/Cancel
        btnSave.classList.remove("d-block");
        btnSave.classList.add("d-none");
        btnCancel.classList.remove("d-block");
        btnCancel.classList.add("d-none");
    }
}