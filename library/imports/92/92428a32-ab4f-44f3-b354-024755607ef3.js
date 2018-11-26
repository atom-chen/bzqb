"use strict";
cc._RF.push(module, '92428oyq09E87NUAkdVYH7z', 'shop');
// modules/plaza/script/shop/shop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var shopMgr_1 = require("../../../../manager/public/shopMgr");
var enums_1 = require("../../../../manager/enums");
var GameNet_1 = require("../../../../framework/modules/GameNet");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-05 20:15:41
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var shopMgr = shopMgr_1.default.getInstance();
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.shopState = null;
        _this.boxShop = [];
        _this.cardShop = [];
        _this.goldShop = [];
        _this.crystalShop = [];
        _this.diamondShop = [];
        //刷新时间
        _this.serverDelay = null;
        _this.refreshEndTime = null;
        _this.refreshTimeText = null;
        _this.refreshTimesText = null;
        return _this;
    }
    Model.prototype.initData = function () {
        this.shopState = shopMgr.shopState;
        this.initBoxData();
        this.initMoneyData();
        this.initCrystalData();
        this.initDiamondData();
        this.initCardData();
    };
    Model.prototype.initBoxData = function () {
        this.boxShop = shopMgr.boxShop;
    };
    Model.prototype.initCardData = function () {
        this.cardShop = shopMgr.cardShop;
    };
    Model.prototype.initMoneyData = function () {
        this.goldShop = shopMgr.goldShop;
    };
    Model.prototype.initCrystalData = function () {
        this.crystalShop = shopMgr.crystalShop;
    };
    Model.prototype.initDiamondData = function () {
        this.diamondShop = shopMgr.diamondShop;
    };
    Model.prototype.initRefreshTime = function () {
        this.serverDelay = GameNet_1.default.getInstance().getServerDelay();
        this.refreshEndTime = shopMgr.cardShopRefreshTime + (enums_1.enums.Shop_RefreshTime * 1000);
        console.log(shopMgr.cardShopRefreshTime, enums_1.enums.Shop_RefreshTime);
    };
    Model.prototype.initRefreshTimes = function () {
        this.refreshTimesText = (20 - shopMgr.refreshCount) + "/20";
    };
    Model.prototype.setRefreshTime = function () {
        var serverTime = Date.now() + this.serverDelay;
        var refreshNeedTime = this.refreshEndTime - serverTime;
        refreshNeedTime = refreshNeedTime > 0 ? refreshNeedTime : 0;
        var hour = Math.floor((refreshNeedTime / 1000) / 3600);
        var minute = Math.floor(((refreshNeedTime / 1000) % 3600) / 60);
        var second = Math.floor((refreshNeedTime / 1000) % 60);
        var hours = hour >= 10 ? hour : '0' + hour;
        var minutes = minute >= 10 ? minute : '0' + minute;
        var seconds = second >= 10 ? second : '0' + second;
        // this.onlineBoxPercent = unlockNeedTime / (this.onlineBox.boxInfo.Onlinetime[this.onlineBox.boxTimes].time * 1000);
        this.refreshTimeText = hours + ":" + minutes + ":" + seconds;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            //在这里声明ui
            btn_box: ctrl.btn_box,
            btn_card: ctrl.btn_card,
            btn_money: ctrl.btn_money,
            btn_crystal: ctrl.btn_crystal,
            btn_diamond: ctrl.btn_diamond,
            btn_back: ctrl.btn_back,
            boxContent: ctrl.boxContent,
            boxShop: ctrl.boxShop,
            moenyContent: ctrl.moenyContent,
            goldShop: ctrl.goldShop,
            crystalShop: ctrl.crystalShop,
            crystalContent: ctrl.crystalContent,
            diamondContent: ctrl.diamondContent,
            diamondShop: ctrl.diamondShop,
            note_card: ctrl.note_card,
            cardShop: ctrl.cardShop,
            lab_refreshCost: ctrl.lab_refreshCost,
            refreshTimes: ctrl.refreshTimes,
            refreshTime: ctrl.refreshTime,
            btn_refresh: ctrl.btn_refresh,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    View.prototype.addPrefab = function (obj_node, obj_Prefab) {
        return this.addPrefabNode(obj_Prefab, obj_node);
    };
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.lab_refreshCost.getComponent(cc.Label).string = enums_1.enums.Shop_RefreshFee.toString();
    };
    View.prototype.showRefreshTime = function () {
        this.ui.refreshTimes.getComponent(cc.Label).string = this.model.refreshTimesText;
        this.ui.refreshTime.getComponent(cc.Label).string = this.model.refreshTimeText;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var ShopCtrl = /** @class */ (function (_super) {
    __extends(ShopCtrl, _super);
    function ShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //btn
        _this.btn_box = null;
        _this.btn_card = null;
        _this.btn_money = null;
        _this.btn_crystal = null;
        _this.btn_diamond = null;
        _this.btn_back = null;
        _this.btn_refresh = null;
        //note
        _this.boxContent = null;
        _this.moenyContent = null;
        _this.crystalContent = null;
        _this.diamondContent = null;
        _this.note_card = null;
        //Prefab
        _this.boxShop = null;
        _this.goldShop = null;
        _this.crystalShop = null;
        _this.diamondShop = null;
        _this.cardShop = null;
        //label
        _this.lab_refreshCost = null;
        _this.refreshTimes = null;
        _this.refreshTime = null;
        //声明ui组件end
        //这是ui组件的map,将ui和控制器或试图普通变量分离
        _this.boxList = [];
        _this.goldList = [];
        _this.crustalList = [];
        _this.diamondList = [];
        _this.cardList = [];
        return _this;
    }
    ShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initData();
    };
    //显示回调
    ShopCtrl.prototype.onEnable = function () {
    };
    //定义网络事件
    ShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.shop.refreshShop': this.refreshShop,
        };
    };
    //定义全局事件
    ShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    ShopCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_back, this.back, "返回");
        this.connect("click", this.ui.btn_refresh, this.refresh, "刷新");
    };
    ShopCtrl.prototype.updataCardShop = function () {
        this.model.initCardData();
        for (var i = 0; i < this.cardList.length; i++) {
            var obj = this.cardList[i];
            var data = this.model.cardShop;
            console.log(data[i]);
            obj.getComponent("cardShop").setData(data[i].price, data[i].amount, data[i].name, data[i].priceType);
        }
    };
    ShopCtrl.prototype.RefreshTiming = function () {
        var _this = this;
        this.schedule(function (timing) {
            _this.model.setRefreshTime();
            _this.view.showRefreshTime();
        }, 1);
    };
    //进入哪个商店
    ShopCtrl.prototype.choseShop = function (name) {
        cc.log(name, this.ui["btn_" + name].getComponent(cc.Toggle).isChecked);
        //cc.log(this.ui["btn_"+name].getComponent(cc.Toggle).isChecked)
        this.ui["btn_" + name].getComponent(cc.Toggle).isChecked = true;
    };
    ShopCtrl.prototype.initData = function () {
        this.model.initData();
        this.btn_box.getComponent(cc.Toggle).isChecked = false;
        console.log("---宝箱商店---", this.model.boxShop);
        this.ui.boxContent.width = (this.model.boxShop.length) * 320;
        for (var i = 0; i < this.model.boxShop.length; i++) {
            var boxShop = this.view.addPrefab(this.ui.boxContent, this.ui.boxShop);
            var cost = this.model.boxShop[i].price.amount;
            var gift = this.model.boxShop[i].gift[0].amount;
            boxShop.getComponent('boxShop').setData(cost, gift);
            boxShop.setPosition(cc.v2(160 + (i * 320), 0));
        }
        console.log("---卡片商店---", this.model.cardShop);
        for (var i = 0; i < this.model.cardShop.length; i++) {
            var cardShop = this.view.addPrefab(this.ui.note_card, this.ui.cardShop);
            var cost = this.model.cardShop[i].price;
            var count = this.model.cardShop[i].amount;
            var name = this.model.cardShop[i].name;
            var priceType = this.model.cardShop[i].priceType;
            var card = this.model.cardShop[i].card;
            cardShop.getComponent('cardShop').setData(cost, count, name, priceType);
            cardShop.setPosition(cc.v2(-250 + ((i % 2) * 350), 155 - (Math.floor(i / 2) * 140)));
            this.cardList.push(cardShop);
        }
        console.log("---金币商店---", this.model.goldShop);
        this.ui.moenyContent.width = (this.model.goldShop.length) * 320;
        for (var i = 0; i < this.model.goldShop.length; i++) {
            var goldShop = this.view.addPrefab(this.ui.moenyContent, this.ui.goldShop);
            var cost = this.model.goldShop[i].price.amount;
            var gift = this.model.goldShop[i].gift[0].amount;
            var reward = this.model.goldShop[i].reward[0].amount;
            var name = this.model.goldShop[i].name;
            goldShop.getComponent('goldShop').setData(cost, gift, reward, name);
            goldShop.setPosition(cc.v2(160 + (i * 320), 0));
        }
        console.log("---粉晶商店---", this.model.crystalShop);
        this.ui.crystalContent.width = (this.model.crystalShop.length) * 320;
        for (var i = 0; i < this.model.crystalShop.length; i++) {
            var crystalShop = this.view.addPrefab(this.ui.crystalContent, this.ui.crystalShop);
            var cost = this.model.crystalShop[i].price == null ? 0 : this.model.crystalShop[i].price.amount;
            var gift = this.model.crystalShop[i].gift ? this.model.crystalShop[i].gift[0].amount : 0;
            var reward = this.model.crystalShop[i].reward[0].amount;
            var name = this.model.crystalShop[i].name;
            crystalShop.getComponent('crystalShop').setData(cost, gift, reward, name);
            crystalShop.setPosition(cc.v2(160 + (i * 320), 0));
        }
        console.log("---砖石商店---", this.model.diamondShop);
        this.ui.diamondContent.width = (this.model.diamondShop.length) * 320;
        for (var i = 0; i < this.model.diamondShop.length; i++) {
            var diamondShop = this.view.addPrefab(this.ui.diamondContent, this.ui.diamondShop);
            var cost = this.model.diamondShop[i].Recharge;
            var gift = this.model.diamondShop[i].gift ? this.model.diamondShop[i].gift[0].amount : 0;
            var reward = this.model.diamondShop[i].reward[0].amount;
            var name = this.model.diamondShop[i].name;
            diamondShop.getComponent('diamondShop').setData(cost, gift, reward, name);
            diamondShop.setPosition(cc.v2(160 + (i * 320), 0));
        }
        this.choseShop(this.model.shopState);
        //计时
        this.model.initRefreshTime();
        this.model.setRefreshTime();
        this.model.initRefreshTimes();
        this.view.showRefreshTime();
        this.RefreshTiming();
    };
    //网络事件回调begin
    ShopCtrl.prototype.refreshShop = function () {
        this.updataCardShop();
        this.model.initRefreshTimes();
        this.view.showRefreshTime();
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    ShopCtrl.prototype.back = function () {
        this.closeModule("shop");
    };
    ShopCtrl.prototype.openPrefabCB = function (name) {
        return this.openSubModule(name);
    };
    ShopCtrl.prototype.refresh = function () {
        ModuleMgr_1.default.getInstance().showMsgBox({ content: "是否花费50进行商店刷新？", okcb: this.sendRefreshMsg });
    };
    ShopCtrl.prototype.sendRefreshMsg = function () {
        shopMgr.reqRefreshShop();
    };
    //end
    // update(dt) {}
    ShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_box", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_card", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_money", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_crystal", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_diamond", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_back", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "btn_refresh", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "boxContent", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "moenyContent", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "crystalContent", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "diamondContent", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "note_card", void 0);
    __decorate([
        property(cc.Prefab)
    ], ShopCtrl.prototype, "boxShop", void 0);
    __decorate([
        property(cc.Prefab)
    ], ShopCtrl.prototype, "goldShop", void 0);
    __decorate([
        property(cc.Prefab)
    ], ShopCtrl.prototype, "crystalShop", void 0);
    __decorate([
        property(cc.Prefab)
    ], ShopCtrl.prototype, "diamondShop", void 0);
    __decorate([
        property(cc.Prefab)
    ], ShopCtrl.prototype, "cardShop", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "lab_refreshCost", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "refreshTimes", void 0);
    __decorate([
        property(cc.Node)
    ], ShopCtrl.prototype, "refreshTime", void 0);
    ShopCtrl = __decorate([
        ccclass
    ], ShopCtrl);
    return ShopCtrl;
}(BaseCtrl_1.default));
exports.default = ShopCtrl;

cc._RF.pop();