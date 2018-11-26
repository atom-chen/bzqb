(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/net/NetErrMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd228fJOsz5JBJuWwhqPsHya', 'NetErrMgr', __filename);
// framework/net/NetErrMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var errorcode_1 = require("./errorcode");
var Emitter_1 = require("../modules/Emitter");
var GameNet_1 = require("../modules/GameNet");
var ModuleMgr_1 = require("../modules/ModuleMgr");
var NetErrMgr = /** @class */ (function () {
    function NetErrMgr() {
    }
    NetErrMgr.getInstance = function () {
        return NetErrMgr._instance;
    };
    NetErrMgr.prototype.dealWithError = function (code) {
        if (code) {
            switch (code) {
                case errorcode_1.errorcode.ERR_LACK_ROLE:
                    Emitter_1.default.getInstance().emit("goToCreateRole");
                    break;
                case errorcode_1.errorcode.ERR_TOKEN_ERR:
                    GameNet_1.default.getInstance().clear();
                    Emitter_1.default.getInstance().emit("platTokenError");
                    break;
                default:
                    ModuleMgr_1.default.getInstance().showTipBox(errorcode_1.errortip[code] || "未知错误!");
            }
            return true;
        }
        return false;
    };
    //单例处理
    NetErrMgr._instance = new NetErrMgr();
    return NetErrMgr;
}());
exports.default = NetErrMgr;

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
        //# sourceMappingURL=NetErrMgr.js.map
        