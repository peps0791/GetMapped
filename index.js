// index.js

// set up ======================================================================
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');


const logUtil = require("./util/log-util");
const dbUtil = require("./util/db-util");
const miscUtil = require("./util/misc-util");


const scriptName = path.basename(__filename);




const app = express();
const port = process.env.PORT || 3000;

// set up our express application
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');

// routes ======================================================================
require('./routes/routes.js')(app); // load our routes and pass in our app

dbUtil.initDB().then(function(){
    app.listen(port);
    logUtil.writeLog(scriptName, '', 'App server started at port ' + port);
}).catch(function(error){
    logUtil.writeLog(scriptName, '', 'Some error occurred while connecting to DB '+error);
    logUtil.writeLog(scriptName, '', 'Exiting application!!!');
});



app.get('/getMaps', async (req, res)=>{

    //get floor info
    const mapCollection = db.collection('map');

    var maps = [];
    const cursor = mapCollection.find({});
    while(await cursor.hasNext()) {
        const doc = await cursor.next();
        maps.push(doc.mapName);
    }
    console.log("maps->"+maps);
    res.status(200).render('map-dashboard', {response: {"maps": maps}});

});

app.post('/renameMap', async (req, res)=>{


    var mapName = req.body.mapname;
    console.log("map name->"+mapName);

    var newName = req.body.newname;
    console.log("map name->"+newName);

    //get floor info
    const mapCollection = db.collection('map');

    mapCollection.updateOne({"mapName": mapName}, {"$set": {"mapName": newName}}, function (err, results) {
        if (err != null) {
            console.log("some error occurred while renaming map::" + err);
            res.status(500).json({'status': "FAIL"});
        } else {
            //console.log(results);
            console.log("Map renamed");
            res.status(200).json({'status': "SUCCESS"});
        }
    });

});




app.post("/remove", (req, res)=>{

    var mapName = req.body.mapname;
    console.log("mapname->"+mapName);

    const mapCollection = db.collection('map');
    mapCollection.remove({"mapName":mapName}, function(err, result){

        if (err != null) {
            console.log("some error occurred while removing documents from mongodb::" + err)
            res.status(500).json({response:{'error':'Error removing map'}});
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({response:{'status':'SUCCESS'}});
        }
    });
});



app.post("/saveMap", (req, res) => {

    var nodes = req.body.nodes;
    console.log("saving map::" + nodes);
    var name = req.body.mapname;
    console.log("saving map::" + name);
    const mapCollection = db.collection('map');
    mapCollection.updateOne({"mapName": name}, {"$set": {"nodes": nodes}}, {upsert: true}, function (err, results) {
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

app.get("/add-new-map",  (req, res)=>{
    res.render("add-new", {response:null})
});

//expose this to write test cases
module.exports = app;
