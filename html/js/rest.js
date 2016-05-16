var omsgboxtimeoutid;

var delivererlist;

function load_deliverer_list()
{
    var dlistobj = $("#inputdeliverer");
    dlistobj.prop("disabled", true);
    dlistobj.html('<option value="-1" selected>请选择</option>');
    request_data({
        action: "getdelivererlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getdelivererlist error: " + data.reason);
            return;
        }
        delivererlist = data.data;
        for (var i = 0; i < delivererlist.length; i++) {
            var ditem = delivererlist[i];
            dlistobj.append(
                $(document.createElement("option"))
                    .attr("value", i.toString())
                    .text(ditem.deliverername)
            );
        }
    }, function (reason) {
        show_error("can't get deliverer list: " + reason);
    });
    
    dlistobj.prop("disabled", false);
}


function select_order_deliverer(oitem)
{
    $("#selectdeliverermsgbox").empty();
    var dlid = $("#inputdeliverer").val(); // deliverer index in list
    var dfee = $("#inputfee").val();
    var errtext = ""
    var failflag = false;
    if (parseInt(dlid) == -1) {
        errtext += "请选择一个配送员\n";
        failflag = true;
    }
    if (dfee == "") {
        errtext += "请输入配送费\n";
        failflag = true;
    }
    if (failflag) {
        create_alert("#selectdeliverermsgbox", "danger", "确认失败", errtext);
        return;
    }
    
    if (!confirm("您确认将此订单交由 " + delivererlist[dlid].deliverername + " 配送并支付配送费 " + parseFloat(dfee).toFixed(2) + " 元吗？"))
        return;
    
    $("#confirmbtn").text("正在提交");
    $("#confirmbtn").prop("disabled", true);
    $("#selectdelivererbox").find("select").prop("disabled", true);
    $("#selectdelivererbox").find("input").prop("disabled", true);
    
    request_data({
        action: "setorderdeliverer",
        oid: oitem.oid,
        delivererid: delivererlist[dlid].delivererid,
        delivererfee: parseFloat(dfee),
    }).then(function (data) {
        if (data.result != "ok") {
            show_error("setorderdeliverer error: " + data.reason);
            return;
        }
        load_order_list();
        create_alert("#omsgbox", "success", "配送员选择成功", "");
        clearTimeout(omsgboxtimeoutid);
        omsgboxtimeoutid = setTimeout(function () {
            $("#omsgbox").empty();
        }, 5000);
    }, function (reason) {
        show_error("can't set order deliverer: " + reason);
    });
}

function show_order_detail(oitem)
{
    if (is_rest_confirmable(oitem.ostate)) {
        $("#confirmbtn").show();
        $("#selectdelivererbox").show();
    } else {
        $("#confirmbtn").hide();
        $("#selectdelivererbox").hide();
    }
    $("#omsgbox").empty();
    $("#backtoorderlistbtn").prop("disabled", false);
    $("#backtoorderlistbtn2").prop("disabled", false);
    $("#confirmbtn").prop("disabled", false).text("选择配送员");
    $("#selectdelivererbox").find("select").prop("disabled", false).val("-1");
    $("#selectdelivererbox").find("input").prop("disabled", false).val("");
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
        select_order_deliverer(oitem, this);
    });
}


function load_order_list()
{
    $("#orderlistpage").show();
    $("#orderdetailpage").hide();
    
    $("#orderlisttable").children("tbody").html("<tr><td></td><td>加载中 ...</td><td></td><td></td><td></td><td></td></tr>");
    request_data({
        action: "getrestorderlist",
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getrestorderlist error: " + data.reason);
            return;
        }
        var olist = data.data;
        var tobj = $("#orderlisttable").children("tbody");
        tobj.empty();
        if (olist.length == 0) {
            $("#orderlisttable").children("tbody").html("<tr><td></td><td>暂无数据</td><td></td><td></td><td></td><td></td></tr>");
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
                .text(confirmable ? "选择配送员" : "查看详情")
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
                        .text(oitem.odeliverername))
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
    load_deliverer_list();
    load_order_list();
});
