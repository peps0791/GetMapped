//function to show dialog   
var showDialog = function() {
	//if the contents have been hidden with css, you need this
	$myWindow.show(); 
	//open the dialog

	/**************Source Seat Validation Code***************/
	var idOfButtonClicked = document.getElementById(buttonClicked).id;
	customAlert('N','idOfButtonClicked-> '+idOfButtonClicked);
	var rowNum = idOfButtonClicked.substr(idOfButtonClicked.length - 1);
	customAlert('N','rowNum = '+rowNum);
	var finalRowNum = parseInt(rowNum) +1;
	var destinationSeat = document.getElementById('searchTable').rows[finalRowNum].cells[3].innerHTML;
	customAlert('N','destination seat = '+destinationSeat);
	var sourceSeat = document.getElementById('sourceseat').value;
	customAlert('N','sourceSeat = '+sourceSeat);
	
	if(sourceSeat==null || sourceSeat=='' || sourceSeat==' '){
		customAlert('Y','We know where you want to go. But we dont know where you are. Mind filling in the source seat? That little text box in the bottom left corner of your screen?');
		return 'EmptySource';
	}
	
	if(sourceSeat == destinationSeat){
		customAlert('Y','So you want to stalk..... you? You? Really? Or maybe you didnt check the source seat and destination seat carefully!');
		return 'EmptySource';
	}
		
	/***************End Of Source Seat Validation***************/
	
	/*Find maps for the source seat and destination seat*/
	var selectedImageforSeats = doPostAjax('SeatToCoordinatesMapping.jsp', 'FindMap');	
	customAlert('N','selectedImageforSeats = '+selectedImageforSeats);
	/*If , the maps for the two seats are same, one map navigation*/
	if(selectedImageforSeats.split('-')[0] == 1){
			window.imagetobesearched = selectedImageforSeats.split('-')[1].split('~')[0];
			customAlert('N','imagetobesearched = '+window.imagetobesearched);
	}
	/*else, navigation from entry to destination seat on destination seat map*/
	
	
	$myWindow.dialog("open");
	$("#dialogImage").attr("src",window.imagetobesearched);
	//$("#dialogImage").attr("src","IMG_2109.JPG");
	$(function() {
		createGrid('dialogImage',10,'forClient');
	});
};

//function to close dialog, probably called by a button in the dialog
var closeDialog = function() {
	$myWindow.dialog("close");
};

