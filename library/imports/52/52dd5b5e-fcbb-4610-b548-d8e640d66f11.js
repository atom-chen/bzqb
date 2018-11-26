"use strict";
cc._RF.push(module, '52dd5te/LtGELVI2OZA1m8R', 'effectBuffMgr');
// modules/game/script/effectBuff/effectBuffMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
// enum buffTypeEnum{
// 	// 通常
// 	"normal" = 0,
// 	// 治愈
// 	"cure" = 1,
// 	// 中毒
// 	"poisoning" = 2,
// 	// 灼烧
// 	"burn" = 3,
// }
var buffTypeEnum = {
    // 通常
    "normal": "0",
    // 治愈
    "cure": "1",
    // 中毒
    "poisoning": "2",
    // 灼烧
    "burn": "3",
};
// buff控制器
var buffEffectMgr = /** @class */ (function () {
    function buffEffectMgr() {
        this.buffEnum = {
            "1": 0,
            "2": 0,
            "3": 0
        };
    }
    // 施加buff
    buffEffectMgr.prototype.addBuff = function (buffType) {
        this.nowBuffType[buffType] = 2;
    };
    // 减去buff
    buffEffectMgr.prototype.subBuff = function (buffType) {
        this.nowBuffType[buffType] > 0 && (this.nowBuffType[buffType]--);
    };
    // buff 结算
    buffEffectMgr.prototype.buffSettle = function () {
        for (var buffType in this.nowBuffType) {
            var buffTimce = this.nowBuffType[buffType];
            if (buffTimce > 0) {
                // TODO buff效果计算
            }
        }
    };
    return buffEffectMgr;
}());
exports.default = buffEffectMgr;

cc._RF.pop();