function loginUser() {
    var userRegister = true;
    document.location.href("https://www.google.com/");
    if(userRegister){

    }
    var email = document.getElementById("signin-email").value;
    var password = document.getElementById("signin-password").value;
    $.ajax({
        type: "POST",
        url: "/login",
        contentType: "application/json;",
        data: JSON.stringify(
            {
                "email": email,
                "password": password
            }),
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });

}

function registerUser() {
    var name = document.getElementById("signup-username").value;
    var email = document.getElementById("signup-email").value;
    var password = document.getElementById("signup-password").value;

    $.ajax({
        type: "POST",
        url: "/register",
        contentType: "application/json;",
        data: JSON.stringify(
            {
                "name": name,
                "email": email,
                "password": password
            }),
        success: function (data) {
            document.getElementById("result").innerText = data.result;
        }
    });
}