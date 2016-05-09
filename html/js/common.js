function get_session_data()
{
    var ret = Cookies.getJSON("sessiondata");
    console.log(ret);
    return ret;
}

function remove_session_data()
{
    Cookies.remove("sessiondata");
}

function save_session_data(sdata)
{
    console.log("SAVE SESSION DATA: ", sdata);
    if (sdata.rememberme) {
        Cookies.set("sessiondata", sdata, { expires: sdata.expires });
    } else {
        Cookies.set("sessiondata", sdata);
    }
}

function show_error(str)
{
    console.log("error: " + str);
}
/*
    universal data requester
*/
function request_data(parameters)
{
    console.log("REQUEST DATA: ", parameters);
    
    console.log("REQUEST: " + JSON.stringify(parameters));
    // FIXME: get some data
    
    return new Promise ( function (resolve, reject) {
        setTimeout( function () {
            var data;
            if (parameters.action == "login") {
                /*
                    ####### ACTION: login #######
                    ======= INPUT SAMPLE =======
                    action: "login",
                    username: $("#inputusername").val(),
                    password: $("#inputpassword").val(),
                    userrole: userrole,
                    rememberme: $("#remembermebox").is(':checked'),
                    
                    ======= OUTPUT SAMPLE =======
                    see below
                */
                if (parameters.username == "zby" && parameters.password == "123456") {
                    data = {
                        result: "ok",
                        sessionid: "ahfakjsdhfkjafhdksja",
                        sessionlife: "60", /* in seconds */
                    }
                } else {
                    data = {
                        result: "error",
                        reason: "错误的用户名或密码",
                    }
                }
            } else if (parameters.action == "register") {
                /*
                    ####### ACTION: register #######
                    ======= INPUT SAMPLE =======
                    var fdata = {
                        action: "register",
                        username: username,
                        password: password,
                        userrole: userrole,
                    };
                    ======= OUTPUT SAMPLE =======
                    see below
                */
                
                if (parameters.username == "zby") {
                    data = {
                        result: "error",
                        reason: "用户名已经存在",
                    };
                } else {
                    data = {
                        result: "ok",
                    };
                }
            } else {
                reject("unknown action!");
            }
            console.log("RESPONSE: " + JSON.stringify(data));
            resolve(data);
        }, 1000);
    });
}

/*
    title should be: success, info, warning, danger
*/
function create_alert(selector, type, title, content)
{
    $(selector).empty().append(
        $(document.createElement("div"))
            .addClass("alert alert-" + type)
            .attr("role", "alert")
            .append($(document.createElement("div"))
                .css("display", "inline-block")
                .css("vertical-align", "top")
                .append($(document.createElement("strong"))
                    .text(title))
                .append($(document.createElement("span"))
                    .html("&nbsp;&nbsp;&nbsp;")))
            .append($(document.createElement("div"))
                .css("white-space", "pre-wrap")
                .css("display", "inline-block")
                .text(content))
    );
}
