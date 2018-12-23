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

    it('should return initialized connection object when dbutil.connection is null', ()=> {

        dbUtil.db = null;
        let connection = dbUtil.getConnectionObj();
        assert.notDeepEqual(connection, null)
    });


    it('should return initialized connection object when dbutil.connection is not null', ()=> {

        dbUtil.initDB();
        let connection = dbUtil.getConnectionObj();
        assert.notDeepEqual(connection, null)

    });
});

describe('getFromDB', ()=> {

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
});


describe('insertInDB', ()=> {

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

        let doc = {"mapName":"test-mapp", "file-name":"test-file"};
        let insertId =  await dbUtil.insertInDB("map", doc);
        assert.notEqual(insertId, null)

    });

    it('should trow error on duplicate data', async ()=>{

        let doc = {"mapName":"test-map", "file-name":"test-file"};
        try{
            await dbUtil.insertInDB("map", doc);
        }catch(err){
            assert.equal(err.message, constants.ITEM_ALREADY_PRSENT_ERRORCODE)
        }

    });
});

/*describe('executeQuery()', function () {

    it('should execute a given select query successfully', async () => {

        let query = "SELECT * FROM users WHERE username = ?";
        let values = ["test27@gmail.com"];
        let result = await dbUtil.executeQuery(query, values);
        console.log(JSON.stringify(result));
        assert.deepEqual(result[0].username, values[0]);

    });

    it('should execute a given insert query successfully', async () => {

        let query = "INSERT INTO users ( username, password, age, gender, state, city, zip ) values (?,?,?,?,?,?,?)";
        let values = ['testesda12345@gmail.com', 'somepassword', 34, 'm', 'AZ', 'tempe', '85281'];

        let result = await dbUtil.executeQuery(query, values);
        console.log(JSON.stringify(result));
        assert.equal('insertId' in result, true)
    });

    it('should throw a DB_EXCEPTION_ERROR if something wrong happens while executing query', async () => {

        let query = "INSERT INTO user ( username, password, age, gender, state, city, zip ) values (?,?,?,?,?,?,?)";
        let values = ['test27@gmail.com', 'somepassword', 34, 'm', 'AZ', 'tempe', '85281'];

        try {
            await dbUtil.executeQuery(query, values);
        } catch (err) {
            assert.deepEqual(err.code, constants.DB_ERRORCODE);
        }
    });

    it('should throw an error if the values array is empty', async () => {

        let query = "SELECT * FROM users WHERE username = ?";
        let values = [];
        try {
            await dbUtil.executeQuery(query, values);
        } catch (err) {
            assert.deepEqual(err.code, constants.INVALID_PARAM_ERRORCODE);
        }
    });

    it('should throw ERROR if the array length and the query parameters are not equal', async () => {

        let query = "INSERT INTO users ( username, password, age, gender, state, city, zip ) values (?,?,?,?,?,?,?)";
        let values = ['test10@gmail.com', 34, 'm', 'AZ', 'tempe', '85281'];
        try {
            await dbUtil.executeQuery(query, values);
        } catch (err) {
            assert.deepEqual(err.code, constants.DB_ERRORCODE);
        }
    });
});*/


/*describe('findUser()', function(){

	it('should return the user row given a valid username which is present', async()=>{

		let username = 'test10@gmail.com';
		var userObj = await dbUtil.findUser(username);
		assert.equal('username' in userObj[0], true);
	});

	it('should throw NO_RESULT_FROM_DB_ERRORCODE error given an invalid username which is not present', async()=>{

        let username = 'test112340@gmail.com';
        try{
            await dbUtil.findUser(username);
        }catch(err){
            assert.deepEqual(err.code, constants.NO_RESULT_FROM_DB_ERRORCODE)
        }
	});

	it('should throw INVALID_PARAM_ERRORCODE error given the username is null', async()=>{

        let username = null;
        try{
            await dbUtil.findUser(username);
        }catch(err){
            assert.deepEqual(err.code, constants.INVALID_PARAM_ERRORCODE)
        }
	});

	it('should throw INVALID_PARAM_ERRORCODE given the username is empty', async()=>{

	    let username = null;
        try{
            await dbUtil.findUser(username);
        }catch(err){
            assert.deepEqual(err.code, constants.INVALID_PARAM_ERRORCODE)
        }

	});
});*/

/*describe('insertUser()', function(){

	it('should insert a user successfully when the input is valid', async()=>{

	    let values = ['test8156@gmail.com', 'somepassword', 34, 'm', 'AZ', 'tempe', '85281'];
		let result = await dbUtil.insertUser(values);
		assert.equal('insertId'in result, true)
	});

	it('should throw DB_ERRORCODE error if user is already present', async()=>{

	    let values = ['test5156@gmail.com', 'somepassword', 34, 'm', 'AZ', 'tempe', '85281'];
	    try{
            await dbUtil.insertUser(values)
        }catch(err){
            assert.deepEqual(err.code, constants.DB_ERRORCODE)
        }

	});

	it('should throw DB_ERRORCODE error if the user details are incomplete', async()=>{
        let values = ['test5156@gmail.com', 'm', 'AZ', 'tempe', '85281'];
        try{
            await dbUtil.insertUser(values);
        }catch(err){
            assert.deepEqual(err.code, constants.DB_ERRORCODE)
        }
	});

	it('should throw INVALID_PARAM_ERRORCODE error if values are empty', async()=>{
        let values = null;
        try{
            await dbUtil.insertUser(values);
        }catch(err){
            assert.deepEqual(err.code, constants.INVALID_PARAM_ERRORCODE)
        }
    })
});*/