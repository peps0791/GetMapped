<!DOCTYPE html>
<html lang="en">
<head>
  <title>Find Your Way</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet"
href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <script
src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script
src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <style>
    #footer {
        position: relative;
        margin-top: -100px;
        height: 90px;
        clear: both;
        padding-top: 20px;
    }
    .carousel-inner{
    height: 757px;
    }

  </style>
  <div class="active">
    <div style="height:131px;">
        <!--NavBar Code-->
        <nav class="navbar navbar-default"
style="background-color:#A0B0E0" style="margin-bottom:0px;">
            <div class="container-fluid">
                <div class="navbar-header" style="float:center">
                    <h1 style="color:#FFFFFF" align="center"><b>Lets
Find Some Ways<b></h1>
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-info btn"
style="margin-right:40px;background-color:#00008B;width:100px;float:right"><b>Log
Off</b></button>
                <ul class="nav navbar-nav">
                    <li><a href="#" style="color:#FFFFFF">Home</a></li>
                    <li><a href="#" style="color:#FFFFFF">Page 1</a></li>
                    <li><a href="#" style="color:#FFFFFF">Page 2</a></li>
                    <li><a href="#" style="color:#FFFFFF">Page 3</a></li>
                </ul>
            </div>
        </nav>
    </div>
    <!--Left Column Code-->
    <div
style="float:left;width:29.1%;height:768px;background-color:#A0B0E0">
        <!--<a class="navbar-brand" href="#" style="color:#FFFFFF">Login
as Admin</a>
        <a class="navbar-brand" href="#" style="color:#FFFFFF">Login as
User</a>
        <br>-->
        <h1 align="center" style="color:#FFFFFF"><b>Login Area</b></h1>
        <div id="loginScreen" style="float:center">
        <br>
            <form role="form" method="post" action="login.jsp">
            <div class="form-group" align="left" style="margin-left:70px">
                <label for="usr" style="color:#FFFFFF">UserName</label>
                <input type="text" class="form-control" id="usr"
name="usr" style="width:250px">
            </div>
            <div class="form-group" align="left" style="margin-left:70px">
                <label for="pwd" style="color:#FFFFFF">Password</label>
                <input type="password" class="form-control" id="pwd"
name="pwd" style="width:250px">
            </div>
            <!--
            <div>
                <input type="checkbox" class="form-control-md" id="chk"
style="margin-left:200px">
                <label for="usr" style="color:#FFFFFF">Remember Me</label>
            </div> -->
            <br>
            <button type="Submit" class="btn btn-info btn"
style="margin-left:50px;background-color:#00008B"><b>Login As
User</b></button>
            <button type="Submit" class="btn btn-info btn"
style="margin-left:30px;background-color:#00008B"><b>Login As
Admin</b></button>
            </form>
        </div>
    </div>

    <div id="myCarousel" class="carousel slide" data-ride="carousel"
style="float:right;width:70%">
        <!-- Indicators -->
        <ol class="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to="0"
class="active"></li>
            <li data-target="#myCarousel" data-slide-to="1"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
            <div class="item active">
                <img src="Desert.jpg" class="img-responsive" alt="Chania">
                    <div class="carousel-caption">
                        <h3>Grave Error</h3>
                        <p>Errors you can take to your Grave.</p>
                    </div>
            </div>

            <div class="item">
                <img src="Lighthouse.jpg" class="img-responsive"
alt="Chania">
                    <div class="carousel-caption">
                        <h3>The Wall</h3>
                        <p>Remember, the Wall of Berlin?</p>
                    </div>
            </div>


            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel"
role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left"
aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel"
role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"
aria-hidden="true"></span>
            <span class="sr-only">Next</span>
            </a>
        </div>
    </div>


    <!--Footer Code-->
    <footer style="background-color:#A0B0E0" id="footer"
style="margin-top:10px;">
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
</head>
</html>
