/*
* File name: db-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const logUtil = require('./log-util');
const path = require('path');
/*const dbConfig = require('../config/database');
const constants = require('../constants');
const verify = require('./verify-util');
const errFile = require('./error-util');*/

const config = require("../config/config");
const MongoClient = require('mongodb').MongoClient;

const scriptName = path.basename(__filename);

module.exports = {

    db: null,

    /*function name: inittDB*/
    /*Params: None*/
    /*returns: None*/
    initDB: function () {

        let currentFuncName = 'initDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, 'initDB() function called');

        return new Promise((resolve, reject)=>{
            if (!_this.db){

                MongoClient.connect(config.dbConfig.uri, {useNewUrlParser: true})
                    .then(function (client) {
                        logUtil.writeLog(scriptName, currentFuncName, "Connected successfully to the db server.");
                        _this.db = client.db(config.dbConfig.dbName);
                        resolve("DB_INIT_SUCCESS");
                    })
                    .catch(function (err) {
                        logUtil.writeLog(scriptName, currentFuncName, "some error occurred while connecting to db", true, err);
                        reject("DB_INIT_FAIL"+err);
                    });
            }else{
                logUtil.writeLog(scriptName, currentFuncName, "db object already initialized");
                resolve("DB_INIT_SUCCESS")
            }
        });
    },

    getFromDB: function (collectionName, queryObj) {

        let currentFuncName = 'getFromDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, 'getFromDB() function called');

        return new Promise(function (resolve, reject) {
            try {
                let db = _this.getConnectionObj();
                const mapCollection = db.collection(collectionName);
                resolve(mapCollection.find(queryObj));

            } catch (err) {
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },

    /*function name: getConnectionObj*/
    /*params: None*/
    /*Returns: initialized connection object*/
    getConnectionObj: function () {

        let _this = module.exports;
        if (!_this.db) {
            _this.initDB()
        }
        return _this.db;
    }

    /*FunctionName: executeQuery*/
    /*params: userQuery ::String, valuesArr::Array*/
    /*Returns: Promise with the row returned from DB*/
    /*Throws Error with code DB_ERRORCODE in case of database related exceptions.*/
    /*Throws Error with code INVALID_PARAM_ERRORCODE in case of invalid parameters.*/
    /*Throws Error with code NO_RESULT_FROM_DB_ERRORCODE if empty result is returned from database.*/
    /*executeQuery: function (userQuery, valuesArr) {

        const currentFuncName = 'executeQuery()';
        let _this = module.exports;

        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters::query ->' + userQuery + ':: values->' + JSON.stringify(valuesArr));
        return new Promise(function (resolve, reject) {

            try {
                if (verify.validate(userQuery) && verify.validate(valuesArr)) {
                    let con = _this.getConnectionObj();
                    con.query(userQuery, valuesArr, function (err, rows) {
                        if (err) {
                            logUtil.writeLog(scriptName, currentFuncName, "Error while executing query ", true, err);
                            err.code = constants.DB_ERRORCODE;
                            reject(err)
                        } else {
                            logUtil.writeLog(scriptName, currentFuncName, "Rows returned from DB->" + JSON.stringify(rows) + "length->" + rows.length + " Is true? ->" + (rows === true));
                            try {
                                if (verify.validate(rows)) {
                                    resolve(rows)
                                }
                            } catch (err) {
                                reject(errFile.getErrorObj(constants.NO_RESULT_FROM_DB_ERRORCODE))
                            }
                        }
                    })
                }
            } catch (err) {
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        })
    }*/
};