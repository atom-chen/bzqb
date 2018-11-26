"use strict";
cc._RF.push(module, 'ba48c8zCTBDoogVEfCc3Q8l', 'boxShop');
// modules/plaza/script/shop/boxShop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-13 20:20:56
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
            btn_box: ctrl.btn_box,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), ctrl.cost.toString());
        this.showLabelString(this.ui.lab_gift.getComponent(cc.Label), ctrl.gift.toString());
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var BoxShopCtrl = /** @class */ (function (_super) {
    __extends(BoxShopCtrl, _super);
    function BoxShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label
        _this.lab_cost = null;
        _this.lab_gift = null;
        //button
        _this.btn_box = null;
        return _this;
    }
    BoxShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    BoxShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    BoxShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    BoxShopCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_box, this.buy, "购买宝箱");
    };
    BoxShopCtrl.prototype.buy = function () {
        ModuleMgr_1.default.getInstance().showMsgBox({ content: "\u786E\u5B9A\u8981\u82B1\u8D39" + this.cost + "\u8D2D\u4E70\u5B9D\u7BB1\uFF1A,\u548C\u91D1\u5E01" + this.gift + "?" });
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    BoxShopCtrl.prototype.setData = function (cost, gift) {
        this.cost = cost;
        this.gift = gift;
    };
    BoxShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], BoxShopCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], BoxShopCtrl.prototype, "lab_gift", void 0);
    __decorate([
        property(cc.Node)
    ], BoxShopCtrl.prototype, "btn_box", void 0);
    BoxShopCtrl = __decorate([
        ccclass
    ], BoxShopCtrl);
    return BoxShopCtrl;
}(BaseCtrl_1.default));
exports.default = BoxShopCtrl;

cc._RF.pop();