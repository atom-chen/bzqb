"use strict";
cc._RF.push(module, '4df63o6datJ4qdgzz2WYYiL', 'guildsTreasureCasesPanel');
// modules/plaza/script/guilds/guildsTreasureCasesPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var enums_1 = require("../../../../manager/enums");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
var tableMgr_1 = require("../../../../manager/public/tableMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 汤凯
日期:2018-11-22
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.inGamePlayerContentHeight = 300;
        _this.playerInfoLeap = 110;
        _this.playersInfoList = guildsMgr_1.default.getInstance().getGuildPlayersInfoList();
        _this.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        _this.myGuildInfo = guildsMgr_1.default.getInstance().getMyGuildInfo();
        _this.guildBoxInfo = null;
        return _this;
        // if(!this.guildShopInfo)
        // {
        // 	ShopMgr.getInstance().reqShopInfo(true);
        // }
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            pref_playerInfo: ctrl.pref_playerInfo,
            lbl_coinsAmt: ctrl.lbl_coinsAmt,
            lbl_cardsAmt: ctrl.lbl_cardsAmt,
            lbl_tickTime: ctrl.lbl_tickTime,
            spr_guildTreasureIcon: ctrl.spr_guildTreasureIcon,
            node_inGamePlayersInfoContent: ctrl.node_inGamePlayersInfoContent,
            node_outGamePlayersInfoContent: ctrl.node_outGamePlayersInfoContent,
            bar_guildBoxProgress: ctrl.bar_guildBoxProgress,
            inGameScroll_bar: ctrl.inGameScroll_bar
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addPlayersInfoList();
        this.refreshBoxInfo();
    };
    View.prototype.findLevelBox = function () {
        var nextLevel = this.model.guildInfo.boxLv + 1;
        var nextLevelBox = tableMgr_1.default.getInstance().search('Guild_Box', { boxLevel: nextLevel });
        while (this.model.myGuildInfo.keyCount > nextLevelBox.cumulativeKey) {
            nextLevel++;
            nextLevelBox = tableMgr_1.default.getInstance().search('Guild_Box', { boxLevel: nextLevel });
            if (!nextLevelBox) {
                nextLevel--;
                return tableMgr_1.default.getInstance().search('Guild_Box', { boxLevel: nextLevel });
                ;
            }
        }
        return nextLevelBox;
    };
    View.prototype.refreshBoxInfo = function () {
        if (this.model.guildInfo && this.model.myGuildInfo) {
            var nextLevelBox = this.findLevelBox();
            var boxInfo = tableMgr_1.default.getInstance().search('baoxiang_baoxiang', { id: nextLevelBox.boxId });
            if (boxInfo) {
                this.model.guildBoxInfo = boxInfo;
                this.model.guildBoxInfo.requiredKey = nextLevelBox.requiredKey;
                this.ui.lbl_coinsAmt.string = Math.floor(this.model.guildBoxInfo.lowmoney + Math.random() * (this.model.guildBoxInfo.higmoney - this.model.guildBoxInfo.lowmoney));
                this.ui.lbl_cardsAmt.string = Math.floor(this.model.guildBoxInfo.lowcard + Math.random() * (this.model.guildBoxInfo.higcard - this.model.guildBoxInfo.lowcard));
                this.ui.bar_guildBoxProgress.progress = this.model.myGuildInfo.keyCount / nextLevelBox.requiredKey;
            }
        }
    };
    View.prototype.addPlayersInfoList = function () {
        var inGamePlayersCount = 0;
        var outGamePlayersCount = 0;
        if (this.model.playersInfoList && this.model.playersInfoList.members.length > 0 && this.node.active) {
            this.ui.node_inGamePlayersInfoContent.destroyAllChildren();
            this.ui.node_outGamePlayersInfoContent.destroyAllChildren();
            for (var guildIdx = 0; guildIdx < this.model.playersInfoList.members.length; guildIdx++) {
                var guildPlayerInfoData = this.model.playersInfoList.members[guildIdx];
                var playerInfo = cc.instantiate(this.ui.pref_playerInfo);
                if (guildPlayerInfoData.keyCount > 0) {
                    inGamePlayersCount++;
                    this.ui.node_inGamePlayersInfoContent.addChild(playerInfo);
                }
                else {
                    outGamePlayersCount++;
                    this.ui.node_outGamePlayersInfoContent.addChild(playerInfo);
                }
                playerInfo.getComponent('guildPlayerInfo').updateAndShowGuildPlayerInfo(guildPlayerInfoData);
            }
            this.ui.node_inGamePlayersInfoContent.setContentSize(this.ui.node_inGamePlayersInfoContent.getContentSize().width, (this.model.playersInfoList.page + 1) * this.model.inGamePlayerContentHeight);
            this.ui.node_outGamePlayersInfoContent.setContentSize(this.ui.node_inGamePlayersInfoContent.getContentSize().width, outGamePlayersCount * this.model.playerInfoLeap);
        }
    };
    View.prototype.showTickTime = function (tickTime) {
        var daysCube = Math.floor(tickTime / 86400);
        if (daysCube >= 10) {
            daysCube = daysCube.toString();
        }
        else {
            daysCube = '0' + daysCube.toString();
        }
        var hoursCube = Math.floor(tickTime / 3600);
        if (hoursCube >= 10) {
            hoursCube = hoursCube.toString();
        }
        else {
            hoursCube = '0' + hoursCube.toString();
        }
        this.ui.lbl_tickTime.string = daysCube + "天" + hoursCube + "时";
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsTreasureCasesPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsTreasureCasesPanelCtrl, _super);
    function GuildsTreasureCasesPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.pref_playerInfo = null;
        _this.lbl_coinsAmt = null;
        _this.lbl_cardsAmt = null;
        _this.lbl_tickTime = null;
        _this.spr_guildTreasureIcon = null;
        _this.node_inGamePlayersInfoContent = null;
        _this.node_outGamePlayersInfoContent = null;
        _this.bar_guildBoxProgress = null;
        _this.inGameScroll_bar = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsTreasureCasesPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        //切换前后台需要对定时器进行清理和初始化
        this.schedule(this.countDown.bind(this), 2);
    };
    //定义网络事件
    GuildsTreasureCasesPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.reqGuildMembers': this.search_entry_reqGuildMembers,
        };
    };
    //定义全局事件
    GuildsTreasureCasesPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsTreasureCasesPanelCtrl.prototype.connectUi = function () {
        this.connect("scroll-to-bottom", this.ui.inGameScroll_bar.node, this.scrollToBottom.bind(this), "拉到末尾");
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
    };
    GuildsTreasureCasesPanelCtrl.prototype.scrollToBottom = function () {
        guildsMgr_1.default.getInstance().reqGuildMembers(userMgr_1.default.getInstance().getMyInfo().guildId, guildsMgr_1.default.getInstance().membersPage + 1);
    };
    GuildsTreasureCasesPanelCtrl.prototype.countDown = function () {
        if (this.model.guildInfo && this.model.guildInfo.boxTime > 0) {
            var curTime = new Date().getTime();
            var timeGap = Math.floor((curTime - this.model.guildInfo.boxTime) / 1000);
            if ((timeGap) >= enums_1.enums.GuildBox_Intervals) {
                //活动开始
                // ShopMgr.getInstance().reqShopInfo(true);
            }
            else {
                this.view.showTickTime(enums_1.enums.GuildBox_Intervals - timeGap);
            }
        }
    };
    GuildsTreasureCasesPanelCtrl.prototype.search_entry_reqGuildMembers = function () {
        console.log("guild treasureCasePanel search_entry_reqGuildMembers");
        this.model.playersInfoList = guildsMgr_1.default.getInstance().getGuildPlayersInfoList();
        this.model.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        this.view.addPlayersInfoList();
        this.view.refreshBoxInfo();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsTreasureCasesPanelCtrl.prototype.onDestroy = function () {
        this.unschedule(this.countDown);
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Prefab)
    ], GuildsTreasureCasesPanelCtrl.prototype, "pref_playerInfo", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsTreasureCasesPanelCtrl.prototype, "lbl_coinsAmt", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsTreasureCasesPanelCtrl.prototype, "lbl_cardsAmt", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsTreasureCasesPanelCtrl.prototype, "lbl_tickTime", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildsTreasureCasesPanelCtrl.prototype, "spr_guildTreasureIcon", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsTreasureCasesPanelCtrl.prototype, "node_inGamePlayersInfoContent", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsTreasureCasesPanelCtrl.prototype, "node_outGamePlayersInfoContent", void 0);
    __decorate([
        property(cc.ProgressBar)
    ], GuildsTreasureCasesPanelCtrl.prototype, "bar_guildBoxProgress", void 0);
    __decorate([
        property(cc.ScrollView)
    ], GuildsTreasureCasesPanelCtrl.prototype, "inGameScroll_bar", void 0);
    GuildsTreasureCasesPanelCtrl = __decorate([
        ccclass
    ], GuildsTreasureCasesPanelCtrl);
    return GuildsTreasureCasesPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsTreasureCasesPanelCtrl;

cc._RF.pop();