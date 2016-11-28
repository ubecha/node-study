// https://www.npmjs.com/package/mssql
var sql = require('mssql');

// ref : 데이터 타입 참고 : \bos\node_modules\mssql\lib\datatypes.js
module.exports = {
    getInstance: function () {
        return sql;
    },
    executeSingleResult: function (query, params, cb) {
        sql.connect(config.maindb).then(function () {
            console.log('REQ:');
            // Stored Procedure
            var req = new sql.Request();

            for (var key in params) {
                var param = params[key];
                if (param.io && param.io == 2) {
                    req.output(param.name, param.type, param.value);
                } else {
                    req.input(param.name, param.type, param.value);
                }
            }

            req.execute(query, function (err, recordsets) {
                if (err) {
                    console.log(err.toString());
                }
                cb(err, recordsets && recordsets.length > 0 && recordsets[0].length > 0 ? recordsets[0][0] : null);
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
            cb(err, null);
        });
    },
    executeResult: function (query, params, cb) {
        sql.connect(config.maindb).then(function () {
            console.log('REQ:');
            // Stored Procedure
            var req = new sql.Request();

            for (var key in params) {
                var param = params[key];
                if (param.io && param.io == 2) {
                    req.output(param.name, param.type, param.value);
                } else {
                    req.input(param.name, param.type, param.value);
                }
            }

            req.execute(query, function (err, recordsets) {
                if (err) {
                    console.log(err.toString());
                }
                cb(err, recordsets && recordsets.length > 0 && recordsets[0].length > 0 ? recordsets[0] : null);
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
            cb(err, null);
        });

    },
    execute: function (query, params, cb) {
        sql.connect(config.maindb).then(function () {
            console.log('REQ:');
            // Stored Procedure
            var req = new sql.Request();

            for (var key in params) {
                var param = params[key];
                if (param.io && param.io == 2) {
                    req.output(param.name, param.type, param.value);
                } else {
                    req.input(param.name, param.type, param.value);
                }
            }

            req.execute(query, function (err, recordsets) {
                if (err) {
                    console.log(err.toString());
                }
                cb(err, recordsets);
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
            cb(err, null);
        });

    },
    queryResult: function (query, params, cb) {
        sql.connect(config.maindb).then(function () {
            console.log('REQ:');
            // Stored Procedure
            var req = new sql.Request();

            for (var key in params) {
                var param = params[key];
                if (param.io && param.io == 2) {
                    req.output(param.name, param.type, param.value);
                } else {
                    req.input(param.name, param.type, param.value);
                }
            }

            req.query(query, function (err, recordsets) {
                if (err) {
                    console.log(err.toString());
                }
                cb(err, recordsets && recordsets.length > 0 ? recordsets : null);
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
            cb(err, null);
        });

    },
    query: function (query, params, cb) {
        sql.connect(config.maindb).then(function () {
            console.log('REQ:');
            // Stored Procedure
            var req = new sql.Request();

            for (var key in params) {
                var param = params[key];
                if (param.io && param.io == 2) {
                    req.output(param.name, param.type, param.value);
                } else {
                    req.input(param.name, param.type, param.value);
                }
            }

            req.query(query, function (err, recordsets) {
                if (err) {
                    console.log(err.toString());
                }
                cb(err, recordsets);
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
            cb(err, null);
        });

    },
    testQuery: function (accountid) {
        mssql.connect(config.maindb).then(function () {
            // Query
            new mssql.Request().query('select 1 as number').then(function (recordset) {
                console.dir(recordset);
            }).catch(function (err) {
                console.error("err" + err.toString());
                // ... query error checks
            });
        }).catch(function (err) {
            // ... connect error checks
            console.error("fail DB" + err.toString());
        });
    }
};
