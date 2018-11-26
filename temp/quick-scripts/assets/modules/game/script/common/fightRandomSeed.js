(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/common/fightRandomSeed.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ff3f1KhWNBKQLkqacWiPox1', 'fightRandomSeed', __filename);
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
        //# sourceMappingURL=fightRandomSeed.js.map
        