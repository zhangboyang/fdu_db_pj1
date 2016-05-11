var login_timeout_flag = false;

function do_login_timeout()
{
    if (!login_timeout_flag) {
        create_alert(document.createElement("div"), "danger", "操作失败", "登录超时，请重新登录")
            .appendTo("body")
            .css("width", "400px")
            .css("position", "fixed")
            .css("left", "50%")
            .css("top", "50%")
            .css("transform", "translate(-50%, -50%)");

        setTimeout( function () {
            window.location = "login.html";
        }, 1000);
        login_timeout_flag = true;
    }
}

function check_login()
{
    var sdata = get_session_data();
    if (!sdata) {
        do_login_timeout();
        return false;
    }
    return true;
}

function init_navbar()
{
    var usernavbar =
        '<nav class="navbar navbar-fixed-top">'
        +'  <div class="container">'
        +'    <div class="navbar-header">'
        +'      <span class="navbar-brand">欢迎使用外卖系统 - 用户版</span>'
        +'    </div>'
        +'    <div id="navbar"><!--'
        +'      <ul class="nav navbar-nav">'
        +'        <li><a href="#">Link</a></li>'
        +'      </ul>-->'
        +''
        +'      <ul class="nav navbar-nav navbar-right">'
        +'        <li><a href="user.html">点餐</a></li>'
        +'        <li><a href="user-orders.html">我的订单</a></li>'
        +'        <li><a href="userinfo.html">个人信息</a></li>'
        +'        <li><a href="logout.html">退出</a></li>'
        +'      </ul>'
        +'    </div>'
        +'  </div>'
        +'</nav>';
    var loginnavbar =
        '<nav class="navbar navbar-fixed-top">'
        +'  <div class="container">'
        +'    <div class="navbar-header">'
        +'      <span class="navbar-brand">欢迎使用外卖系统</span>'
        +'    </div>'
        +'    <div id="navbar"><!--'
        +'      <ul class="nav navbar-nav">'
        +'        <li><a href="#">Link</a></li>'
        +'      </ul>-->'
        +'      <ul class="nav navbar-nav navbar-right">'
        +'        <li><a href="login.html">登录</a></li>'
        +'        <li><a href="register.html">注册</a></li>'
        +'      </ul>'
        +'    </div>'
        +'  </div>'
        +'</nav>';
        
    var userrole = "";
    var sdata = get_session_data();
    if (sdata) userrole = sdata.userrole;
    
    if (userrole == "user") {
        $("#navbarbox").html(usernavbar);
    } else {
        $("#navbarbox").html(loginnavbar);
    }
}

function do_logout()
{
    remove_session_data().then( function () {
        window.location = "login.html";
    });
}

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
    var request_login = true;
    switch (parameters.action) {
        case "login":
        case "register":
            request_login = false;
    }
    
    
    if (request_login && !check_login())
        return new Promise ( function (resolve, reject) { reject("登录超时"); });
    
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
            } else if (parameters.action == "submitorder") {
                /* ####### ACTION: getrestlist #######
                    input 
                        {
                            action: "submitorder",
                            data: olist,
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "getorderlist") {
                /* ####### ACTION: getorderlist #######
                    input 
                        action: "getorderlist",
                        data: [
                        ]
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        {
                            rid: "qj",
                            rname: "全家",
                            oid: 3000,
                            odatetime: "2016-03-48 32:18",
                            ostate: "needconfirm",
                            ocontent: [
                                { cid: "dbf", cname: "茄汁嫩鸡蛋包饭", cprice: "14.30", cdesc: "普通蛋包饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "奇怪的凉面", camount: 7 },
                            ],
                        },
                        {
                            rid: "qj",
                            rname: "全家",
                            oid: 2000,
                            odatetime: "2016-01-42 12:79",
                            ostate: "pending",
                            ocontent: [
                                { cid: "dbf", cname: "茄汁嫩鸡蛋包饭", cprice: "14.30", cdesc: "普通蛋包饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 2 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "奇怪的凉面", camount: 3 },
                            ],
                        },
                        {
                            rid: "ppxxj",
                            rname: "泡泡香香鸡",
                            oid: 1000,
                            odatetime: "2016-01-32 01:93",
                            ostate: "delivering",
                            ocontent: [
                                { cid: "djp", cname: "招牌大鸡排", cprice: "13.00", cdesc: "好吃的鸡排", camount: 1 },
                            ],
                        },
                        {
                            rid: "ppxxj",
                            rname: "泡泡香香鸡",
                            oid: 1000,
                            odatetime: "2015-17-01 38:48",
                            ostate: "finished",
                            ocontent: [
                                { cid: "djp", cname: "招牌大鸡排", cprice: "13.00", cdesc: "好吃的鸡排", camount: 1 },
                            ],
                        },
                    ],
                };
            } else if (parameters.action == "confirmorder") {
                /* ####### ACTION: confirmorder #######
                    input 
                        {
                            action: "confirmorder",
                            oid: 123,
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "getuserinfo") {
                /* ####### ACTION: getuserinfo #######
                    input 
                        {
                            action: "getuserinfo",
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                    username: "zby",
                    tel: "13800138000",
                    address: "mars",
                };
            } else if (parameters.action == "setuserinfo") {
                /* ####### ACTION: setuserinfo #######
                    input 
                        {
                            action: "setuserinfo",
                        }
                    output example see below
                */
                data = {
                    result: "ok",
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
    return $(selector).empty().append(
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
