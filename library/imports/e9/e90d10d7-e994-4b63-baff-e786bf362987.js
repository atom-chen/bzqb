"use strict";
cc._RF.push(module, 'e90d1DX6ZRLY7r/54a/NimH', 'PlayerData');
// modules/game/script/modles/PlayerData.ts

Object.defineProperty(exports, "__esModule", { value: true });
// fightPlayerData.ts
/*
author: 黄凯
日期:2018-11-19
*/
// 玩家初始化数据模型结构体
var PlayerData = /** @class */ (function () {
    // 初始的卡牌能量
    // cardPower:number;
    function PlayerData(playerData) {
        this.roleType = playerData.roleType;
        this.seatId = playerData.seatId;
        this.team = playerData.team;
        this.name = playerData.name;
        this.cardList = playerData.cardList;
        // this.cardPower = playerData.cardPower;
    }
    PlayerData.prototype.setPoi = function (poi) {
        this.realPoi = poi;
    };
    return PlayerData;
}());
exports.default = PlayerData;

cc._RF.pop();