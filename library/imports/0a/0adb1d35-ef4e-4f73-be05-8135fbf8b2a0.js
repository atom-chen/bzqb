"use strict";
cc._RF.push(module, '0adb101705Pc74FgTX7+LKg', 'achievement');
// modules/plaza/script/achievement/achievement.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 蒙磊
日期:2018-11-16 15:32:08
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
            lab_title: ctrl.lab_title,
            lab_describe: ctrl.lab_describe,
            lab_progress: ctrl.lab_progress,
            btn_goTo: ctrl.btn_goTo,
            btn_receive: ctrl.btn_receive,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var AchievementCtrl = /** @class */ (function (_super) {
    __extends(AchievementCtrl, _super);
    function AchievementCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //label
        _this.lab_title = null;
        _this.lab_describe = null;
        _this.lab_progress = null;
        //btn 
        _this.btn_goTo = null;
        _this.btn_receive = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    AchievementCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    AchievementCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    AchievementCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    AchievementCtrl.prototype.setLabel = function (title, describe, progress) {
        this.view.showLabelString(this.ui.lab_title, title);
        this.view.showLabelString(this.ui.lab_describe, describe);
        this.view.showLabelString(this.ui.lab_progress, progress);
    };
    AchievementCtrl.prototype.setButton = function (recevied) {
        if (recevied == 0) {
            this.ui.btn_goTo.active = true;
        }
        else {
            this.ui.btn_receive.active = true;
        }
    };
    //绑定操作的回调
    AchievementCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    AchievementCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], AchievementCtrl.prototype, "lab_title", void 0);
    __decorate([
        property(cc.Label)
    ], AchievementCtrl.prototype, "lab_describe", void 0);
    __decorate([
        property(cc.Label)
    ], AchievementCtrl.prototype, "lab_progress", void 0);
    __decorate([
        property(cc.Node)
    ], AchievementCtrl.prototype, "btn_goTo", void 0);
    __decorate([
        property(cc.Node)
    ], AchievementCtrl.prototype, "btn_receive", void 0);
    AchievementCtrl = __decorate([
        ccclass
    ], AchievementCtrl);
    return AchievementCtrl;
}(BaseCtrl_1.default));
exports.default = AchievementCtrl;

cc._RF.pop();