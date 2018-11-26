(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/effectBuff/effectBuffMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '52dd5te/LtGELVI2OZA1m8R', 'effectBuffMgr', __filename);
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
        //# sourceMappingURL=effectBuffMgr.js.map
        