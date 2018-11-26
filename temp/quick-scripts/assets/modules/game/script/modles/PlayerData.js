(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/modles/PlayerData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e90d1DX6ZRLY7r/54a/NimH', 'PlayerData', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PlayerData.js.map
        