function lock_reg_controls(x)
{
    $("#regform").find("button").prop("disabled", x);
    $("#regform").find("input").prop("disabled", x);
}

var userrole = "user";

function init_roleselector()
{
    $("#roleselector").children("button").click( function () {
        userrole = $(this).attr("data-rolestr");
        $("#roleselector").children("button").removeClass("active");
        $(this).addClass("active");
    }).each( function () {
        if ($(this).attr("data-rolestr") == userrole) {
            $(this).addClass("active");
        }
    });
}

function init_regform()
{
    $("#regform").submit( function (e) {
        e.preventDefault();
        var username = $("#inputusername").val();
        var password = $("#inputpassword").val();
        var password2 = $("#inputpassword2").val();
        var rememberme = $("#remembermebox").is(':checked');
        var tel = $("#inputtel").val();
        var address = $("#inputaddress").val();
        
        var errtext = ""
        var failflag = false;
        if (username == "") {
            errtext += "用户名不能为空\n";
            failflag = true;
        }
        if (password == "") {
            errtext += "密码不能为空\n";
            failflag = true;
        }
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
        if (!userrole || userrole == "") {
            errtext += "请选择一种角色\n";
            failflag = true;
        }
        create_alert("#regmsgbox", "danger", "注册失败", errtext);
        if (failflag) return;
        
        
        var fdata = {
            action: "register",
            username: username,
            password: password,
            //userrole: userrole,
            tel: tel,
            address: address,
        };
        
        $("#regmsgbox").empty();
        $("#regbtn").text("注册中");
        lock_reg_controls(true);

        request_data(fdata).then( function (data) {
            if (data.result == "ok") {
                $("#regbtn").text("注册成功");
                create_alert("#regmsgbox", "success", "注册成功", "页面跳转中，请稍候……");
                var timestamp = new Date();
                var expdate = new Date();
                expdate.setSeconds(expdate.getSeconds() + parseInt(data.sessionlife));
                var sdata = {
                    username: username,
                    userrole: userrole,
                    sessionid: data.sessionid,
                    sessionlife: data.sessionlife,
                    timestamp: timestamp.getTime(),
                    expires: expdate.getTime(),
                };
                save_session_data(sdata);
                setTimeout(function () {
                    window.location = "login.html";
                }, 1000);
            } else if (data.result == "error") {
                create_alert("#regmsgbox", "danger", "注册失败", data.reason);
                $("#regbtn").text("注册");
                lock_reg_controls(false);
            } else {
                show_error("invalid response data: " + data);
            }
        }, function (reason) {
            show_error("regform requestdata failed, reason: " + reason);
        });
    });
}

$(document).ready( function () {
    init_navbar();
    remove_session_data();
    //init_roleselector();
    init_regform();
});

