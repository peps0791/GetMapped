module.exports = {
    getErrorObj: function(code, msg=''){
        let errObj = new Error(msg);
        errObj.code = code;
        return errObj;
    }
};