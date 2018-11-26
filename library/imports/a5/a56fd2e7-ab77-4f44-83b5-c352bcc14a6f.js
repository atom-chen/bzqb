"use strict";
cc._RF.push(module, 'a56fdLnq3dPRIO1w1K8wUpv', 'fightCameraMgr');
// modules/game/script/carame/fightCameraMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var emitter = Emitter_1.default.getInstance();
var gameConfig_1 = require("../common/gameConfig");
var fightEvent = gameConfig_1.default.fightEvent;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/*
author: 黄凯
日期:2018-11-19
*/
// TODO 初始化包围盒
// TODO 滑动屏幕
var fightCameraMgr = /** @class */ (function (_super) {
    __extends(fightCameraMgr, _super);
    function fightCameraMgr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    fightCameraMgr.prototype.setNowAABB = function (ratio) {
        // 设置包围盒限制 TODO
        var size = {
            x: 2340 / 2,
            y: 1080 / 2
        };
        var winSize = {
            x: (cc.winSize.width / 2 + 20) / ratio,
            y: (cc.winSize.height / 2 + 20) / ratio
        };
        this.cameraAABB = {
            top: size.y - winSize.y,
            bottom: -size.y + winSize.y,
            left: -size.x + winSize.x,
            right: size.x - winSize.x
        };
        // console.log("this.cameraAABB",this.cameraAABB)
    };
    fightCameraMgr.prototype.onLoad = function () {
        this.nowLerpPoi = new cc.Vec2(this.node.x, this.node.y);
        this.cameraNode = this.getComponent(cc.Camera);
        this.nowZoomRatio = 1;
        // 绑定相机趋近事件
        emitter.on(fightEvent.setNowLerpPoi, this.setNowLerpPoi, this);
        emitter.on(fightEvent.setZoomRatio, this.setZoomRatio, this);
        this.setNowAABB(1);
    };
    // 设置现行插值
    fightCameraMgr.prototype.setNowLerpPoi = function (poi) {
        this.nowLerpPoi = new cc.Vec2(poi.x, poi.y);
        if (this.nowLerpPoi.y > this.cameraAABB.top) {
            this.nowLerpPoi.y = this.cameraAABB.top;
        }
        else if (this.nowLerpPoi.y < this.cameraAABB.bottom) {
            this.nowLerpPoi.y = this.cameraAABB.bottom;
        }
        if (this.nowLerpPoi.x > this.cameraAABB.right) {
            this.nowLerpPoi.x = this.cameraAABB.right;
        }
        else if (this.nowLerpPoi.x < this.cameraAABB.left) {
            this.nowLerpPoi.x = this.cameraAABB.left;
        }
    };
    // 设置焦距
    fightCameraMgr.prototype.setZoomRatio = function (num) {
        num < 0.8 && (num = 0.8);
        this.nowZoomRatio = num;
        this.setNowAABB(num);
    };
    // 相机的渐进
    fightCameraMgr.prototype.update = function (dt) {
        if (this.nowLerpPoi) {
            this.node.position = this.node.position.lerp(this.nowLerpPoi, 0.05);
        }
        if (Math.abs(this.cameraNode.zoomRatio - this.nowZoomRatio) > 0.02) {
            this.cameraNode.zoomRatio += (this.nowZoomRatio - this.cameraNode.zoomRatio) * 0.02;
        }
    };
    fightCameraMgr.prototype.onDestroy = function () {
        emitter.off(fightEvent.setNowLerpPoi, this);
        emitter.off(fightEvent.setZoomRatio, this);
    };
    fightCameraMgr = __decorate([
        ccclass
    ], fightCameraMgr);
    return fightCameraMgr;
}(cc.Component));
exports.default = fightCameraMgr;

cc._RF.pop();