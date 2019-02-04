// index.js

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const logUtil = require("./util/log-util");
const dbUtil = require("./util/db-util");
const config = require("./config/config");

const scriptName = path.basename(__filename);

const app = express();
const port = process.env.PORT || config.appConfig.appPort;

// set up our express application
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');

dbUtil.initDB().then(function(){
    app.listen(port);
    logUtil.writeLog(scriptName, '', 'App server started at port ' + port);
}).catch(function(error){
    logUtil.writeLog(scriptName, '', 'Some error occurred while connecting to DB '+error);
    logUtil.writeLog(scriptName, '', 'Exiting application!!!');
});

// routes ======================================================================
require('./routes/routes.js')(app); // load our routes and pass in our app
module.exports = app;