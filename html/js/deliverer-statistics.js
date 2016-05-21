function reset_reststat_form()
{
    $("#querypage").show();
    $("#resultpage").hide();
    $("#inputstatstart").val("2000-01-01 00:00:00");
    var curdate = new Date();
    $("#inputstatend").val(curdate.getFullYear() + "-" + 
        ("0" + curdate.getMonth().toString()).slice(-2) + "-" +
        ("0" + curdate.getDate().toString()).slice(-2)  + " 23:59:59");
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
    $("#resultpage").hide();
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
        //$("#querypage").hide();
        $("#resultpage").show();
        $("#reststatform").find("input").prop("disabled", false);
        $("#reststatform").find("button").prop("disabled", false);
        $("#submitbtn").text("提交查询");
    }, function (reason) {
        show_error("can't deliverer statisiics: " + reason);
    });
}

$(document).ready( function () {
    check_login();
    init_navbar();
    reset_reststat_form();
});
