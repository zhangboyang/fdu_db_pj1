var ordercontent;

function recalc_ordertotal()
{
    var total = 0;
    ordercontent.forEach( function (citem) {
        total += parseFloat(citem.cprice) * parseInt(citem.camount);
    });
    total = total.toFixed(2);
    
    $("#ordertotal").text("总计 " + total + " 元");
    $("#submitordermsgbox").empty();
}

function submit_order()
{
    var olist = new Array();
    var havecontentflag = false;
    for (var i = 0; i < ordercontent.length; i++) {
        if (ordercontent[i].camount > 0) {
            havecontentflag = true;
            olist.push({
                cid: ordercontent[i].cid,
                camount: ordercontent[i].camount,
            });
        }
    }
    if (!havecontentflag) {
        create_alert("#submitordermsgbox", "danger", "下单失败", "您还没有选择任何一种菜品");
        return;
    }
    
    $("#submitorderbtn").prop("disabled", true).text("正在下单");
    
    request_data({
        action: "submitorder",
        data: olist,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("sumbitorder error: " + data.reason);
            return;
        }
        console.log(data);
    }, function (reason) {
        show_error("can't submit order: " + reason);
    });
}

function change_cuisine_amount(cobj, delta, amountspan)
{
    cobj.camount += delta;
    if (cobj.camount < 0) cobj.camount = 0;
    $(amountspan).text(cobj.camount.toString());
    recalc_ordertotal();
}

function load_cuisine_list(robj)
{
    $("#restpage").hide();
    $("#cuisinepage").show();
    $("#submitorderarea").hide();
    
    $("#restdesc").text(robj.rdesc);
    $("#cuisinepage_restname").text(robj.rname);
    $("#cuisinetable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td></tr>");
    request_data({
        action: "getcuisinelist",
        rid: robj.rid,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getcuisinelist error: " + data.reason);
            return;
        }
        var rlist = data.data;
        ordercontent = rlist;
        var tobj = $("#cuisinetable").children("tbody");
        tobj.empty();
        rlist.forEach( function (citem) {
            citem["camount"] = 0;
            let cobj = citem;
            let amountspan = document.createElement("span");
            tobj.append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .text(citem.cname))
                    .append($(document.createElement("td"))
                        .text(citem.cdesc))
                    .append($(document.createElement("td"))
                        .text(citem.cprice))
                    .append($(document.createElement("td"))
                        .append($(document.createElement("button"))
                            .attr("type", "button")
                            .addClass("btn btn-sm btn-default")
                            .append($(document.createElement("span"))
                                .addClass("glyphicon glyphicon-minus")
                                .attr("aria-hidden", "true"))
                            .click( function () {
                                change_cuisine_amount(cobj, -1, amountspan);
                            }))
                        .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
                        .append($(amountspan).text(citem.camount.toString()))
                        .append($(document.createElement("span")).html("&nbsp;&nbsp;&nbsp;"))
                        .append($(document.createElement("button"))
                            .attr("type", "button")
                            .addClass("btn btn-sm btn-default")
                            .append($(document.createElement("span"))
                                .addClass("glyphicon glyphicon-plus")
                                .attr("aria-hidden", "true"))
                            .click( function () {
                                change_cuisine_amount(cobj, 1, amountspan);
                            }))
                    )
            );
            recalc_ordertotal();
            $("#submitorderarea").show();
        });
    }, function (reason) {
        show_error("can't get cuisine list: " + reason);
    });
}

function load_rest_list()
{
    $("#restpage").show();
    $("#cuisinepage").hide();
    
    $("#resttable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td></tr>");
    request_data({
        action: "getrestlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getrestlist error: " + data.reason);
            return;
        }
        var rlist = data.data;
        var tobj = $("#resttable").children("tbody");
        tobj.empty();
        rlist.forEach( function (ritem) {
            let robj = ritem;
            tobj.append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .text(ritem.rname))
                    .append($(document.createElement("td"))
                        .text(ritem.rdesc))
                    .append($(document.createElement("td"))
                        .append($(document.createElement("button"))
                            .attr("type", "button")
                            .addClass("btn btn-sm btn-default")
                            .text("进入")
                            .click( function () {
                                load_cuisine_list(robj);
                            })))
            );
        });
    }, function (reason) {
        show_error("can't get rest list: " + reason);
    });
}

$(document).ready( function () {
    $("#restpage").show();
    $("#cuisinepage").hide();
    load_rest_list();
});
