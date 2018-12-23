/*
* File name: verify-util.js
* Author: ppapreja
* Holds functions related to variable values validation.
* */

'use strict';

let logUtil = require('./log-util');
let errFile = require('./error-util');
let constants = require('../constants');
let path = require('path');

const scriptName = path.basename(__filename);

module.exports = {

    /*functionName: validate*/
    /*param: val ::(JSON, string, array)*/
    validate: function (val) {

        let currentFuncName = 'validate';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters ' + JSON.stringify(val));
        if (!val || val === null || val === undefined || val === '' || val.length === 0 || val === [] || val === {}) {
            throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE);
        } else {
            return true
        }
    },


    /*function name: checkParameters*/
    /*returns true if the parameters are valid*/
    /*throws INVALID_PARAM_ERRORCODE if param passed is invalid*/
    checkParameters: function (userJSON) {
        //check username, password, age, gender, state, city and zip code
        let _this = module.exports;
        let currentFuncName = 'checkParameters()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters ' + JSON.stringify(userJSON));
        try {
            _this.validate(userJSON);
            return (_this.checkEmail(userJSON.username) && _this.checkPassword(userJSON.password) && _this.checkAge(userJSON.age) && _this.checkCity(userJSON.citi) && _this.checkZip(userJSON.zip) && _this.checkState(userJSON.state) && _this.checkGender(userJSON.optradio));
        } catch (err) {
            throw err
        }
    },

    /*Function name: checkEmail*/
    /*params: email::String*/
    /*returns: true if email field is valid, else false*/
    /*throws INVALID_PARAM_ERRORCODE if param passed is invalid*/
    checkEmail: function (email) {
        let _this = module.exports;
        let currentFuncName = 'checkEmail()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + email);
        try {
            _this.validate(email);
            if (email.length > 100) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the email cannot exceed 100');
            }
            let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            let regexResult = new RegExp(re).test(email.toString().toLowerCase());
            logUtil.writeLog(scriptName, currentFuncName, ' Regex result->' + regexResult);
            if (!regexResult) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Email format incorrect!');
            }
            return true;
        } catch (err) {
            throw err;
        }
    },

    /*function name: checkPassword*/
    /*params: password*/
    /*returns: true if password field is valid*/
    /*throws INVALID_PARAM_ERRORCODE if param passed is empty or greater than 100 in length.*/
    checkPassword: function (password) {
        let _this = module.exports;
        let currentFuncName = 'checkPassword()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + password);
        try {
            _this.validate(password);
            if (password.length > 100) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the password cannot exceed 100');
            }
        } catch (err) {
            throw err;
        }
        return true;
    },

    /*Function name: checkAge*/
    /*Params: age*/
    /*Returns true if age is valid.*/
    /*Throws INVALID_PARAM_ERRORCODE if age is empty*/
    /*Throws INVALID_PARAM_ERRORCODE if age is not an integer or cannot be parsed to int*/
    /*Throws INVALID_PARAM_ERRORCODE if age <=0 or greater than 150*/
    checkAge: function (age) {
        let currentFuncName = 'checkAge';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + age);

        try {

            age = parseInt(age);
            if (age === null || age === undefined) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Age param is empty');
            }
            if (isNaN(age)) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Age param is not a valid number');
            }
            if (age <= 0 || age > 150) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Age range incorrect');
            }
        } catch (err) {
            throw err;
        }
        return true;
    },

    /*Function name: checkState*/
    /*params: state*/
    /*returns True if the state is valid*/
    /*Throws INVALID_PARAM_ERRORCODE if state length greater than 100*/
    checkState: function (state) {
        let _this = module.exports;
        let currentFuncName = 'checkState()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + state);
        try {
            _this.validate(state);
            if (state.length > 100) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the state cannot exceed 100');
            }
        } catch (err) {
            throw err;
        }
        return true;
    },

    /*Function name: checkCity*/
    /*params: city*/
    /*returns True if the city is valid*/
    /*Throws INVALID_PARAM_ERRORCODE if city is empty or length greater than 100 or is a number*/
    checkCity: function (city) {
        let _this = module.exports;
        let currentFuncName = 'checkCity()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + city);
        console.log('is a number->' + parseInt(city));
        try {
            _this.validate(city);
            if (city.length > 100) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the city cannot exceed 100');
            }
            if (!isNaN(parseInt(city))) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'City cannot be a number');
            }
        } catch (err) {
            throw err;
        }
        return true;
    },

    /*Function name: checkZip*/
    /*params: zip*/
    /*returns True if the zip is valid*/
    /*Throws INVALID_PARAM_ERRORCODE if zip is empty or length greater than 100*/
    checkZip: function (zip) {
        let _this = module.exports;
        let currentFuncName = 'checkZip()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + zip);
        try {
            _this.validate(zip);
            if (zip.length > 100) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the zip cannot exceed 100');
            }
        } catch (err) {
            throw err;
        }
        return true;
    },

    /*Function name: checkGender*/
    /*params: gender*/
    /*returns True if the gender is valid*/
    /*Throws INVALID_PARAM_ERRORCODE if gender is empty or length greater than 1 or value other than 'm' or 'f'*/
    checkGender: function (gender) {
        let _this = module.exports;
        let currentFuncName = 'checkGender()';
        logUtil.writeLog(scriptName, currentFuncName, ' called with parameters->' + gender);
        try {
            _this.validate(gender);
            if (gender.length > 1) {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Length of the Gender cannot exceed 1');
            }
            if (gender !== 'm' && gender !== 'f' && gender!=='o') {
                throw errFile.getErrorObj(constants.INVALID_PARAM_ERRORCODE, 'Incorrect value of gender');
            }
            return true;
        } catch (err) {
            throw err;
        }
    }
};