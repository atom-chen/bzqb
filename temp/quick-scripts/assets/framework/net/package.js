(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/net/package.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cc640JJ7/tOs79DEp2MaVFv', 'package', __filename);
// framework/net/package.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Package = /** @class */ (function () {
    function Package(msg) {
        //可以理解成回包方法 
        //增量列表
        this._updateArr = msg.updateArr || [];
        //错误码
        this._code = msg.code;
        this._data = msg;
    }
    Package.prototype.getData = function () {
        return this._data;
    };
    Package.prototype.getDataByType = function (type) {
        for (var i = 0; i < this._updateArr.length; ++i) {
            if (this._updateArr[i][0] == type) {
                return this._updateArr[i][1];
            }
        }
        return null;
    };
    Package.prototype.getDatasByType = function (type) {
        var arr = [];
        for (var i = 0; i < this._updateArr.length; ++i) {
            if (this._updateArr[i][0] == type) {
                arr.push(this._updateArr[i][1]);
            }
        }
        return arr;
    };
    return Package;
}());
exports.default = Package;

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
        //# sourceMappingURL=package.js.map
        