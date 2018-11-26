"use strict";
cc._RF.push(module, '6370e6ivk5KRaaVXJt8+E2T', 'achievementBG');
// modules/plaza/script/achievement/achievementBG.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var achievementMgr_1 = require("../../../../manager/public/achievementMgr");
/*
author: 蒙磊
日期:2018-11-09 15:46:41
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var achievementMgrMgr = achievementMgr_1.default.getInstance();
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.achievement = [];
        _this.achievementProgress = [];
        return _this;
    }
    Model.prototype.initData = function () {
        this.achievement = achievementMgrMgr.achievement;
        this.setProgress();
    };
    Model.prototype.setProgress = function () {
        for (var i = 0; i < this.achievement.length; i++) {
            var curProgress = this.achievement[i].src;
            var targetProgress = this.achievement[i].target;
            if (typeof targetProgress === "object") {
                targetProgress = targetProgress.quantity;
            }
            this.achievementProgress[i] = "进度" + curProgress + "/" + targetProgress;
        }
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
            btn_close: ctrl.btn_close,
            achievementList: ctrl.achievementList,
            achievement: ctrl.achievement,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    View.prototype.addPrefab = function (obj_node, obj_Prefab) {
        return this.addPrefabNode(obj_Prefab, obj_node);
    };
    //初始化ui
    View.prototype.initUi = function () {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var AchievementCtrl = /** @class */ (function (_super) {
    __extends(AchievementCtrl, _super);
    function AchievementCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        //note
        _this.achievementList = null;
        //Prefab
        _this.achievement = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    AchievementCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initData();
    };
    //定义网络事件
    AchievementCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    AchievementCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    AchievementCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.close, "关闭");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    AchievementCtrl.prototype.initData = function () {
        this.model.initData();
        this.ui.achievementList.height = (this.model.achievement.length) * 90;
        for (var i = 0; i < this.model.achievement.length; i++) {
            var achievement = this.view.addPrefab(this.ui.achievementList, this.ui.achievement);
            achievement.setPosition(cc.v2(0, -180 + (i * -90)));
            console.log(this.model.achievement[i]);
            achievement.getComponent("achievement").setLabel(this.model.achievement[i].tableInfo.name, this.model.achievement[i].tableInfo.des, this.model.achievementProgress[i]);
            achievement.getComponent("achievement").setButton(this.model.achievement[i].recevied);
        }
    };
    AchievementCtrl.prototype.close = function () {
        this.closeModule("achievementBG");
    };
    // update(dt) {}
    AchievementCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], AchievementCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], AchievementCtrl.prototype, "achievementList", void 0);
    __decorate([
        property(cc.Prefab)
    ], AchievementCtrl.prototype, "achievement", void 0);
    AchievementCtrl = __decorate([
        ccclass
    ], AchievementCtrl);
    return AchievementCtrl;
}(BaseCtrl_1.default));
exports.default = AchievementCtrl;

cc._RF.pop();