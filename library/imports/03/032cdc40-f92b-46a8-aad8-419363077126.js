"use strict";
cc._RF.push(module, '032cdxA+StGqKrYQZNjB3Em', 'moneyList');
// modules/public/script/moneyList.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var shopMgr_1 = require("../../../manager/public/shopMgr");
var userMgr_1 = require("../../../manager/public/userMgr");
/*
author: 蒙磊
日期:2018-11-21 21:38:08
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
            //button
            btn_moneyAdd: ctrl.btn_moneyAdd,
            btn_diamondAdd: ctrl.btn_diamondAdd,
            btn_crystalAdd: ctrl.btn_crystalAdd,
            //label
            lab_money: ctrl.lab_money,
            lab_crystal: ctrl.lab_crystal,
            lab_diamond: ctrl.lab_diamond,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.updateMoney();
    };
    View.prototype.updateMoney = function () {
        console.log("金钱变更！", userMgr_1.default.getInstance().userMoney.gold);
        this.ui.lab_money.getComponent(cc.Label).string = this.numberEllipsis(userMgr_1.default.getInstance().userMoney.gold);
        this.ui.lab_crystal.getComponent(cc.Label).string = this.numberEllipsis(userMgr_1.default.getInstance().userMoney.crystal);
        this.ui.lab_diamond.getComponent(cc.Label).string = this.numberEllipsis(userMgr_1.default.getInstance().userMoney.diamond);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MoneyListCtrl = /** @class */ (function (_super) {
    __extends(MoneyListCtrl, _super);
    function MoneyListCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_moneyAdd = null;
        _this.btn_crystalAdd = null;
        _this.btn_diamondAdd = null;
        _this.lab_money = null;
        _this.lab_crystal = null;
        _this.lab_diamond = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MoneyListCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    MoneyListCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    MoneyListCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "refreshMoneyUI": this.refreshMoneyUI,
        };
    };
    MoneyListCtrl.prototype.refreshMoneyUI = function () {
        this.view.updateMoney();
    };
    //绑定操作的回调
    MoneyListCtrl.prototype.connectUi = function () {
        var _this = this;
        console.log(this.ui.btn_moneyAdd);
        this.connect("click", this.ui.btn_moneyAdd, function () {
            shopMgr_1.default.getInstance().setShopState("money");
            if (shopMgr_1.default.getInstance().isInitShop) {
                _this.openSubModule("shop");
            }
            else {
                shopMgr_1.default.getInstance().reqShopInfo();
            }
        }, "购买金币");
        this.connect("click", this.ui.btn_crystalAdd, function () {
            shopMgr_1.default.getInstance().setShopState("crystal");
            if (shopMgr_1.default.getInstance().isInitShop) {
                _this.openSubModule("shop");
            }
            else {
                shopMgr_1.default.getInstance().reqShopInfo();
            }
        }, "购买水晶");
        this.connect("click", this.ui.btn_diamondAdd, function () {
            shopMgr_1.default.getInstance().setShopState("diamond");
            if (shopMgr_1.default.getInstance().isInitShop) {
                _this.openSubModule("shop");
            }
            else {
                shopMgr_1.default.getInstance().reqShopInfo();
            }
        }, "购买砖石");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    MoneyListCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "btn_moneyAdd", void 0);
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "btn_crystalAdd", void 0);
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "btn_diamondAdd", void 0);
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "lab_money", void 0);
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "lab_crystal", void 0);
    __decorate([
        property(cc.Node)
    ], MoneyListCtrl.prototype, "lab_diamond", void 0);
    MoneyListCtrl = __decorate([
        ccclass
    ], MoneyListCtrl);
    return MoneyListCtrl;
}(BaseCtrl_1.default));
exports.default = MoneyListCtrl;

cc._RF.pop();