function doPostAjax(url, operation)
{
    customAlert('N','Inside doPostAjax()');
	customAlert('N','url:' +url +' and operation:' +operation);
    var retval = "-1";
	var sParam = '-1';
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);
	
	/* Pre AJAX Call Processing */
	if(operation!='FileUpload'){
		/*For file upload, content type is not set to this.*/
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}
	
	if(operation=='FileUpload'){
	
		/*If the image desc text box is empty, then return from the function*/
		if(!validateText('imageDesc')){
			return;
		}
		
		/*Save the uploaded image description in memory*/
		window.uploadedimageDesc = document.getElementById('imageDesc').value.trim();
		customAlert('N','uploaded image description::' +window.uploadedimageDesc);
		
		var file = document.getElementById("uploadfile");
		/* Create a FormData instance */
		var formData = new FormData();
		/* Add the file */
		formData.append("upload", file.files[0]);
		sParam = formData;
	}
	
	else if(operation == 'FetchFiles'){
		sParam = 'arrayString=FetchFiles&imageName=None';
		customAlert('N','operation is FetchFiles and sParam is' +sParam);
	}
	
	else if(operation=='SaveMap'){
	
		var divSize = 10;
		createMatrix("mapimage", divSize);
		var imageElement=document.getElementById("mapimage");
		var ratioW = Math.floor(imageElement.clientWidth/divSize);   
		customAlert('N','ratioW::' +ratioW);
		var ratioH = Math.floor(imageElement.clientHeight/divSize);
		customAlert('N','ratioH::' +ratioH);
	
		//Convert Matrix to String
		var arrString = '';
		for (var i = 0; i < ratioH; i++ ) {         //to be changed to ratioH
			//console.log('i is :' +i);
			for(var p = 0; p < ratioW; p++){		//to be changed to ratioW
				//console.log('p is: ' +p);
				if(arrString==''){
					arrString = x[i][p];
				}else if(p==0){
					arrString = arrString + x[i][p];
				}else{
					arrString = arrString + '|' +x[i][p];
				}
				//console.log('0');
			}
			arrString = arrString + '~'
		}
		//customAlert('N','arrString = '+arrString);
		var key = 'arrayString=';
		sParam = key + arrString + '&imageName=' +window.uploadedimageName + '&imageDesc=' +window.uploadedimageDesc;
		customAlert('N','sParam = '+sParam);
	}
	
	
	else if(operation == 'SaveSeatCoordinates'){
		sParam = 'seatCoordinatesMapping=' +window.seatCoordiatesMap + '&imageDesc=' +window.uploadedimageDesc;
		customAlert('N','operation is SaveSeatCoordinates and sParam is' +sParam);
	}
	
	else if(operation == 'DeleteCoordinates'){
		var coordinates = window.deleteCoordinates;
		sParam = 'seatCoordinatesMapping=Delete-' +coordinates + '&imageDesc=' +window.uploadedimageDesc;
		customAlert('N','operation is DeleteCoordinates and sParam is' +sParam);
	}
	
	else if(operation == 'GetMap'){
	
		var fileNameSelected = window.imagetobesearched;
		//var fileNameSelected = 'IMG_2109.JPG';
		//var fileNameSelected = document.getElementById('selectedFileName').value;
		customAlert('N','File name to be fetched from DB::' +fileNameSelected);
		sParam = 'arrayString=Fetch&imageName='+fileNameSelected;
		customAlert('N','operation is GetMap and sParam is' +sParam);

	}
	
	else if(operation == 'GetAdminMap'){
	
		var fileNameSelected = document.getElementById('selectedFileName').value;
		customAlert('N','File name to be fetched from DB::' +fileNameSelected);
		sParam = 'arrayString=Fetch&imageName='+fileNameSelected;
		customAlert('N','operation is GetAdminMap and sParam is' +sParam);
	}
	
	else if(operation == 'GetSeatInfo'){	
		var element = document.getElementById('popCoordinates').value;
		sParam = 'coordinates='+ element + '&imageDesc=' +window.uploadedimageDesc;
		customAlert('N','operation is GetSeatInfo and sParam is ' +sParam);
	}
	
	else if(operation =='ClientPathFinding'){
		var key = 'arrayString=';
		var seatCoordinateString = doPostAjax('SeatToCoordinatesMapping.jsp','GetSeatCoordinates');
		if(seatCoordinateString=='empty string'){
			return;
		}
		customAlert('N','seatCoordinateString='+seatCoordinateString);
		if(seatCoordinateString.substr(seatCoordinateString.length - 1)=='~'){
			seatCoordinateString =seatCoordinateString.substr(0, seatCoordinateString.length - 1);
		}
		var CoordinatesArray = seatCoordinateString.split('~');
		var sourceArray = CoordinatesArray[0].split('=');
		var sourceCoordinates = sourceArray[1];
		var destArray = CoordinatesArray[1].split('=');
		var destCoordinates = destArray[1];
		sParam = key+mapMatrix+'&sourceCoordinates='+sourceCoordinates+'&destinationCoordinates='+destCoordinates;
		customAlert('N','sParam in ClientPathFinding:' +sParam);
	}
	
	else if(operation == 'GetSeatCoordinates'){
		var idOfButtonClicked = document.getElementById(buttonClicked).id;
		customAlert('N','idOfButtonClicked-> '+idOfButtonClicked);
		var rowNum = idOfButtonClicked.substr(idOfButtonClicked.length - 1);
		customAlert('N','rowNum = '+rowNum);
		var finalRowNum = parseInt(rowNum) +1;
		var destinationSeat = document.getElementById('searchTable').rows[finalRowNum].cells[3].innerHTML;
		customAlert('N','destination seat = '+destinationSeat);
		var sourceSeat = document.getElementById('sourceseat').value;
		customAlert('N','sourceSeat = '+sourceSeat);

		/**************Source Seat Validation Code***************/
		if(sourceSeat==null || sourceSeat=='' || sourceSeat==' '){
			customAlert('Y','We know where you want to go. We dont know where you are. Mind filling in the source seat?');
			return 'empty string';
		}
		
		/***************End Of Source Seat Validation***************/
		sParam = 'sourceSeat='+sourceSeat+'&destinationSeat='+destinationSeat;
		customAlert('N','sParam = '+sParam);
	}
	
	else if(operation == 'FindMap'){
		var sourceSeat = document.getElementById('sourceseat').value;
		customAlert('N','source Seat = '+sourceSeat);
		var idOfButtonClicked = document.getElementById(buttonClicked).id;
		customAlert('N','idOfButtonClicked-> '+idOfButtonClicked);
		var rowNum = idOfButtonClicked.substr(idOfButtonClicked.length - 1);
		customAlert('N','rowNum = '+rowNum);
		var finalRowNum = parseInt(rowNum) +1;
		var destinationSeat = document.getElementById('searchTable').rows[finalRowNum].cells[3].innerHTML;
		customAlert('N','destination seat = '+destinationSeat);
		sParam = 'sourceSeat=' +sourceSeat + '&destinationSeat=' +destinationSeat + '&operation=FindMap';
		customAlert('N','sParam = '+sParam);
	}
	else if(operation == 'SearchResult'){
		var employeeName = document.getElementById('name').value;
		customAlert('N','employeeName = ' +employeeName);
		var employeeTeam = document.getElementById('team').value;
		customAlert('N','employeeTeam = ' +employeeTeam);
		var employeeExtension = document.getElementById('extension').value;
		customAlert('N','employeeExtension = ' +employeeExtension);
		sParam = 'name=' +employeeName +'&team=' + employeeTeam + '&extension=' +employeeExtension;
		customAlert('N','sParam = '+sParam);
	}
	
    req.send(sParam);
    function processRequest()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200)
                parseMessages();
            else
                retval = '-1';
        }
    }
    function parseMessages()
    {
        retval = trim(req.responseText);
    }
	customAlert('N','return value:' +retval);
	
	
	/*Post AJAX Call Processing */
	if(operation == 'SaveMap'){
	
		//Check if any coordinates have been stored for deletion 
		if(window.deleteCoordinates){
				doPostAjax('SeatCoordinatesSave.jsp','DeleteCoordinates');
		}
		/*Retrieve the result of call, if call not successful, throw a prompt*/
		
		/*Clear the seat coordinates once deleted from DB*/
		/*What if not successful??*/
		window.deleteCoordinates = null;
	
	
		//Check if any coordinates have been stored for saving in DB
		//Save the seat, Coordinates in DB
		if(window.seatCoordiatesMap){
			doPostAjax('SeatCoordinatesSave.jsp','SaveSeatCoordinates');
		}
		/*Retrieve the result of call, if call not successful, throw a prompt*/
		
		/*Clear the seat coordinates once saved in DB*/
		/*What if not successful??*/
		window.seatCoordiatesMap = null;
		
	}
	
	if(operation=='FileUpload'){
		processReturnStatus(retval);
		document.getElementById("filePath").innerHTML = retval;
		var thelastindex = retval.lastIndexOf("\\");
		document.getElementById("mapimage").src = retval;
	}
	else if(operation == 'GetSeatInfo'){
	
		window.cachedSeatMapping = retval;
		customAlert('N','cachedSeatMapping' + window.cachedSeatMapping);
		document.getElementById('popSeat').value = window.cachedSeatMapping;
	}
	
	else if(operation == 'ClientPathFinding'){
	
		//var sourceId = getIDfromCoordinates(sourceCoordinates);
		var sourceId = sourceCoordinates;
		customAlert('N','source Id:' +sourceId);
		//var destId = getIDfromCoordinates(destCoordinates);
		var destId = destCoordinates;
		customAlert('N','dest Id:' +destId);
		customAlert('N','retval:' +retval);
		if(retval.length==0 || retval=='' || retval==' ' || retval.indexOf("~")=='-1'){
			//No path available...
			customAlert('Y','Something funny just happened! The path you requested couldnt be found. If I were you, I would tell the joke to the Admin. Lets see if he finds it funny!');
			return;
		}
		var retvalArray = retval.split('~');
		for(var i = 0;i < retvalArray.length;i++){
			var idObtained = retvalArray[i];
			customAlert('N','id obtained:' +idObtained);
			var element = document.getElementById(idObtained);
			if(idObtained == sourceId){
				element.style.backgroundColor = "red";
			}else if(idObtained == destId){
				element.style.backgroundColor = "green";
			}else{
				element.style.backgroundColor = "yellow";
			}
		}
	}
	
	else if(operation=='GetMap'){
		window.mapMatrix = retval;
		doPostAjax('PathFinder.jsp','ClientPathFinding');
	}
	
	else if(operation=='GetAdminMap'){
		customAlert('N','Inside GetAdminMap operation...');
		window.mapMatrix = retval;
		var localMatrix = mapMatrix;
		var outerArray = localMatrix.split('~');
		for(var i=0;i<outerArray.length;i++){
			var innerArray = outerArray[i].split('|');
			for(var p=0;p< innerArray.length;p++){
				var id  = i.toString() + ','+ p.toString();
				//customAlert('N','id:' +id);
				var recreatedElement = document.getElementById(id);
				if(innerArray[p]=='0'){
					customAlert('N','innerArray['+p+']:' +innerArray[p]);
					recreatedElement.style.backgroundColor = 'Red';
				}
				
			}
		}
		
		customAlert('N','End of GetAdmin Map...');
	}
	
	else if(operation=='SearchResult'){
		/*Clears the div if already created*/
		$('#searchTable').remove();
		
		if(retval.substr(retval.length - 1)=='~'){
			retval =retval.substr(0, retval.length - 1);
		}
		var a, b, tableElem, rowElem, colElem;
		tableElem = document.createElement('table');
		tableElem.id = 'searchTable';
		
		/*Add Headings to the Table */
		rowElem = document.createElement('tr');
		colElem = document.createElement('td');
		colElem.innerHTML = 'Name';
        rowElem.appendChild(colElem);
		tableElem.appendChild(rowElem);
		colElem = document.createElement('td');
		colElem.innerHTML = 'Team';
        rowElem.appendChild(colElem);
		tableElem.appendChild(rowElem);
		colElem = document.createElement('td');
		colElem.innerHTML = 'Extension';
        rowElem.appendChild(colElem);
		tableElem.appendChild(rowElem);
		colElem = document.createElement('td');
		colElem.innerHTML = 'Seat Number';
        rowElem.appendChild(colElem);
		tableElem.appendChild(rowElem);
		colElem = document.createElement('td');
		colElem.innerHTML = '';
        rowElem.appendChild(colElem);
		tableElem.appendChild(rowElem);
		
		/* Headings Added to the Table */
		
		var retvalArray = retval.split('~');
		customAlert('N','retval 0:' +retvalArray[0]);
		customAlert('N','retval 1:' +retvalArray[1]);
		for(var i=0; i < retvalArray.length; i++){
			var innerArray = retvalArray[i].split('^');
			rowElem = document.createElement('tr');
			rowElem.id = 'row' + i;
			for(var j=0;j<innerArray.length; j++){
				colElem = document.createElement('td');
				colElem.innerHTML = innerArray[j];
                rowElem.appendChild(colElem);
			}
			
			/* Add button to the Row */
			colElem=document.createElement("BUTTON");
			colElem.id = 'button'+i;
			colElem.setAttribute("class", "buttonclass");
			colElem.onclick = function() {
				window.buttonClicked = this.id;
				var status =  showDialog();
				if(status!='EmptySource'){
					doPostAjax('MaptoDBOperations.jsp','GetMap');
					return false;
				}
			};
			colElem.innerHTML= "stalk";
			rowElem.appendChild(colElem);
			tableElem.appendChild(rowElem);
			
		}
		$('#searchResult').append(tableElem);
	}
	customAlert('N',retval);
    return retval;
}

