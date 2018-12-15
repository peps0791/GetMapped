const winston = require('winston');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
const { createLogger, format, transports } = require('winston');
//const { combine, timestamp, label, prettyPrint } = format;
const { combine, timestamp} = format;

//Set up Logging=======================================================================================
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({

	format: combine(
    //label({ label: 'right meow!' }),
    timestamp(),
    format.align(),
  	format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    //prettyPrint()
  ),
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/cubicapp.log`,
      timestamp: tsFormat,
      colorize: true,
      level: env === 'development' ? 'debug' : 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/error.log`,
      timestamp: tsFormat,
      colorize: true,
      level: 'error'
    })
  ]
});

module.exports = {
  /*params: file (scriptname:string), label (function label: string), msg (string), iserror (boolean), err (obj)*/
  /*wrapper for the logger function*/
  /**/
  writeLog: function(file, label, msg, iserror=false, err){

    logger.info(file + ":::" + label + ":::" + msg);

    if(iserror){
      logger.error(file + ":::" + label + ":::" + msg + " => " +err.stack);
    } 
  }
}