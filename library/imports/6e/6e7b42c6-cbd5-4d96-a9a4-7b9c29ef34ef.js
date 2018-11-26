"use strict";
cc._RF.push(module, '6e7b4LGy9VNlqmke5wp7zTv', 'guildsFrame');
// modules/plaza/script/guilds/guildsFrame.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 陈斌杰
日期:2018-11-09 15:25:14
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
        _this.ui = {};
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsFrameCtrl = /** @class */ (function (_super) {
    __extends(GuildsFrameCtrl, _super);
    function GuildsFrameCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsFrameCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsFrameCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    GuildsFrameCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsFrameCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsFrameCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    GuildsFrameCtrl = __decorate([
        ccclass
    ], GuildsFrameCtrl);
    return GuildsFrameCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsFrameCtrl;

cc._RF.pop();