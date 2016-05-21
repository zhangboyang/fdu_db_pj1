function reset_reststat_form()
{
    $("#inputstatstart").val("2000-01-01 00:00:00");
    var curdate = new Date();
    $("#inputstatend").val(curdate.getFullYear() + "-" + 
        ("0" + curdate.getMonth().toString()).slice(-2) + "-" +
        ("0" + curdate.getDate().toString()).slice(-2)  + " 23:59:59");
    back_to_query();
}

function back_to_query()
{
    $("#querypage").show();
    $("#resultpage").hide();
    $("#reststatform").find("input").prop("disabled", false);
    $("#reststatform").find("button").prop("disabled", false);
    $("#submitbtn").text("提交查询");
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
        action: "getadminuserstatistics",
        statstart: qstart,
        statend: qend,
    }).then( function (data) {
        if (data.result != "ok") {
            show_error("getadminuserstatistics error: " + data.reason);
            return;
        }
        var tobj = $("#usertable").children("tbody");
        tobj.empty();
        $("#od_revenue").text(parseFloat(data.totalrevenue).toFixed(2));
        $("#od_orderamount").text(data.totalorderamount);
        data.data.forEach( function (uitem) {
            tobj.append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .text(uitem.uname))
                    .append($(document.createElement("td"))
                        .text(uitem.uaddr))
                    .append($(document.createElement("td"))
                        .text(uitem.utel))
                    .append($(document.createElement("td"))
                        .text(uitem.uorderamount))
                    .append($(document.createElement("td"))
                        .text(parseFloat(uitem.uconsumption).toFixed(2)))
            );
        });
        $("#querypage").hide();
        $("#resultpage").show();
    }, function (reason) {
        show_error("can't get admin user statisiics: " + reason);
    });
}

$(document).ready( function () {
    check_login();
    init_navbar();
    reset_reststat_form();
});
