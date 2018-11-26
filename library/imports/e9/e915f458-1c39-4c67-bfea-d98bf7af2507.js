"use strict";
cc._RF.push(module, 'e915fRYHDlMZ7/q2Yv3ryUH', 'hkPhysics');
// modules/game/script/physics/hkPhysics.ts

Object.defineProperty(exports, "__esModule", { value: true });
var gameConfig_1 = require("../common/gameConfig");
/*
author: 黄凯
日期:2018-11-19
*/
var physicsConfig = gameConfig_1.default.physicsConfig;
var hkPhysics = /** @class */ (function () {
    function hkPhysics() {
        this.bodies = [];
        this.gravity = physicsConfig.gravity;
        this.enabled = false;
    }
    hkPhysics.getInstance = function () {
        return hkPhysics._instance;
    };
    // 获取模拟效果
    hkPhysics.getBodyGuideLine = function (poi, force) {
        var newVec = [];
        var body = {
            force: {
                x: 0,
                y: 0
            },
            lineVelocity: {
                x: force.x,
                y: force.y
            },
            position: {
                x: poi.x,
                y: poi.y
            },
            mass: 1,
        };
        for (var i = 0; i < 30; i++) {
            hkPhysics.doBodyMonitor(body);
            if (i % 3 == 0) {
                newVec.push({
                    x: body.position.x,
                    y: body.position.y
                });
            }
        }
        return newVec;
    };
    hkPhysics.doBodyMonitor = function (body) {
        body.force.x += body.mass * physicsConfig.gravity.x;
        body.force.y += body.mass * physicsConfig.gravity.y;
        body.lineVelocity.x += body.force.x / body.mass;
        body.lineVelocity.y += body.force.y / body.mass;
        body.position.x += Math.round(body.lineVelocity.x / physicsConfig.physicsScale);
        body.position.y += Math.round(body.lineVelocity.y / physicsConfig.physicsScale);
    };
    // 添加刚体
    hkPhysics.prototype.addBody = function (body) {
        this.bodies.push(body);
    };
    // 删除刚体
    hkPhysics.prototype.removeBody = function (body) {
        var index = this.bodies.indexOf(body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
        }
    };
    hkPhysics.prototype.netFrame = function () {
        if (!this.enabled) {
            return;
        }
        var count = this.bodies.length;
        // 遍历所有的body
        for (var i = count - 1; i >= 0; i--) {
            var body = this.bodies[i];
            body.step();
        }
    };
    hkPhysics._instance = new hkPhysics();
    return hkPhysics;
}());
exports.default = hkPhysics;

cc._RF.pop();