"use strict";
cc._RF.push(module, 'c0900ml5T9M0oaA0CAxzjV6', 'hkRigidBody');
// modules/game/script/physics/hkRigidBody.ts

Object.defineProperty(exports, "__esModule", { value: true });
var hkPhysics_1 = require("./hkPhysics");
var hkPhysics = hkPhysics_1.default.getInstance();
var gameConfig_1 = require("../common/gameConfig");
/*
author: 黄凯
日期:2018-11-19
*/
var physicsConfig = gameConfig_1.default.physicsConfig;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// 简单的刚体
var rigidbody = /** @class */ (function (_super) {
    __extends(rigidbody, _super);
    // 监听真实值发生变化
    function rigidbody() {
        var _this = _super.call(this) || this;
        // 是否启用
        _this.bodyEnable = true;
        _this.mass = 1;
        _this.force = {
            x: 0,
            y: 0
        };
        _this.lineVelocity = {
            x: 0,
            y: 0
        };
        return _this;
    }
    // 设置线性速度
    rigidbody.prototype.setLineVelocity = function (vector) {
        this.lineVelocity.x = vector.x;
        this.lineVelocity.y = vector.y;
    };
    // 设置力度
    rigidbody.prototype.setForce = function (force) {
        this.force.x = force.x;
        this.force.y = force.y;
    };
    // 增量
    rigidbody.prototype.applyForce = function (force) {
        this.force.x += force.x;
        this.force.y += force.y;
    };
    // 增量
    rigidbody.prototype.applyLineVelocity = function (vector) {
        this.lineVelocity.x += vector.x;
        this.lineVelocity.y += vector.y;
    };
    rigidbody.prototype.onEnable = function () {
        if (hkPhysics) {
            hkPhysics.addBody(this);
        }
    };
    rigidbody.prototype.onDisable = function () {
        if (hkPhysics) {
            hkPhysics.removeBody(this);
        }
    };
    // 施加重力
    rigidbody.prototype.addGravity = function () {
        this.force.x = Math.round(this.force.x * 1000 + this.mass * (physicsConfig.gravity.x * 1000)) / 1000;
        this.force.y = Math.round(this.force.y * 1000 + this.mass * (physicsConfig.gravity.y * 1000)) / 1000;
    };
    // 立转化成速度
    rigidbody.prototype.addAllForce = function () {
        this.lineVelocity.x = Math.round(this.lineVelocity.x * 1000 + this.force.x / this.mass * 1000) / 1000;
        this.lineVelocity.y = Math.round(this.lineVelocity.y * 1000 + this.force.y / this.mass * 1000) / 1000;
    };
    // 运行计算
    rigidbody.prototype.step = function () {
        if (!this.bodyEnable) {
            return;
        }
        this.addGravity();
        this.addAllForce();
        if (this.node["realPoi"]) {
            this.node["realPoi"].x += Math.round(this.lineVelocity.x / physicsConfig.physicsScale);
            this.node["realPoi"].y += Math.round(this.lineVelocity.y / physicsConfig.physicsScale);
        }
        else {
            this.node.x += Math.round(this.lineVelocity.x / physicsConfig.physicsScale);
            this.node.y += Math.round(this.lineVelocity.y / physicsConfig.physicsScale);
        }
    };
    rigidbody = __decorate([
        ccclass
    ], rigidbody);
    return rigidbody;
}(cc.Component));
exports.default = rigidbody;

cc._RF.pop();