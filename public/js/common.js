String.prototype.replaceAll = function (t, e) {
    return this.replace(new RegExp(t, "gm"), e);
};
String.prototype.trim = function () {
    return this.replace(/(^ *)|( *$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^ *)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/( *$)/g, "");
};
String.prototype.isNumber = function () {
    return !isNaN(this);
};