function getACTObj()
{
    if(window.XMLHttpRequest)
        return new XMLHttpRequest;

    var a =
["Microsoft.XMLHTTP","MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"];
    for(var c=0;c<a.length;c++)
    {
        try
        {
            return new ActiveXObject(a[c])
        }
        catch(b)
        {
            alert('Exception - ' + b);
        }
    }
    return null;
}

function processReturnStatus(retval)
{
	var index = retval.indexOf("No file uploaded");
    if(retval.indexOf("No file uploaded.")==-1){
        alert("File uploaded");
        $('#myModal').modal('hide');
		
		/*Store the image name in Memory.*/
		window.uploadedimageName = retval;
		customAlert('N','uploaded file name:' +window.uploadedimageName);
    }else{
        alert("Some Error uploading the file.");
    }
}


function trim(str)
{
    return str.replace(/^\s+|\s+$/g, '');
}


/***********************************************************************************/
/*function Name: clickDiv                            				               */
/*function param: clicked div                                                      */
/*function returns:                                                 			   */
/*function Role: performs some operation on click of grid div                      */
/***********************************************************************************/

function clickDiv(field)
{
	/*****************Create Popover in this method**********************/
	showPopOver('pop1', 'GetSeatInfo',field.id);
	/********************************************************************/
	
	customAlert('N','field details:' +field.id);
}

