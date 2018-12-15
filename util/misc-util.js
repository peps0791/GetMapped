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

const scriptName = path.basename(__filename);

module.exports = {

    getMapsFromDB: function () {

        let maps = [];

        return new Promise(async function (resolve, reject) {

            let mapCursor = await dbUtil.getFromDB("map", {});
            while (await mapCursor.hasNext()) {
                const doc = await mapCursor.next();
                maps.push(doc.mapName);
            }
            resolve(maps)
        });
    },

    getEmployeesFromDB: function () {

        let employees = [];

        return new Promise(async function (resolve, reject) {

            let empCursor = await dbUtil.getFromDB("employee", {});
            while(await empCursor.hasNext()) {
                const doc = await empCursor.next();
                employees.push(doc);
            }
            resolve(employees)
        });
    }



};