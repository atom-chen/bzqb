"use strict";
cc._RF.push(module, '50d0eFzQQhFNJpd4/Xiphcp', 'boomCollider');
// modules/game/script/physics/boomCollider.ts

Object.defineProperty(exports, "__esModule", { value: true });
var hkCollisionManager = require("hkCollisionManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var boomType = {};
/*
author: 黄凯
日期:2018-11-19
*/
var boomCollider = /** @class */ (function (_super) {
    __extends(boomCollider, _super);
    function boomCollider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO 初始化场景大小
    boomCollider.prototype.init = function (width) {
        var collider = this.getComponent(cc.PolygonCollider);
        if (!collider) {
            collider = this.addComponent(cc.PolygonCollider);
        }
        collider.tag = 8;
        var points = this.createPoint(width);
        collider.points = points;
        this.onEnable();
    };
    // 计算points点为信息
    boomCollider.prototype.createPoint = function (width) {
        var height = Math.round(width / 3);
        var poi1 = {
            x: -height,
            y: -width
        };
        var poi2 = {
            x: height,
            y: -width
        };
        var poi3 = {
            x: width,
            y: 0
        };
        var poi4 = {
            x: height,
            y: height
        };
        var poi5 = {
            x: -height,
            y: height
        };
        var poi6 = {
            x: -width,
            y: 0
        };
        var points = [];
        points.push(poi1);
        points.push(poi2);
        points.push(poi3);
        points.push(poi4);
        points.push(poi5);
        points.push(poi6);
        return points;
    };
    boomCollider.prototype.onEnable = function () {
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            hkCollisionManager.addCollider(collider);
        }
    };
    boomCollider.prototype.onDisable = function () {
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            hkCollisionManager.removeCollider(collider);
        }
    };
    boomCollider = __decorate([
        ccclass
    ], boomCollider);
    return boomCollider;
}(cc.Component));
exports.default = boomCollider;

cc._RF.pop();