/***********************************************************************************/
/*function Name: createGrid                            				               */
/*function param: image Id, div Size, optionalOperationSpecifier                   */
/*function returns:                                                 			   */
/*function Role: Creates a grid on the specified image according to given div size */
/* and performs operations according to operation specified.                       */
/***********************************************************************************/

function createGrid(imageId, divSize, optionalOperationSpecifier){

	customAlert('N','Inside create grid function...');
	var imageElement=document.getElementById(imageId);
	var ratioW = Math.floor(imageElement.clientWidth/divSize);
	customAlert('N','ratioW::' +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/divSize);
	customAlert('N','ratioH::' +ratioH);
	
	if(optionalOperationSpecifier == 'forAdmin'){
	
		var parent = $('<div />', {
		class: 'grid', 
		width: imageElement.clientWidth, 
		height: imageElement.clientHeight,
		top:0,
		left:0,
		}).addClass('grid').appendTo('#myMap');


		for (var i = 0; i < ratioH; i++) {
			for(var p = 0; p < ratioW; p++){
				//customAlert('Y','value of i is:' +i +' and p is:' +p);
				$('<div />', {
					id:i.toString() + ',' + p.toString(),
					onclick:'clickDiv(this)',
					width: divSize, 
					height: divSize 
				}).appendTo(parent);
			}
		} 
	
	}else if(optionalOperationSpecifier == 'forClient'){
	
		$('#myMatrix').remove();
		var parent = $('<div />', {
		id: 'myMatrix',
		class: 'grid', 
		width: imageElement.clientWidth, 
		height: imageElement.clientHeight,
		top:0,
		left:0,
		}).addClass('grid').appendTo('#example');

		for (var i = 0; i < ratioH; i++) {
			for(var p = 0; p < ratioW ; p++){
				$('<div />', {
					id:i.toString() + ',' + p.toString(),
					width: divSize, 
					height: divSize 
				}).appendTo(parent);
			}
		}
	}
}


