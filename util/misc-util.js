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
    },


    /*
      * @name: insertEmployee()
      * @description: inserts a new emp entry in the database
      * @params: mapName (::String), fileName (::String)
      * @returns: Promise object
      */
    insertEmployee: (coord, seatNo, empName, empPhone)=>{

        let currentFuncName = 'insertEmployee()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                let doc = {"coord": coord, "seatNo": seatNo, "empName": empName, "empPhone": empPhone};
                let insertId = await dbUtil.insertInDB(constants.COLLECTION_EMP,  doc);
                verify.validate(insertId);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  inserted map id::'+insertId);
                resolve();
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },


    /*
   * @name: removeMap()
   * @description: removes map from the database
   * @params: mapName (::String)
   * @returns: Promise object
   */
    removeMap: (mapName)=>{

        let currentFuncName = 'removeMap()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(mapName);
                let query = {"mapName":mapName};

                let removeStatus = await dbUtil.removeFromDB(constants.COLLECTION_MAP, query);
                verify.validate(removeStatus);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  remove status::'+removeStatus);
                resolve();
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },

    /*
   * @name: updateMap()
   * @description: updates map by storing updated nodes
   * @params: mapName (::String), mapNodes (::String)
   * @returns: Promise object
   */
    updateMap: (mapName, mapNodes)=>{

        let currentFuncName = 'updateMap()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(mapName);
                verify.validate(mapNodes);

                let query = {"mapName":mapName};
                let values = {"$set": {"nodes": mapNodes}};

                let updateStatus = await dbUtil.updateDB(constants.COLLECTION_MAP, query, values);
                verify.validate(updateStatus);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  update status::'+updateStatus);
                resolve();
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },

    renameMap: (mapName, newName)=>{

        let currentFuncName = 'renameMap()';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  function called');

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(mapName);
                verify.validate(newName);

                let query = {"mapName":mapName};
                let values = {"$set": {"mapName": newName}};

                let updateStatus = await dbUtil.updateDB(constants.COLLECTION_MAP, query, values);
                verify.validate(updateStatus);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  update status::'+updateStatus);
                resolve();
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    }
};