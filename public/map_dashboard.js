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

    //-----------------------------------------------------------//

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


    //------------------------------------------------------------//

    var currentTimeStamp = + new Date()
    console.log("current timestamp->"+currentTimeStamp)


    var link = $(document.createElement('a'))
    link.addClass("card-footer text-white clearfix small z-1")
    link.id = "collapseLink"+currentTimeStamp.toString()
    link.attr("href", "#collapseEl"+currentTimeStamp.toString())
    link.attr("data-toggle", "collapse")
    link.attr("aria-expanded", "false")
    link.attr("aria-controls", "collapseEl"+currentTimeStamp.toString())

    outDiv.append(link)


    var span1 = $(document.createElement('span'))
    span1.addClass("float-left")
    span1.html("Rename Floor Plan")
    link.append(span1)

    var span2 = $(document.createElement('span'))
    span2.addClass("float-right")
    link.append(span2)

    var iEl = $(document.createElement('span'))
    iEl.addClass("fas fa-angle-right")
    span2.append(iEl)

    var collapseDiv = $(document.createElement('div'))
    collapseDiv.attr("id", "collapseEl"+currentTimeStamp.toString())
    collapseDiv.addClass("collapse")
    outDiv.append(collapseDiv)

    var inCollapseDiv = $(document.createElement('div'))
    inCollapseDiv.addClass("card card-body")
    collapseDiv.append(inCollapseDiv)

    var input = $(document.createElement('input'))
    input.attr("id","input-"+currentTimeStamp.toString());
    var btn = $(document.createElement('button'))
    btn.addClass("btn-md")
    btn.text("Rename")
    btn.css("color", "grey")
    btn.css("margin-top", "1%")
    btn.attr("id", "btn-"+currentTimeStamp.toString());
    inCollapseDiv.append(input)
    inCollapseDiv.append(btn)

    //----------------------------------------------------------------//

    var link = $(document.createElement('a'))
    link.addClass("card-footer text-white clearfix small z-1")
    link.attr("href", "#")

    outDiv.append(link)

    var span1 = $(document.createElement('span'))
    span1.addClass("float-left")
    span1.html("Remove Floor Plan")
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

function populateDashBoard(response) {
    console.log("populate response method called")
    console.log(response.maps)

    if (response.maps && response.maps.length===0){
        console.log("No items on display...")
        $("#noitemdiv").attr("hidden", false)
    }
    for(var item of response.maps){
        var createdDiv = createDiv(item)
        $(".container-fluid .row").append(createdDiv)
    }
}

