var omsgboxtimeoutid;
function confirm_order(oitem, btnobj)
{
    $("#backtoorderlistbtn").prop("disabled", true);
    $(btnobj).text("正在确认");
    $("#orderlisttable").find("button").prop("disabled", true);
    $("#confirmbtn").prop("disabled", true);
    request_data({
        action: "confirmorder",
        oid: oitem.oid,
    }).then(function (data) {
        if (data.result != "ok") {
            show_error("confirmorder error: " + data.reason);
            return;
        }
        load_order_list();
        create_alert("#omsgbox", "success", "订单确认成功", "");
        clearTimeout(omsgboxtimeoutid);
        omsgboxtimeoutid = setTimeout(function () {
            $("#omsgbox").empty();
        }, 5000);
    }, function (reason) {
        show_error("can't confirm order list: " + reason);
    });
}

function show_order_detail(oitem)
{
    if (is_confirmable(oitem.ostate)) {
        $("#confirmbtn").show();
    } else {
        $("#confirmbtn").hide();
    }
    $("#omsgbox").empty();
    $("#backtoorderlistbtn").prop("disabled", false);
    $("#confirmbtn").prop("disabled", false).text("确认订单");
    $("#orderlistpage").hide();
    $("#orderdetailpage").show();
    $("#od_rname").text(oitem.rname);
    $("#od_odatetime").text(oitem.odatetime);
    $("#od_stat").text(stat2str(oitem.ostate));
    var tobj = $("#cuisinetable").children("tbody");
    tobj.empty();
    var ototal = 0, ototalcnt = 0;
    oitem.ocontent.forEach( function (citem) {
        var curcount = parseInt(citem.camount);
        var curprice = parseFloat(citem.cprice) * curcount;
        ototal += curprice;
        ototalcnt += curcount;
        tobj.append(
            $(document.createElement("tr"))
                .append($(document.createElement("td"))
                    .text(citem.cname))
                .append($(document.createElement("td"))
                    .text(citem.cdesc))
                .append($(document.createElement("td"))
                    .text(citem.cprice))
                .append($(document.createElement("td"))
                    .text(citem.camount))
                .append($(document.createElement("td"))
                    .text(curprice.toFixed(2)))
        );
    });
    $("#od_total").text(ototal.toFixed(2));
    tobj.append(
        $(document.createElement("tr"))
            .append($(document.createElement("td"))
                .append($(document.createElement("strong"))
                    .text("合计")))
            .append($(document.createElement("td")))
            .append($(document.createElement("td")))
            .append($(document.createElement("td"))
                .append($(document.createElement("strong"))
                    .text(ototalcnt)))
            .append($(document.createElement("td"))
                .append($(document.createElement("strong"))
                    .text(ototal.toFixed(2))))
    );
    $("#confirmbtn").unbind("click").click( function () {
        confirm_order(oitem, this);
    });
}

function stat2str(stat)
{
    switch (stat) {
        case "finished": return "已完成";
        case "pending": return "制作中";
        case "needconfirm": return "待确认";
        case "delivering": return "运送中";
        default: return "未知 (" + stat + ")";
    }
}

function is_confirmable(stat)
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
function load_order_list()
{
    $("#orderlistpage").show();
    $("#orderdetailpage").hide();
    
    $("#orderlisttable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td><td></td></tr>");
    request_data({
        action: "getorderlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getorderlist error: " + data.reason);
            return;
        }
        var olist = data.data;
        var tobj = $("#orderlisttable").children("tbody");
        tobj.empty();
        olist.forEach( function (oitem) {
            let oobj = oitem;
            var contentobj = $(document.createElement("td"));
            
            oitem.ocontent.forEach( function (citem) {
                $(document.createElement("div"))
                    .text(citem.cname + " * " + citem.camount.toString())
                    .appendTo(contentobj);
            });
            var actionobj = $(document.createElement("td"));
            $(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm btn-default")
                .text("查看详情")
                .click( function () {
                    show_order_detail(oobj);
                }).appendTo(actionobj);
                
            if (is_confirmable(oitem.ostate)) {
                $(document.createElement("span"))
                    .html("&nbsp;&nbsp;")
                    .appendTo(actionobj);
                $(document.createElement("button"))
                    .attr("type", "button")
                    .addClass("btn btn-sm btn-success")
                    .text("确认订单")
                    .click( function () {
                        confirm_order(oobj, this);
                    }).appendTo(actionobj);
            }
            
            tobj.append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .text(oitem.rname))
                    .append(contentobj)
                    .append($(document.createElement("td"))
                        .text(oitem.odatetime))
                    .append($(document.createElement("td"))
                        .text(stat2str(oitem.ostate)))
                    .append(actionobj)
            );
        });
    }, function (reason) {
        show_error("can't get order list: " + reason);
    });
}

$(document).ready( function () {
    check_login();
    init_navbar();
    load_order_list();
});
