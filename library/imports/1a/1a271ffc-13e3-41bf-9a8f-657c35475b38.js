"use strict";
cc._RF.push(module, '1a271/8E+NBv5qPZXw1R1s4', 'juhua');
// modules/public/script/juhua.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
/*
author: 张志强
日期:2018-11-09 18:31:30
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
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addGrayLayer();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var JuhuaCtrl = /** @class */ (function (_super) {
    __extends(JuhuaCtrl, _super);
    function JuhuaCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    JuhuaCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    JuhuaCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    JuhuaCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    JuhuaCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    JuhuaCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    JuhuaCtrl = __decorate([
        ccclass
    ], JuhuaCtrl);
    return JuhuaCtrl;
}(BaseCtrl_1.default));
exports.default = JuhuaCtrl;

cc._RF.pop();