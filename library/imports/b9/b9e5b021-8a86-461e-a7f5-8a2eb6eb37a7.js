"use strict";
cc._RF.push(module, 'b9e5bAhioZGHqf1ii626zen', 'ShootData');
// modules/game/script/modles/ShootData.ts

Object.defineProperty(exports, "__esModule", { value: true });
// ShootData.ts
/*
author: 黄凯
日期:2018-11-19
*/
// import config from "../common/gameConfig";
// 发射导弹的一些必要参数
var ShootData = /** @class */ (function () {
    function ShootData() {
    }
    // 初始化导弹数据结构
    ShootData.prototype.init = function (dataObj) {
        this.missileType = dataObj.missileType;
        this.shootPoi = dataObj.shootPoi;
        this.startPoi = dataObj.startPoi;
        this.power = dataObj.power;
        this.seatId = dataObj.seatId;
        this.missileBuffType = dataObj.missileBuffType;
        this.ellipseRange = dataObj.ellipseRange;
        this.continuousFire = dataObj.continuousFire;
        this.divisionFire = dataObj.divisionFire;
    };
    return ShootData;
}());
exports.default = ShootData;

cc._RF.pop();