window.isMouseDown = false;
window.isEditMode = false;
window.isAssistanceEnabled = false;


$("input[name='optradio']").change(function(){
    // Do something interesting here
    if ($(this).val() === 'lanes') {
        console.log("lanes");
        $("#assistant").attr("hidden", false);
        $("#seat-assistant").attr("hidden", true);
    } else if ($(this).val() === 'seats') {
        console.log("seats");
        $("#assistant").attr("hidden", true);
        $("#seat-assistant").attr("hidden", false);

        $('#enableAsstCheckBox').prop('checked', false);
        console.log("Checkbox state (method 2) = " + $('#enableAsstCheckBox').is(':checked'));
        window.isEditMode = true;
        window.isAssistanceEnabled = false;
    }
});


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
        window.isEditMode = false;
        window.isAssistanceEnabled = true;
    }else{
        window.isEditMode = true;
        window.isAssistanceEnabled = false;
    }
});


// get selection
$('.editMode input[type=radio]').on('change', function() {
    console.log(this.value);
    let mOptions = $("#markOptions");
    if(this.value === "EditMode"){
        mOptions.attr("hidden", false);
        window.isEditMode = true;
        window.isAssistanceEnabled = false;
        $('#enableAsstCheckBox').prop('checked', false);

    }else if(this.value === "ViewMode"){
        mOptions.attr("hidden", true);
        $("#assistant").attr("hidden", true);
        $("#seat-assistant").attr("hidden", true);
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
        "empPhone": empPhone,
        "mapname":localStorage.getItem("mapname")
    }, function (data) {
        console.log("result from server:" + JSON.stringify(data));
        alert("Map updated successfully!! ");
        clearAllTextBoxes();
    });
});



function clearAllTextBoxes(){
    $('#seatCoord').val("");
    $("#seatNo").val("");
    $("#empName").val("");
    $("#empPhone").val("");
}
