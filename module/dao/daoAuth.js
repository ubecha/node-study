var mssql = require('mssql');
var sql = require('../mssql.js');
var errcode = require('../errorcode');

module.exports = {
    doLogin: function (username, password, cb) {
        if (!username || username.length < 1 || !password || password.length < 1)
            return callback(true);

        sql.executeSingleResult('[dbo].[UP_ACCOUNT_GETUSERBYID]', [{
            io: 1, // 1 for input, 2 for output
            name: 'accountid',
            type: mssql.NVarChar,
            value: username
        }], function (err, results) {
            if (err) {
                console.error(err);
                cb(errcode.NewError(400), null);
                return;
            }
            if (!results || results.Password != password) {
                console.error(err);
                cb(errcode.NewError(401), null);
                return;
            }
            var user = {
                ACCOUNTID: results.EmpNo,
                NAME: results.EmpNo,
                ROLE: results.Auth
            };
            cb(null, user);
        });
    }
};
