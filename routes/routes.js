'use strict';

const path = require('path');

const logUtil = require("../util/log-util");
//const dbUtil = require("../util/db-util");
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
     * @description: gets the list of all maps and employees from the database
     * @renders: dashboard.ejs
     */
    app.get('/', async (req, res) => {

        logUtil.writeLog(scriptName, constants.LABEL_API_ROOT,  constants.LABEL_API_ROOT + '  endpoint hit');
        try {
            // get maps from db
            let maps = await miscUtil.getMapsNamesFromDB();
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'maps fetched form DB->' + maps);
            // get employees from db
            let employees = await miscUtil.getEmployeesFromDB();
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'employees fetched from DB->' + employees);
            // render the list back to the frontend
            res.status(200).render('dashboard', {response: {"maps": maps, "emp": employees}});
        } catch (err) {
            logUtil.writeLog(scriptName, constants.LABEL_API_ROOT, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

    /*
    * @api: '/getMap'
    * @description: gets the specified map from the database
    * @renders: upload-new.ejs
    */
    app.get("/getMap", async (req, res)=>{

        logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP,  constants.LABEL_API_GET_MAP + '  endpoint hit');
        let mapName = req.query.mapname;
        logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP,  'map name->'+mapName);
        try{
            verify.validate(mapName);
            let map = await miscUtil.getMapFromDB(mapName);
            res.status(200).render('upload-new', {response: {"nodes": map.nodes,  "mapname":mapName,  "filename": map["file-name"]}});
        }catch(err){
            logUtil.writeLog(scriptName, constants.LABEL_API_GET_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }

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
            console.log(err.code);
            console.log(err.msg);
            console.log(err.name);
            if(err.code === constants.DB_ERRORCODE && err.message === constants.ITEM_ALREADY_PRSENT_ERRORCODE){
                res.status(500).render("add-new", {response:{'errCode':err.message}})
            }else{
                logUtil.writeLog(scriptName, constants.LABEL_API_CREATE_MAP, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
                res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
            }

        }
    });
};