/***********************************************************************************/
/*function Name: createMatrix                            				           */
/*function param: image Id, div Size											   */
/*function returns:                                                 			   */
/*function Role: Create a matrix for the specified image                           */
/*according to given div size              										   */
/***********************************************************************************/

function createMatrix(imageId, divSize){
	customAlert('N','Inside function createMatrix...');
	//var imageElement=document.getElementById("mapimage");
	var imageElement=document.getElementById(imageId);
	var ratioW = Math.floor(imageElement.clientWidth/divSize);
	customAlert('N','ratioW::' +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/divSize);
	customAlert('N','ratioH::' +ratioH);
	
	//Create a matrix with dimensions equal to width and height of image
	window.x = new Array(ratioH);
	for (var j = 0; j < ratioH; j++) {
		x[j] = new Array(ratioW);
		for(var t = 0; t < ratioW; t++){
			x[j][t] = '1';          //1 means Obstacle
		}
	}
	
	//Id div id is red, change the array content from 0 to 1
	for (var i = 0; i < ratioH; i++ ) {
		for(var p = 0; p < ratioW; p++){
			var calculatedId = i.toString() + ',' + p.toString();	    //TODO::put this in a separate function to be made generic		
			var someElement = document.getElementById(calculatedId);			
			if(someElement.style.backgroundColor=='Red' || someElement.style.backgroundColor=='red'){
				x[i][p] = '0';          //0 means Open
			}
		}
	}	
}

function customAlert(alertFlag, input){
	if(alertFlag=='Y'){
		alert(input);
	}
	console.log(input);
}


function uploadImage(){
	customAlert('N','Inside upload Image');
	document.getElementById("mapimage").src = 'IMG_2109.JPG';
	
}

/***********************************************************************************/
/*function Name: editExistingMap                            				       */
/*function param: 											                       */
/*function returns:                                                 			   */
/*function Role: Loads the image from server and creates a grid on it              */
/***********************************************************************************/

