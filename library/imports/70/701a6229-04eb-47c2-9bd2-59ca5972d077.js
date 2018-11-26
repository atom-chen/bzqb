"use strict";
cc._RF.push(module, '701a6IpBOtHwpvSWcpZctB3', 'battleBox');
// modules/plaza/script/box/battleBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var boxMgr_1 = require("../../../../manager/public/boxMgr");
/*
author: 蒙磊
日期:2018-11-08 11:20:57
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var boxMgr = boxMgr_1.default.getInstance();
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.hour = null;
        _this.minute = null;
        _this.second = null;
        _this.initTime();
        return _this;
    }
    //时间
    Model.prototype.initTime = function () {
        var time = boxMgr.curBattleBox.boxInfo.unlock_time;
        var hour = Math.floor(time / 3600);
        var minute = Math.floor((time % 3600) / 60);
        var second = Math.floor(time % 60);
        this.hour = hour >= 10 ? hour : '0' + hour;
        this.minute = minute >= 10 ? minute : '0' + minute;
        this.second = second >= 10 ? second : '0' + second;
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
            //button
            btn_unlock: ctrl.btn_unlock,
            btn_close: ctrl.btn_close,
            //label
            lab_time: ctrl.lab_time,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showBoxTime();
    };
    View.prototype.showBoxTime = function () {
        this.ui.lab_time.getComponent(cc.Label).string = this.model.hour + ":" + this.model.minute + ":" + this.model.second;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var BattleBoxCtrl = /** @class */ (function (_super) {
    __extends(BattleBoxCtrl, _super);
    function BattleBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //button
        _this.btn_unlock = null;
        _this.btn_close = null;
        //label
        _this.lab_time = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    BattleBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    BattleBoxCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    BattleBoxCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    BattleBoxCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.closeBox, "关闭战斗宝箱");
        this.connect("click", this.ui.btn_unlock, this.unlockBox, "开启战斗宝箱");
    };
    BattleBoxCtrl.prototype.closeBox = function () {
        this.closeModule("battleBox");
    };
    BattleBoxCtrl.prototype.unlockBox = function () {
        boxMgr.unlockBox();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    BattleBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], BattleBoxCtrl.prototype, "btn_unlock", void 0);
    __decorate([
        property(cc.Node)
    ], BattleBoxCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], BattleBoxCtrl.prototype, "lab_time", void 0);
    BattleBoxCtrl = __decorate([
        ccclass
    ], BattleBoxCtrl);
    return BattleBoxCtrl;
}(BaseCtrl_1.default));
exports.default = BattleBoxCtrl;

cc._RF.pop();