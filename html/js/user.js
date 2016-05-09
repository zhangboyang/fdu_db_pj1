function load_rest_list()
{
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
            let rid = ritem.rid;
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
                                alert(rid);
                            })))
            );
        });
    }, function (reason) {
        show_error("can't get rest list: " + reason);
    });
}

$(document).ready( function () {
    load_rest_list();
});
