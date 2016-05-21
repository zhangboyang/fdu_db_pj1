function make_popup_msgbox(obj)
{
    return obj.appendTo("body")
            .css("width", "400px")
            .css("position", "fixed")
            .css("left", "50%")
            .css("top", "50%")
            .css("transform", "translate(-50%, -50%)")
            .css("z-index", "100");
}

var login_timeout_flag = false;
function do_login_timeout()
{
    if (!login_timeout_flag) {
        make_popup_msgbox(create_alert(document.createElement("div"), "danger", "操作失败", "登录超时，请重新登录"));
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
        +'        <li><a href="user-info.html">个人信息</a></li>'
        +'        <li><a href="logout.html">退出</a></li>'
        +'      </ul>'
        +'    </div>'
        +'  </div>'
        +'</nav>';
    var restnavbar =
        '<nav class="navbar navbar-fixed-top">'
        +'  <div class="container">'
        +'    <div class="navbar-header">'
        +'      <span class="navbar-brand">欢迎使用外卖系统 - 餐厅版</span>'
        +'    </div>'
        +'    <div id="navbar"><!--'
        +'      <ul class="nav navbar-nav">'
        +'        <li><a href="#">Link</a></li>'
        +'      </ul>-->'
        +''
        +'      <ul class="nav navbar-nav navbar-right">'
        +'        <li><a href="rest.html">最近订单</a></li>'
        +'        <li><a href="rest-editmenu.html">编辑菜单</a></li>'
        +'        <li><a href="rest-statistics.html">查看统计</a></li>'
//        +'        <li><a href="userinfo.html">个人信息</a></li>'
        +'        <li><a href="logout.html">退出</a></li>'
        +'      </ul>'
        +'    </div>'
        +'  </div>'
        +'</nav>';
    var deliverernavbar =
        '<nav class="navbar navbar-fixed-top">'
        +'  <div class="container">'
        +'    <div class="navbar-header">'
        +'      <span class="navbar-brand">欢迎使用外卖系统 - 送餐员版</span>'
        +'    </div>'
        +'    <div id="navbar"><!--'
        +'      <ul class="nav navbar-nav">'
        +'        <li><a href="#">Link</a></li>'
        +'      </ul>-->'
        +''
        +'      <ul class="nav navbar-nav navbar-right">'
        +'        <li><a href="deliverer.html">最近订单</a></li>'
        +'        <li><a href="deliverer-statistics.html">查看统计</a></li>'
//        +'        <li><a href="userinfo.html">个人信息</a></li>'
        +'        <li><a href="logout.html">退出</a></li>'
        +'      </ul>'
        +'    </div>'
        +'  </div>'
        +'</nav>';

    var adminnavbar =
        '<nav class="navbar navbar-fixed-top">'
        +'  <div class="container">'
        +'    <div class="navbar-header">'
        +'      <span class="navbar-brand">欢迎使用外卖系统 - 管理员版</span>'
        +'    </div>'
        +'    <div id="navbar"><!--'
        +'      <ul class="nav navbar-nav">'
        +'        <li><a href="#">Link</a></li>'
        +'      </ul>-->'
        +''
        +'      <ul class="nav navbar-nav navbar-right">'
        +'        <li><a href="admin.html">编辑餐厅</a></li>'
        +'        <li><a href="admin-order-statistics.html">用户订单统计</a></li>'
        +'        <li><a href="admin-rest-statistics.html">餐厅点餐统计</a></li>'
//        +'        <li><a href="userinfo.html">个人信息</a></li>'
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
    } else if (userrole == "rest") {
        $("#navbarbox").html(restnavbar);
    } else if (userrole == "deliverer") {
        $("#navbarbox").html(deliverernavbar);
    } else if (userrole == "admin") {
        $("#navbarbox").html(adminnavbar);
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
    var sdata = get_session_data();
    Cookies.remove("sessiondata");
    return new Promise ( function (resolve, reject) {
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
    if (!login_timeout_flag) {
        make_popup_msgbox(create_alert(document.createElement("div"), "danger", "错误", str + "\n请刷新页面后重试\n"));
    }
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
        case "logout":
            request_login = false;
    }
    
    
    //if (request_login && !check_login())
        //return new Promise ( function (resolve, reject) { reject("登录超时"); });
    
    console.log("REQUEST DATA: ", parameters);
    
    console.log("REQUEST: " + JSON.stringify(parameters));
    // FIXME: get some data
    
    var url = "";
    switch (parameters.action) {
    	case "login":
    		url = "LoginServlet";
    		break;
    	case "logout":
    		url = "logout";
    		break;
    	case "register":
            url = "RegisteServlet";
            break;
        case "submitorder":
        case "confirmorder":
        case "getuserinfo":
        case "setuserinfo":
        case "getcuisinelist":
        case "getorderlist":
            url = "UserServlet";
            break;
        case "getrestlist":
        case "getcuisinelist":
        case "getdelivererlist":
        case "setorderdeliverer":
        case "getrestorderlist":
        case "createcuisine":
        case "deletecuisine":
        case "getrestdesc":
        case "setcuisineinfo":
        case "getreststatistics":
            url = "RestServlet";
            break;
        case "getdelivererorderlist":
        case "deliveryconfirm":
            url = "DelivererServlet";
            break;
    }
    
    url = "";
    if (url != "") {
        url = "http://localhost:8080/DataBase/" + url;
        var sdata = get_session_data();
        if (sdata) {
        	parameters["uid"] = sdata.uid;
        	parameters["rid"] = sdata.rid;
        	parameters["id"] = sdata.id;
        	parameters["delivererid"] = sdata.delivererid;
        }
        return new Promise ( function (resolve, reject) {
            $.post(url, { data: JSON.stringify(parameters) }, null, "json").done( function (data, textStatus, jqXHR) {
            	console.log("REMOTE RESPONSE: " + JSON.stringify(data));
                resolve(data);
            }).fail( function (xhr, textStatus, errorThrown) {
                reject("post to " + url + " failed: " + textStatus + ", " + errorThrown);
            });
        });
    }
    
    // the FAKE data generator
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
                        sessionlife: "3600", /* in seconds */
                    }
                } else {
                    data = {
                        result: "error",
                        reason: "错误的用户名或密码",
                    }
                }
            } else if (parameters.action == "logout") {
                /* ####### ACTION: logout #######
                    input 
                        {
                            action: "logout",
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                };
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
                        { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭" },
                        { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团" },
                        { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！" },
                    ],
                };
            } else if (parameters.action == "getdelivererlist") {
                /* ####### ACTION: getdelivererlist #######
                    input 
                        action: "getdelivererlist",
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        { delivererid: 1111, deliverername: "送餐员甲", deliverertel: "110" },
                        { delivererid: 2222, deliverername: "送餐员乙", deliverertel: "120" },
                        { delivererid: 3333, deliverername: "送餐员丙", deliverertel: "130" },
                    ],
                };
            } else if (parameters.action == "submitorder") {
                /* ####### ACTION: submitorder #######
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
            } else if (parameters.action == "setorderdeliverer") {
                /* ####### ACTION: setorderdeliverer #######
                    input 
                        {
                            action: "setorderdeliverer",
                            oid: oitem.oid,
                            delivererid: delivererlist[dlid].delivererid,
                            delivererfee: parseFloat(dfee),
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
                                { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 7 },
                            ],
                        },
                        {
                            rid: "qj",
                            rname: "全家",
                            oid: 2000,
                            odatetime: "2016-01-42 12:79",
                            ostate: "pending",
                            ocontent: [
                                { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 2 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 3 },
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
            } else if (parameters.action == "getrestorderlist") {
                /* ####### ACTION: getrestorderlist #######
                    input 
                        action: "getrestorderlist",
                        data: [
                        ]
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        {
                            oid: 3000,
                            odatetime: "2016-03-48 32:18",
                            ostate: "pending",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            ocontent: [
                                { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 7 },
                            ],
                        },
                        {
                            oid: 1000,
                            odatetime: "2016-01-32 01:93",
                            ostate: "delivering",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            odeliverername: "张三",
                            ocontent: [
                                { cid: "djp", cname: "招牌大鸡排", cprice: "13.00", cdesc: "好吃的鸡排", camount: 1 },
                            ],
                        },
                    ],
                };
            } else if (parameters.action == "getdelivererorderlist") {
                /* ####### ACTION: getdelivererorderlist #######
                    input 
                        action: "getdelivererorderlist",
                        data: [
                        ]
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        {
                            oid: 3000,
                            odatetime: "2016-03-48 32:18",
                            ostate: "pending",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            odelivererfee: 10.00,
                            ocontent: [
                                { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 7 },
                            ],
                        },
                        {
                            oid: 1000,
                            odatetime: "2016-01-32 01:93",
                            ostate: "finished",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            odelivererfee: 20.00,
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
                            password: password,
                            tel: tel,
                            address: address,
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "getreststatistics") {
                /* ####### ACTION: getreststatistics #######
                    input 
                        {
                            action: "getreststatistics",
                            statstart: qstart,
                            statend: qend,
                        }
                    output example see below
                */
                data = {
                    result: "ok",
                    revenue: "12345.67",
                    popularcuisine: [
                        { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                        { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                        { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 7 },
                    ]
                };
            } else if (parameters.action == "getrestcuisinelist") {
                /* ####### ACTION: getrestcuisinelist #######
                    input 
                        action: "getrestcuisinelist",
                    output example see below
                */
                data = {
                    result: "ok",
                    rdesc: "盖罗娇的山中野店，酒和菜都是西南边疆的特产",
                    data: [
                        { cid: "cnmt", cname: "陈年茅台", cprice: "12.34", cdesc: "小店远近驰名的陈年茅台" },
                        { cid: "mzxht", cname: "蜜汁熏火腿", cprice: "45.67", cdesc: "小店最拿手的蜜汁熏火腿" },
                    ],
                };
            } else if (parameters.action == "createcuisine") {
                /* ####### ACTION: createcuisine #######
                    input 
                        action: "createcuisine",
                    output example see below
                */
                data = {
                    result: "ok",
                    data:
                        { cid: "newcuisine", cname: "新菜品", cprice: "1.00", cdesc: "请填入菜品简介" }
                };
            } else if (parameters.action == "deletecuisine") {
                /* ####### ACTION: deletecuisine #######
                    input 
                        action: "deletecuisine",
                        cid: cuisine id,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "getrestdesc") {
                /* ####### ACTION: getrestdesc #######
                    input 
                        action: "getrestdesc",
                    output example see below
                */
                data = {
                    result: "ok",
                    rdesc: "盖罗娇的山中野店，酒和菜都是西南边疆的特产",
                };
            } else if (parameters.action == "setrestdesc") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        action: "setrestdesc",
                        rdesc: "newdesc"
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "setcuisineinfo") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        action: "setcuisineinfo",
                        cid: citem.cid,
                        cname: newcname,
                        cdesc: newcdesc,
                        cprice: newcprice,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "delivererconfirm") {
                /* ####### ACTION: delivererconfirm #######
                    input 
                        action: "delivererconfirm",
                        cid: citem.cid,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "getdelivererstatistics") {
                /* ####### ACTION: getdelivererstatistics #######
                    input 
                        action: "getdelivererstatistics",
                        statstart: qstart,
                        statend: qend,
                    output example see below
                */
                data = {
                    result: "ok",
                    totalsalary: "1234.56",
                    data: [
                        {
                            oid: 3000,
                            orestid: 4000,
                            orestname: "逍遥客栈",
                            odatetime: "2016-03-48 32:18",
                            ofinishtime: "2016-01-34 00:93",
                            ostate: "finished",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            odeliverername: "张三",
                            odeliverertel: "12345",
                            odelivererfee: 20.00,
                            ocontent: [
                                { cid: "dbf", cname: "番茄滑蛋饭", cprice: "14.30", cdesc: "其实就是西红柿鸡蛋盖饭", camount: 1 },
                                { cid: "ft", cname: "孜然烤鸡饭团", cprice: "7.20", cdesc: "一般的饭团", camount: 5 },
                                { cid: "lm", cname: "本帮炒素凉面", cprice: "13.20", cdesc: "一点肉都没有！", camount: 7 },
                            ],
                        },
                        {
                            oid: 1000,
                            orestid: 5000,
                            orestname: "仙剑客栈",
                            odatetime: "2016-01-32 01:93",
                            ofinishtime: "2016-01-34 00:93",
                            ostate: "delivering",
                            oconsumername: "王五",
                            oconsumertel: "13800138000",
                            oconsumeraddr: "mars",
                            odeliverername: "张三",
                            odeliverertel: "12345",
                            odelivererfee: 20.00,
                            ocontent: [
                                { cid: "djp", cname: "招牌大鸡排", cprice: "13.00", cdesc: "好吃的鸡排", camount: 1 },
                            ],
                        },
                    ],
                };
            } else if (parameters.action == "getadminrestlist") {
                /* ####### ACTION: getrestdesc #######
                    input 
                        action: "getrestdesc",
                    output example see below
                */
                data = {
                    result: "ok",
                    data: [
                        { rid: 1000, rname: "山中野店", rdesc: "酒和菜都是西南边疆的特产", rtel: "12345", raddr: "PAL"},
                        { rid: 2000, rname: "全家", rdesc: "FamilyMart", rtel: "13800138000", raddr: "蔡伦路华佗路"},
                        { rid: 3000, rname: "泡泡香香鸡", rdesc: "主要售卖炸鸡排", rtel: "13800123456", raddr: "高科苑门口"},
                    ]
                };
            } else if (parameters.action == "setrestinfo") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        rid: ritem.rid,
                        rname: newrname,
                        rdesc: newrdesc,
                        raddr: newraddr,
                        rtel: newrtel,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "setrestpassword") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        action: "setrestpassword",
                        rid: ritem.rid,
                        newpassword: newpasswd,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "deleterest") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        rid: ritem.rid,
                    output example see below
                */
                data = {
                    result: "ok",
                };
            } else if (parameters.action == "createrest") {
                /* ####### ACTION: setrestdesc #######
                    input 
                        rid: ritem.rid,
                        rname: newrname,
                        rdesc: newrdesc,
                        raddr: newraddr,
                        rtel: newrtel,
                    output example see below
                */
                data = {
                    result: "ok",
                    data: {
                        rid: 33333,
                        rname: "请输入名称",
                        rdesc: "请输入简介",
                        raddr: "请输入地址",
                        rtel: "请输入电话",
                    }
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



function ostat2str(stat)
{
    //   ->   制作中      ->      运送中    ->     已完成
    // 用户下单       餐厅选择配送员        用户确认
    switch (stat) {
        case "finished": return "已完成";
        case "pending": return "制作中";
        case "needconfirm": return "待确认";
        case "delivering": return "运送中";
        default: return "未知 (" + stat + ")";
    }
}

function is_user_confirmable(stat)
{
    switch (stat) {
        case "pending":
        case "needconfirm":
        case "delivering":
            return true;
        default:
            return false;
    }
}

function is_rest_confirmable(stat)
{
    switch (stat) {
        case "pending":
            return true;
        default:
            return false;
    }
}
