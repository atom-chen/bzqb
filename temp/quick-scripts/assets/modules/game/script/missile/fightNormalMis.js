(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/missile/fightNormalMis.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '53ef2CxSFtM8qYEy70S2Ehc', 'fightNormalMis', __filename);
// modules/game/script/missile/fightNormalMis.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var fightBaseMissile_1 = require("./fightBaseMissile");
var gameConfig_1 = require("../common/gameConfig");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var emitter = Emitter_1.default.getInstance();
var fightEvent = gameConfig_1.default.fightEvent;
/*
author: 黄凯
日期:2018-11-19
*/
// 基础导弹
var fightNormalMis = /** @class */ (function (_super) {
    __extends(fightNormalMis, _super);
    function fightNormalMis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 初始化 炮弹
    fightNormalMis.prototype.init = function (shootData, fatherNode, shootPoi, delay) {
        if (delay === void 0) { delay = 0; }
        _super.prototype.init.call(this, shootData, fatherNode, shootPoi, delay);
    };
    // 和地图碰撞时
    fightNormalMis.prototype.onMapCollider = function () {
        this.dead(true, false);
    };
    // 碰撞回调
    fightNormalMis.prototype.wmCollisionEnter = function (otherCollider, collider) {
        // 防止打到自己
        if (this.frameCount < 3) {
            return;
        }
        this.dead(true, false);
    };
    // 网络帧
    fightNormalMis.prototype.netFrame = function () {
        _super.prototype.netFrame.call(this);
    };
    fightNormalMis = __decorate([
        ccclass
    ], fightNormalMis);
    return fightNormalMis;
}(fightBaseMissile_1.default));
exports.default = fightNormalMis;

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
        //# sourceMappingURL=fightNormalMis.js.map
        