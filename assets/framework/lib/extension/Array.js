Array.prototype.deepCopy = function () {
    return this.map(v => JSON.parse(JSON.stringify(v)));
}
// 交集
Array.prototype.intersect = function (arr) {
    return this.filter(v => arr.includes(v));
}
// 并集
Array.prototype.union = function (arr) {
    return this.concat(arr.filter(v => !this.includes(v)));
}
// 差集
Array.prototype.diff = function (arr) {
    return this.concat(arr).filter(v => !this.includes(v) || !arr.includes(v));
}
// 根据值删除数组对应元素
Array.prototype.removeByValue = function (value) {
    let idx = this.indexOf(value);
    if (~idx) this.splice(idx, 1);
}