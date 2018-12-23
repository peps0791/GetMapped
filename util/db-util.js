/*
* File name: db-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const path = require('path');
const assert = require('chai').assert;

/*const dbConfig = require('../config/database');
const constants = require('../constants');

const errFile = require('./error-util');*/
const logUtil = require('./log-util');
const config = require("../config/config");
const verify = require('./verify-util');

const MongoClient = require('mongodb').MongoClient;

const scriptName = path.basename(__filename);

module.exports = {

    db: null,

    /*
     * @name: initDB()
     * @description: initializes database if not already initialized
     * @params: None
     * @returns: Promise object
     */
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
                        resolve();
                    })
                    .catch(function (err) {
                        logUtil.writeLog(scriptName, currentFuncName, "Some error occurred while connecting to db", true, err);
                        reject(err);
                    });
            }else{
                logUtil.writeLog(scriptName, currentFuncName, "DB object already initialized");
                resolve()
            }
        });
    },

    /*
     * @name: getFromDB()
     * @description: fetches data from the database for the specified query and collection name
     * @params: collectionName (::String), queryObj (::JSON)
     * @returns: Promise object
     */
    getFromDB: function (collectionName, queryObj) {

        let currentFuncName = 'getFromDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters::collection name->'+collectionName + " :: queryObj"+JSON.stringify(queryObj));

        return new Promise(async function (resolve, reject) {
            try {

                verify.validate(collectionName);
                assert.notEqual(queryObj, null);

                let db = await _this.getConnectionObj();
                const mapCollection = db.collection(collectionName);

                mapCollection.find(queryObj).toArray().then((docs)=>{
                    logUtil.writeLog(scriptName, currentFuncName, "Result from the server::"+JSON.stringify(docs));
                    resolve(docs);
                }).catch((err)=>{
                    logUtil.writeLog(scriptName, currentFuncName, 'Some exception occurred while getting data from DB', true, err);
                    throw err
                });


            } catch (err) {
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err)
            }
        });
    },


    /*
     * @name: getConnectionObj()
     * @description: returns db connection object
     * @params: None
     * @returns: db connection object
     */
    getConnectionObj: async function () {

        let _this = module.exports;
        let currentFuncName = 'getConnectionObj';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called ');
        try{
            if (!_this.db ) {
                await _this.initDB();
            }
        }catch(err){
            logUtil.writeLog(scriptName, currentFuncName, currentFuncName +'  Error ', true, err);
            throw new Error(err)
        }
        return _this.db;
    }
};