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
        "empPhone": empPhone,
        "mapname":localStorage.getItem("mapname")
    }, function (data) {
        console.log("result from server:" + JSON.stringify(data));
        alert("Map updated successfully!! ");
        clearAllTextBoxes();
    });
});


function findSourceCoord(){
    let srcSeat = $("#startPt").val();
    let destSeat = $("#endPt").val();
    alert("button clicked..." + srcSeat + "::" + destSeat);
    //get source destination coordinates from DB
    //
    //markWay(source, destination)
}

function markWay(source, destination){

}


function clearAllTextBoxes(){
    $('#seatCoord').val("");
    $("#seatNo").val("");
    $("#empName").val("");
    $("#empPhone").val("");
}
