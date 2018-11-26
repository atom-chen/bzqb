(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/cardFactory/fightCardFactory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96c79UpL4JNmr9Vw/tQUPcl', 'fightCardFactory', __filename);
// modules/game/script/cardFactory/fightCardFactory.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
/*
author: 黄凯
日期:2018-11-22
*/
var emitter = Emitter_1.default.getInstance();
// 战斗卡牌处理
var gameConfig_1 = require("../common/gameConfig");
var netFrame = gameConfig_1.default.netFrame, fightEvent = gameConfig_1.default.fightEvent, missileType = gameConfig_1.default.missileType, waitTime = gameConfig_1.default.waitTime, playerConfig = gameConfig_1.default.playerConfig, missileBuffType = gameConfig_1.default.missileBuffType;
var cardFactory = /** @class */ (function () {
    function cardFactory() {
    }
    cardFactory.prototype.doMain = function (playerModel, card) {
        // 测试
        switch (card) {
            // 三分裂
            case 1:
                playerModel.addDivisionFire();
                break;
            // 二连射
            case 2:
                playerModel.addContinuousFire(2);
                break;
            // 三连射
            case 3:
                playerModel.addContinuousFire(3);
                break;
            // 攻击力加强100
            case 4:
                playerModel.addAtkPower(100);
                break;
        }
    };
    return cardFactory;
}());
exports.default = new cardFactory();

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
        //# sourceMappingURL=fightCardFactory.js.map
        