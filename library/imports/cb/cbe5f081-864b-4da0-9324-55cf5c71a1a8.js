"use strict";
cc._RF.push(module, 'cbe5fCBhktNoJMkVc9ccaGo', 'BaseBodyFight');
// modules/game/script/baseClass/BaseBodyFight.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var gameConfig_1 = require("../common/gameConfig");
var wmCollisionManager = require("hkCollisionManager");
var fightEvent = gameConfig_1.default.fightEvent;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/*
author: 黄凯
日期:2018-11-19
*/
var BaseBodyFight = /** @class */ (function (_super) {
    __extends(BaseBodyFight, _super);
    function BaseBodyFight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // constructor() {
    // super()
    // }
    // realPoi:any;
    BaseBodyFight.prototype.onEnable = function () {
        Emitter_1.default.getInstance().on(fightEvent.netFrame, this.netFrame, this);
        Emitter_1.default.getInstance().on(fightEvent.netUpdate, this.netUpdate, this);
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            wmCollisionManager.addCollider(collider);
        }
    };
    // 网络帧数驱动
    BaseBodyFight.prototype.netFrame = function () {
    };
    // TODO 插值算法
    BaseBodyFight.prototype.netUpdate = function (dt) {
        if (this.node["realPoi"]) {
            this.node.position = this.node["realPoi"];
        }
    };
    BaseBodyFight.prototype.onDisable = function () {
        Emitter_1.default.getInstance().off(fightEvent.netFrame, this);
        Emitter_1.default.getInstance().off(fightEvent.netUpdate, this);
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            wmCollisionManager.removeCollider(collider);
        }
    };
    BaseBodyFight = __decorate([
        ccclass
    ], BaseBodyFight);
    return BaseBodyFight;
}(cc.Component));
exports.default = BaseBodyFight;

cc._RF.pop();