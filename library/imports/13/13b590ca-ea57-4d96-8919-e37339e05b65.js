"use strict";
cc._RF.push(module, '13b59DK6ldNlokZ43M54Ftl', 'levelBox');
// modules/plaza/script/levelBox/levelBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var boxMgr_1 = require("../../../../manager/public/boxMgr");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-23 17:11:42
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.buyState = false;
        return _this;
    }
    Model.prototype.setData = function (data, have) {
        this.levelBox = data;
        this.have = have;
        this.des = data.des;
        this.originalPrice = data.original_price.toString();
        this.curPrice = "现价" + data.price_diamond;
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
            lab_des: ctrl.lab_des,
            lab_originalPrice: ctrl.lab_originalPrice,
            lab_curPrice: ctrl.lab_curPrice,
            btn_buy: ctrl.btn_buy,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.initData = function () {
        this.showLabelString(this.ui.lab_des, this.model.des);
        this.showLabelString(this.ui.lab_originalPrice, this.model.originalPrice);
        this.showLabelString(this.ui.lab_curPrice, this.model.curPrice);
        if (this.model.have == null) {
            this.ui.btn_buy.children[1].active = false;
        }
        else {
            this.ui.btn_buy.children[0].active = false;
            this.ui.btn_buy.getComponent(cc.Button).interactable = false;
        }
    };
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var LevelBoxCtrl = /** @class */ (function (_super) {
    __extends(LevelBoxCtrl, _super);
    function LevelBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label
        _this.lab_des = null;
        _this.lab_originalPrice = null;
        _this.lab_curPrice = null;
        _this.btn_buy = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    LevelBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件${route}
    LevelBoxCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.box.buyLevelBox': this.buyLevelBox,
        };
    };
    //定义全局事件
    LevelBoxCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    LevelBoxCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_buy, this.buy, "购买");
    };
    //网络事件回调begin
    LevelBoxCtrl.prototype.buyLevelBox = function () {
        if (this.model.buyState) {
            this.btn_buy.children[0].active = false;
            this.btn_buy.children[1].active = true;
            this.ui.btn_buy.getComponent(cc.Button).interactable = false;
        }
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    LevelBoxCtrl.prototype.buy = function () {
        var _this = this;
        var diamond = this.model.levelBox.original_price;
        var level = ModuleMgr_1.default.getInstance().showMsgBox({
            content: "\u786E\u5B9A\u8981\u82B1\u8D39" + diamond + "\u7816\u77F3\u8D2D\u4E70\u7EA7\u7279\u60E0\u793C\u5305?",
            okcb: function () { boxMgr_1.default.getInstance().sendBuyLevelBox(_this.model.levelBox.condition_level), _this.model.buyState = true; }
        });
    };
    LevelBoxCtrl.prototype.setData = function (data, have) {
        this.model.setData(data, have);
        this.view.initData();
    };
    LevelBoxCtrl.prototype.initData = function () {
    };
    // update(dt) {}
    LevelBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], LevelBoxCtrl.prototype, "lab_des", void 0);
    __decorate([
        property(cc.Label)
    ], LevelBoxCtrl.prototype, "lab_originalPrice", void 0);
    __decorate([
        property(cc.Label)
    ], LevelBoxCtrl.prototype, "lab_curPrice", void 0);
    __decorate([
        property(cc.Node)
    ], LevelBoxCtrl.prototype, "btn_buy", void 0);
    LevelBoxCtrl = __decorate([
        ccclass
    ], LevelBoxCtrl);
    return LevelBoxCtrl;
}(BaseCtrl_1.default));
exports.default = LevelBoxCtrl;

cc._RF.pop();