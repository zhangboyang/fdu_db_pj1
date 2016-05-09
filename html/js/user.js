var ordercontent;

function change_cuisine_amount(cobj, delta, amountspan)
{
    cobj.camount += delta;
    if (cobj.camount < 0) cobj.camount = 0;
    $(amountspan).text(cobj.camount.toString());
    console.log(ordercontent);
}

function load_cuisine_list(robj)
{
    $("#restpage").hide();
    $("#cuisinepage").show();
    
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
                        .text(citem.cprive))
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
