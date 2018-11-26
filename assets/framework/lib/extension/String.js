String.prototype.replaceByKey = function (words) {
    return this.replace(/%\w/g, k => words[k]);
}