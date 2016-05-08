
var userrole = "user";

function check_session()
{
    var sdata = get_session_data();
    if (sdata) console.log(sdata.expires < new Date().getTime(), sdata.expires, new Date().getTime());
    if (sdata && sdata.expires > new Date().getTime()) {
        jump_to_session(sdata);
    }
}

function jump_to_session(sdata)
{
    console.log("JUMP_TO_SESSION: ", sdata);
    window.location = sdata.userrole + ".html";
}


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

function init_loginform()
{
    $("#loginform").submit( function (e) {
        e.preventDefault();
        var username = $("#inputusername").val();
        var password = $("#inputpassword").val();
        var rememberme = $("#remembermebox").is(':checked');
        
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
        if (!userrole || userrole == "") {
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
            rememberme: rememberme,
        };
        
        $("#loginmsgbox").empty();
        $("#loginbtn").text("登录中").prop("disabled", true);

        request_data(fdata).then( function (data) {
            if (data.result == "ok") {
                $("#loginbtn").text("登录成功");
                create_alert("#loginmsgbox", "success", "登录成功", "页面跳转中，请稍候……");
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
                    jump_to_session(sdata);
                }, 1000);
            } else if (data.result == "error") {
                create_alert("#loginmsgbox", "danger", "登录失败", data.reason);
                $("#loginbtn").text("登录").prop("disabled", false);
            } else {
                show_error("invalid response data: " + data);
            }
        }, function (reason) {
            show_error("loginform requestdata failed, reason: " + reason);
        });
    });
}

$(document).ready( function () {
    check_session();
    init_roleselector();
    init_loginform();
});

