(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/baseClass/BaseMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3cc4dI6ntNGI7C24I252Qdn', 'BaseMgr', __filename);
// framework/baseClass/BaseMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameNet_1 = require("../modules/GameNet");
var ModuleMgr_1 = require("../modules/ModuleMgr");
var Emitter_1 = require("../modules/Emitter");
var Loader_1 = require("../modules/Loader");
//基础的管理器
var BaseMgr = /** @class */ (function () {
    function BaseMgr() {
        Emitter_1.default.getInstance().registerRoute(this);
        this.routes = {};
    }
    BaseMgr.prototype.dealResp = function (route, msg) {
        if (this.routes[route])
            this.routes[route].call(this, msg);
    };
    //发送全局事件
    BaseMgr.prototype.gemit = function (event) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var _a;
        return (_a = Emitter_1.default.getInstance()).emit.apply(_a, [event].concat(arg));
    };
    BaseMgr.prototype.send_msg = function (route, msg) {
        return GameNet_1.default.getInstance().send_msg(route, msg);
    };
    BaseMgr.prototype.loadConfig = function (configName) {
        return Loader_1.default.getInstance().loadConfig("config/" + configName);
    };
    BaseMgr.prototype.getConfigSync = function (configName) {
        var url = ModuleMgr_1.default.getInstance().getResUrl("config", configName);
        return Loader_1.default.getInstance().getRes(url, cc.JsonAsset);
    };
    /**
     * 打开子模块
     * @param moduleName 模块名
     */
    BaseMgr.prototype.openSubModule = function (moduleName, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        return ModuleMgr_1.default.getInstance().openSubModule(moduleName, isPublic);
    };
    BaseMgr.prototype.closeModule = function (moduleName) {
        ModuleMgr_1.default.getInstance().closeModule(moduleName);
    };
    /**
     * 切换场景
     * @param sceneName 场景名
     */
    BaseMgr.prototype.switchScene = function (sceneName) {
        ModuleMgr_1.default.getInstance().switchScene(sceneName);
    };
    BaseMgr.prototype.destroy = function () {
        Emitter_1.default.getInstance().unregisterRoute(this);
    };
    return BaseMgr;
}());
exports.default = BaseMgr;

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
        //# sourceMappingURL=BaseMgr.js.map
        