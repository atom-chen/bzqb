"use strict";
cc._RF.push(module, 'c1177a78tpL8YKNpBECW6bB', 'createGuild');
// modules/plaza/script/guilds/createGuild.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
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
        _this.guildName = null;
        _this.badgeId = 0;
        _this.enterType = enums_1.enums.GuildJoinType_AllJoin;
        _this.neededStage = 1;
        return _this;
    }
    Model.prototype.updateEnterType = function (increment) {
        this.enterType += increment;
        if (this.enterType > enums_1.enums.GuildJoinType_CannotJoin) {
            this.enterType = enums_1.enums.GuildJoinType_AllJoin;
        }
        if (this.enterType < enums_1.enums.GuildJoinType_AllJoin) {
            this.enterType = enums_1.enums.GuildJoinType_CannotJoin;
        }
    };
    Model.prototype.updateNeededStage = function (increment) {
        this.neededStage += increment;
        if (this.neededStage > 10) {
            this.neededStage = 1;
        }
        if (this.neededStage < 1) {
            this.neededStage = 10;
        }
    };
    Model.prototype.updateBadge = function (badgeId) {
        this.badgeId = badgeId;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_create: ctrl.btn_create,
            btn_close: ctrl.btn_close,
            edit_guildName: ctrl.edit_guildName,
            lbl_guildType: ctrl.lbl_guildType,
            lbl_guildRank: ctrl.lbl_guildRank,
            btn_enterTypeUp: ctrl.btn_enterTypeUp,
            btn_enterTypeDown: ctrl.btn_enterTypeDown,
            btn_divisionUp: ctrl.btn_divisionUp,
            btn_divisionDown: ctrl.btn_divisionDown,
            node_iconsPanel: ctrl.node_iconsPanel,
            btn_selectIcons: ctrl.btn_selectIcons,
            btn_clippingNode: ctrl.btn_clippingNode
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.updateEnterType = function () {
        switch (this.model.enterType) {
            case enums_1.enums.GuildJoinType_CannotJoin:
                this.ui.lbl_guildType.string = '不可加入';
                break;
            case enums_1.enums.GuildJoinType_NeedApproval:
                this.ui.lbl_guildType.string = '需要批准';
                break;
            default:
                this.ui.lbl_guildType.string = '允许任何人';
                break;
        }
    };
    View.prototype.updateNeededStage = function () {
        var card = tableMgr_1.default.getInstance().search('duanwei_duanwei', { stage: this.model.neededStage });
        this.ui.lbl_guildRank.string = card.name;
    };
    View.prototype.updateBadge = function () {
        switch (this.model.badgeId) {
            case enums_1.enums.Get_Gold:
                // this.ui.lbl_guildRank.string = '不可加入';
                break;
            case enums_1.enums.Get_Gold:
                // this.ui.lbl_guildRank.string = '需要批准';
                break;
            default:
                // this.ui.lbl_guildRank.string = '允许任何人';
                break;
        }
    };
    View.prototype.showIconsPanel = function (flag) {
        this.ui.node_iconsPanel.active = flag;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var CreateGuildCtrl = /** @class */ (function (_super) {
    __extends(CreateGuildCtrl, _super);
    function CreateGuildCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_create = null;
        _this.btn_close = null;
        _this.edit_guildName = null;
        _this.lbl_guildType = null;
        _this.lbl_guildRank = null;
        _this.spr_guildBadge = null;
        _this.btn_enterTypeUp = null;
        _this.btn_enterTypeDown = null;
        _this.btn_divisionUp = null;
        _this.btn_divisionDown = null;
        _this.node_iconsPanel = null;
        _this.btn_clippingNode = null;
        _this.btn_selectIcons = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    CreateGuildCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    CreateGuildCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.guild.createGuild': this.plaza_guild_createGuild
        };
    };
    //定义全局事件
    CreateGuildCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    CreateGuildCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_create, this.btnCreate.bind(this), "创建公会");
        this.connect("click", this.ui.btn_close, this.btnClose.bind(this), "关闭");
        // this.connect("text-changed",this.ui.edit_guildName,this.editGuildNameChanged.bind(this),"公会名称编辑中");
        this.connect("editing-did-ended", this.ui.edit_guildName, this.editGuildNameChangedEnd.bind(this), "公会名称编辑完");
        this.connect("click", this.ui.btn_enterTypeUp, this.btnEnterTypeUp.bind(this), "关闭");
        this.connect("click", this.ui.btn_enterTypeDown, this.btnEnterTypeDown.bind(this), "关闭");
        this.connect("click", this.ui.btn_divisionUp, this.btnDivisionUp.bind(this), "关闭");
        this.connect("click", this.ui.btn_divisionDown, this.btnDivisionDown.bind(this), "关闭");
        this.connect("click", this.ui.btn_selectIcons, this.btnSelectIcons.bind(this), "点击切换公会徽章");
        this.connect("click", this.ui.btn_clippingNode, this.btnClippingNode.bind(this), "点击隐藏底板");
        this.connectIcons();
    };
    CreateGuildCtrl.prototype.connectIcons = function () {
        var _this = this;
        var iconsList = this.node_iconsPanel.children;
        var _loop_1 = function (i) {
            this_1.connect("click", iconsList[i], function () {
                console.log("click icon", i);
                _this.view.showIconsPanel(false);
            }), "点击徽章";
            ;
        };
        var this_1 = this;
        for (var i = 0; i < iconsList.length; i++) {
            _loop_1(i);
        }
    };
    CreateGuildCtrl.prototype.btnSelectIcons = function () {
        this.view.showIconsPanel(true);
    };
    CreateGuildCtrl.prototype.btnClippingNode = function () {
        this.view.showIconsPanel(false);
    };
    CreateGuildCtrl.prototype.btnEnterTypeUp = function () {
        this.model.updateEnterType(1);
        this.view.updateEnterType();
    };
    CreateGuildCtrl.prototype.btnEnterTypeDown = function () {
        this.model.updateEnterType(-1);
        this.view.updateEnterType();
    };
    CreateGuildCtrl.prototype.btnDivisionUp = function () {
        this.model.updateNeededStage(1);
        this.view.updateNeededStage();
    };
    CreateGuildCtrl.prototype.btnDivisionDown = function () {
        this.model.updateNeededStage(-1);
        this.view.updateNeededStage();
    };
    CreateGuildCtrl.prototype.btnCreate = function () {
        if (this.model.guildName) {
            guildsMgr_1.default.getInstance().reqCreateGuild(this.model.guildName, this.model.badgeId, this.model.enterType, this.model.neededStage);
        }
    };
    CreateGuildCtrl.prototype.btnClose = function () {
        this.remove();
    };
    CreateGuildCtrl.prototype.editGuildNameChanged = function (event) {
    };
    CreateGuildCtrl.prototype.editGuildNameChangedEnd = function (event) {
        this.model.guildName = event.string;
    };
    CreateGuildCtrl.prototype.plaza_guild_createGuild = function () {
        guildsMgr_1.default.getInstance().reqMyGuildDetail();
        guildsMgr_1.default.getInstance().reqGuildMembers(guildsMgr_1.default.getInstance().getGuildId(), 0);
        this.remove();
        this.closeModule("guilds");
        this.openSubModule('guildsInfo');
    };
    // update(dt) {}
    CreateGuildCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_create", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.EditBox)
    ], CreateGuildCtrl.prototype, "edit_guildName", void 0);
    __decorate([
        property(cc.Label)
    ], CreateGuildCtrl.prototype, "lbl_guildType", void 0);
    __decorate([
        property(cc.Label)
    ], CreateGuildCtrl.prototype, "lbl_guildRank", void 0);
    __decorate([
        property(cc.Sprite)
    ], CreateGuildCtrl.prototype, "spr_guildBadge", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_enterTypeUp", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_enterTypeDown", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_divisionUp", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_divisionDown", void 0);
    __decorate([
        property(cc.Node)
    ], CreateGuildCtrl.prototype, "node_iconsPanel", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_clippingNode", void 0);
    __decorate([
        property(cc.Button)
    ], CreateGuildCtrl.prototype, "btn_selectIcons", void 0);
    CreateGuildCtrl = __decorate([
        ccclass
    ], CreateGuildCtrl);
    return CreateGuildCtrl;
}(BaseCtrl_1.default));
exports.default = CreateGuildCtrl;

cc._RF.pop();