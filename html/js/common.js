function get_session_data()
{
    var ret = Cookies.getJSON("sessiondata");
    console.log(ret);
    return ret;
}

function save_session_data(sdata)
{
    console.log("SAVE SESSION DATA: ", sdata);
    Cookies.set("sessiondata", sdata, { expires: sdata.expires });
}

function show_error(str)
{
    console.log("error: " + str);
}
/*
    universal data requester
*/
function request_data(parameters, callback)
{
    console.log("REQUEST DATA: ", parameters);
    
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
                resolve(data);
            }
        
            reject("unknown action!");
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
