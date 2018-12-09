
<!DOCTYPE html>
<html lang="en">
	<head>
	<title>Find Your Way</title>
	<meta charset="utf-8">
	<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
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
			z-index: -1;
			position:absolute;
		}
		exampleImage{
			z-index: -1;
			position:absolute;
		}
		.grid {
			top:0;
			left:0;
			border: 1px hidden #ccc;
			border-width: 1px 0 0 1px;
		}
		.grid div {
			top:0;
			left:0;
			border: 1px hidden #000000;
			border-width: 0 1px 1px 0;
			float: left;
		}
		#mySearch {
			border: 1px solid #ccc;
			border-width: 1px 0 0 1px;
		
		}
		table {
			border: 2px solid black;   
		}
		td {
			padding: 10px;
			border: 1px solid lightgrey; 
		}
		buttonclass{
			color:#cccccc;
		}
	</style>

	<body>

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
					<button type="button" class="btn btn-default" id= "logOff" style="margin-right:40px;background-color:#00008B;color:#FFFFFF;width:100px;float:right"><b>LogOff</b></button>
					<ul class="nav navbar-nav">
						<!--<li><a href="#" style="color:#FFFFFF">Home</a></li>-->
						<li><a href="#" id="setup" style="color:#FFFFFF">Set Up A New Map</a></li>
						<li><a href="#" style="color:#FFFFFF">Edit Existing Map</a></li>
						<li><a href="#" style="color:#FFFFFF">Delete Existing Map</a></li>
					</ul>
				</div>
				</nav>
			</div>
			
			
			<!--Left Column Code-->
			<div style="float:left;width:19.1%;height:768px;background-color:#A0B0E0">
				<h1 align="center" style="color:#FFFFFF"><b>Welcome User!</b></h1>
				<div id="loginScreen" style="float:center">
				<br>
					<div class="centered" style="margin:0 auto;width:70%" ><!--style="margin-left:27px">-->
						<form role="form" >
							<div class="form-group" align="left">
								<label for="name" style="color:#FFFFFF">Name</label>
								<input type="text" class="form-control" id="name"><!-- style="width:60%"-->
							</div>
							<div class="form-group" align="left">
								<label for="team" style="color:#FFFFFF">Team</label>
								<input type="text" class="form-control" id="team"> <!--style="width:200px"-->
							</div>
							<div class="form-group" align="left">
								<label for="extension" style="color:#FFFFFF">Extension</label>
								<input type="text" class="form-control" id="extension"> <!--style="width:200px"-->
							</div>
							<br>
							<button type="button" class="btn btn-info btn" style="background-color:#00008B;<!--width:150px-->" 
onclick="doPostAjax('SearchResults.jsp','SearchResult')"><b>Search</b></button>

							<div class="centered" align="left">
								<label for="sourceseat" style="color:#FFFFFF">Source Seat</label>
								<input type="text" class="form-control" id="sourceseat">
							</div>				
						</form>
					</div>
				</div>
			</div>

			
			<!-- Search Results Table Code -->
			<div id="searchResult" style="float:right;width:80%">		
			</div>
			
			<!--Dialog Box Code-->
			<div id="example" >
				<img src="" width="1022" height="752" id="dialogImage" class="exampleImage" onload="loaded(this)"/>
			</div>
			
			
			<!--Footer Code-->
			<footer style="background-color:#A0B0E0" id="footer" style="margin-top:10px;">
				<div class="container">
					<div class="row">
						<div class="span3 top-buffer-footer">
							<p style="color:#F0F7FF"> &copy; 2015 FindYourWay</p>
						</div>
						<div align="center" class="span7 top-buffer-footer">
							<a href="#" style="color:#F0F7FF">About Us</a> |
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
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
		<script src="//code.jquery.com/jquery-1.10.2.js"></script>
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
		<script src="EventHandling.js"></script>		
		<script>
				$( function(){ 						
					//variable to reference window
					$myWindow = jQuery('#example');

					//instantiate the dialog
					$myWindow.dialog({ height: 950,
						width: 1024,
						modal: true,
						position: 'center',
						autoOpen:false,
						title:'Your Path',
						overlay: { opacity: 0.5, background: 'black'}
						});		
				});
		</script>
	</body>
	</head>
</html>

