window.isMouseDown = false;
window.isEditMode = false;
window.isAssistanceEnabled = false;


$("#highlightBtn").click(function(){

    console.log("highlights button clicked...");

    let start = $("#startPt").val();
    let end = $("#endPt").val();

    //TODO: do initial checks to validate coordinates

    console.log(start);
    console.log(end);

    let x1 = parseInt(start.split("-")[0]);
    let y1 = parseInt(start.split("-")[1]);

    let x2 = parseInt(end.split("-")[0]);
    let y2 = parseInt(end.split("-")[1]);

    if(x1===x2){
        for(let i=y1;i<y2;i++){
            $("#" + x1 + "-" + i).addClass("highlighted")
        }

    }else if(y1===y2){
        for(let i=x1;i<x2;i++){
            $("#" + i + "-" + y1).addClass("highlighted")
        }
    }

});

$('#enableAsstCheckBox').click(function() {
    console.log("Checkbox state (method 1) = " + $('#enableAsstCheckBox').prop('checked'));
    console.log("Checkbox state (method 2) = " + $('#enableAsstCheckBox').is(':checked'));

    if($('#enableAsstCheckBox').prop('checked')){
        $("#assistant").attr("hidden", false);
        window.isEditMode = false;
        window.isAssistanceEnabled = true;
    }else{
        $("#assistant").attr("hidden", true);
        window.isEditMode = true;
        window.isAssistanceEnabled = false;
    }
});


// get selection
$('.editMode input[type=radio]').on('change', function() {
    console.log(this.value);
    //
    let el = $("#enableAsstDiv");
    if(this.value === "EditMode"){
        el.attr("hidden", false);
        window.isEditMode = true;
        window.isAssistanceEnabled = false;
        $('#enableAsstCheckBox').prop('checked', false);

    }else if(this.value === "ViewMode"){
        el.attr("hidden", true);
        $("#assistant").attr("hidden", true);
        window.isEditMode = false;
        window.isAssistanceEnabled = false;
    }
});

$(document).mousedown(function(event) {
    if(window.isEditMode &&  event.which === 1 &&  event.target.nodeName === "TD"){

        window.isMouseDown = true;
        $(event.target).toggleClass("highlighted");

        //console.log("id of node clicked::" + event.target.id)
        $("#seatCoord").val(event.target.id)
    }
}).mouseover(function (event) {
    if(window.isEditMode &&  event.which === 1 &&  event.target.nodeName === "TD"){
        if (window.isMouseDown) {
            $(event.target).toggleClass("highlighted");
        }
    }

}).mouseup(function (event) {
    if(window.isEditMode &&  event.which === 1 && event.target.nodeName === "TD"){
        window.isMouseDown = false;
    }
});


$('#clearAllBtn').click(function () {

    //clear all highlighted buttons
    console.log('clear all button clicked...');

    if(window.confirm("Are you sure you want to remove all the markings?\nThis action cannot be undone!")){
        let nodes = [];
        let el_arr = $(".highlighted");

        for (let item of el_arr) {
            item.classList.remove('highlighted')
        }
        $.post("/save-map", {"nodes": nodes, "mapname":localStorage.getItem("mapname")}, function (data) {
            console.log("result from server:" + JSON.stringify(data));
            alert("Markings removed successfully!");

            clearAllTextBoxes();
        });
    }

});

$('#saveMapBtn').click(function () {

    let nodes = [];
    let el_arr = $(".highlighted");

    for (let item of el_arr) {
        nodes.push(item.id)
    }

    //ajax call for saving the map
    $.post("/save-map", {"nodes": nodes, "mapname":localStorage.getItem("mapname")}, function (data) {
        console.log("result from server:" + JSON.stringify(data));
        alert("Map saved successfully!")
    });
});

$('#saveSeatBtn').click(function () {

    let coordinates = $('#seatCoord').val();
    let seat = $("#seatNo").val();
    let empName = $("#empName").val();
    let empPhone = $("#empPhone").val();

    //ajax call for saving seat functionality
    $.post("/save-seat", {
        "coord": coordinates,
        "seatNo": seat,
        "empName": empName,
        "empPhone": empPhone
    }, function (data) {
        console.log("result from server:" + JSON.stringify(data));
        alert("Map saved")
    });
});

$('#removeBtn').click(function () {

    if(window.confirm("Are you sure you want to remove this map?")){
        $.post("/remove-map", {
            "mapname": localStorage.getItem("mapname"),
        }, function (data) {
            console.log("result from server:" + JSON.stringify(data));
            alert("Map successfully removed!\n Redirecting to the home page...");
            window.location.href = "/"
        });
    }
});

$('#searchBtn').click(function () {

    let cellSize = 10;
    let numCols = Math.floor(document.getElementById("myimg").clientWidth / cellSize);
    let numRows = Math.floor(document.getElementById("myimg").clientHeight / cellSize);
    //console.log(nodes)

    //create graph
    let nodes = new Array(numRows);
    let copy = new Array(numCols);
    for (let i = 0; i < nodes.length; i++) {
        copy[i] = 0;
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i] = copy.slice(0);
    }

    let el_arr = $(".highlighted");
    console.log(el_arr);
    for (let item of el_arr) {

        let x = parseInt(item.id.split("-")[0]);
        let y = parseInt(item.id.split("-")[1]);
        console.log("x->" + x + " y ->" + y);
        nodes[x][y] = 1
    }

    console.log(nodes);
    console.log("debuging->" + nodes[0][0] + " --" + nodes[0][1] + " --" + nodes[0][10]);
    let graph = new Graph(nodes, {diagonal: true});
    let start = graph.grid[0][0];
    let end = graph.grid[0][10];
    let pathresult = astar.search(graph, start, end);
    console.log("result->" + pathresult);
    for (let resultitem of pathresult) {
        console.log(resultitem);
        let itemid = resultitem.x + "-" + resultitem.y;
        console.log(itemid);
        console.log($("#" + itemid));
        $("#" + itemid).addClass("searchresult");
    }
});


function clearAllTextBoxes(){
    $('#seatCoord').val("");
    $("#seatNo").val("");
    $("#empName").val("");
    $("#empPhone").val("");
}
