'use strict';

const path = require('path');

const logUtil = require("../util/log-util");
//const dbUtil = require("../util/db-util");
const miscUtil = require("../util/misc-util");
const constants = require("../constants");

const scriptName = path.basename(__filename);

module.exports = function (app) {

    /*
     * @api: '/'
     * @description: gets the list of all maps and employees from the database
     * @renders: dashboard.ejs
     */
    app.get('/', async (req, res) => {

        logUtil.writeLog(scriptName, constants.ROOT_API_LABEL,  constants.ROOT_API_LABEL + '  endpoint hit');
        try {
            // get maps from db
            let maps = await miscUtil.getMapsNamesFromDB();
            logUtil.writeLog(scriptName, constants.ROOT_API_LABEL, 'maps fetched form DB->' + maps);
            // get employees from db
            let employees = await miscUtil.getEmployeesFromDB();
            logUtil.writeLog(scriptName, constants.ROOT_API_LABEL, 'employees fetched from DB->' + employees);
            // render the list back to the frontend
            res.status(200).render('dashboard', {response: {"maps": maps, "emp": employees}});
        } catch (err) {
            logUtil.writeLog(scriptName, constants.ROOT_API_LABEL, 'Error thrown to the endpoint' + err.code + '::' + err.message, true, err);
            res.status(500).render('error', {response: {'errorCode': err.code, 'errorMsg': err.message}});
        }
    });

};