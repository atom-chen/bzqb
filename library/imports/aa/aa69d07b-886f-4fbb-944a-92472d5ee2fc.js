"use strict";
cc._RF.push(module, 'aa69dB7iG9Pu5RKkkctXuL8', 'bottomMain');
// modules/plaza/script/main/bottomMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var boxMgr_1 = require("../../../../manager/public/boxMgr");
var GameNet_1 = require("../../../../framework/modules/GameNet");
var effectMgr_1 = require("../../../../manager/public/effectMgr");
var achievementMgr_1 = require("../../../../manager/public/achievementMgr");
var talentMgr_1 = require("../../../../manager/public/talentMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
/*
author: 蒙磊
日期:2018-11-02 18:03:47
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
        _this.unlockingBattleBox = null; //解锁中的宝箱节点
        _this.battleBoxEndTime = null; //箱子结束时间
        _this.battleBoxUnlockTime = null; //箱子显示时间
        return _this;
    }
    //解锁的时间（毫秒）       解锁所需时间（秒）
    Model.prototype.initbattleBoxEndTime = function (unlockTime, unlock_time) {
        this.battleBoxEndTime = unlockTime + unlock_time * 1000;
    };
    Model.prototype.setUnlockBattleBoxTime = function () {
        var serverDelay = GameNet_1.default.getInstance().getServerDelay();
        var serverTime = Date.now() + serverDelay;
        var unlockNeedTime = this.battleBoxEndTime - serverTime;
        unlockNeedTime = unlockNeedTime > 0 ? unlockNeedTime : 0;
        var hour = Math.floor((unlockNeedTime / 1000) / 3600);
        var minute = Math.floor(((unlockNeedTime / 1000) % 3600) / 60);
        var hours = hour >= 10 ? hour : '0' + hour;
        var minutes = minute >= 10 ? minute : '0' + minute;
        this.battleBoxUnlockTime = hours + ":" + minutes;
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
            btn_talent: ctrl.btn_talent,
            btn_skill: ctrl.btn_skill,
            btn_achievement: ctrl.btn_achievement,
            btn_guild: ctrl.btn_guild,
            btn_ranking: ctrl.btn_ranking,
            boxList: ctrl.boxList,
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
    View.prototype.hide = function (obj) {
        obj.active = false;
    };
    View.prototype.show = function (obj) {
        obj.active = true;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var BottomMainCtrl = /** @class */ (function (_super) {
    __extends(BottomMainCtrl, _super);
    function BottomMainCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_talent = null;
        _this.btn_skill = null;
        _this.btn_achievement = null;
        _this.btn_guild = null;
        _this.btn_ranking = null;
        _this.boxList = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    BottomMainCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initBox();
    };
    //定义网络事件
    BottomMainCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.teji.reqTejiInfo": this.reqTejiInfo,
            "plaza.data.reqAchieveInfo": this.reqAchieveInfo,
            "plaza.talent.reqTalentInfo": this.reqTalentInfo,
            "plaza.box.unlockBox": this.unlockBox,
            "plaza.vip.buyVipGift": this.buyVipGift,
        };
    };
    //定义全局事件
    BottomMainCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    BottomMainCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_talent, function () {
            if (talentMgr_1.default.getInstance().isInit) {
                _this.reqTalentInfo();
            }
            else {
                talentMgr_1.default.getInstance().sendReqTalentInfo();
            }
        }, "打开天赋");
        this.connect("click", this.ui.btn_skill, function () {
            if (effectMgr_1.default.getInstance().isInit) {
                _this.openPrefabCB("effects");
                return;
            }
            effectMgr_1.default.getInstance().sendReqEffectData();
        }, "发送特技数据请求");
        this.connect("click", this.ui.btn_achievement, function () {
            if (achievementMgr_1.default.getInstance().isInit) {
                _this.reqAchieveInfo();
            }
            else {
                achievementMgr_1.default.getInstance().sendReqAchieveInfo();
            }
        }, "打开成就");
        this.connect("click", this.ui.btn_guild, function () {
            var guildId = userMgr_1.default.getInstance().getMyInfo().guildId;
            if (guildId) {
                guildsMgr_1.default.getInstance().reqMyGuildDetail();
                guildsMgr_1.default.getInstance().reqGuildMembers(guildId, 0);
                _this.openPrefabCB("guildsInfo");
            }
            else
                _this.openPrefabCB("guilds");
        }, "打开公会");
        this.connect("click", this.ui.btn_ranking, function () { _this.openPrefabCB("ranks"); }, "打开排行榜");
        this.connectBattleBox();
    };
    BottomMainCtrl.prototype.connectBattleBox = function () {
        var _this = this;
        var _loop_1 = function (i) {
            this_1.connect("click", this_1.ui.boxList.children[i], function () {
                boxMgr.setCurBattleBox(i);
                if (boxMgr.battleBox[i].unlockTime == 0) {
                    _this.openPrefabCB("battleBox");
                }
                else {
                    //boxMgr.testOpenBox(boxMgr.battleBox[i].id_service)
                }
            }, "打开战斗宝箱");
        };
        var this_1 = this;
        for (var i = 0; i < this.ui.boxList.childrenCount; i++) {
            _loop_1(i);
        }
    };
    BottomMainCtrl.prototype.initBox = function () {
        console.log(boxMgr.battleBox);
        for (var i = 0; i < this.ui.boxList.childrenCount; i++) {
            if (boxMgr.battleBox[i]) {
                if (boxMgr.battleBox[i].unlockTime == 0) {
                    var obj_string = boxMgr.battleBox[i].boxInfo.unlock_time / 3600 + "小时";
                    var obj_label = this.ui.boxList.children[i].children[0].children[0].children[0].getComponent(cc.Label);
                    this.view.show(this.ui.boxList.children[i].children[0]);
                    this.view.hide(this.ui.boxList.children[i].children[1]);
                    this.view.showLabelString(obj_label, obj_string);
                }
                else {
                    //初始化解锁中宝箱时间
                    this.model.initbattleBoxEndTime(boxMgr.battleBox[i].unlockTime, boxMgr.battleBox[i].boxInfo.unlock_time);
                    this.model.setUnlockBattleBoxTime();
                    this.model.unlockingBattleBox = this.ui.boxList.children[i].children[0].children[1].children[0];
                    var obj_label = this.model.unlockingBattleBox.getComponent(cc.Label);
                    this.view.showLabelString(obj_label, this.model.battleBoxUnlockTime);
                    this.view.hide(this.ui.boxList.children[i].children[0].children[0]);
                    this.view.show(this.ui.boxList.children[i].children[0].children[1]);
                    this.unlockBattleBoxTiming(obj_label);
                }
            }
            else {
                this.view.hide(this.ui.boxList.children[i].children[0]);
                this.view.show(this.ui.boxList.children[i].children[1]);
            }
        }
    };
    //解锁中宝箱计时
    BottomMainCtrl.prototype.unlockBattleBoxTiming = function (obj_string) {
        var _this = this;
        this.schedule(function () {
            _this.model.setUnlockBattleBoxTime();
            _this.view.showLabelString(obj_string, _this.model.battleBoxUnlockTime);
        }, 1);
    };
    //网络事件回调begin
    BottomMainCtrl.prototype.reqTejiInfo = function () {
        this.openPrefabCB("effects");
    };
    BottomMainCtrl.prototype.reqAchieveInfo = function () {
        this.openPrefabCB("achievementBG");
    };
    BottomMainCtrl.prototype.reqTalentInfo = function () {
        this.openPrefabCB("talentBG");
    };
    BottomMainCtrl.prototype.buyVipGift = function () {
        console.log("加人新战斗宝箱！！");
        this.initBox();
    };
    BottomMainCtrl.prototype.unlockBox = function () {
        this.initBox();
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    BottomMainCtrl.prototype.openPrefabCB = function (name) {
        this.openSubModule(name);
    };
    // update(dt) {}
    BottomMainCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "btn_talent", void 0);
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "btn_skill", void 0);
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "btn_achievement", void 0);
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "btn_guild", void 0);
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "btn_ranking", void 0);
    __decorate([
        property(cc.Node)
    ], BottomMainCtrl.prototype, "boxList", void 0);
    BottomMainCtrl = __decorate([
        ccclass
    ], BottomMainCtrl);
    return BottomMainCtrl;
}(BaseCtrl_1.default));
exports.default = BottomMainCtrl;

cc._RF.pop();