
<!DOCTYPE html>
<html lang="en">
	<head>
	<title>Find Your Way</title>
	<meta charset="utf-8">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="EventHandling.js"></script>
	<style>
		#footer {
			position: relative;
			margin-top: -100px;
			height: 90px;
			clear: both;
			padding-top: 20px;
		}
		.myMap{
			height: 757px;
			
		}
		img{
			-webkit-filter: grayscale(1);
			z-index: -1;
			position:absolute;
		}
		.grid {
			margin-top:0px;
			margin-left:0px;
			border: 1px solid #ccc;
			border-width: 1px 0 0 1px;
		}
		.grid div {
			top:0;
			left:0;
			border: 1px solid #000000;
			border-width: 0 1px 1px 0;
			float: left;
		}
		
		.popover {
			position: absolute;
			display: none;
			z-index: 2;
			height: 150px;
			width: 300px;
			background-color: #eaeaea;
		}
		
	</style>

	<body>

		<!-- Modal -->
		<div class="modal fade" id="myModal" role="dialog">
			<div class="modal-dialog">

				<!-- Modal content-->
				<div class="modal-content">
					<div class="modal-header" style="background-color:#A0B0E0">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h3 class="modal-title" align="center" style="color:#FFFFFF"><b>Upload Area</b></h3>
					</div>
					<div class="modal-body">
						<form accept="image/gif, image/jpeg" id="uploadform">
						<b>Your image:</b><br> <input type="file" name="uploadfile" id="uploadfile" enctype="multipart/form-data" onchange="toggleDivVisibility('imagedes')"><br>
						<div id = "imagedes" style="visibility:hidden">
							<label for="imageDesc" style="color:#A0B0E0">Image Name</label>
							<input type="text" id = "imageDesc"><br>
						</div>
						<button type="button" class="btn btn-default" style="background-color:#00008B;color:#FFFFFF" onclick="doPostAjax('FileUpload.jsp','FileUpload')">Submit</button>
						<p id="filePath"></p>
						</form>
					</div>
					<div class="modal-footer" style="background-color:#A0B0E0">
						<button type="button" class="btn btn-default" data-dismiss="modal" style="background-color:#00008B;color:#FFFFFF">Close</button>
					</div>
				</div>
			</div>
		</div>
		
		
		<!--Div Container for Popover -->
		
		<div id="pop1" class="popover" align="center">
			Your pop-over content will go in here!!!
			<div id="popContent">
				<label for="popName" style="color:#FFFFFF">Name</label>
				<input type="text" id = "popName"><br>
				<label for="popSeat" style="color:#FFFFFF">Seat Number</label>
				<input type="text" id = "popSeat"><br>
			</div>
			<label for="popCoordinates" style="color:#FFFFFF">Coordinates</label>
			<input type="text" id = "popCoordinates" readonly><br>
			<select name=mytextarea onchange="toggleDivVisibility('popContent')" id="popCombo">
				<option name=Seat value=Seat> Seat </option>
				<option name=Alley value=Alley> Alley </option>
			</select>
			<a  id = "submitseat" href="javascript:closePopOver('pop1', 'Submit');">Submit</a>
			<a id="closeseat" href="javascript:closePopOver('pop1', '');">Close</a>
			<a id="undoseat" href="javascript:closePopOver('pop1', 'Undo');">Undo</a>
		</div>
		
		
		<!--Div Container for Popover for Fetching List Of Uploaded Files -->
		
		<div id="pop2" class="popover" align="center">
			Files Uploaded Already
			<div id="listOfFiles">
			</div>
			<a href="javascript:closePopOver('pop2','ClearUploadedFilePopover');">Close</a>
		</div>
		
		
		
		<!--
		<div class="popover">
		<p>Some explanation possibly to what to do!</p>
		<a href="#" data-toggle="popover" data-content="Mark Seat">Toggle popover</a>
		<a href="#" data-toggle="popover" data-content="Mark Empty Space">Toggle popover</a>
		<a href="#" data-toggle="popover" data-content="Mark Obstacle">Toggle popover</a>
		</div>-->
		<div class="active" id="outerdiv" style="z-index:-1">
			<div style="height:131px;">
				<!--NavBar Code-->
				<nav class="navbar navbar-default" style="background-color:#A0B0E0" style="margin-bottom:0px;">
				<div class="container-fluid">
					<div class="navbar-header" style="float:center">
					<h1 style="color:#FFFFFF" align="center"><b>Lets Find Some Ways<b></h1>
					</div>
				</div>

				<div>
					<button type="button" class="btn btn-default" style="margin-right:40px;background-color:#00008B;color:#FFFFFF;width:100px;float:right"><b>LogOff</b></button>
					<ul class="nav navbar-nav">
						<!--<li><a href="#" style="color:#FFFFFF">Home</a></li>-->
						<li><a href="#" id="setup" style="color:#FFFFFF" data-toggle="modal" data-target="#myModal">Set Up A New Map</a></li>
						<!--<li><a href="#" style="color:#FFFFFF" id = "editExisting" onclick="editExistingMap()">Edit Existing Map</a></li>-->
						<li><a href="#" style="color:#FFFFFF" id = "editExisting" onclick="showPopOver('pop2','GetUploadedFiles','')">Edit Existing Map</a></li>
						<li><a href="#" style="color:#FFFFFF">Delete Existing Map</a></li>
					</ul>
				</div>
				</nav>
			</div>
			
			
			<!--Left Column Code-->
			<div style="float:left;width:19.1%;height:768px;background-color:#A0B0E0">
				<!--<a class="navbar-brand" href="#" style="color:#FFFFFF">Login as Admin</a>
				<a class="navbar-brand" href="#" style="color:#FFFFFF">Login as User</a><br>-->
				
				<h1 align="center" style="color:#FFFFFF"><b>Welcome Admin!</b></h1>
				<div id="loginScreen" style="float:center">
				<br>
					<div style="margin-left:70px">
						<!--<a href="#" id="setup" style="color:#FFFFFF" data-toggle="modal" data-target="#myModal"><h4>Set Up A New Map</h4></a>-->
						<button type="button" class="btn btn-default" style="background-color:#00008B;color:#FFFFFF" id="gridbtn" onclick="createGrid('mapimage',10,'forAdmin')">Create Grid</button>
						<button type="button" class="btn btn-default" style="background-color:#00008B;color:#FFFFFF" id="savebtn" onclick="doPostAjax('MaptoDBOperations.jsp','SaveMap')">Save Map</button><br><br>
					</div>
				</div>
				<p id="selectedFileName" style="hidden"></p>
			</div>

			<!-- Image Window Code -->
			<div id="myMap" style="float:right;width:80%">
				<img id="mapimage" width="1024" height="752" class ="img-responsive">
			</div>


			<!--Footer Code-->
			<footer style="background-color:#A0B0E0" id="footer" style="margin-top:10px;">
				<div class="container">
					<div class="row">
						<div class="span3 top-buffer-footer">
							<p style="color:#F0F7FF"> &copy; 2015 FindYourWay</p>
						</div>
						<div align="center" class="span7 top-buffer-footer">
							<a  href="#" style="color:#F0F7FF">About Us</a> |
							<a href="#" style="color:#F0F7FF">Privacy Policy</a> |
							<a href="#" style="color:#F0F7FF">Terms & Conditions</a>
						</div>
						<div class="span2 top-buffer-footer">
							<a style="float:right"  href="#">Peppy Powered</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</body>
	</head>
</html>

