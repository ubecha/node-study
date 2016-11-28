module.exports = {
    NewError: function (errcode) {
        var err = new Error(this.ErrorCode[errcode + ''] || this.ErrorCode['-1']);
        err.code = errcode;
        return err;
    },
    ErrorCode: {
        '-1': "Unknown",
        '1': "OK",
        '400': "login failed",
        '401': "incorrect user"
    }
};
