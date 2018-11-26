"use strict";
cc._RF.push(module, 'd39abSdbH1HCZ/XuzE9QEQB', 'cardShop');
// modules/plaza/script/shop/cardShop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var tableMgr_1 = require("../../../../manager/public/tableMgr");
/*
author: 蒙磊
日期:2018-11-15 10:31:05
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.initData();
        return _this;
    }
    Model.prototype.initData = function () {
        this.cost = ctrl.cost;
        this.count = ctrl.count;
        this.priceType = ctrl.priceType;
        this.name = ctrl.name;
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
            lab_name: ctrl.lab_name,
            lab_cost: ctrl.lab_cost,
            lab_count: ctrl.lab_count,
            sp_price: ctrl.sp_price,
            sp_SpriteFrame: ctrl.sp_SpriteFrame,
            cardBuyShow: ctrl.cardBuyShow,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        if (this.model.cost) {
            this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), this.model.cost.toString());
        }
        if (this.model.count) {
            this.showLabelString(this.ui.lab_count.getComponent(cc.Label), 'X' + this.model.count);
        }
        if (this.model.name) {
            this.showLabelString(this.ui.lab_name.getComponent(cc.Label), this.model.name);
        }
        if (this.model.priceType != null) {
            this.ui.sp_price.spriteFrame = this.ui.sp_SpriteFrame[this.model.priceType - 1];
        }
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    View.prototype.addPrefab = function (obj_node, obj_Prefab) {
        return this.addPrefabNode(obj_Prefab, obj_node);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var CardShopCtrl = /** @class */ (function (_super) {
    __extends(CardShopCtrl, _super);
    function CardShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label
        _this.lab_cost = null;
        _this.lab_name = null;
        _this.lab_count = null;
        //sprite
        _this.sp_price = null;
        //SpriteFrame
        _this.sp_SpriteFrame = [cc.SpriteFrame];
        //Prefab
        _this.cardBuyShow = null;
        return _this;
    }
    CardShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    CardShopCtrl.prototype.setData = function (cost, count, name, priceType) {
        if (this.view) {
            this.model.cost = cost;
            this.model.count = count;
            this.model.name = name;
            this.model.priceType = priceType;
            this.view.initUi();
        }
        else {
            this.cost = cost;
            this.count = count;
            this.name = name;
            this.priceType = priceType;
        }
    };
    //定义网络事件
    CardShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    CardShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    CardShopCtrl.prototype.connectUi = function () {
        this.connect("click", this.node.getComponent(cc.Button), this.buyCard, "购买特技");
    };
    CardShopCtrl.prototype.updateDateAndShowCardShop = function (data) {
        var card = tableMgr_1.default.getInstance().search('teji_teji', { id: data.itemId });
        this.model.cost = data.price;
        this.model.count = data.amount;
        this.model.name = card.name;
        this.model.priceType = 2;
        this.view.initUi();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    CardShopCtrl.prototype.buyCard = function () {
        //this.addPrefab()
        //ModuleMgr.getInstance().showMsgBox({ content: `确定要花费${this.model.cost}购买特技：${this.model.name},X${this.model.count}?` })
    };
    //end
    // update(dt) {}
    CardShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], CardShopCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], CardShopCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Node)
    ], CardShopCtrl.prototype, "lab_count", void 0);
    __decorate([
        property(cc.Sprite)
    ], CardShopCtrl.prototype, "sp_price", void 0);
    __decorate([
        property([cc.SpriteFrame])
    ], CardShopCtrl.prototype, "sp_SpriteFrame", void 0);
    __decorate([
        property(cc.Prefab)
    ], CardShopCtrl.prototype, "cardBuyShow", void 0);
    CardShopCtrl = __decorate([
        ccclass
    ], CardShopCtrl);
    return CardShopCtrl;
}(BaseCtrl_1.default));
exports.default = CardShopCtrl;

cc._RF.pop();