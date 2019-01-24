function findSourceCoord(){
    let srcSeat = $("#startPt").val();
    let destSeat = $("#endPt").val();

    let mapName = localStorage.getItem("mapname");
    alert("button clicked..." + srcSeat + "::" + destSeat);


    //get source destination coordinates from DB
    $.get("/get-seat?srcSeat="+srcSeat +"&mapname="+mapName, function(res){
        console.log(JSON.stringify(res));
        let coord = res.empObj.coord;
        console.log("coord::"+coord);
        //$("#"+coord).removeClass("silent");
        $("#"+coord).addClass("destination");

        markWay(coord, window.empSeat);
    });
}

function markWay(source, destination){

    console.log("src coordinate::"+source);
    console.log("dst coordinate::"+destination);

    //create graph
    var nodes = new Array(window.numRows);
    var copy = new Array(window.numCols);
    for (var i = 0; i < nodes.length; i++) {
        copy[i] = 0;
    }
    for (var i=0; i < nodes.length; i++){
        nodes[i] = copy.slice(0);
    }
    var el_arr = $(".silent");
    console.log(el_arr);
    for (var item of el_arr) {
        var x = parseInt(item.id.split("-")[0])
        var y = parseInt(item.id.split("-")[1])
        console.log("x->"+x + " y ->"+y)
        nodes[x][y] = 1
    }
    console.log(nodes);
    console.log("debuging->"+nodes[21][25] + " --" + nodes[26][25] );
    var graph = new Graph(nodes, { diagonal: true });
    var start = graph.grid[ parseInt(source.split("-")[0])  ][ parseInt(source.split("-")[1]) ];
    var end = graph.grid[ parseInt(destination.split("-")[0]) ][ parseInt(destination.split("-")[1]) ];

    //var start = graph.grid[21][25];
    //var end = graph.grid[26][25];

    var pathresult = astar.search(graph, start, end);
    console.log("result->"+pathresult);
    for(var resultitem of pathresult){
        console.log(resultitem)
        var itemid = resultitem.x + "-" + resultitem.y
        console.log(itemid)
        console.log($( "#" +itemid ))
        $( "#" +itemid ).addClass( "searchresult" );
    }

}


function clearAllTextBoxes(){
    $('#seatCoord').val("");
    $("#seatNo").val("");
    $("#empName").val("");
    $("#empPhone").val("");
}