function editExistingMap(){
	customAlert('N','edit existing map function called...');
	customAlert('N','windowuploadedImageName' + window.uploadedimageName);
	$("#mapimage").load(function() {
		//alert($(this).height());
		createGrid('mapimage', 10, 'forAdmin');
		doPostAjax('MaptoDBOperations.jsp','GetAdminMap');
	}).attr('src', window.uploadedimageName);
}

function loaded(imgloaded)
{
	//imgloaded.previousElementSibling.style.display="none";
}

/***********************************************************************************/
/*function Name: showPopOver                            				           */
/*function param: popover div id, operation, optionalParameter                     */
/*function returns:                                                 			   */
/*function Role: Displays popover and performs operations to be performed          */
/*on display of the popover, on the basis of input operation given.  		       */
/***********************************************************************************/

function showPopOver(divID, operation, optionalParam) {
	
	/*Get the coordinates of the mouse click to open popver*/
	var clickCoordinates = showCoords(event);	
	customAlert('N','click coordinates::' +clickCoordinates);
	
	/* Open popover at the specified co-ordinates*/
	document.getElementById(divID).style.left = clickCoordinates.split(",")[0]+"px";
	document.getElementById(divID).style.top = clickCoordinates.split(",")[1]+"px";

	// Show the div
	document.getElementById(divID).style.display = "block";
	
	if(operation == 'GetUploadedFiles'){
	
		/*Ajax Call For Fetching The List Of Files Uploaded On DB*/
		var mapIdNameString = doPostAjax('MaptoDBOperations.jsp', 'FetchFiles');
		customAlert('N','mapIdNameString::' +mapIdNameString);
		var fileIdNameArray = mapIdNameString.split('~');
		var mydiv = document.getElementById("listOfFiles");
		
		var param1 = 'Y';
		var param2 = 'some text';
		for(var i = 0; i < fileIdNameArray.length; i++){
			var fileIdNameMapping = fileIdNameArray[i];
			var aTag = document.createElement('a');
			aTag.innerHTML = fileIdNameMapping;
			aTag.onclick = function() {
				document.getElementById('selectedFileName').value = this.innerHTML.split("-")[1];
				window.uploadedimageName = this.innerHTML.split("-")[1];
				window.uploadedimageDesc = this.innerHTML.split("-")[0];
				editExistingMap();
				closePopOver('pop2','ClearUploadedFilePopover');
			};
			mydiv.appendChild(aTag);
		}
	}else if(operation == 'GetSeatInfo'){
		//Clear the Seat text Box value
		document.getElementById('popSeat').value = '';
		document.getElementById('popCombo').value = 'Seat';
		document.getElementById('submitseat').style.visibility = 'visible';
		document.getElementById('popContent').style.visibility = 'visible';
		
		/**************Check for marked fields******************************************/	
		/*Optional parameter is the coordinates of the div clicked */
		var element = document.getElementById(optionalParam);
		document.getElementById("popCoordinates").value = optionalParam;
		if(element.style.backgroundColor=="red" || element.style.backgroundColor=="Red"){
			//field is already marked
			//populate seat number
			//check local memory. If present, retrieve from there, else database call.
			doPostAjax('GetSeatInfo.jsp','GetSeatInfo');
			
			/*div is already marked, hide the the submit link*/
			document.getElementById('submitseat').style.visibility = 'hidden';
		}
		/********************************************************************************/
		/* Set the coordinates retrieved at mouse click in the "popCoordinates" text box*/
		document.getElementById("popCoordinates").value = optionalParam;
		
		/*TODO: If Alley, then change the combo value to Alley*/
		if(document.getElementById('popSeat').value == 'null'){
			//Its an alley, change the combo box value to Alley
			document.getElementById('popCombo').value = 'Alley';
			//Hide the popContent div
			document.getElementById('popContent').style.visibility = 'hidden';
		}
	}
}


/***********************************************************************************/
/*function Name: closePopOver                            				           */
/*function param: popover div id, operation                                        */
/*function returns:                                                 			   */
/*function Role: Performs operations to be performed on the click of close button  */
/*of the popover, on the basis of input operation given.  		                   */
/***********************************************************************************/

