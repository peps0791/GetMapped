'use strict';

const path = require('path');
const assert = require('chai').assert;

const logUtil = require("../util/log-util");
const miscUtil = require("../util/misc-util");
const constants = require("../constants");
const verify = require('../util/verify-util');
const config = require("../config/config");
const multer  = require('multer');

const scriptName = path.basename(__filename);
let upload = multer({ storage: multer.diskStorage(config.multerConfig.storage)});

module.exports = function (app) {

    /*
     * @api: '/'
     * @description: renders the start page of the application
     * @renders: start.ejs
     */
    app.get('/', (req, res) => {

        logUtil.writeLog(scriptName, constants.LABEL_API_ROOT,  constants.LABEL_API_ROOT + '  endpoint hit');
        try {
            res.status(200).render('start');
        } catch (err) {
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    /*
     * @api: '/admin-view'
     * @description: gets the list of all maps and employees from the database
     * @renders: dashboard.ejs
     */
    app.get('/admin-view', async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_ADMIN_VIEW,  constants.LABEL_API_ADMIN_VIEW + '  endpoint hit');
        try{
            //res.status(200).render('start');
            // get maps from db
            let maps = await miscUtil.getMapsNamesFromDB();
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'maps fetched form DB->' + maps);
            // get employees from db
            let employees = await miscUtil.getEmployeesFromDB({});
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'employees fetched from DB->' + employees);
            // render the list back to the frontend
            res.status(200).render('dashboard', {response: {"maps": maps, "emp": employees}});
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_ADMIN_VIEW, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    app.post("/search-emp", async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_SEARCH_EMP,  constants.LABEL_API_SEARCH_EMP + '  endpoint hit');
        try{
            let empName = req.body.empName;
            console.log("empName::"+empName);
            let empSeat = req.body.empSeat;
            console.log("emp seat::"+empSeat);
            let empDoc = await miscUtil.getEmployeeFromDB(empName, empSeat);

            console.log(empDoc);
            let map = await miscUtil.getMapFromDB(empDoc["mapName"]);

            res.status(200).render('search-result', {response: {"emp":empDoc, "nodes": map.nodes,  "mapname":empDoc["mapName"],  "filename": map["file-name"]}});
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_SEARCH_EMP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    /*
    * @api: '/emp-view'
    * @description: renders the employee search view
    * @renders: search.ejs
    */
    app.get("/emp-view", async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_EMP_VIEW,  constants.LABEL_API_EMP_VIEW + '  endpoint hit');
        try{

            res.status(200).render('search');
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_EMP_VIEW, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    /*
    * @api: '/get-map'
    * @description: gets the specified map from the database
    * @renders: upload-new.ejs
    */
    app.get("/get-map", async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP,  constants.LABEL_API_GET_MAP + '  endpoint hit');
        let mapName = req.query.mapname;
        logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP,  'map name->'+mapName);
        try{
            verify.validate(mapName);
            let map = await miscUtil.getMapFromDB(mapName);
            let emp = await miscUtil.getEmployeesFromDB({"mapName":mapName});
            res.status(200).render('upload-new', {response: {"employees":emp, "nodes": map.nodes,  "mapname":mapName,  "filename": map["file-name"]}});
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }

    });

    /*
    * @api: '/add-new-map'
    * @description: renders the page for adding new map
    * @renders: add-new.ejs
    */
    app.get("/add-new-map",  (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_ADD_NEW,  constants.LABEL_API_ADD_NEW + '  endpoint hit');
        res.render("add-new", {response:null})
    });

    /*
    * @api: '/create-map'
    * @description: creates a new map entry in the database
    * @renders: upload-new.ejs
    */
    app.post("/create-map", upload.single('exampleFormControlFile1'), async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_CREATE_MAP,  constants.LABEL_API_CREATE_MAP + '  endpoint hit');

        try{
            let uploadedFile = req.file;
            logUtil.writeLog(scriptName, constants.LABEL_API_CREATE_MAP,  'uploaded file->'+uploadedFile);
            verify.validate(req.file);

            let mapName = req.body.mapName;
            logUtil.writeLog(scriptName, constants.LABEL_API_CREATE_MAP,  'map name->'+mapName);
            verify.validate(mapName);

            await miscUtil.createNewMap(mapName, uploadedFile.originalname);
            res.status(200).render('upload-new', {response: {"nodes": [], "mapname": mapName, "filename": uploadedFile.originalname}});
        }catch(err){
            if(err.code === constants.DB_ERRORCODE && err.message === constants.ITEM_ALREADY_PRSENT_ERRORCODE){
                res.status(500).render("add-new", {response:{'errCode':err.message}})
            }else{
                logUtil.writeLog(scriptName, constants.LABEL_API_CREATE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
                res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
            }

        }
    });


    /*
    * @api: '/remove-map'
    * @description: removes map from the database
    * @renders: None
    */
    app.post("/remove-map", async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_REMOVE_MAP,  constants.LABEL_API_REMOVE_MAP + '  endpoint hit');

        try{
            let mapName = req.body.mapname;
            logUtil.writeLog(scriptName, constants.LABEL_API_REMOVE_MAP,  'mapName->'+mapName);
            verify.validate(mapName);

            await miscUtil.removeMap(mapName);
            res.status(200).json({response:{'status':'SUCCESS'}});
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_REMOVE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).json({'status': "FAIL"});
        }
    });


    /*
   * @api: '/save-map'
   * @description: saves(updates) map nodes to the database
   * @renders: None
   */
    app.post("/save-map", async (req, res) => {

        logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP,  constants.LABEL_API_SAVE_MAP + '  endpoint hit');
        try{
            let mapName = req.body.mapname;
            logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP,  'map name::'+mapName);
            verify.validate(mapName);

            let nodes = req.body.nodes;
            logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP,  'map nodes::'+JSON.stringify(nodes));
            try{
                assert(nodes!=null);
            }catch(err){
                nodes = [];
            }

            await miscUtil.updateMap(mapName, nodes);
            res.status(200).json({'status': "SUCCESS"});

        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).json({'status': "FAIL"});
        }
    });

    /*
      * @api: '/save-seat'
      * @description: saves emp-seat information in the database
      * @renders: None
      */
    app.post('/save-seat', async (req, res) => {

        logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_SEAT,  constants.LABEL_API_SAVE_SEAT + '  endpoint hit');
        try{
            let coord = req.body.coord;
            let seatNo = req.body.seatNo;
            let empName = req.body.empName;
            let empTeam = req.body.empTeam;
            let empPhone = req.body.empPhone;
            let mapName = req.body.mapname;

            await miscUtil.insertSeat(coord, seatNo, empName, empTeam, empPhone, mapName);
            res.status(200).json({'status': "SUCCESS"});

        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).json({'status': "FAIL"});
        }
    });


    app.get("/get-seat", async (req, res)=>{
        logUtil.writeLog(scriptName, constants.LABEL_API_GET_SEAT,  constants.LABEL_API_GET_SEAT + '  endpoint hit');
        try{
            let srcSeat = req.query.srcSeat;
            let mapName = req.query.mapname;
            let empObj = await miscUtil.getSeat(srcSeat, mapName);
            console.log(JSON.stringify(empObj));
            res.status(200).json({'status': "SUCCESS", "empObj":empObj});

        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_SAVE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).json({'status': "FAIL"});
        }
    });


    /*
     * @api: '/get-maps'
     * @description: saves emp-seat information in the database
     * @renders: map-dashboard
     */
    app.get('/get-maps', async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAPS,  constants.LABEL_API_GET_MAPS + '  endpoint hit');
        try{
            // get maps from db
            let maps = await miscUtil.getMapsNamesFromDB();
            logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAPS, 'maps fetched form DB->' + maps);
            res.status(200).render('map-dashboard', {response: {"maps": maps}});

        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAPS, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    /*
     * @api: '/rename-map'
     * @description: renames map
     * @renders: None
     */
    app.post('/rename-map', async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_RENAME_MAP,  constants.LABEL_API_RENAME_MAP + '  endpoint hit');
        try{
            let mapName = req.body.mapname;
            logUtil.writeLog(scriptName, constants.LABEL_API_RENAME_MAP,  'map name::'+mapName);
            verify.validate(mapName);

            let newName = req.body.newname;
            logUtil.writeLog(scriptName, constants.LABEL_API_RENAME_MAP,  'new name::'+newName);
            verify.validate(newName);

            await miscUtil.renameMap(mapName, newName);
            res.status(200).json({'status': "SUCCESS"});

        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_RENAME_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(200).json({'status': "FAIL", "error":{"code":err.code, "message":err.message}});
        }
    });
};