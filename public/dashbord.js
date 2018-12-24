function createDiv(text){

    //display map tiles on the dashboard
    var outerDiv = $(document.createElement('div'))
    outerDiv.addClass("col-xl-3 col-sm-6 mb-3")

    var outDiv = $(document.createElement('div'))
    outDiv.addClass("card text-white bg-primary o-hidden h-100")

    outerDiv.append(outDiv)

    var inDiv = $(document.createElement('div'))
    inDiv.addClass("card-body")

    outDiv.append(inDiv)

    var innerDiv = $(document.createElement('div'))
    innerDiv.addClass("mr-5")
    innerDiv.html('<h4>'+text + '</h4>')

    var link = $(document.createElement('a'))
    link.addClass("card-footer text-white clearfix small z-1")
    link.attr("href", "/get-map?mapname="+text)

    outDiv.append(link)

    var span1 = $(document.createElement('span'))
    span1.addClass("float-left")
    span1.html("View Floor Plan")
    link.append(span1)

    var span2 = $(document.createElement('span'))
    span2.addClass("float-right")
    link.append(span2)

    var iEl = $(document.createElement('span'))
    iEl.addClass("fas fa-angle-right")
    span2.append(iEl)

    inDiv.append(innerDiv)

    console.log(outerDiv)
    return outerDiv

}

function createRow(empItem){

    console.log(empItem)
    console.log(empItem.empName)
    var row = $(document.createElement('tr'))

    var col1 = $(document.createElement('td'))
    col1.html(empItem.empName)
    row.append(col1)

    var col2 = $(document.createElement('td'))
    col2.html("Employee")
    row.append(col2)

    var col3 = $(document.createElement('td'))
    col3.html("US")
    row.append(col3)

    var col4 = $(document.createElement('td'))
    col4.html("25")
    row.append(col4)

    var col5 = $(document.createElement('td'))
    col5.html(empItem.empPhone)
    row.append(col5)

    var col6 = $(document.createElement('td'))
    col6.html(empItem.seatNo)
    row.append(col6)

    return row
}

