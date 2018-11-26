"use strict";
cc._RF.push(module, 'cb5d0vHN2tCwoxeSMXRh0fG', 'guildsShopPanel');
// modules/plaza/script/guilds/guildsShopPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var shopMgr_1 = require("../../../../manager/public/shopMgr");
var enums_1 = require("../../../../manager/enums");
/*
author: 汤凯
日期:2018-11-22
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.guildShopInfo = shopMgr_1.default.getInstance().getGuildShopInfo();
        if (!_this.guildShopInfo) {
            shopMgr_1.default.getInstance().reqShopInfo(enums_1.enums.GuildShop_Card);
        }
        return _this;
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            pref_shopItem: ctrl.pref_shopItem,
            lbl_flushCost: ctrl.lbl_flushCost,
            lbl_honorValue: ctrl.lbl_honorValue,
            lbl_tickTime: ctrl.lbl_tickTime,
            btn_flush: ctrl.btn_flush,
            node_shopItemContent: ctrl.node_shopItemContent,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addShopItems();
    };
    View.prototype.addShopItems = function () {
        if (this.model.guildShopInfo && this.model.guildShopInfo.items) {
            for (var guildShopItemIdx = 0; guildShopItemIdx < this.model.guildShopInfo.items.length; guildShopItemIdx++) {
                var shopItemData = this.model.guildShopInfo.items[guildShopItemIdx];
                var prefabNode = cc.instantiate(this.ui.pref_shopItem);
                this.ui.node_shopItemContent.addChild(prefabNode);
                prefabNode.getComponent('cardShop').updateDateAndShowCardShop(shopItemData);
            }
        }
    };
    View.prototype.showTickTime = function (tickTime) {
        var hoursCube = Math.floor(tickTime / 3600);
        if (hoursCube >= 10) {
            hoursCube = hoursCube.toString();
        }
        else {
            hoursCube = '0' + hoursCube.toString();
        }
        var minutesCube = Math.floor(tickTime % 3600 / 60);
        if (minutesCube >= 10) {
            minutesCube = minutesCube.toString();
        }
        else {
            minutesCube = '0' + minutesCube.toString();
        }
        var secondsCube = Math.floor(tickTime % 60);
        if (secondsCube >= 10) {
            secondsCube = secondsCube.toString();
        }
        else {
            secondsCube = '0' + secondsCube.toString();
        }
        this.ui.lbl_tickTime.string = hoursCube + ":" + minutesCube + ":" + secondsCube;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsShopPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsShopPanelCtrl, _super);
    function GuildsShopPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.pref_shopItem = null;
        _this.lbl_flushCost = null;
        _this.lbl_honorValue = null;
        _this.lbl_tickTime = null;
        _this.btn_flush = null;
        _this.node_shopItemContent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsShopPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        //切换前后台需要对定时器进行清理和初始化
        this.schedule(this.countDown.bind(this), 2);
    };
    //定义网络事件
    GuildsShopPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.data.reqShopInfo': this.plaza_data_reqShopInfo,
        };
    };
    //定义全局事件
    GuildsShopPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsShopPanelCtrl.prototype.connectUi = function () {
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
        this.connect("click", this.ui.btn_flush, this.btnFlush.bind(this), "刷新列表");
    };
    GuildsShopPanelCtrl.prototype.countDown = function () {
        if (this.model.guildShopInfo) {
            var curTime = new Date().getTime();
            var timeGap = Math.floor((curTime - this.model.guildShopInfo.refreshTime) / 1000);
            if ((timeGap) >= enums_1.enums.GuildShop_RefreshTime) {
                shopMgr_1.default.getInstance().reqShopInfo(enums_1.enums.GuildShop_Card);
            }
            else {
                this.view.showTickTime(enums_1.enums.GuildShop_RefreshTime - timeGap);
            }
        }
    };
    GuildsShopPanelCtrl.prototype.btnFlush = function () {
        shopMgr_1.default.getInstance().refreshShop(enums_1.enums.GuildShop_Card);
    };
    GuildsShopPanelCtrl.prototype.plaza_data_reqShopInfo = function () {
        this.model.guildShopInfo = shopMgr_1.default.getInstance().getGuildShopInfo();
        this.view.addShopItems();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsShopPanelCtrl.prototype.onDestroy = function () {
        this.unschedule(this.countDown);
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Prefab)
    ], GuildsShopPanelCtrl.prototype, "pref_shopItem", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsShopPanelCtrl.prototype, "lbl_flushCost", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsShopPanelCtrl.prototype, "lbl_honorValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsShopPanelCtrl.prototype, "lbl_tickTime", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsShopPanelCtrl.prototype, "btn_flush", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsShopPanelCtrl.prototype, "node_shopItemContent", void 0);
    GuildsShopPanelCtrl = __decorate([
        ccclass
    ], GuildsShopPanelCtrl);
    return GuildsShopPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsShopPanelCtrl;

cc._RF.pop();