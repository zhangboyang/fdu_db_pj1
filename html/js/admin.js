var restdescstr;


function new_inputbox()
{
    return $(document.createElement("input"))
        .attr("type", "text")
        .addClass("form-control")
        .css("width", "80%")
        .css("display", "inline-block");
}

function gen_rest_td(ritem, trobj)
{
    return trobj.empty()
        .append($(document.createElement("td"))
            .text(ritem.rname))
        .append($(document.createElement("td"))
            .text(ritem.rdesc))
        .append($(document.createElement("td"))
            .text(ritem.raddr))
        .append($(document.createElement("td"))
            .text(ritem.rtel))
        .append($(document.createElement("td"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-default")
                .text("修改")
                .click( function () {
                    edit_rest(ritem, this);
                }))
            .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-danger")
                .text("删除")
                .click( function () {
                    delete_rest(ritem, this);
                }))
            .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-warning")
                .text("重设密码")
                .click( function () {
                    set_rest_password(ritem, this);
                }))
        );
}
function edit_rest_confirm(ritem, trobj)
{
    trobj.find("button, input").prop("disabled", true);
    $(trobj.find("button")[0]).text("保存中");
    var inputboxlist = trobj.find("input");
    var newrname = $(inputboxlist[0]).val();
    var newrdesc = $(inputboxlist[1]).val();
    var newraddr = $(inputboxlist[2]).val();
    var newrtel = $(inputboxlist[3]).val();
    request_data({
        action: "setrestinfo",
        rid: ritem.rid,
        rname: newrname,
        rdesc: newrdesc,
        raddr: newraddr,
        rtel: newrtel,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("setrestinfo error: " + data.reason);
            return;
        }
        ritem.rname = newrname;
        ritem.rdesc = newrdesc;
        ritem.raddr = newraddr;
        ritem.rtel = newrtel;
        gen_rest_td(ritem, trobj);
    }, function (reason) {
        show_error("can't get set rest info: " + reason);
    });
}
function set_rest_password(ritem, domobj)
{
    var trobj = $(domobj).closest("tr");
    var newpasswd = prompt("请输入新密码：");
    if (!newpasswd) { alert("操作已取消。"); return; }
    trobj.find("button, input").prop("disabled", true);
    $(this).text("正在设置");
    request_data({
        action: "setrestpassword",
        rid: ritem.rid,
        newpassword: newpasswd,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("setrestpassword error: " + data.reason);
            return;
        }
        alert("密码已成功重设。");
        $(this).text("重设密码");
        trobj.find("button, input").prop("disabled", false);
    }, function (reason) {
        show_error("can't get set rest password: " + reason);
    });
}
function edit_rest(ritem, domobj)
{
    var trobj = $(domobj).closest("tr");
    trobj.empty()
        .append($(document.createElement("td"))
            .append(new_inputbox().val(ritem.rname)))
        .append($(document.createElement("td"))
            .append(new_inputbox().val(ritem.rdesc)))
        .append($(document.createElement("td"))
            .append(new_inputbox().val(ritem.raddr)))
        .append($(document.createElement("td"))
            .append(new_inputbox().val(ritem.rtel)))
        .append($(document.createElement("td"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-success")
                .text("保存")
                .click( function () {
                    edit_rest_confirm(ritem, trobj);
                }))
            .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-default")
                .text("取消")
                .click( function () {
                    gen_rest_td(ritem, trobj);
                }))
        );
}

function new_rest(btnobj)
{
    $(btnobj).text("创建中").prop("disabled", true);
    request_data({
        action: "createrest",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("createrest error: " + data.reason);
            return;
        }
        var ritem = data.data;
        var trobj = document.createElement("tr");
        $(btnobj).closest("tr").before($(trobj));
        edit_rest(ritem, trobj);
        $(btnobj).text("添加餐厅").prop("disabled", false);
    }, function (reason) {
        show_error("can't create rest: " + reason);
    });
}

function delete_rest(ritem, btnobj)
{
    if (!confirm("您确定要删除 " + ritem.rname + " 吗？")) return;
    $(btnobj).text("删除中");
    $(btnobj).closest("tr").find("button").prop("disabled", true);
    request_data({
        action: "deleterest",
        rid: ritem.rid,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("deleterest error: " + data.reason);
            return;
        }
        $(btnobj).closest("tr").remove();
    }, function (reason) {
        show_error("can't delete rest: " + reason);
    });
}

function load_rest_list()
{
    $("#resttable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td><td></td></tr>");
    request_data({
        action: "getadminrestlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getrestrestlist error: " + data.reason);
            return;
        }
        var clist = data.data;
        ordercontent = clist;
        var tobj = $("#resttable").children("tbody");
        tobj.empty();
        if (clist.length == 0) {
            $("#resttable").children("tbody").html("<tr><td></td><td>暂无数据</td><td></td><td></td><td></td></tr>");
        }
        clist.forEach( function (ritem) {
            ritem["camount"] = 0;
            let cobj = ritem;
            let amountspan = document.createElement("span");
            tobj.append(
                gen_rest_td(ritem, $(document.createElement("tr")))
            );
        });
        tobj.append($(document.createElement("tr"))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
                .append($(document.createElement("td"))
                    .append($(document.createElement("button"))
                        .attr("type", "button")
                        .addClass("btn btn-sm btn-primary")
                        .text("添加餐厅")
                        .click( function () {
                            new_rest(this);
                        }))
                )
        );
    }, function (reason) {
        show_error("can't get admin rest list: " + reason);
    });
}


$(document).ready( function () {
    check_login();
    init_navbar();
    load_rest_list();
});
