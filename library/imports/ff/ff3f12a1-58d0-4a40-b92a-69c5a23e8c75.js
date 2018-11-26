"use strict";
cc._RF.push(module, 'ff3f1KhWNBKQLkqacWiPox1', 'fightRandomSeed');
// modules/game/script/common/fightRandomSeed.ts

Object.defineProperty(exports, "__esModule", { value: true });
// fightUtil.ts
/*
author: 黄凯
日期:2018-11-19
*/
// 随机数控制
var randomMgr = /** @class */ (function () {
    function randomMgr() {
        this._seed = 0;
    }
    randomMgr.getInstance = function () {
        return randomMgr._instance;
    };
    randomMgr.prototype.init = function (seed) {
        this._seed = seed;
    };
    randomMgr.prototype.randomRange = function (min, max) {
        min = (typeof min !== "undefined") ? min : 0;
        max = (typeof max !== "undefined") ? max : 1;
        return min + this.random() * (max - min);
    };
    randomMgr.prototype.random = function () {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        return this._seed / 233280;
    };
    randomMgr._instance = new randomMgr();
    return randomMgr;
}());
exports.default = randomMgr;

cc._RF.pop();