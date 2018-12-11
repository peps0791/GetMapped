// server.js

// set up ======================================================================
// get all the tools we need
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


const uri = 'mongodb://localhost:27017';  // mongodb://localhost - will fail

// Database Name
const dbName = 'getMappedDB';


var app = express();
var port = process.env.PORT || 3000;
var db;

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
MongoClient.connect(uri, {useNewUrlParser: true})
    .then(function (client) { // <- db as first argument
        //console.log(client)
        console.log("connected successfully to the db server");
        db = client.db(dbName);
        //console.log(db);

        app.listen(port);

    })
    .catch(function (err) {
        console.log("some error occurred::" + err)
    });

app.get('/', (req, res) => {
    res.status(200).render('dashboard');
});

app.get('/new', (req, res) => {

    //get nodes for current page
    const mapCollection = db.collection('map');
    mapCollection.findOne({"mapId": 1}, function (err, result) {
        if (err != null) {
            console.log("some error occurred while fetching documents from mongodb::" + err)
            res.status(500).render('upload-new');
        } else {
            console.log(JSON.stringify(result));
            res.status(200).render('upload-new', {response: {"nodes": result.nodes}});
        }
    });
});

app.post("/saveMap", (req, res) => {

    var nodes = req.body.nodes;
    console.log("saving map::" + nodes);
    const mapCollection = db.collection('map');
    mapCollection.updateOne({"mapId": 1}, {"$set": {"nodes": nodes}}, {upsert: true}, function (err, results) {
        if (err != null) {
            console.log("some error occurred while updating db::" + err)
            res.status(500).json({'status': "FAIL"});
        } else {
            //console.log(results);
            console.log("Map updated");
            res.status(200).json({'status': "SUCCESS"});
        }

    });
});

app.post('/saveSeat', (req, res) => {

    var coord = req.body.coord;
    var seatNo = req.body.seatNo;
    var empName = req.body.empName;
    var empPhone = req.body.empPhone;

    //save to mongo
    // Get the seatMap collection
    const empCollection = db.collection('employee');
    empCollection.insertOne(
        {"coord": coord, "seatNo": seatNo, "empName": empName, "empPhone": empPhone}
        , function (err, result) {

            if (err != null) {
                res.status(500).json({'status': "FAIL"});
            }
            //assert.equal(err, null);
            //assert.equal(3, result.result.n);
            //assert.equal(3, result.ops.length);
            console.log("Inserted 1 document into the collection");
            res.status(200).json({'status': "SUCCESS"});
        });
});
//console.log('App server started at port ' + port);
//logUtil.writeLog(scriptName, '', 'App server started at port ' + port);

//expose this to write test cases
//module.exports = app;
