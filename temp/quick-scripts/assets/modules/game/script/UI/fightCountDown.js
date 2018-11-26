(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/UI/fightCountDown.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4c6bauOolBEAKBuaL1/C/kT', 'fightCountDown', __filename);
// modules/game/script/UI/fightCountDown.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var emitter = Emitter_1.default.getInstance();
var gameConfig_1 = require("../common/gameConfig");
/*
author: 黄凯
日期:2018-11-19
*/
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var fightEvent = gameConfig_1.default.fightEvent;
var fightCountDown = /** @class */ (function (_super) {
    __extends(fightCountDown, _super);
    function fightCountDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
    }
    fightCountDown.prototype.onLoad = function () {
        emitter.on(fightEvent.showCountDown, this.showCountDown, this);
        emitter.on(fightEvent.hideCountDown, this.hideCountDown, this);
        emitter.on(fightEvent.updateCountDown, this.updateCountDown, this);
    };
    fightCountDown.prototype.showCountDown = function () {
        this.node.active = true;
    };
    fightCountDown.prototype.hideCountDown = function () {
        this.node.active = false;
    };
    fightCountDown.prototype.updateCountDown = function (num) {
        this.label.string = num;
    };
    fightCountDown.prototype.onDestroy = function () {
        emitter.off(fightEvent.showCountDown, this);
        emitter.off(fightEvent.hideCountDown, this);
        emitter.off(fightEvent.updateCountDown, this);
    };
    __decorate([
        property(cc.Label)
    ], fightCountDown.prototype, "label", void 0);
    fightCountDown = __decorate([
        ccclass
    ], fightCountDown);
    return fightCountDown;
}(cc.Component));
exports.default = fightCountDown;

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
        //# sourceMappingURL=fightCountDown.js.map
        