function doPostAjax()
{
    customAlert('N','Inside doPOstAJAX()');
    var url= "FileUpload.jsp";
    var file = document.getElementById("uploadfile");
    // Create a FormData instance
    var formData = new FormData();
    // Add the file
    formData.append("upload", file.files[0]);
    var retval = "-1";
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);

//req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send(formData);
    //alert(req.status);
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
    processReturnStatus(retval);
	customAlert('N','retval is :' +retval);
	document.getElementById("filePath").innerHTML = retval;
	var thelastindex = retval.lastIndexOf("\\");
	document.getElementById("mapimage").src = retval;
    alert(retval);
    return retval;
}

function doPostAjax1()
{
    customAlert('Y','Inside doPOstAJAX1()');
	
	var imageElement=document.getElementById("mapimage");
	var ratioW = Math.floor(imageElement.clientWidth/10);
	customAlert('N','ratioW::' +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/10);
	customAlert('N','ratioH::' +ratioH);
	
	//Convert Matrix to String
	var arrString = '';
	for (var i = 0; i < 10; i++ ) {
		//console.log('i is :' +i);
		for(var p = 0; p < 10; p++){
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
	customAlert('N','arrString = '+arrString);
	
    var url= "PathFinder.jsp";
    var retval = "-1";
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);

	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send('arrayString='+ arrString);
    //alert(req.status);
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
	var retvalArray = retval.split('~');
	for(var i=0;i< retvalArray.length;i++){
		var idObtained = retvalArray[i];
		customAlert('N','id obtained:' +idObtained);
		var element = document.getElementById(idObtained);
		element.style.backgroundColor="yellow";
	}
    alert(retval);
    return retval;
}

function doPostAjax2()
{
    customAlert('Y','Inside doPOstAJAX2()');
	
	createMatrix();
	var imageElement=document.getElementById("mapimage");
	var ratioW = Math.floor(imageElement.clientWidth/10);
	customAlert('N','ratioW::' +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/10);
	customAlert('N','ratioH::' +ratioH);
	
	//Convert Matrix to String
	var arrString = '';
	for (var i = 0; i < 10; i++ ) {
		//console.log('i is :' +i);
		for(var p = 0; p < 10; p++){
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
	customAlert('N','arrString = '+arrString);
	
    var url= "SaveMap.jsp";
    var retval = "-1";
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);

	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send('arrayString='+ arrString);
    //alert(req.status);
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
    alert(retval);
    return retval;
}

function doPostAjax4()
{
    customAlert('N','Inside doPOstAJAX4()');
    var url= "PathFinder.jsp";
    var retval = "-1";
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);

	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send('arrayString='+ mapMatrix);
    //alert(req.status);
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
	var retvalArray = retval.split('~');
	for(var i=0;i< retvalArray.length;i++){
		var idObtained = retvalArray[i];
		customAlert('N','id obtained:' +idObtained);
		var element = document.getElementById(idObtained);
		element.style.backgroundColor="yellow";
	}
    alert(retval);
    return retval;
}



function doPostAjax3()
{
    customAlert('Y','Inside doPOstAJAX3()');
	
    var url= "RetreiveCoordinates.jsp";
    var retval = "-1";
    var req = getACTObj();
    req.onreadystatechange = processRequest;
    req.open("POST",url,false);

	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send('arrayString=arrString');
    //alert(req.status);
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
	window.mapMatrix = retval;
	doPostAjax4();
}

function doPostAjax5(url, operation)
{
    customAlert('Y','Inside doPOstAJAX5()');
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
		var file = document.getElementById("uploadfile");
		/* Create a FormData instance */
		var formData = new FormData();
		/* Add the file */
		formData.append("upload", file.files[0]);
		sParam = formData;
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
	processReturnStatus(operation, retval);
	
	/*Post AJAX Call Processing */
	if(operation=='FileUpload'){
		document.getElementById("filePath").innerHTML = retval;
		var thelastindex = retval.lastIndexOf("\\");
		document.getElementById("mapimage").src = retval;
		customAlert('Y',retval);
	}
	
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
	//alert("index::" +index);
    //alert("Return from doPostAJAX::" +retval);
    if(retval.indexOf("No file uploaded.")==-1){
        alert("File uploaded");
        $('#myModal').modal('hide')

    }else{
        alert("Some Error uploading the file.");
    }
}


function trim(str)
{
    return str.replace(/^\s+|\s+$/g, '');
}

function methodCall(field)
{
	//alert("field details:" +field.id);
	field.style.backgroundColor="red";
}


function createGrid(size) {
	alert("inside create grid function...");
	var imageElement=document.getElementById("mapimage");
	var ratioW = Math.floor(imageElement.clientWidth/size);
	alert("ratioW::" +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/size);
	alert("ratioH::" +ratioH);
	

	var parent = $('<div />', {
	class: 'grid', 
	width: ratioW * size, 
	height: ratioH * size,
	}).addClass('grid').appendTo('#myMap');

	for (var i = 0; i < ratioH; i++) {
		for(var p = 0; p < ratioW; p++){
			$('<div />', {
				id:i.toString()+p.toString(),
				onclick:'methodCall(this)',
				width: size - 1, 
				height: size - 1
			}).appendTo(parent);
		}
	} 
}

function createMatrix(){
	alert("Inside function createMatrix...");
	var imageElement=document.getElementById("mapimage");
	var ratioW = Math.floor(imageElement.clientWidth/10);
	//alert("ratioW::" +ratioW);
	var ratioH = Math.floor(imageElement.clientHeight/10);
	//alert("ratioH::" +ratioH);
	//var someElement = document.getElementById('00');
	//alert(someElement.style.backgroundColor);
	
	//Create a matrix with dimensions equal to width and height of image
	window.x = new Array(ratioH);
	for (var j = 0; j < ratioH; j++) {
		x[j] = new Array(ratioW);
		for(var t = 0; t < ratioW; t++){
			x[j][t]='1';
		}
	}
	
	//Id div id is red, change the array content from 0 to 1
	for (var i = 0; i < ratioH; i++ ) {
		for(var p = 0; p < ratioW; p++){
			var calculatedId = i.toString() + p.toString();
			//alert('calculated Id ' +calculatedId);
			var someElement = document.getElementById(calculatedId);
			//alert('some element id' +someElement.id);
			if(someElement.style.backgroundColor=='Red' || someElement.style.backgroundColor=='red'){
				//alert(calculatedId + ' id is red' );
				x[i][p] = '0';
			}
		}
	}
	
	//Print Matrix
	/*
	for (var i = 0; i < ratioH; i++ ) {
		//console.log('i is :' +i);
		for(var p = 0; p < ratioW; p++){
			//console.log('p is: ' +p);
			console.log(x[i][p]);
			//console.log('0');
		}
	}*/
	
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

/*function searchPath(){
	customAlert('N','Inside search Path...');
	var sourceStr = document.getElementById('source');
	var destinationStr = document.getElementById('destination');
	var sourceArr = sourceStr.split(',');
	var destinationArr = destinationStr.split('~');
	doPostAjax
}*/