function closePopOver(divID, operation) {
	
	if(operation == 'Undo'){
		var coordinates =  document.getElementById('popCoordinates').value;
		customAlert('N','undo button called for coordinates: ' +coordinates);
		var div = document.getElementById(coordinates);
		if(div.style.backgroundColor == 'red' || div.style.backgroundColor == 'Red'){
			customAlert('N','coordinates color is red.... delete call to be made');
		}
		
		if(!window.deleteCoordinates){
			/*delete coordinates are currently null*/
			window.deleteCoordinates = coordinates;
		}else{		
			var existingCoordinates = window.deleteCoordinates;
			window.deleteCoordinates = existingCoordinates + "~" + coordinates;	
			
		}
		customAlert('N','delete coordinates: ' +window.deleteCoordinates);
		div.style.backgroundColor = "transparent"
		
	}else if(operation == 'Submit'){
		//Create seat-coordinate mapping 
		var isSuccess = createSeatCoordinateStringForSave();
		if(isSuccess){
			// Colour the field
			var coordinates = document.getElementById("popCoordinates").value;
			customAlert('N','coordinates->' +coordinates);
			var field = document.getElementById(coordinates);
			field.style.backgroundColor="red";
		}else{
			customAlert('N','createSeatCoordinateStringForSave returned with false value');
			return;
		}
	}else if(operation == 'ClearUploadedFilePopover'){
		document.getElementById("listOfFiles").innerHTML = '';
	}
	// Hide the Div
	customAlert('N','Closing div :' +divID);
	document.getElementById(divID).style.display = "none";
}


/***********************************************************************************/
/*function Name: toggleDivVisibility                            				   */
/*function param: div ID                                                  		   */
/*function returns:                                                 			   */
/*function Role: Toggles the visibility of the div   		                       */
/***********************************************************************************/
function toggleDivVisibility(divId) {
	
	if(divId == 'popContent'){
		 var x = document.getElementById("popCombo").value;
		 customAlert('N',x);
		 /*If x is 'Seat', keep the popContent div visible, else hide it in case of 'Alley'*/
		 if(x == 'Seat'){
			document.getElementById(divId).style.visibility = "visible";
		 }else if( x == 'Alley'){
			document.getElementById(divId).style.visibility = "hidden";
		 }
	}else if(divId == 'imagedes'){
		document.getElementById(divId).style.visibility = "visible";
	}
	 
}

/***********************************************************************************/
/*function Name: createSeatCoordinateStringForSave                            		*/
/*function param:                                                   			   */
/*function returns: true if the operation success, else false                       */
/*function Role: Creates a ~ separated string of seat numbers and seat coordinates  */
/*separated by -, to be saved in DB on click of save button							*/
/***********************************************************************************/

function createSeatCoordinateStringForSave(){
	var seatNo = document.getElementById("popSeat").value;
	customAlert('N','seat->' +seatNo);
	var coordinates = document.getElementById("popCoordinates").value;
	customAlert('N','coordinates->' +coordinates);
	
	/*If option is chosen to be alley instead of seat, coordinates will not be saved*/
	var divValue =  document.getElementById("popCombo").value;
	if(divValue == 'Seat'){
		
		/*If seat is chosen and seat number is kept blank, throw alert and return with false*/
		if(seatNo == '' || seatNo == ' ' || seatNo.trim().length == 0 || seatNo == 'null'){
				customAlert('Y','The Seat Number! Fill the Seat Number!');
				return false;
		}
		
		if(!window.seatCoordiatesMap){
		window.seatCoordiatesMap = seatNo+'-'+coordinates;
		}else{
			var existingSeatCoordinates = window.seatCoordiatesMap;
			window.seatCoordiatesMap = existingSeatCoordinates + '~' + seatNo + '-' + coordinates;
			customAlert('N','seat coordinates map->' + seatCoordiatesMap);
		}
	}else{
		//Pop Combo Value not equal to seat, string will not be made for this.
	}
	return true;
	
}

/********************************************************************/
/*function Name: showCoords                                         */
/*function param: event                                             */
/*function returns: comma separated string of x and y coordinates   */
/*function Role: Get the Coordinates of the mouse click             */
/********************************************************************/
function showCoords(event) {
	/*x co-ordinates of the mouse click*/
    var x = event.clientX;
	/*y coordinates of the mouse click*/
    var y = event.clientY;
    return x + "," + y;
}

function validateText(textBoxDivId){
	customAlert('N','Value in the ' + textBoxDivId + ' is :' + document.getElementById(textBoxDivId).value.trim());
	if(document.getElementById(textBoxDivId).value.trim() == ''){
		customAlert('Y','You must enter the image name before submitting request.');
		return false;
	}
	return true;
}
