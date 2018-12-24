

// config/config.js
module.exports = {
    dbConfig:{
        "dbName":"getMappedDB",
        "test-dbName": "getMappedDBTest",
        "uri":"mongodb://localhost:27017"
    },
    multerConfig:{
        storage: {
            destination: function (req, file, cb) {
                cb(null, 'public/uploads')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        }
    },
    appConfig:{
        appPort:3000
    }
};
