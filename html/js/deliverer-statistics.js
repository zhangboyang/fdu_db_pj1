function back_to_input()
{
    $("#querypage").show();
    $("#resultpage").hide();
    $("#reststatform").find("input").prop("disabled", false);
    $("#reststatform").find("button").prop("disabled", false);
    $("#submitbtn").text("提交查询");
    $("#resultpage").hide();
    $("#orderdetailpage").hide();
}

function reset_reststat_form()
{
    back_to_input();
    $("#inputstatstart").val("2000-01-01 00:00:00");
    var curdate = new Date();
    $("#inputstatend").val(curdate.getFullYear() + "-" + 
        ("0" + curdate.getMonth().toString()).slice(-2) + "-" +
        ("0" + curdate.getDate().toString()).slice(-2)  + " 23:59:59");
}

function query_statistics()
{
    var qstart = $("#inputstatstart").val();
    var qend = $("#inputstatend").val();
    $("#od_start").text(qstart);
    $("#od_end").text(qend);
    $("#reststatform").find("input").prop("disabled", true);
    $("#reststatform").find("button").prop("disabled", true);
    $("#submitbtn").text("查询中");
    
    request_data({
        action: "getdelivererstatistics",
        statstart: qstart,
        statend: qend,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getdelivererstatistics error: " + data.reason);
            return;
        }
        //var tobj = $("#cuisinetable").children("tbody");
        //tobj.empty();
        $("#od_salary").text(data.totalsalary);
        $("#querypage").hide();
        $("#resultpage").show();
        $("#reststatform").find("input").prop("disabled", false);
        $("#reststatform").find("button").prop("disabled", false);
        $("#submitbtn").text("提交查询");
        
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
            
            $(document.createElement("button"))
                .attr("type", "button")
                .addClass("btn btn-sm")
                .addClass("btn-default")
                .text("查看详情")
                .click( function () {
                    show_order_detail(oobj);
                }).appendTo(actionobj);
            
            tobj.append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .text(oitem.orestname))
                    .append(contentobj)
                    .append($(document.createElement("td"))
                        .text(oitem.odatetime))
                    .append($(document.createElement("td"))
                        .text(oitem.ofinishtime))
                    .append($(document.createElement("td"))
                        .text(oitem.oconsumername))
                    .append($(document.createElement("td"))
                        .text(parseFloat(oitem.odelivererfee).toFixed(2)))
                    .append(actionobj)
            );
        });
    }, function (reason) {
        show_error("can't deliverer statisiics: " + reason);
    });
}

function back_to_result()
{
    $("#resultpage").show();
    $("#orderdetailpage").hide();
}

function show_order_detail(oitem)
{
    $("#resultpage").hide();
    $("#orderdetailpage").show();
    
    $("#od_restname").text(oitem.orestname);
    $("#od_consumername").text(oitem.oconsumername);
    $("#od_consumertel").text(oitem.oconsumertel);
    $("#od_consumeraddr").text(oitem.oconsumeraddr);
    $("#od_deliverername").text(oitem.odeliverername);
    $("#od_deliverertel").text(oitem.odeliverertel);
    $("#od_odatetime").text(oitem.odatetime);
    $("#od_ofinishtime").text(oitem.ofinishtime);
    $("#od_stat").text(ostat2str(oitem.ostate));
    $("#od_delivererfee").text(parseFloat(oitem.odelivererfee).toFixed(2));
    
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




$(document).ready( function () {
    check_login();
    init_navbar();
    reset_reststat_form();
});
