/*
* File name: misc-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const assert = require('chai').assert;
const path = require('path');

const logUtil = require('./log-util');
const dbUtil = require("./db-util");
const constants = require("../constants");
const verify = require('./verify-util');
const scriptName = path.basename(__filename);

module.exports = {

    /*
    * @name: getMapsNamesFromDB()
    * @description: fetched list of map names from the database
    * @params: None
    * @returns: Promise object containing array of map names
    */
    getMapsNamesFromDB: ()=> {

        let currentFuncName = 'getMapsNamesFromDB()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        let maps = [];
        return new Promise(async (resolve, reject)=> {
            try {
                let docs = await dbUtil.getFromDB(constants.COLLECTION_MAP, {});
                for(let doc of docs){
                    maps.push(doc.mapName);
                }
                resolve(maps)
            } catch (err) {
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },

    /*
    * @name: getMapFromDB()
    * @description: gets the specified map from the database
    * @params: mapName (::String)
    * @returns: Promise object containing map object
    */
    getMapFromDB:(mapName)=>{

        let currentFuncName = 'getMapFromDB()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(mapName);
                let docs = await dbUtil.getFromDB(constants.COLLECTION_MAP, {"mapName":mapName});
                assert(docs.length===1);
                resolve(docs[0]);
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err);
            }
        });
    },

    /*
    * @name: getEmployeesFromDB()
    * @description: fetched list of employees from the database
    * @params: None
    * @returns: Promise object containing array of employee objects
    */
    getEmployeesFromDB: ()=> {

        let currentFuncName = 'getEmployeesFromDB()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        let employees = [];
        return new Promise(async (resolve, reject)=> {
            try{
                let docs = await dbUtil.getFromDB(constants.COLLECTION_EMP, {});
                for(let doc of docs){
                    employees.push(doc);
                }
                resolve(employees)
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },

    /*
   * @name: createNewMap()
   * @description: inserts a new entry of map in the database
   * @params: mapName (::String), fileName (::String)
   * @returns: Promise object
   */
    createNewMap:(mapName, fileName)=>{

        let currentFuncName = 'createNewMap()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(mapName);
                verify.validate(fileName);
                let doc = {"mapName":mapName, "file-name":fileName};
                let insertId = await dbUtil.insertInDB(constants.COLLECTION_MAP,  doc);
                verify.validate(insertId);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  inserted map id::'+insertId);
                resolve();
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    }
};