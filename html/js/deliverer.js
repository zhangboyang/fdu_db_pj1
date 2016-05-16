var omsgboxtimeoutid;

function select_order_deliverer(oitem)
{
    if (!confirm("您确认此订单已经送到吗？"))
        return;
    $("#selectdeliverermsgbox").empty();

    $("#confirmbtn").text("正在提交");
    $("#confirmbtn").prop("disabled", true);
    
    request_data({
        action: "delivererconfirm",
        oid: oitem.oid,
    }).then(function (data) {
        if (data.result != "ok") {
            show_error("delivererconfirm error: " + data.reason);
            return;
        }
        load_order_list();
        create_alert("#omsgbox", "success", "订单确认成功", "");
        clearTimeout(omsgboxtimeoutid);
        omsgboxtimeoutid = setTimeout(function () {
            $("#omsgbox").empty();
        }, 5000);
    }, function (reason) {
        show_error("can't confirm order: " + reason);
    });
}

function show_order_detail(oitem)
{
    if (is_rest_confirmable(oitem.ostate)) {
        $("#confirmbtn").show();
    } else {
        $("#confirmbtn").hide();
    }
    $("#omsgbox").empty();
    $("#backtoorderlistbtn").prop("disabled", false);
    $("#backtoorderlistbtn2").prop("disabled", false);
    $("#confirmbtn").prop("disabled", false).text("确认送到");
    $("#orderlistpage").hide();
    $("#orderdetailpage").show();
    
    $("#od_consumername").text(oitem.oconsumername);
    $("#od_consumertel").text(oitem.oconsumertel);
    $("#od_consumeraddr").text(oitem.oconsumeraddr);
    $("#od_deliverername").text(oitem.odeliverername);
    $("#od_odatetime").text(oitem.odatetime);
    $("#od_stat").text(ostat2str(oitem.ostate));
    
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
                    .text(citem.camount))
        );
    });
    $("#od_delivererfee").text(parseFloat(oitem.odelivererfee).toFixed(2));
    $("#confirmbtn").unbind("click").click( function () {
        select_order_deliverer(oitem, this);
    });
}


function load_order_list()
{
    $("#orderlistpage").show();
    $("#orderdetailpage").hide();
    
    $("#orderlisttable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    request_data({
        action: "getdelivererorderlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getdelivererorderlist error: " + data.reason);
            return;
        }
        var olist = data.data;
        var tobj = $("#orderlisttable").children("tbody");
        tobj.empty();
        if (olist.length == 0) {
            $("#orderlisttable").children("tbody").html("<tr><td></td><td></td><td>暂无数据</td><td></td><td></td><td></td><td></td><td></td></tr>");
        }
        olist.forEach( function (oitem) {
            let oobj = oitem;
            var contentobj = $(document.createElement("td"));
            
            oitem.ocontent.forEach( function (citem) {
                $(document.createElement("div"))
                    .text(citem.cname + " * " + citem.camount.toString())
                    .appendTo(contentobj);
            });
            var actionobj = $(document.createElement("td"));
            var confirmable = is_rest_confirmable(oitem.ostate);
            if (confirmable) oitem["odeliverername"] = "待选择";
            
            $(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm")
                .addClass(confirmable ? "btn-success" : "btn-default")
                .text(confirmable ? "去确认" : "查看详情")
                .click( function () {
                    show_order_detail(oobj);
                }).appendTo(actionobj);
            
            tobj.append(
                $(document.createElement("tr"))
                    .append(contentobj)
                    .append($(document.createElement("td"))
                        .text(oitem.odatetime))
                    .append($(document.createElement("td"))
                        .text(oitem.oconsumername))
                    .append($(document.createElement("td"))
                        .text(oitem.oconsumeraddr))
                    .append($(document.createElement("td"))
                        .text(oitem.oconsumertel))
                    .append($(document.createElement("td"))
                        .text(parseFloat(oitem.odelivererfee).toFixed(2)))
                    .append($(document.createElement("td"))
                        .text(ostat2str(oitem.ostate)))
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
