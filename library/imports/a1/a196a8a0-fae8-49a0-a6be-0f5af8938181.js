"use strict";
cc._RF.push(module, 'a196aig+uhJoKa+D1r4k4GB', 'PlayerCtrlData');
// modules/game/script/modles/PlayerCtrlData.ts

Object.defineProperty(exports, "__esModule", { value: true });
/*
author: 黄凯
日期:2018-11-19
*/
// 玩家操作数据模型 发给服务器的数据格式 这个可以是单利
var fightPlayerModule = /** @class */ (function () {
    function fightPlayerModule() {
        this.shootPoi = {};
        this.direction = 0;
        this.elevation = -1;
        this.userCard = -1;
        this.changePlane = -1;
    }
    fightPlayerModule.getInstance = function () {
        return fightPlayerModule._instance;
    };
    // 发射炮弹
    fightPlayerModule.prototype.setShootPoi = function (poi) {
        this.shootPoi = poi;
    };
    // 获取操作
    fightPlayerModule.prototype.getData = function () {
        var obj = {};
        if (this.direction !== 0) {
            obj["direction"] = this.direction;
        }
        if (this.elevation !== -1) {
            obj["elevation"] = this.elevation;
        }
        if (this.userCard !== -1) {
            obj["userCard"] = this.userCard;
        }
        if (this.changePlane !== -1) {
            obj["changePlane"] = this.changePlane;
        }
        if (this.shootPoi.x || this.shootPoi.y) {
            obj["shootPoi"] = this.shootPoi;
        }
        // 清空所有数据
        // this.clear();
        return obj;
    };
    fightPlayerModule.prototype.clear = function () {
        this.shootPoi = {
            x: 0,
            y: 0
        };
        // this.direction = -1;
        this.elevation = -1;
        this.userCard = -1;
        this.changePlane = -1;
    };
    fightPlayerModule._instance = new fightPlayerModule();
    return fightPlayerModule;
}());
exports.default = fightPlayerModule;

cc._RF.pop();