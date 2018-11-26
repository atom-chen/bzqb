"use strict";
cc._RF.push(module, '4aa562fqC9MB47GnGcvHDAH', 'fightBaseMissile');
// modules/game/script/missile/fightBaseMissile.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var gameConfig_1 = require("../common/gameConfig");
var hkRigidBody_1 = require("../physics/hkRigidBody");
var wmCollisionManager = require("hkCollisionManager");
var emitter = Emitter_1.default.getInstance();
var fightEvent = gameConfig_1.default.fightEvent, colliderConfig = gameConfig_1.default.colliderConfig, netFrame = gameConfig_1.default.netFrame;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var hz = 1000 / netFrame;
/*
author: 黄凯
日期:2018-11-19
*/
// 基础导弹
var fightBaseMissile = /** @class */ (function (_super) {
    __extends(fightBaseMissile, _super);
    function fightBaseMissile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 延迟时间
        _this.delay = 0;
        return _this;
    }
    // 显示
    fightBaseMissile.prototype.onEnable = function () {
        emitter.on(fightEvent.netFrame, this.netFrame, this);
        emitter.on(fightEvent.netUpdate, this.netUpdate, this);
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            wmCollisionManager.addCollider(collider);
        }
    };
    // 隐藏
    fightBaseMissile.prototype.onDisable = function () {
        this.remove();
    };
    fightBaseMissile.prototype.onDestroy = function () {
        this.remove();
    };
    fightBaseMissile.prototype.remove = function () {
        emitter.off(fightEvent.netFrame, this);
        emitter.off(fightEvent.netUpdate, this);
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            wmCollisionManager.removeCollider(collider);
        }
        // console.log("onDisable")
    };
    // 设置真实坐标点
    fightBaseMissile.prototype.setRealPoi = function (poi) {
        poi.x = Math.round(poi.x);
        poi.y = Math.round(poi.y);
        this.node["realPoi"].x = poi.x;
        this.node["realPoi"].y = poi.y;
        this.node.x = poi.x;
        this.node.y = poi.y;
        this.oldX = poi.x;
        this.oldY = poi.y;
    };
    // 获取真实坐标点
    fightBaseMissile.prototype.getRealPoi = function () {
        return this.node["realPoi"];
    };
    // 初始化
    // 导弹数据  父节点 通过是否延迟绑定相机 
    fightBaseMissile.prototype.init = function (shootData, fatherNode, shootPoi, delay) {
        if (delay === void 0) { delay = 0; }
        this.frameCount = 0;
        this.rigidBody = this.getComponent(hkRigidBody_1.default);
        this.node["realPoi"] = {};
        this.setRealPoi(shootData.startPoi);
        // this.node.x = shootData.startPoi.x;
        // this.node.y = shootData.startPoi.y;
        // this.node["realPoi"].x = Math.round(shootData.startPoi.x);
        // this.node["realPoi"].y = Math.round(shootData.startPoi.y);
        this.power = shootData.power;
        this.seatId = shootData.seatId;
        this.node.parent = fatherNode;
        this.ellipseRange = shootData.ellipseRange;
        this.missileBuffType = shootData.missileBuffType;
        // 如果不是延迟炮弹 立即发射
        if (delay === 0) {
            this.rigidBody.setLineVelocity(shootPoi);
            this.isBindCarame = true;
        }
        else {
            // 延迟炮弹
            this.node.opacity = 0;
            this.delay = delay;
            this.shootPoi = shootPoi;
            this.fatherNode = fatherNode;
            this.rigidBody.bodyEnable = false;
        }
    };
    // 和地图碰撞时
    fightBaseMissile.prototype.onMapCollider = function () {
    };
    // 炮弹死亡 是否是爆炸了
    fightBaseMissile.prototype.dead = function (isBoomType, isPlane) {
        if (isPlane === void 0) { isPlane = false; }
        // console.log("isPlane+++++",isPlane)
        emitter.emit(fightEvent.onMissileDead, this, isBoomType, isPlane);
    };
    // 飞出场景 碰撞回调
    fightBaseMissile.prototype.wmCollisionExit = function (otherCollider, collider) {
        // console.log("otherCollider.tag:",otherCollider.node.name,"collider:",collider.node.name);
        switch (otherCollider.tag) {
            case colliderConfig.bgBound:
                // TODO 删除导弹
                this.dead(false, false);
                break;
        }
    };
    // 网络帧数驱动
    fightBaseMissile.prototype.netFrame = function () {
        // 如果绑定相机
        if (this.isBindCarame) {
            emitter.emit(fightEvent.setNowLerpPoi, this.getRealPoi());
        }
        // 如果有延迟
        if (this.delay) {
            this.delay--;
            if (this.delay === 0) {
                this.delayMissile();
            }
        }
        else {
            this.frameCount++;
        }
        // 插值
        var realPoi = this.getRealPoi();
        if (this.node && realPoi) {
            this.nowFrameTime = +new Date();
            var x = realPoi.x;
            var y = realPoi.y;
            this.setRealPoi(this.node);
            this.node.x = x;
            this.node.y = y;
            this.oldX = x;
            this.oldY = y;
        }
    };
    // 延迟导弹的发射
    fightBaseMissile.prototype.delayMissile = function () {
        this.node.opacity = 255;
        this.rigidBody.bodyEnable = true;
        this.rigidBody.setLineVelocity(this.shootPoi);
    };
    // TODO 导弹插值运算
    fightBaseMissile.prototype.netUpdate = function (dt) {
        var realPoi = this.getRealPoi();
        if (realPoi) {
            if (this.nowFrameTime) {
                var sd = ((+new Date()) - this.nowFrameTime) / hz;
                sd > 1 && (sd = 1);
                this.node.x = (realPoi.x - this.oldX) * sd + this.oldX;
                this.node.y = (realPoi.y - this.oldY) * sd + this.oldY;
            }
        }
    };
    fightBaseMissile = __decorate([
        ccclass
    ], fightBaseMissile);
    return fightBaseMissile;
}(cc.Component));
exports.default = fightBaseMissile;

cc._RF.pop();