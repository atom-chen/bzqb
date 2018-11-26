(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/modules/LogMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9a388QxB0tH6oSxQw8RniXi', 'LogMgr', __filename);
// framework/modules/LogMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var maxOpLength = 100;
var LogMgr = /** @class */ (function () {
    function LogMgr() {
    }
    LogMgr.getInstance = function () {
        return LogMgr._instance;
    };
    LogMgr.prototype.pushLog = function (str) {
        var arr = window['__errorOp'];
        arr.push(str);
        if (arr.length > maxOpLength) {
            arr.shift(); //移除第一个内容
        }
    };
    //加入操作记录
    LogMgr.prototype.addOpreation = function (op) {
        this.pushLog(op);
    };
    LogMgr.prototype.switchScene = function (sceneName) {
        this.pushLog("\u8DF3\u8F6C" + sceneName);
    };
    LogMgr.prototype.addRequire = function (route) {
        this.pushLog("\u8BF7\u6C42" + route);
    };
    LogMgr.prototype.addRespond = function (route) {
        this.pushLog("\u6536\u5230" + route);
    };
    LogMgr.prototype.showSubModule = function (prefabName) {
        this.pushLog("\u5F39\u51FA" + prefabName);
    };
    //单例处理
    LogMgr._instance = new LogMgr();
    return LogMgr;
}());
exports.default = LogMgr;

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
        //# sourceMappingURL=LogMgr.js.map
        