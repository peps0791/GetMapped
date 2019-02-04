function findSourceCoord(){
    let srcSeat = $("#startPt").val();
    let mapName = localStorage.getItem("mapname");

    //get source destination coordinates from DB give seat number
    $.get("/get-seat?srcSeat="+srcSeat +"&mapname="+mapName, function(res){
        let srcSeatCoord = res.empObj.coord;
        $("#"+srcSeatCoord).addClass("source");

        //get the path between the nodes using A* algorithm
        markWay(srcSeatCoord, window.destEmpSeatCoord);
        let dstSeatCoord = $("#"+window.destEmpSeatCoord);
        dstSeatCoord.removeClass("searchResult");
        dstSeatCoord.addClass("destination");
    });
}

function markWay(source, destination){

    console.log("src coordinate::"+source);
    console.log("dst coordinate::"+destination);

    //create graph
    let nodes = new Array(window.numRows);
    let copy = new Array(window.numCols);
    for (let i = 0; i < nodes.length; i++) {
        copy[i] = 0;
    }
    for (let i=0; i < nodes.length; i++){
        nodes[i] = copy.slice(0);
    }
    let el_arr = $(".silent");
    console.log(el_arr);
    for (let item of el_arr) {
        let x = parseInt(item.id.split("-")[0]);
        let y = parseInt(item.id.split("-")[1]);
        //console.log("x->"+x + " y ->"+y);
        nodes[x][y] = 1
    }
    //console.log(nodes);
    //console.log("debuging->"+nodes[21][25] + " --" + nodes[35][82] );
    let graph = new Graph(nodes, { diagonal: true });
    let start = graph.grid[ parseInt(source.split("-")[0])  ][ parseInt(source.split("-")[1]) ];
    let end = graph.grid[ parseInt(destination.split("-")[0]) ][ parseInt(destination.split("-")[1]) ];

    let pathResult = astar.search(graph, start, end, { heuristic: astar.heuristics.diagonal });
    console.log("result->"+pathResult);
    for(let resultItem of pathResult){
        //console.log(resultItem);
        let itemId = resultItem.x + "-" + resultItem.y;
        //console.log(itemId);
        //console.log($( "#" +itemId ));
        $( "#" +itemId ).addClass( "searchResult" );
    }
}
