$('#uploadform').submit(function(event) {

    event.preventDefault(); //this will prevent the default submit
    localStorage.setItem("mapname", $("#mapName").val());
    $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
});

function populateAlert(response){
    if(response && response.errCode === "DUPLICATE_ITEM_ERROR"){
        alert("A map with the same name already present in the database. \nPlease enter some other name.");
    }
}