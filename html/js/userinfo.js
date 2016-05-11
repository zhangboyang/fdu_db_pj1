
function lock_userinfo_controls(x)
{
    $("#userinfoform").find("input").prop("disabled", x);
    $("#submitbtn").prop("disabled", x);
    $("#resetbtn").prop("disabled", x);
    $("#inputusername").prop("disabled", true);
}

function submit_userinfo()
{
    var username = $("#inputusername").val();
    var password = $("#inputpassword").val();
    var password2 = $("#inputpassword2").val();
    var tel = $("#inputtel").val();
    var address = $("#inputaddress").val();
    
    var errtext = ""
    var failflag = false;
    /*if (username == "") {
        errtext += "用户名不能为空\n";
        failflag = true;
    }*/
    if (tel == "") {
        errtext += "手机号码不能为空\n";
        failflag = true;
    }
    if (address == "") {
        errtext += "送餐地址不能为空\n";
        failflag = true;
    }
    if (password != password2) {
        errtext += "两次输入的密码不相同\n";
        failflag = true;
    }
    if (failflag) {
        create_alert("#userinfomsgbox", "danger", "修改失败", errtext);
        return;
    }


    lock_userinfo_controls(true);
    $("#submitbtn").text("正在修改");
            
    request_data({
        action: "setuserinfo",
        //username: username,
        password: password,
        tel: tel,
        address: address,
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

function reset_userinfo_form()
{
    $("#userinfomsgbox").empty();
    load_userinfo();
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
