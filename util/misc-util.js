/*
* File name: misc-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const logUtil = require('./log-util');
const dbUtil = require("./db-util");
const path = require('path');
const constants = require("../constants");

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
                let docs = await dbUtil.getFromDB("employee", {});
                for(let doc of docs){
                    employees.push(doc);
                }
                resolve(employees)
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    }


};