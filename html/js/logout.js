function jump_to_login()
{
    $("#logoutmsg").text("登出成功，正在跳转 ...");
    setTimeout( function () {
        window.location = "login.html";
    }, 1000);
}

$(document).ready( function () {
    remove_session_data().then( function () {
        jump_to_login();
    }, function (reason) {
        show_error("can't do remote logout: " + reason);
        jump_to_login();
    });
    init_navbar();
});

