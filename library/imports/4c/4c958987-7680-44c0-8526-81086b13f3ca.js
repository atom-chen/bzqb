"use strict";
cc._RF.push(module, '4c958mHdoBEwIUmgQhrE/PK', 'talentBG');
// modules/plaza/script/talent/talentBG.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var talentMgr_1 = require("../../../../manager/public/talentMgr");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
var GameNet_1 = require("../../../../framework/modules/GameNet");
var enums_1 = require("../../../../manager/enums");
/*
author: 蒙磊
日期:2018-11-09 15:54:28
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.talentMgr = talentMgr_1.default.getInstance();
        _this.talentPoint = _this.talentMgr.talentPoint;
        _this.talentList = _this.talentMgr.talentList;
        _this.refreshNeedTime = null;
        _this.talentInfo = talentMgr_1.default.getInstance().talentInfo;
        _this.resetTime = null;
        _this.serverDelay = null;
        _this.refreshEndTime = null;
        return _this;
    }
    Model.prototype.initResetTime = function () {
        this.serverDelay = GameNet_1.default.getInstance().getServerDelay();
        this.refreshEndTime = this.talentMgr.lastResetTime + (enums_1.enums.Talent_ResetTime * 1000);
    };
    Model.prototype.refreshData = function () {
        this.talentList = this.talentMgr.talentList;
        this.talentPoint = this.talentMgr.talentPoint;
    };
    Model.prototype.setResetTime = function () {
        var serverTime = Date.now() + this.serverDelay;
        this.refreshNeedTime = this.refreshEndTime - serverTime;
        this.refreshNeedTime = this.refreshNeedTime > 0 ? this.refreshNeedTime : -1;
        if (this.refreshNeedTime < 0) {
            this.resetTime = "可分享重置";
        }
        else {
            var hour = Math.floor((this.refreshNeedTime / 1000) / 3600) + 1;
            this.resetTime = hour + "小时后重置";
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
            btn_reset: ctrl.btn_reset,
            note_resetTalent: ctrl.note_resetTalent,
            btn_closeReset: ctrl.btn_closeReset,
            note_talentList: ctrl.note_talentList,
            suspensionFrame: ctrl.suspensionFrame,
            lab_talentPoint: ctrl.lab_talentPoint,
            btn_buyReset: ctrl.btn_buyReset,
            btn_share: ctrl.btn_share,
            lab_resetTime: ctrl.lab_resetTime,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    View.prototype.show = function (name) {
        this.ui[name].active = true;
    };
    View.prototype.hide = function (name) {
        this.ui[name].active = false;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TalentCtrl = /** @class */ (function (_super) {
    __extends(TalentCtrl, _super);
    function TalentCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //btn
        _this.btn_close = null;
        _this.btn_reset = null;
        _this.btn_closeReset = null;
        _this.btn_buyReset = null;
        _this.btn_share = null;
        //note
        _this.note_resetTalent = null;
        _this.note_talentList = null;
        //label
        _this.lab_talentPoint = null;
        _this.lab_resetTime = null;
        //Prefab
        _this.suspensionFrame = null;
        //声明ui组件end
        //这是ui组件的map,将ui和控制器或试图普通变量分离
        _this.ts_talentList = [];
        return _this;
    }
    TalentCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        this.note_resetTalent.childrenCount;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initData();
    };
    //定义网络事件
    TalentCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.talent.resetTalent': this.resetTalent,
            'plaza.talent.learnTalent': this.learnTalent,
        };
    };
    //定义全局事件
    TalentCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TalentCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.close, "关闭");
        this.connect("click", this.ui.btn_reset, this.reset, "打开重置天赋界面");
        this.connect("click", this.ui.btn_buyReset, this.butReset, "花钱重置重置天赋");
        this.connect("click", this.ui.btn_share, this.share, "分享重置重置天赋");
        this.connect("click", this.ui.btn_closeReset, this.closeReset, "关闭重置天赋");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化
    TalentCtrl.prototype.initData = function () {
        this.model.initResetTime();
        this.resetTiming();
        this.schedule(this.resetTiming, 60);
        this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime);
        this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString());
        for (var i = 0; i < this.note_talentList.childrenCount; i++) {
            var talent = this.note_talentList.children[i].addComponent("talent");
            talent.setSuspensionFrame(this.ui.suspensionFrame);
            talent.setTalentData(this.model.talentList[i], i);
            talent.addIcon(this.model.talentList[i].icon);
            talent.refreshLevel();
            this.ts_talentList.push(talent);
        }
    };
    //学习天赋回调
    TalentCtrl.prototype.learnTalent = function () {
        this.model.refreshData();
        console.log(this.model.talentPoint);
        this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString());
        var curTalent = talentMgr_1.default.getInstance().curTalent;
        if (curTalent) {
            curTalent.updataTalentData(this.model.talentList[curTalent.model.index]);
            curTalent.refreshLevel();
        }
    };
    //重置天赋计时
    TalentCtrl.prototype.resetTiming = function () {
        this.model.setResetTime();
        this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime.toString());
    };
    //购买重置天赋提示
    TalentCtrl.prototype.butReset = function () {
        ModuleMgr_1.default.getInstance().showMsgBox({ content: "是否花费200进行天赋重置？", okcb: this.buyResetTalent });
    };
    //分享重置天赋按钮回调
    TalentCtrl.prototype.share = function () {
        if (this.model.refreshNeedTime <= 0) {
            talentMgr_1.default.getInstance().sendReqresetTalent(1);
        }
        else {
            console.log("重置时间未到");
        }
    };
    //购买重置天赋
    TalentCtrl.prototype.buyResetTalent = function () {
        talentMgr_1.default.getInstance().sendReqresetTalent(2);
    };
    //重置天赋回调
    TalentCtrl.prototype.resetTalent = function () {
        this.closeReset();
        this.model.refreshData();
        this.model.initResetTime();
        this.model.setResetTime();
        this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime.toString());
        this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString());
        for (var i = 0; i < this.ts_talentList.length; i++) {
            this.ts_talentList[i].refreshLevel();
        }
    };
    //打开重置天赋界面
    TalentCtrl.prototype.reset = function () {
        this.view.show('note_resetTalent');
    };
    TalentCtrl.prototype.closeReset = function () {
        this.view.hide('note_resetTalent');
    };
    // update(dt) {}
    //退出天赋
    TalentCtrl.prototype.close = function () {
        this.closeModule("talentBG");
    };
    TalentCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "btn_reset", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "btn_closeReset", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "btn_buyReset", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "btn_share", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "note_resetTalent", void 0);
    __decorate([
        property(cc.Node)
    ], TalentCtrl.prototype, "note_talentList", void 0);
    __decorate([
        property(cc.Label)
    ], TalentCtrl.prototype, "lab_talentPoint", void 0);
    __decorate([
        property(cc.Label)
    ], TalentCtrl.prototype, "lab_resetTime", void 0);
    __decorate([
        property(cc.Prefab)
    ], TalentCtrl.prototype, "suspensionFrame", void 0);
    TalentCtrl = __decorate([
        ccclass
    ], TalentCtrl);
    return TalentCtrl;
}(BaseCtrl_1.default));
exports.default = TalentCtrl;

cc._RF.pop();