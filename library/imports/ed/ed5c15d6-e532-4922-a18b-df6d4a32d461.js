"use strict";
cc._RF.push(module, 'ed5c1XW5TJJIqGL321KMtRh', 'guildsInfoPanel');
// modules/plaza/script/guilds/guildsInfoPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
var friendsMgr_1 = require("../../../../manager/public/friendsMgr");
var guildMembersMgr_1 = require("../../../../manager/public/guildMembersMgr");
var enums_1 = require("../../../../manager/enums");
var tableMgr_1 = require("../../../../manager/public/tableMgr");
/*
author: 汤凯
日期:2018-11-19
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.playerContentHeight = 360;
        _this.myInfo = userMgr_1.default.getInstance().getMyInfo();
        _this.myGuildInfo = guildsMgr_1.default.getInstance().getMyGuildInfo();
        _this.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        _this.guildPlayerInfoList = guildsMgr_1.default.getInstance().getGuildPlayersInfoList();
        _this.operationPlayerInfo = null;
        _this.playerInfoLeap = 110;
        return _this;
    }
    Model.prototype.isGuildMember = function () {
        return this.myInfo.guildId;
    };
    Model.prototype.isFriend = function () {
        if (this.operationPlayerInfo) {
            return friendsMgr_1.default.getInstance().isFriend(this.operationPlayerInfo.id);
        }
        return false;
    };
    Model.prototype.kickMember = function (value) {
        this.guildPlayerInfoList.members.removeByValue(value);
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_joinGuild: ctrl.btn_joinGuild,
            btn_leaveGuild: ctrl.btn_leaveGuild,
            btn_donate: ctrl.btn_donate,
            pref_playerInfo: ctrl.pref_playerInfo,
            node_playerInfoList: ctrl.node_playerInfoList,
            spr_guildIcon: ctrl.spr_guildIcon,
            lbl_guildLevel: ctrl.lbl_guildLevel,
            lbl_guildLevelValue: ctrl.lbl_guildLevelValue,
            lbl_guildName: ctrl.lbl_guildName,
            lbl_guildEnterTypeValue: ctrl.lbl_guildEnterTypeValue,
            lbl_guildContributionPointsValue: ctrl.lbl_guildContributionPointsValue,
            lbl_guildIDValue: ctrl.lbl_guildIDValue,
            lbl_guildMembersValue: ctrl.lbl_guildMembersValue,
            lbl_guildNeededStageValue: ctrl.lbl_guildNeededStageValue,
            lbl_guildAnnouncementValue: ctrl.lbl_guildAnnouncementValue,
            node_guildPlayerOperations: ctrl.node_guildPlayerOperations,
            lbl_operatorName: ctrl.lbl_operatorName,
            btn_playerInfo: ctrl.btn_playerInfo,
            btn_demote: ctrl.btn_demote,
            btn_promote: ctrl.btn_promote,
            btn_addFriend: ctrl.btn_addFriend,
            btn_transferGuild: ctrl.btn_transferGuild,
            btn_kick: ctrl.btn_kick,
            btn_clippingNode: ctrl.btn_clippingNode,
            btn_guildSetting: ctrl.btn_guildSetting,
            pref_guildSetting: ctrl.pref_guildSetting,
            scroll_bar: ctrl.scroll_bar,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.refreshGuildInfo();
        this.refreshPlayerInfoList();
    };
    View.prototype.showMemberBtns = function () {
        if (this.model.isGuildMember() == 0) {
            this.ui.btn_joinGuild.node.active = true;
            this.ui.btn_leaveGuild.node.active = false;
            this.ui.btn_donate.node.active = false;
        }
        else {
            this.ui.btn_joinGuild.node.active = false;
            this.ui.btn_leaveGuild.node.active = true;
            this.ui.btn_donate.node.active = true;
            if (this.model.myGuildInfo && this.model.myGuildInfo.position >= enums_1.enums.Guild_President) {
                this.ui.btn_guildSetting.node.active = true;
            }
        }
    };
    View.prototype.refreshPlayerInfoList = function () {
        if (this.model.guildPlayerInfoList && this.model.guildPlayerInfoList.members.length > 0 && this.node.active) {
            this.ui.node_playerInfoList.destroyAllChildren();
            this.ui.node_playerInfoList.setContentSize(this.ui.node_playerInfoList.getContentSize().width, (this.model.guildPlayerInfoList.page + 1) * this.model.playerContentHeight);
            for (var guildIdx = 0; guildIdx < this.model.guildPlayerInfoList.members.length; guildIdx++) {
                var guildPlayerInfoData = this.model.guildPlayerInfoList.members[guildIdx];
                var playerInfo = cc.instantiate(this.ui.pref_playerInfo);
                this.ui.node_playerInfoList.addChild(playerInfo);
                playerInfo.getComponent('guildPlayerInfo').updateAndShowGuildPlayerInfo(guildPlayerInfoData);
            }
        }
    };
    View.prototype.updateEnterType = function () {
        switch (this.model.guildInfo.enterType) {
            case enums_1.enums.GuildJoinType_CannotJoin:
                this.ui.lbl_guildEnterTypeValue.string = '不可加入';
                break;
            case enums_1.enums.GuildJoinType_NeedApproval:
                this.ui.lbl_guildEnterTypeValue.string = '需要批准';
                break;
            default:
                this.ui.lbl_guildEnterTypeValue.string = '允许任何人';
                break;
        }
    };
    View.prototype.refreshGuildInfo = function () {
        this.showMemberBtns();
        if (this.model.guildInfo) {
            this.ui.lbl_guildAnnouncementValue.string = this.model.guildInfo.announcement;
            // this.ui.spr_guildIcon = this.model.guildInfo.badgeId;
            this.ui.lbl_guildLevel.string = 'LV.' + this.model.guildInfo.lv;
            this.ui.lbl_guildLevelValue.string = this.model.guildInfo.exp;
            this.ui.lbl_guildName.string = this.model.guildInfo.name;
            var card = tableMgr_1.default.getInstance().search('duanwei_duanwei', { stage: this.model.guildInfo.neededStage });
            this.updateEnterType();
            this.ui.lbl_guildContributionPointsValue.string = this.model.guildInfo.donate;
            this.ui.lbl_guildIDValue.string = this.model.guildInfo.id;
            this.ui.lbl_guildMembersValue.string = this.model.guildInfo.memberAmount;
            this.ui.lbl_guildNeededStageValue.string = card.name;
        }
    };
    View.prototype.showGuildPlayerOperations = function () {
        this.ui.node_guildPlayerOperations.active = true;
        this.ui.lbl_operatorName.string = this.model.operationPlayerInfo.nickname;
        if (this.model.isGuildMember() == 0) {
            this.showNotGuildMemberBtns();
        }
        else if (this.model.operationPlayerInfo.id == this.model.myInfo.userUID) {
            this.showSelfBtns();
        }
        else if (this.model.myGuildInfo) {
            switch (this.model.myGuildInfo.position) {
                case enums_1.enums.Guild_Member:
                    this.showGuildMemberBtns();
                    break;
                case enums_1.enums.Guild_President:
                    this.showGuildPresidentBtns();
                    break;
                case enums_1.enums.Guild_VicePresident:
                    this.showGuildVicePresidentBtns();
                    break;
            }
        }
    };
    View.prototype.hideGuildPlayerOperations = function () {
        this.ui.node_guildPlayerOperations.active = false;
    };
    View.prototype.showNotGuildMemberBtns = function () {
        this.ui.btn_playerInfo.node.active = true;
        this.ui.btn_demote.node.active = false;
        this.ui.btn_promote.node.active = false;
        this.ui.btn_addFriend.node.active = !this.model.isFriend();
        this.ui.btn_transferGuild.node.active = false;
        this.ui.btn_kick.node.active = false;
    };
    View.prototype.showSelfBtns = function () {
        this.ui.btn_playerInfo.node.active = true;
        this.ui.btn_demote.node.active = false;
        this.ui.btn_promote.node.active = false;
        this.ui.btn_addFriend.node.active = false;
        this.ui.btn_transferGuild.node.active = false;
        this.ui.btn_kick.node.active = false;
    };
    View.prototype.showGuildMemberBtns = function () {
        this.ui.btn_playerInfo.node.active = true;
        this.ui.btn_demote.node.active = false;
        this.ui.btn_promote.node.active = false;
        this.ui.btn_addFriend.node.active = !this.model.isFriend();
        this.ui.btn_transferGuild.node.active = false;
        this.ui.btn_kick.node.active = false;
    };
    View.prototype.showGuildPresidentBtns = function () {
        this.ui.btn_playerInfo.node.active = true;
        this.ui.btn_demote.node.active = true;
        this.ui.btn_promote.node.active = true;
        this.ui.btn_addFriend.node.active = !this.model.isFriend();
        this.ui.btn_transferGuild.node.active = true;
        this.ui.btn_kick.node.active = true;
    };
    View.prototype.showGuildVicePresidentBtns = function () {
        this.ui.btn_playerInfo.node.active = true;
        this.ui.btn_demote.node.active = true;
        this.ui.btn_promote.node.active = false;
        this.ui.btn_addFriend.node.active = !this.model.isFriend();
        this.ui.btn_transferGuild.node.active = false;
        this.ui.btn_kick.node.active = true;
    };
    View.prototype.addGuildSetting = function () {
        var guildSetting = this.node.getChildByName('guildSetting');
        if (guildSetting) {
            guildSetting.destroy();
        }
        var guildSetting = cc.instantiate(this.ui.pref_guildSetting);
        this.node.addChild(guildSetting);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsInfoPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsInfoPanelCtrl, _super);
    function GuildsInfoPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_joinGuild = null;
        _this.btn_leaveGuild = null;
        _this.btn_donate = null;
        _this.pref_playerInfo = null;
        _this.node_playerInfoList = null;
        _this.spr_guildIcon = null;
        _this.lbl_guildLevel = null;
        _this.lbl_guildLevelValue = null;
        _this.lbl_guildName = null;
        _this.lbl_guildEnterTypeValue = null;
        _this.lbl_guildContributionPointsValue = null;
        _this.lbl_guildIDValue = null;
        _this.lbl_guildMembersValue = null;
        _this.lbl_guildNeededStageValue = null;
        _this.lbl_guildAnnouncementValue = null;
        _this.node_guildPlayerOperations = null;
        _this.lbl_operatorName = null;
        _this.btn_playerInfo = null;
        _this.btn_demote = null;
        _this.btn_promote = null;
        _this.btn_addFriend = null;
        _this.btn_transferGuild = null;
        _this.btn_kick = null;
        _this.btn_clippingNode = null;
        _this.btn_guildSetting = null;
        _this.pref_guildSetting = null;
        _this.scroll_bar = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsInfoPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsInfoPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.randomGuildList': this.search_entry_randomGuildList,
            'guild.guild.updateAnnouncement': this.guild_guild_updateAnnouncement,
            'search.entry.reqGuildMembers': this.search_entry_reqGuildMembers,
            'guild.guild.reqMyGuildDetail': this.guild_guild_reqMyGuildDetail,
            'plaza.guild.reqGuildDetail': this.plaza_guild_reqGuildDetail,
            'plaza.guild.joinGuild': this.plaza_guild_joinGuild,
            'guild.member.kickMember': this.guild_member_kickMember,
            'guild.member.transPresident': this.guild_member_transPresident,
            'guild.member.appointVicePresident': this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident': this.guild_member_fireVicePresident,
            'plaza.friends.addFriend': this.plaza_friends_addFriend,
        };
    };
    //定义全局事件
    GuildsInfoPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = { 'guild.playerOperation': this.guildPlayerOperation };
    };
    //绑定操作的回调
    GuildsInfoPanelCtrl.prototype.connectUi = function () {
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
        this.connect("click", this.ui.btn_joinGuild, this.btnJoinGuild.bind(this), "加入公会");
        this.connect("click", this.ui.btn_leaveGuild, this.btnLeaveGuild.bind(this), "退出公会");
        this.connect("click", this.ui.btn_donate, this.btnDonate.bind(this), "捐献");
        this.connect("click", this.ui.btn_playerInfo, this.btnPlayerInfo.bind(this), "玩家信息");
        this.connect("click", this.ui.btn_demote, this.btnDemote.bind(this), "降职");
        this.connect("click", this.ui.btn_promote, this.btnPromote.bind(this), "升值");
        this.connect("click", this.ui.btn_addFriend, this.btnAddFriend.bind(this), "添加好友");
        this.connect("click", this.ui.btn_transferGuild, this.btnTransferGuild.bind(this), "转让公会");
        this.connect("click", this.ui.btn_kick, this.btnKick.bind(this), "踢出");
        this.connect("click", this.ui.btn_clippingNode, this.btnClippingNode.bind(this), "踢出");
        this.connect("click", this.ui.btn_guildSetting, this.btnGuildSetting.bind(this), "公会设置");
        this.connect("scroll-to-bottom", this.ui.scroll_bar.node, this.scrollToBottom.bind(this), "拉到末尾");
    };
    GuildsInfoPanelCtrl.prototype.scrollToBottom = function () {
        guildsMgr_1.default.getInstance().reqGuildMembers(userMgr_1.default.getInstance().getMyInfo().guildId, guildsMgr_1.default.getInstance().membersPage + 1);
    };
    GuildsInfoPanelCtrl.prototype.search_entry_randomGuildList = function () {
        // this.model.guildList = GuildsMgr.getInstance().getRandomGuildList();
        // this.view.freshGuildList();
    };
    GuildsInfoPanelCtrl.prototype.btnGuildSetting = function () {
        this.view.addGuildSetting();
    };
    GuildsInfoPanelCtrl.prototype.btnClippingNode = function () {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.btnLeaveGuild = function () {
        guildMembersMgr_1.default.getInstance().quitGuild();
    };
    GuildsInfoPanelCtrl.prototype.btnDonate = function () {
    };
    GuildsInfoPanelCtrl.prototype.btnPlayerInfo = function () {
        if (this.model.operationPlayerInfo) {
            // guildMembersMgr.getInstance().
        }
    };
    GuildsInfoPanelCtrl.prototype.btnDemote = function () {
        if (this.model.operationPlayerInfo) {
            guildMembersMgr_1.default.getInstance().fireVicePresident(this.model.operationPlayerInfo.id);
        }
    };
    GuildsInfoPanelCtrl.prototype.btnPromote = function () {
        if (this.model.operationPlayerInfo) {
            guildMembersMgr_1.default.getInstance().appointVicePresident(this.model.operationPlayerInfo.id);
        }
    };
    GuildsInfoPanelCtrl.prototype.btnAddFriend = function () {
        if (this.model.operationPlayerInfo) {
            friendsMgr_1.default.getInstance().addFriend(this.model.operationPlayerInfo.id);
        }
    };
    GuildsInfoPanelCtrl.prototype.btnTransferGuild = function () {
        if (this.model.operationPlayerInfo) {
            guildMembersMgr_1.default.getInstance().transPresident(this.model.operationPlayerInfo.id);
        }
    };
    GuildsInfoPanelCtrl.prototype.btnKick = function () {
        if (this.model.operationPlayerInfo) {
            guildMembersMgr_1.default.getInstance().kickMember(this.model.operationPlayerInfo.id);
        }
    };
    GuildsInfoPanelCtrl.prototype.btnJoinGuild = function () {
        console.log("btnJoinGuild");
        if (this.model.guildInfo) {
            switch (this.model.guildInfo.enterType) {
                case enums_1.enums.GuildJoinType_CannotJoin:
                    break;
                case enums_1.enums.GuildJoinType_NeedApproval:
                    guildsMgr_1.default.getInstance().applyJoinGuild(this.model.guildInfo.id);
                    break;
                default:
                    guildsMgr_1.default.getInstance().reqJoinGuild(this.model.guildInfo.id);
                    break;
            }
        }
    };
    GuildsInfoPanelCtrl.prototype.plaza_friends_addFriend = function () {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.guild_member_kickMember = function (msg) {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.guild_member_transPresident = function (msg) {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.guild_member_appointVicePresident = function (msg) {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.guild_member_fireVicePresident = function (msg) {
        this.view.hideGuildPlayerOperations();
    };
    GuildsInfoPanelCtrl.prototype.guildPlayerOperation = function (data) {
        console.log("guildPlayerOperation", data);
        this.model.operationPlayerInfo = data;
        if (this.model.operationPlayerInfo) {
            this.view.showGuildPlayerOperations();
        }
    };
    GuildsInfoPanelCtrl.prototype.plaza_guild_joinGuild = function () {
        guildsMgr_1.default.getInstance().reqMyGuildDetail();
        guildsMgr_1.default.getInstance().reqGuildMembers(guildsMgr_1.default.getInstance().getGuildId(), 0);
    };
    GuildsInfoPanelCtrl.prototype.guild_guild_updateAnnouncement = function () {
    };
    GuildsInfoPanelCtrl.prototype.guild_guild_reqMyGuildDetail = function () {
        this.model.myGuildInfo = guildsMgr_1.default.getInstance().getMyGuildInfo();
        this.model.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        this.view.refreshGuildInfo();
    };
    GuildsInfoPanelCtrl.prototype.plaza_guild_reqGuildDetail = function () {
        this.model.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        this.view.refreshGuildInfo();
    };
    GuildsInfoPanelCtrl.prototype.search_entry_reqGuildMembers = function () {
        this.model.guildPlayerInfoList = guildsMgr_1.default.getInstance().getGuildPlayersInfoList();
        this.view.refreshPlayerInfoList();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsInfoPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_joinGuild", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_leaveGuild", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_donate", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoPanelCtrl.prototype, "pref_playerInfo", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsInfoPanelCtrl.prototype, "node_playerInfoList", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildsInfoPanelCtrl.prototype, "spr_guildIcon", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildLevel", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildLevelValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildEnterTypeValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildContributionPointsValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildIDValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildMembersValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildNeededStageValue", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_guildAnnouncementValue", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsInfoPanelCtrl.prototype, "node_guildPlayerOperations", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsInfoPanelCtrl.prototype, "lbl_operatorName", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_playerInfo", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_demote", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_promote", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_addFriend", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_transferGuild", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_kick", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_clippingNode", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoPanelCtrl.prototype, "btn_guildSetting", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoPanelCtrl.prototype, "pref_guildSetting", void 0);
    __decorate([
        property(cc.ScrollView)
    ], GuildsInfoPanelCtrl.prototype, "scroll_bar", void 0);
    GuildsInfoPanelCtrl = __decorate([
        ccclass
    ], GuildsInfoPanelCtrl);
    return GuildsInfoPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsInfoPanelCtrl;

cc._RF.pop();