"use strict";
cc._RF.push(module, 'a8a38wWS6dFha2VGcXQ6CEb', 'fightCardBtn');
// modules/game/script/UI/fightCardBtn.ts

/*
author: 黄凯
日期:2018-11-22
*/
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var fightPlayerUi = /** @class */ (function (_super) {
    __extends(fightPlayerUi, _super);
    function fightPlayerUi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.testText = null;
        return _this;
    }
    // 初始图片 id等
    fightPlayerUi.prototype.init = function (cardData) {
        // 测试数据 不存在就用1
        this.cardId = cardData.cardId;
        var sprite = this.getComponent(cc.Sprite);
        this.sendUseCard = cardData.sendUseCard;
        // 
        if (cardData.spriteFrame) {
            sprite.spriteFrame = cardData.spriteFrame;
        }
        this.testText.string = "id:" + this.cardId;
    };
    fightPlayerUi.prototype.onLoad = function () {
        // let btn = this.getComponent(cc.Button);
        this.node.on(cc.Node.EventType.TOUCH_START, this.clieckBtn, this);
    };
    fightPlayerUi.prototype.clieckBtn = function () {
        // 发送操作数据
        this.sendUseCard(this.cardId);
    };
    fightPlayerUi.prototype.onDestroy = function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.clieckBtn);
    };
    __decorate([
        property(cc.Label)
    ], fightPlayerUi.prototype, "testText", void 0);
    fightPlayerUi = __decorate([
        ccclass
    ], fightPlayerUi);
    return fightPlayerUi;
}(cc.Component));
exports.default = fightPlayerUi;

cc._RF.pop();