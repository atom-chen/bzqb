"use strict";
cc._RF.push(module, 'd1cf0JVdP9OZ5+iGofXFLW0', 'goldShop');
// modules/plaza/script/shop/goldShop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-13 20:41:33
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        return _super.call(this) || this;
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            //在这里声明ui
            lab_cost: ctrl.lab_cost,
            lab_gift: ctrl.lab_gift,
            lab_reward: ctrl.lab_reward,
            lab_name: ctrl.lab_name,
            btn_moneys: ctrl.btn_moneys,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), ctrl.cost.toString());
        this.showLabelString(this.ui.lab_gift.getComponent(cc.Label), ctrl.gift.toString());
        this.showLabelString(this.ui.lab_reward.getComponent(cc.Label), ctrl.gold.toString());
        this.showLabelString(this.ui.lab_name.getComponent(cc.Label), ctrl.name);
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GoldShopCtrl = /** @class */ (function (_super) {
    __extends(GoldShopCtrl, _super);
    function GoldShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.lab_cost = null;
        _this.lab_gift = null;
        _this.lab_reward = null;
        _this.lab_name = null;
        //button
        _this.btn_moneys = null;
        return _this;
    }
    GoldShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GoldShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    GoldShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GoldShopCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_moneys, this.buy, "购买金币");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    GoldShopCtrl.prototype.buy = function () {
        ModuleMgr_1.default.getInstance().showMsgBox({ content: "\u786E\u5B9A\u8981\u82B1\u8D39" + this.cost + "\u8D2D\u4E70\uFF1A" + this.name + ",\u83B7\u5F97" + (this.gold + this.gift) + "?" });
    };
    //end
    // update(dt) {}
    GoldShopCtrl.prototype.setData = function (cost, gift, gold, name) {
        this.cost = cost;
        this.gift = gift;
        this.gold = gold;
        this.name = name;
    };
    GoldShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], GoldShopCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], GoldShopCtrl.prototype, "lab_gift", void 0);
    __decorate([
        property(cc.Node)
    ], GoldShopCtrl.prototype, "lab_reward", void 0);
    __decorate([
        property(cc.Node)
    ], GoldShopCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Node)
    ], GoldShopCtrl.prototype, "btn_moneys", void 0);
    GoldShopCtrl = __decorate([
        ccclass
    ], GoldShopCtrl);
    return GoldShopCtrl;
}(BaseCtrl_1.default));
exports.default = GoldShopCtrl;

cc._RF.pop();