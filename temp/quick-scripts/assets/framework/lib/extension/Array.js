(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/lib/extension/Array.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69b1bWPTGBJuotPrJA3sTxB', 'Array', __filename);
// framework/lib/extension/Array.js

"use strict";

Array.prototype.deepCopy = function () {
    return this.map(function (v) {
        return JSON.parse(JSON.stringify(v));
    });
};
// 交集
Array.prototype.intersect = function (arr) {
    return this.filter(function (v) {
        return arr.includes(v);
    });
};
// 并集
Array.prototype.union = function (arr) {
    var _this = this;

    return this.concat(arr.filter(function (v) {
        return !_this.includes(v);
    }));
};
// 差集
Array.prototype.diff = function (arr) {
    var _this2 = this;

    return this.concat(arr).filter(function (v) {
        return !_this2.includes(v) || !arr.includes(v);
    });
};
// 根据值删除数组对应元素
Array.prototype.removeByValue = function (value) {
    var idx = this.indexOf(value);
    if (~idx) this.splice(idx, 1);
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Array.js.map
        