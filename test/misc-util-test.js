/*
* File name: misc-util-test.js
* Author: ppapreja
* Test cases for misc-util.js.
* */

const assert = require('chai').assert;
const util = require('../util/misc-util');
const dbUtil = require('../util/db-util');
const config = require('../config/config');


describe('getMapsFromDB()', ()=>{

    it('should throw error if db not connected', async ()=>{

        let originalDBUri = config.dbConfig.uri;
        config.dbConfig.uri = "mongodb://localhost:2701";

        try{
            await util.getMapsNamesFromDB();
        }catch(err){
            console.log("test::"+err.message);
            assert(err.code === err.code)
        }finally{
            config.dbConfig.uri = originalDBUri;
            dbUtil.initDB()
        }
    });

    it('should return array of maps when there are entries present in the DB', async ()=>{

        let maps = await util.getMapsNamesFromDB();
        assert(Array.isArray(maps));

    });



    /*it('should return true if the query index is = file list length', function(){

        let queryIndex = 18;
        let fileListLength = 18;

        let actualResult = util.isLastIndex(queryIndex, fileListLength);
        assert.deepEqual(true, actualResult)

    });

    it('should return false if the query index is < file list length', function(){

        let queryIndex = 17;
        let fileListLength = 18;

        let actualResult = util.isLastIndex(queryIndex, fileListLength);
        assert.deepEqual(false, actualResult)

    });

    it('should throw error if the query index is not a number', function(){

        let queryIndex = 'hahaha';
        let fileListLength = 18;

        try{
            util.isLastIndex(queryIndex, fileListLength);
        }catch(err){
            assert(err.code === constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should throw error if the file list length is not a number', function(){

        let queryIndex = 18;
        let fileListLength = 'hahhaa';

        try{
            util.isLastIndex(queryIndex, fileListLength);
        }catch(err){
            assert(err.code === constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should return true if string queryIndex > string file list length', function(){

        let queryIndex = '18';
        let fileListLength = '17';

        let actualResult =   util.isLastIndex(queryIndex, fileListLength);
        assert.deepEqual(true, actualResult);

    });

    it('should throw error is query index < 0', function(){

        let queryIndex = -1;
        let fileListLength = 18;

        try{
            util.isLastIndex(queryIndex, fileListLength);
        }catch(err){
            assert(err.code === constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should throw error is file list length < 0', function(){

        let queryIndex = 16;
        let fileListLength = -1;

        try{
            util.isLastIndex(queryIndex, fileListLength);
        }catch(err){
            assert(err.code === constants.INVALID_PARAM_ERRORCODE)
        }
    });

    it('should throw error if either of the parameters is empty', function(){

        let queryIndex = null;
        let fileListLength = -1;

        try{
            util.isLastIndex(queryIndex, fileListLength);
        }catch(err){
            assert(err.code === constants.INVALID_PARAM_ERRORCODE)
        }
    });*/

});