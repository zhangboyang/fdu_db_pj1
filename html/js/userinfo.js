
function lock_userinfo_controls(x)
{
    $("#userinfoform").find("input").prop("disabled", x);
    $("#submitbtn").prop("disabled", x);
}

function submit_userinfo()
{
    lock_userinfo_controls(true);
    $("#submitbtn").text("正在修改");
    
    request_data({
        action: "setuserinfo",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("setuserinfo error: " + data.reason);
            return;
        }
        $("#submitbtn").text("确认修改");
        create_alert("#userinfomsgbox", "success", "修改成功", "");
        load_userinfo();
    }, function (reason) {
        show_error("can't set userinfo: " + reason);
    });
}

function load_userinfo()
{
    lock_userinfo_controls(true);
    $("#userinfoform").find("input").attr("placeholder", "加载中");
    
    request_data({
        action: "getuserinfo",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getuserinfo error: " + data.reason);
            return;
        }
        lock_userinfo_controls(false);
        $("#userinfoform").find("input").attr("placeholder", "");
        
        $("#inputusername").val(data.username);
        $("#inputtel").val(data.tel);
        $("#inputaddress").val(data.address);
        
        $("#inputpassword").attr("placeholder", "若不需要修改密码请勿填写").val("");
        $("#inputpassword2").attr("placeholder", "若不需要修改密码请勿填写").val("");
    }, function (reason) {
        show_error("can't get userinfo: " + reason);
    });
}

$(document).ready( function () {
    check_login();
    init_navbar();
    load_userinfo();
});
