(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/physics/backGroundCollider.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3ba11wQbARDQY7ukpYIGk6y', 'backGroundCollider', __filename);
// modules/game/script/physics/backGroundCollider.ts

Object.defineProperty(exports, "__esModule", { value: true });
var hkCollisionManager = require("hkCollisionManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/*
author: 黄凯
日期:2018-11-19
*/
var backGroundCollider = /** @class */ (function (_super) {
    __extends(backGroundCollider, _super);
    function backGroundCollider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO 初始化场景大小
    backGroundCollider.prototype.init = function (size) {
        var collider = this.getComponent(cc.BoxCollider);
        if (!collider) {
            collider = this.addComponent(cc.BoxCollider);
        }
        collider.tag = 9;
        collider.size.width = size.x;
        collider.size.height = size.y;
        this.onEnable();
    };
    backGroundCollider.prototype.onEnable = function () {
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            hkCollisionManager.addCollider(collider);
        }
    };
    backGroundCollider.prototype.onDisable = function () {
        var collider = this.getComponent(cc.Collider);
        if (collider) {
            hkCollisionManager.removeCollider(collider);
        }
    };
    backGroundCollider = __decorate([
        ccclass
    ], backGroundCollider);
    return backGroundCollider;
}(cc.Component));
exports.default = backGroundCollider;

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
        //# sourceMappingURL=backGroundCollider.js.map
        