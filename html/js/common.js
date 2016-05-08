
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
        var data;
        if (parameters.action == "login") {
            /*
                ======= INPUT =======
                action: "login",
                username: $("#inputusername").val(),
                password: $("#inputpassword").val(),
                userrole: userrole,
                rememberme: $("#remembermebox").is(':checked'),
                
                ======= OUTPUT 1 =======
                result: "loginok",
                sessionid: "aaabbbccc"
                
                ======= OUTPUT 2 =======
                result: "loginfailed",
                reason: "错误的用户名或密码",
                
            */
            if (parameters.username == "zby" && parameters.password == "123456") {
                data = {
                    result: "loginok",
                    sessionid: "aaaaaaaa",
                }
            } else {
                data = {
                    result: "loginfailed",
                    reason: "错误的用户名或密码",
                }
            }
            resolve(data);
        }
        
        reject("unknown action!");
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
