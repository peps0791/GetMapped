function createDiv(text){

    console.log("createDiv function called with parameters::"+text);

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

    let link = $(document.createElement('a'));
    link.addClass("card-footer text-white clearfix small z-1");
    link.attr("href", "/get-map?mapname="+text);

    outDiv.append(link);

    let span1 = $(document.createElement('span'));
    span1.addClass("float-left");
    span1.html("View Floor Plan");
    link.append(span1);

    let span2 = $(document.createElement('span'));
    span2.addClass("float-right");
    link.append(span2);

    let iEl = $(document.createElement('span'));
    iEl.addClass("fas fa-angle-right");
    span2.append(iEl);

    inDiv.append(innerDiv);

    //console.log(outerDiv);
    return outerDiv

}

function createRow(empItem){

    console.log("createRow function called with parameters::"+empItem);
    let row = $(document.createElement('tr'));

    let col1 = $(document.createElement('td'));
    col1.html(empItem.empName);
    row.append(col1);

    let col2 = $(document.createElement('td'));
    col2.html("Employee");
    row.append(col2);

    let col3 = $(document.createElement('td'));
    col3.html(empItem.empTeam || "development");
    row.append(col3);

    let col4 = $(document.createElement('td'));
    col4.html(empItem.mapName);
    row.append(col4);

    let col5 = $(document.createElement('td'));
    col5.html(empItem.empPhone);
    row.append(col5);

    let col6 = $(document.createElement('td'));
    col6.html(empItem.seatNo);
    row.append(col6);

    return row
}


function populateDashBoard(response) {
    console.log("populate response method called with parameters::"+JSON.stringify(response));

    for(let item of response.maps){
        let createdDiv = createDiv(item);
        $(".container-fluid .row").append(createdDiv)
    }

    console.log(JSON.stringify(response.emp));
    for(let item of response.emp){
        let createdRow = createRow(item);
        $("tbody").append(createdRow)
    }
}