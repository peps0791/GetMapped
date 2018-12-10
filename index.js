// server.js

// set up ======================================================================
// get all the tools we need
'use strict';
var express  = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const path = require('path');

var app      = express();
var port     = process.env.PORT || 3000;



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(express.static('public'));
//app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
//app.use(bodyParser.json());

app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs'); // set up ejs for templating

// routes ======================================================================
//require('./routes/routes.js')(app); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);

app.get('/', (req, res)=> {
    res.status(200).render('dashboard');
});

app.get('/new', (req, res)=> {
    res.status(200).render('upload-new');
});
//console.log('App server started at port ' + port);
//logUtil.writeLog(scriptName, '', 'App server started at port ' + port);

//expose this to write test cases
//module.exports = app;
