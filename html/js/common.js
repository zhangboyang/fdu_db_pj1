function get_session_data()
{
    var sdata = Cookies.getJSON("sessiondata");
    if (sdata && sdata.expires > new Date().getTime()) {
        // sdata is valid
        return sdata;
    }
    return undefined;
}

function remove_session_data()
{
    return new Promise ( function (resolve, reject) {
        var sdata = get_session_data();
        Cookies.remove("sessiondata");
        if (sdata) {
            request_data({
                action: "logout",
                sessionid: sdata.sessionid,
            }).then ( function () {
                resolve();
            }, function (reason) {
                reject("logout failed: " + reason);
            });
        } else {
            resolve();
        }
    });
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
            } else if (parameters.action == "getrestlist") {
                /* ####### ACTION: getrestlist #######
                    no parameters
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        { rid: "ppxxj", rname: "泡泡香香鸡", rdesc: "卖鸡排的" },
                        { rid: "qj", rname: "全家", rdesc: "卖盒饭的" },
                        { rid: "ljr", rname: "漓江人", rdesc: "卖米线的" },
                    ],
                };
            } else if (parameters.action == "getcuisinelist") {
                /* ####### ACTION: getrestlist #######
                    input 
                        action: "getcuisinelist",
                        rid: restaurant id,
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        { cid: "dbf", cname: "茄汁嫩鸡蛋包饭", cprice: "14.30", cdesc: "普通蛋包饭" },
                        { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团" },
                        { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "奇怪的凉面" },
                    ],
                };
            } else {
                reject("unknown action!");
                return;
            }
            console.log("RESPONSE: " + JSON.stringify(data));
            resolve(data);
        }, 500);
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
