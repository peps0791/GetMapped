function createDiv(text){

    console.log("createDiv function called with parameters::"+text);

    //----------------------------------------------------------//
    //-------------------Outer component------------------------//
    //----------------------------------------------------------//

    //display map tiles on the dashboard
    let outerDiv = $(document.createElement('div'));
    outerDiv.addClass("col-xl-3 col-sm-6 mb-3");

    let outDiv = $(document.createElement('div'));
    outDiv.addClass("card text-white bg-primary o-hidden h-100");
    outerDiv.append(outDiv);

    let inDiv = $(document.createElement('div'));
    inDiv.addClass("card-body");
    outDiv.append(inDiv);

    let innerDiv = $(document.createElement('div'));
    innerDiv.addClass("mr-5");
    innerDiv.html('<h4>'+text + '</h4>');

    //-------------------------------------------------------------//
    //-------------------View Map component------------------------//
    //-------------------------------------------------------------//

    let linkV = $(document.createElement('a'));
    linkV.addClass("card-footer text-white clearfix small z-1");
    linkV.attr("href", "/get-map?mapname="+text);
    outDiv.append(linkV);

    let span1V = $(document.createElement('span'));
    span1V.addClass("float-left");
    span1V.html("View Floor Plan");
    linkV.append(span1V);

    let span2V = $(document.createElement('span'));
    span2V.addClass("float-right");
    linkV.append(span2V);

    let iElV = $(document.createElement('span'));
    iElV.addClass("fas fa-angle-right");
    span2V.append(iElV);

    //------------------------------------------------------------//
    //------------------Rename Map component----------------------//
    //------------------------------------------------------------//

    let currentTimeStamp = + new Date();
    console.log("current timestamp->"+currentTimeStamp);


    let linkR = $(document.createElement('a'));
    linkR.addClass("card-footer text-white clearfix small z-1");
    linkR.attr("id", "collapseLink"+currentTimeStamp.toString());
    linkR.attr("href", "#collapseEl"+currentTimeStamp.toString());
    linkR.attr("data-toggle", "collapse");
    linkR.attr("aria-expanded", "false");
    linkR.attr("aria-controls", "collapseEl"+currentTimeStamp.toString());
    outDiv.append(linkR);


    let span1R = $(document.createElement('span'));
    span1R.addClass("float-left");
    span1R.html("Rename Floor Plan");
    linkR.append(span1R);

    let span2R = $(document.createElement('span'));
    span2R.addClass("float-right");
    linkR.append(span2R);

    let iElR = $(document.createElement('span'));
    iElR.addClass("fas fa-angle-right");
    span2R.append(iElR);

    let collapseDiv = $(document.createElement('div'));
    collapseDiv.attr("id", "collapseEl"+currentTimeStamp.toString());
    collapseDiv.addClass("collapse");
    outDiv.append(collapseDiv);

    let inCollapseDiv = $(document.createElement('div'));
    inCollapseDiv.addClass("card card-body");
    collapseDiv.append(inCollapseDiv);

    let input = $(document.createElement('input'));
    input.attr("id","input-"+currentTimeStamp.toString());
    let btn = $(document.createElement('button'));
    btn.addClass("btn-md");
    btn.text("Rename");
    btn.css("color", "grey");
    btn.css("margin-top", "1%");
    btn.attr("id", "btn-"+currentTimeStamp.toString());
    inCollapseDiv.append(input);
    inCollapseDiv.append(btn);

    //----------------------------------------------------------------//
    //------------------Remove Map component--------------------------//
    //----------------------------------------------------------------//

    let linkRm = $(document.createElement('a'));
    linkRm.addClass("card-footer text-white clearfix small z-1");
    linkRm.attr("href", "#");
    linkRm.click(function(){
        console.log("clicked");

        console.log("name:::"+text);
        if(window.confirm("Are you sure you want to remove this map?")){
            $.post("/remove-map", {
                "mapname": text,
            }, function (data) {
                console.log("result from server:" + JSON.stringify(data));
                alert("Map successfully removed!\n Redirecting to the home page...");
                window.location.href = "/"
            });
        }
    });

    outDiv.append(linkRm);

    let span1Rm = $(document.createElement('span'));
    span1Rm.addClass("float-left");
    span1Rm.html("Remove Floor Plan");
    linkRm.append(span1Rm);

    let span2Rm = $(document.createElement('span'));
    span2Rm.addClass("float-right");
    linkRm.append(span2Rm);

    let iElRm = $(document.createElement('span'));
    iElRm.addClass("fas fa-angle-right");
    span2Rm.append(iElRm);

    inDiv.append(innerDiv);
    return outerDiv

}

function populateDashBoard(response) {

    console.log("populateDashBoard function called with parameters::"+JSON.stringify(response));
    if (response.maps && response.maps.length===0){
        console.log("No items on display...");
        $("#noitemdiv").attr("hidden", false);
    }
    for(let item of response.maps){
        let createdDiv = createDiv(item);
        $(".container-fluid .row").append(createdDiv);
    }
}

