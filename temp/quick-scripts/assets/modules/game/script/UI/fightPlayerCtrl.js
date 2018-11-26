(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/UI/fightPlayerCtrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df14bggDVVLN4vwM9lb/Gm9', 'fightPlayerCtrl', __filename);
// modules/game/script/UI/fightPlayerCtrl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var gameConfig_1 = require("../common/gameConfig");
var fightCardBtn_1 = require("./fightCardBtn");
// import HkPhysics from "../physics/hkPhysics";
// let hkPhysics = HkPhysics.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
var fightEvent = gameConfig_1.default.fightEvent;
var emitter = Emitter_1.default.getInstance();
var PlayerCtrlData_1 = require("../modles/PlayerCtrlData");
var playerCtrlData = PlayerCtrlData_1.default.getInstance();
// 到我的回合时显示的ui
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// TODO 
// 1,仰角限制
// 2,世界坐标等转换情况
// 3,显示隐藏 ui效果
// 4，圆形操作区域问题
var fightPlayerUi = /** @class */ (function (_super) {
    __extends(fightPlayerUi, _super);
    function fightPlayerUi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 左按键
        _this.leftBtn = null;
        // 右按键
        _this.rightBtn = null;
        // 飞机按钮
        _this.planeBtn = null;
        // 卡牌列表
        _this.cardListNode = null;
        // 最后一张卡牌
        _this.lastCard = null;
        _this.cardPrefab = null;
        // 卡牌id找对应的图集
        // 测试用的
        _this.cardSpriteFrame = null;
        // 当前飞机状态
        _this.nowPlane = 0;
        return _this;
    }
    fightPlayerUi.prototype.onLoad = function () {
        var _this = this;
        // 长按发送移动数据
        this.leftBtn.on(cc.Node.EventType.TOUCH_START, function () {
            _this.setDirection(-1);
        });
        this.rightBtn.on(cc.Node.EventType.TOUCH_START, function () {
            _this.setDirection(1);
        });
        this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.cancleDirection, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_END, this.cancleDirection, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.cancleDirection, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_END, this.cancleDirection, this);
        this.planeBtn.on(cc.Node.EventType.TOUCH_START, this.setPlane, this);
        // 触发卡牌的删除
        emitter.on(fightEvent.onCardChange, this.onCardChange, this);
        // TODO 触发卡牌的收缩
    };
    // 设置运动方向
    fightPlayerUi.prototype.setDirection = function (direction) {
        playerCtrlData.direction = direction;
    };
    // 取消长按
    fightPlayerUi.prototype.cancleDirection = function () {
        playerCtrlData.direction = 0;
    };
    // TODO 重置当前飞机 设置飞机
    fightPlayerUi.prototype.setPlane = function () {
        (this.nowPlane == 0) ? (this.nowPlane = 1) : (this.nowPlane = 0);
        playerCtrlData.changePlane = this.nowPlane;
    };
    // 1-6 张卡牌数组
    fightPlayerUi.prototype.onCardChange = function (cards) {
        // TODO 找到卡牌对应的图片
        // 取出最后一张卡牌作为下一张
        this.clearCardList();
        if (cards.length <= 0) {
            return;
        }
        var lastCard = cards.splice(cards.length - 1, 1)[0];
        for (var i = 0; i < cards.length; i++) {
            var cardId = cards[i];
            var node = cc.instantiate(this.cardPrefab);
            var script = node.getComponent(fightCardBtn_1.default);
            // 测试表现  先写死了
            node.width = 110;
            node.height = 160;
            node.x = -i * 120;
            // 测试数据
            script.init({
                cardId: cardId,
                spriteFrame: this.cardSpriteFrame,
                sendUseCard: this.sendUseCard.bind(this)
            });
            node.parent = this.cardListNode;
        }
    };
    // 使用卡牌
    fightPlayerUi.prototype.sendUseCard = function (cardId) {
        playerCtrlData.userCard = cardId;
    };
    // 清理卡牌列表
    fightPlayerUi.prototype.clearCardList = function () {
        var children = this.cardListNode.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            child.destroy();
        }
    };
    fightPlayerUi.prototype.onDestroy = function () {
        this.leftBtn.off(cc.Node.EventType.TOUCH_START, this.setDirection, -1);
        this.rightBtn.off(cc.Node.EventType.TOUCH_START, this.setDirection, 1);
        this.leftBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.cancleDirection);
        this.leftBtn.off(cc.Node.EventType.TOUCH_END, this.cancleDirection);
        this.rightBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.cancleDirection);
        this.rightBtn.off(cc.Node.EventType.TOUCH_END, this.cancleDirection);
        this.planeBtn.off(cc.Node.EventType.TOUCH_START, this.setPlane);
    };
    __decorate([
        property(cc.Node)
    ], fightPlayerUi.prototype, "leftBtn", void 0);
    __decorate([
        property(cc.Node)
    ], fightPlayerUi.prototype, "rightBtn", void 0);
    __decorate([
        property(cc.Node)
    ], fightPlayerUi.prototype, "planeBtn", void 0);
    __decorate([
        property(cc.Node)
    ], fightPlayerUi.prototype, "cardListNode", void 0);
    __decorate([
        property(cc.Node)
    ], fightPlayerUi.prototype, "lastCard", void 0);
    __decorate([
        property(cc.Prefab)
    ], fightPlayerUi.prototype, "cardPrefab", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], fightPlayerUi.prototype, "cardSpriteFrame", void 0);
    fightPlayerUi = __decorate([
        ccclass
    ], fightPlayerUi);
    return fightPlayerUi;
}(cc.Component));
exports.default = fightPlayerUi;

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
        //# sourceMappingURL=fightPlayerCtrl.js.map
        