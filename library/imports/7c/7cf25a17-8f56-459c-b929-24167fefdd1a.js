"use strict";
cc._RF.push(module, '7cf25oXj1ZFnLkpJBZ/790a', 'crystalShop');
// modules/plaza/script/shop/crystalShop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-13 20:41:57
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
            btn_crystal: ctrl.btn_crystal,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), ctrl.cost.toString());
        this.showLabelString(this.ui.lab_gift.getComponent(cc.Label), ctrl.gift.toString());
        this.showLabelString(this.ui.lab_reward.getComponent(cc.Label), ctrl.reward.toString());
        this.showLabelString(this.ui.lab_name.getComponent(cc.Label), ctrl.name);
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var CrystalShopCtrl = /** @class */ (function (_super) {
    __extends(CrystalShopCtrl, _super);
    function CrystalShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label
        _this.lab_cost = null;
        _this.lab_gift = null;
        _this.lab_reward = null;
        _this.lab_name = null;
        _this.btn_crystal = null;
        return _this;
    }
    CrystalShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    CrystalShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    CrystalShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    CrystalShopCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_crystal, this.buy, "购买粉晶");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    CrystalShopCtrl.prototype.buy = function () {
        ModuleMgr_1.default.getInstance().showMsgBox({ content: "\u786E\u5B9A\u8981\u82B1\u8D39" + this.cost + "\u8D2D\u4E70\uFF1A" + this.name + ",\u83B7\u5F97" + (this.reward + this.gift) + "?" });
    };
    CrystalShopCtrl.prototype.setData = function (cost, gift, reward, name) {
        this.cost = cost ? cost : 0;
        this.gift = gift ? gift : 0;
        this.reward = reward ? reward : 0;
        this.name = name;
    };
    // update(dt) {}
    CrystalShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], CrystalShopCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], CrystalShopCtrl.prototype, "lab_gift", void 0);
    __decorate([
        property(cc.Node)
    ], CrystalShopCtrl.prototype, "lab_reward", void 0);
    __decorate([
        property(cc.Node)
    ], CrystalShopCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Node)
    ], CrystalShopCtrl.prototype, "btn_crystal", void 0);
    CrystalShopCtrl = __decorate([
        ccclass
    ], CrystalShopCtrl);
    return CrystalShopCtrl;
}(BaseCtrl_1.default));
exports.default = CrystalShopCtrl;

cc._RF.pop();