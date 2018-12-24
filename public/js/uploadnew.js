window.isMouseDown = false;

$(document).mousedown(function(event) {
    if(event.target.nodeName === "TD"){

        window.isMouseDown = true;
        $(event.target).toggleClass("highlighted");

        //console.log("id of node clicked::" + event.target.id)
        $("#seatCoord").val(event.target.id)
    }
}).mouseover(function (event) {
    if(event.target.nodeName === "TD"){
        if (window.isMouseDown) {
            $(event.target).toggleClass("highlighted");
        }
    }

}).mouseup(function (event) {
    if(event.target.nodeName === "TD"){
        window.isMouseDown = false;
    }
});


$('#clearAllBtn').click(function () {

    //clear all highlighted buttons
    console.log('clear all button clicked...')
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
