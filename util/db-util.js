/*
* File name: db-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const path = require('path');
const assert = require('chai').assert;

/*const dbConfig = require('../config/database');*/
const constants = require('../constants');

const errFile = require('./error-util');
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

                        _this.initCollections(_this.db);
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
     * @name: initCollections()
     * @description: creates index on the map collections
     * @params: db object
     * @returns: None
     */
    initCollections: function(db){

        let currentFuncName = 'initCollections';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called ');

        const mapCol = db.collection("map");
        mapCol.createIndex( { mapName: 1 }, {unique:true});

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

        return new Promise(async (resolve, reject)=> {
            try {

                verify.validate(collectionName);
                assert.notEqual(queryObj, null);

                let db = await _this.getConnectionObj();
                const col = db.collection(collectionName);

                col.find(queryObj).toArray().then((docs)=>{
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
    * @name: insertInDB()
    * @description: insert data in database
    * @params: collectionName (::String), document (::JSON)
    * @returns: Promise object containing insert ID
    */
    insertInDB: function(collectionName, document){

        let currentFuncName = 'insertInDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: collection name::' + collectionName +  " :: doc"+document);

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(collectionName);
                verify.validate(document);

                let db = await _this.getConnectionObj();
                const col = db.collection(collectionName);
                col.insertOne(document).then((res)=>{
                    resolve(res.ops[0]['_id']);
                }).catch((err)=>{
                    if(err.name === "MongoError" && err.message.includes("duplicate key error")){
                        reject(errFile.getErrorObj(constants.DB_ERRORCODE, constants.ITEM_ALREADY_PRSENT_ERRORCODE))
                    }else{
                        reject(err);
                    }
                });

            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err);
            }
        });
    },


    removeFromDB: function(collectionName, query){

        let currentFuncName = 'removeFromDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: collection name::' + collectionName +  " :: query::"+query);

        return new Promise(async (resolve, reject)=>{

            try{

                verify.validate(collectionName);
                verify.validate(query);

                let db = await _this.getConnectionObj();
                const col = db.collection(collectionName);

                col.deleteOne(query)
                    .then((res)=>{
                        resolve(res);
                    }).catch((err)=>{
                     reject(err)   ;
                });
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err);
            }

        });


    }
};