/*
* File name: db-util-test.js
* Author: ppapreja
* Test cases for db-util.js.
* */

'use strict'

const assert = require('chai').assert;
const dbUtil = require('../util/db-util');
const constants = require('../constants');



/*describe('initDB()', function () {

    it('should populate connection obj of dbUtil class', function (done) {

        dbUtil.initDB();
        let con = dbUtil.getConnectionObj();
        let sampleQuery = 'SELECT 1 + 1 AS solution';

        con.query(sampleQuery, (err, results) => {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
});*/



describe('getConnectionObj', ()=> {

    it("Set environment variable to DEV::", ()=>{
        process.env['NODE_ENV'] = constants.DEV_ENV;
    });

    it('Should return initialized connection object when db connection is null', async ()=> {

        dbUtil.db = null;
        let connection = await dbUtil.getConnectionObj();
        assert.notDeepEqual(connection, null)
    });

    it("Reset environment variable::", ()=>{
        process.env['NODE_ENV'] = constants.PROD_ENV;
    });

});

describe('insertInDB', ()=> {

    it("Set environment variable to DEV::", ()=>{
        process.env['NODE_ENV'] = constants.DEV_ENV;
    });

    it('should throw error when collectionName is empty', async ()=>{

        try{
            await dbUtil.insertInDB(null, {})
        }catch(err){
            assert.equal(err.code, constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should throw error when doc is mull', async ()=>{

        try{
            await dbUtil.insertInDB("map", null)
        }catch(err){
            assert.equal(err.code, constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should return valid data when parameters are correct', async ()=>{

        let doc = {"mapName":"test-mapp2", "file-name":"test-file"};
        let insertId =  await dbUtil.insertInDB("map", doc);
        assert.notEqual(insertId, null)

    });

    it('should throw error on duplicate data', async ()=>{

        let doc = {"mapName":"test-mapp", "file-name":"test-file"};
        try{
            await dbUtil.insertInDB("map", doc);
        }catch(err){
            assert.equal(err.message, constants.ITEM_ALREADY_PRSENT_ERRORCODE)
        }
    });

    it("Reset environment variable::", ()=>{
        process.env['NODE_ENV'] = constants.PROD_ENV;
    })
});

describe('getFromDB', ()=> {

    it("Set environment variable to DEV::", ()=>{
        process.env['NODE_ENV'] = constants.DEV_ENV;
    });

    it('should throw error when collectionName is empty', async ()=>{

        try{
            await dbUtil.getFromDB(null, {})
        }catch(err){
            assert.equal(err.code, constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should throw error when queryObj is mull', async ()=>{

        try{
            await dbUtil.getFromDB("map", null)
        }catch(err){
            assert.equal(err.name, "AssertionError")
        }
    });

    it('should return valid data when parameters are correct', async ()=>{

        let mapObjs =  await dbUtil.getFromDB("map", {});
        console.log(mapObjs);
        assert.notEqual(mapObjs, null)
    });

    it("Reset environment variable::", ()=>{
        process.env['NODE_ENV'] = constants.PROD_ENV;
    });
});