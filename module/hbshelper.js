module.exports = {
    equals: function (var1, var2, options) {
        if (var1 == var2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    existsRole: function (arr1, arr2, options) {
        if (!arr1 || !arr1._isAuthed || !arr1._authUserRole)
            return false;

        if (!arr2 || arr2.length === 0)
            return true;

        var myRoles = arr1._authUserRole.split(',');

        if (myRoles.indexOf('admin') > -1)
            return options.fn(this);

        var checkRole = arr2.split(',');

        for (var key in checkRole) {
            if (myRoles.indexOf(checkRole[key]) > -1)
                return options.fn(this);
        }

        return options.inverse(this);
    },
    test: function (text) {
        return "TEST:" + text;
    }
};
