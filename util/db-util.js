/*
* File name: db-util.js
* Author: ppapreja
* Holds functions related to database operations.
* */

'use strict';

// Import modules
const path = require('path');
const assert = require('chai').assert;
const MongoClient = require('mongodb').MongoClient;

const constants = require('../constants');
const errFile = require('./error-util');
const logUtil = require('./log-util');
const config = require("../config/config");
const verify = require('./verify-util');

const scriptName = path.basename(__filename);

module.exports = {

    db: null,
    client:null,

    /*
     * @name: initDB()
     * @description: initializes database if not already initialized
     * @params: None
     * @returns: Promise object
     */
    initDB: ()=> {

        let currentFuncName = 'initDB';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, 'initDB() function called');

        return new Promise((resolve, reject)=>{
            if (!_this.db){
                MongoClient.connect(config.dbConfig.uri, {useNewUrlParser: true})
                    .then(function (client) {
                        logUtil.writeLog(scriptName, currentFuncName, "Connected successfully to the db server.");

                        _this.client = client;
                        _this.db = _this.selectDBName(client);

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

    selectDBName:(client)=>{

        let db;
        if(process.env.NODE_ENV === constants.DEV_ENV){
            db = client.db(config.dbConfig["test-dbName"]);
        }else{
            db = client.db(config.dbConfig.dbName);
        }
        return db;
    },


    /*
     * @name: initCollections()
     * @description: creates index on the map collections
     * @params: db object
     * @returns: None
     */
    initCollections: (db)=>{

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
    getConnectionObj: async ()=> {

        let _this = module.exports;
        let currentFuncName = 'getConnectionObj';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called ');

        return new Promise(async (resolve, reject)=>{
            try{
                if (!_this.db ) {
                    await _this.initDB();
                }
                resolve(_this.db);
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName +'  Error ', true, err);
                reject(err)
            }
        });
    },

    /*
    * @name: getClientObj()
    * @description: returns mongodb client object
    * @params: None
    * @returns: db client object
    */
    getClientObj: async()=>{

        let _this = module.exports;
        let currentFuncName = 'getClientObj';
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called ');

        return new Promise(async (resolve, reject)=>{
            try{
                if (!_this.client ) {
                    await _this.initDB();
                }
                resolve(_this.client);
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName +'  Error ', true, err);
                reject(err)
            }
        });
    },

    /*
     * @name: getFromDB()
     * @description: fetches data from the database for the specified query and collection name
     * @params: collectionName (::String), queryObj (::JSON)
     * @returns: Promise object
     */
    getFromDB: (collectionName, queryObj)=> {

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
    insertInDB:(collectionName, document)=>{

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

    /*
   * @name: removeFromDB()
   * @description: removes entry from the database
   * @params: collectionName (::String), query (::JSON)
   * @returns: Promise object containing result object from the delete query
   */
    removeFromDB:(collectionName, query)=>{

        let currentFuncName = 'removeFromDB()';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: collection name::' + collectionName +  " :: query::"+query);

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(collectionName);
                verify.validate(query);

                let db = await _this.getConnectionObj();
                const col = db.collection(collectionName);

                col.deleteOne(query).then((res)=>{
                        resolve(res);
                    }).catch((err)=>{
                     reject(err);
                });
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err);
            }
        });
    },

    /*
      * @name: updateDB()
      * @description: updates entry in the database
      * @params: collectionName (::String), query (::JSON), values (::JSON), options (::options)
      * @returns: Promise object containing result object from the delete query
      */
    updateDB: (collectionName, query, values, options=null)=>{

        let currentFuncName = 'updateDB()';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: collection name::' + collectionName +  " :: query::"+query + "values::"+  JSON.stringify(values) + " ::options::" +JSON.stringify(options) );

        return new Promise(async (resolve, reject)=>{

            try{
                verify.validate(collectionName);
                verify.validate(query);
                verify.validate(values);

                let db = await _this.getConnectionObj();
                const col = db.collection(collectionName);

                col.updateMany(query, values, options).then((result)=>{
                    resolve(result);
                }).catch((err)=>{
                    reject(err);
                });
            }catch(err){
                logUtil.writeLog(scriptName, currentFuncName, 'Inside Catch block', true, err);
                reject(err);
            }
        });
    },

    executeTransactionRenameMap: (oldName, newName)=>{

        let currentFuncName = 'executeTransactionRenameMap()';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: oldName::' + oldName + "::newName::"+newName);

        return new Promise(async (resolve, reject)=>{

            let session;
            try{
                let client = await _this.getClientObj();
                session = client.startSession();

                session.startTransaction();

                let query = {"mapName":oldName};
                let values = {"$set": {"mapName": newName}};

                let updateMapStatus = await _this.updateDB(constants.COLLECTION_MAP, query, values);
                verify.validate(updateMapStatus);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  update map status::'+updateMapStatus);

                let updateEmpStatus = await _this.updateDB(constants.COLLECTION_EMP, query, values);
                verify.validate(updateEmpStatus);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  update emp status::'+updateEmpStatus);

                session.commitTransaction();
                resolve();

            }catch(error){

                await session.abortTransaction();
                session.endSession();
                reject(error); // Rethrow so calling function sees error
            }
        });
    },

    /*
     * @name: executeTransactionSaveSeat()
     * @description: saves seat in the emp table and coordinates in the map table
     * @params: insertDoc (::JSON), updateObj (::JSON)
     * @returns: Promise object containing result object from the delete query
     */
    executeTransactionSaveSeat: (insertDoc, updateObj)=>{

        let currentFuncName = 'executeTransactionSaveSeat()';
        let _this = module.exports;
        logUtil.writeLog(scriptName, currentFuncName, currentFuncName +' function called with parameters:: collection name::' + JSON.stringify(insertDoc) + "::updateObj::"+JSON.stringify(updateObj));

        return new Promise(async (resolve, reject)=>{
            try{
                let client = await _this.getClientObj();
                const session = client.startSession();

                session.startTransaction();

                let insertId = await _this.insertInDB(constants.COLLECTION_EMP,  insertDoc);
                verify.validate(insertId);
                logUtil.writeLog(scriptName, currentFuncName, currentFuncName+ '  inserted map id::'+insertId);

                let updateStatus = await _this.updateDB(constants.COLLECTION_MAP, updateObj.query, updateObj.values);
                verify.validate(updateStatus);
                session.commitTransaction();
                resolve();
            }catch(error){
                await session.abortTransaction();
                session.endSession();
                reject(error); // Rethrow so calling function sees error
            }
        });
    }
};