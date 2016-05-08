
var userrole = "";

function init_roleselector()
{
    $("#roleselector").children("button").click( function () {
        userrole = $(this).attr("data-rolestr");
        $("#roleselector").children("button").removeClass("active");
        $(this).addClass("active");
    });
}

function init_loginform()
{
    $("#loginform").submit( function (e) {
        e.preventDefault();
        var username = $("#inputusername").val();
        var password = $("#inputpassword").val();
        
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
        if (userrole == "") {
            errtext += "请选择一种角色\n";
            failflag = true;
        }
        create_alert("#loginmsgbox", "danger", "登录失败", errtext);
        if (failflag) return;
        
        
        var fdata = {
            action: "login",
            username: username,
            password: password,
            userrole: userrole,
            rememberme: $("#remembermebox").is(':checked'),
        };
        
        $("#loginmsgbox").empty();
        $("#loginbtn").text("登录中").prop("disabled", true);

        request_data(fdata).then( function (data) {
            if (data.result == "loginok") {
                create_alert("#loginmsgbox", "success", "登录成功", "页面跳转中，请稍候……");
            } else {
                create_alert("#loginmsgbox", "danger", "登录失败", data.reason);
                $("#loginbtn").text("登录").prop("disabled", false);
            }
        }, function (reason) {
            show_error("loginform requestdata failed, reason: " + reason);
        });
    });
}

$(document).ready( function () {
    init_roleselector();
    init_loginform();
});

