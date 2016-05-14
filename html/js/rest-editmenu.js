var restdescstr;

function edit_restdesc()
{
    $("#inputrestdesc").val(restdescstr).show();
    $("#restdesc").hide();
    $("#editdescconfirmbtn").show();
    $("#editdesccancelbtn").show();
    $("#editdescbtn").hide();
}

function edit_restdesc_confirm()
{
    var newrestdescstr = $("#inputrestdesc").val();
    $("#inputrestdesc").prop("disabled", true);
    $("#editdescconfirmbtn").text("保存中").prop("disabled", true);
    $("#editdesccancelbtn").prop("disabled", true);
    request_data({
        action: "setrestdesc",
        rdesc: newrestdescstr,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("setrestdesc error: " + data.reason);
            return;
        }
        restdescstr = newrestdescstr;
        $("#editdescconfirmbtn").text("确定").prop("disabled", false);
        $("#editdesccancelbtn").prop("disabled", false);
        $("#inputrestdesc").prop("disabled", false);
        $("#restdesc").text(newrestdescstr).show();
        $("#inputrestdesc").hide();
        $("#editdescconfirmbtn").hide();
        $("#editdesccancelbtn").hide();
        $("#editdescbtn").show();
    }, function (reason) {
        show_error("can't set rest desc: " + reason);
    });
}

function edit_restdesc_cancel()
{
    $("#restdesc").text(restdescstr).show();
    $("#inputrestdesc").hide();
    $("#editdescconfirmbtn").hide();
    $("#editdesccancelbtn").hide();
    $("#editdescbtn").show();
}

function load_restdesc()
{
    $("#restdesc").text("加载中").show();
    $("#inputrestdesc").hide();
    $("#editdescconfirmbtn").hide();
    $("#editdesccancelbtn").hide();
    $("#editdescbtn").show().prop("disabled", true);
    request_data({
        action: "getrestdesc",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getrestdesc error: " + data.reason);
            return;
        }
        restdescstr = data.rdesc;
        $("#restdesc").text(restdescstr);
        $("#editdescbtn").prop("disabled", false);
    }, function (reason) {
        show_error("can't get rest desc: " + reason);
    });
}

function new_inputbox()
{
    return $(document.createElement("input"))
        .attr("type", "text")
        .addClass("form-control")
        .css("width", "80%")
        .css("display", "inline-block");
}

function gen_cuisine_td(citem, trobj)
{
    return trobj.empty()
        .append($(document.createElement("td"))
            .text(citem.cname))
        .append($(document.createElement("td"))
            .text(citem.cdesc))
        .append($(document.createElement("td"))
            .text(parseFloat(citem.cprice).toFixed(2)))
        .append($(document.createElement("td"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-default")
                .text("修改")
                .click( function () {
                    edit_cuisine(citem, this);
                }))
            .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-danger")
                .text("删除")
                .click( function () {
                    delete_cuisine(citem, this);
                }))
        );
}
function edit_cuisine_confirm(citem, trobj)
{
    trobj.find("button, input").prop("disabled", true);
    $(trobj.find("button")[0]).text("保存中");
    var inputboxlist = trobj.find("input");
    var newcname = $(inputboxlist[0]).val();
    var newcdesc = $(inputboxlist[1]).val();
    var newcprice = parseFloat($(inputboxlist[2]).val());
    request_data({
        action: "setcuisineinfo",
        cid: citem.cid,
        cname: newcname,
        cdesc: newcdesc,
        cprice: newcprice,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("setcuisineinfo error: " + data.reason);
            return;
        }
        citem.cname = newcname;
        citem.cdesc = newcdesc;
        citem.cprice = newcprice;
        gen_cuisine_td(citem, trobj);
    }, function (reason) {
        show_error("can't get set cuisine info: " + reason);
    });
}
function edit_cuisine(citem, domobj)
{
    var trobj = $(domobj).closest("tr");
    trobj.empty()
        .append($(document.createElement("td"))
            .append(new_inputbox().val(citem.cname)))
        .append($(document.createElement("td"))
            .append(new_inputbox().val(citem.cdesc)))
        .append($(document.createElement("td"))
            .append(new_inputbox().val(parseFloat(citem.cprice).toFixed(2))))
        .append($(document.createElement("td"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-success")
                .text("保存")
                .click( function () {
                    edit_cuisine_confirm(citem, trobj);
                }))
            .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
            .append($(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-default")
                .text("取消")
                .click( function () {
                    gen_cuisine_td(citem, trobj);
                }))
        );
}

function new_cuisine(btnobj)
{
    $(btnobj).text("创建中").prop("disabled", true);
    request_data({
        action: "createcuisine",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("createcuisine error: " + data.reason);
            return;
        }
        var citem = data.data;
        var trobj = document.createElement("tr");
        $(btnobj).closest("tr").before($(trobj));
        edit_cuisine(citem, trobj);
        $(btnobj).text("添加菜品").prop("disabled", false);
    }, function (reason) {
        show_error("can't create cuisine: " + reason);
    });
}

function delete_cuisine(citem, btnobj)
{
    if (!confirm("您确定要删除 " + citem.cname + " 吗？")) return;
    $(btnobj).text("删除中");
    $(btnobj).closest("tr").find("button").prop("disabled", true);
    request_data({
        action: "deletecuisine",
        cid: citem.cid,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("deletecuisine error: " + data.reason);
            return;
        }
        $(btnobj).closest("tr").remove();
    }, function (reason) {
        show_error("can't delete cuisine: " + reason);
    });
}

function load_cuisine_list()
{
    $("#cuisinetable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td></tr>");
    request_data({
        action: "getrestcuisinelist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getrestcuisinelist error: " + data.reason);
            return;
        }
        var clist = data.data;
        ordercontent = clist;
        var tobj = $("#cuisinetable").children("tbody");
        tobj.empty();
        if (clist.length == 0) {
            $("#cuisinetable").children("tbody").html("<tr><td></td><td>暂无数据</td><td></td><td></td></tr>");
        }
        clist.forEach( function (citem) {
            citem["camount"] = 0;
            let cobj = citem;
            let amountspan = document.createElement("span");
            tobj.append(
                gen_cuisine_td(citem, $(document.createElement("tr")))
            );
        });
        tobj.append($(document.createElement("tr"))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
                .append($(document.createElement("td"))
                    .append($(document.createElement("button"))
                        .attr("type", "button")
                        .addClass("btn btn-sm btn-primary")
                        .text("添加菜品")
                        .click( function () {
                            new_cuisine(this);
                        }))
                )
        );
    }, function (reason) {
        show_error("can't get rest cuisine list: " + reason);
    });
}


$(document).ready( function () {
    check_login();
    init_navbar();
    load_restdesc();
    load_cuisine_list();
});
