"use strict";
cc._RF.push(module, 'ce854VTIXJNZIVCU2pma+gC', 'guildSetting');
// modules/plaza/script/guilds/guildSetting.ts

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
        _this.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        _this.guildName = _this.guildInfo.name;
        _this.badgeId = _this.guildInfo.badgeId;
        _this.enterType = _this.guildInfo.enterType;
        _this.neededStage = _this.guildInfo.neededStage;
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
        this.guildInfo.enterType = this.enterType;
    };
    Model.prototype.updateNeededStage = function (increment) {
        this.neededStage += increment;
        if (this.neededStage > 10) {
            this.neededStage = 1;
        }
        if (this.neededStage < 1) {
            this.neededStage = 10;
        }
        this.guildInfo.neededStage = this.neededStage;
    };
    Model.prototype.updateBadge = function (badgeId) {
        this.badgeId = badgeId;
        this.guildInfo.badgeId = this.badgeId;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_save: ctrl.btn_save,
            btn_close: ctrl.btn_close,
            lbl_guildName: ctrl.lbl_guildName,
            lbl_guildType: ctrl.lbl_guildType,
            lbl_guildRank: ctrl.lbl_guildRank,
            btn_enterTypeUp: ctrl.btn_enterTypeUp,
            btn_enterTypeDown: ctrl.btn_enterTypeDown,
            btn_divisionUp: ctrl.btn_divisionUp,
            btn_divisionDown: ctrl.btn_divisionDown,
            node_iconsPanel: ctrl.node_iconsPanel,
            btn_selectIcons: ctrl.btn_selectIcons,
            btn_clippingNode: ctrl.btn_clippingNode,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        if (this.model.guildInfo) {
            this.ui.lbl_guildName.string = this.model.guildInfo.name;
            this.updateEnterType();
            this.updateNeededStage();
        }
    };
    View.prototype.showIconsPanel = function (flag) {
        this.ui.node_iconsPanel.active = flag;
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
    return View;
}(BaseView_1.default));
//c, 控制
var GuildSettingCtrl = /** @class */ (function (_super) {
    __extends(GuildSettingCtrl, _super);
    function GuildSettingCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_save = null;
        _this.btn_close = null;
        _this.btn_selectIcons = null;
        _this.lbl_guildName = null;
        _this.lbl_guildType = null;
        _this.lbl_guildRank = null;
        _this.spr_guildBadge = null;
        _this.btn_enterTypeUp = null;
        _this.btn_enterTypeDown = null;
        _this.btn_divisionUp = null;
        _this.btn_divisionDown = null;
        _this.node_iconsPanel = null;
        _this.btn_clippingNode = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildSettingCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildSettingCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.guild.updateSetting': this.guild_guild_updateSetting
        };
    };
    //定义全局事件
    GuildSettingCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildSettingCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_save, this.btnSave.bind(this), "保存公会设置");
        this.connect("click", this.ui.btn_close, this.btnClose.bind(this), "关闭");
        this.connect("click", this.ui.btn_enterTypeUp, this.btnEnterTypeUp.bind(this), "类型上");
        this.connect("click", this.ui.btn_enterTypeDown, this.btnEnterTypeDown.bind(this), "类型下");
        this.connect("click", this.ui.btn_divisionUp, this.btnDivisionUp.bind(this), "段位上");
        this.connect("click", this.ui.btn_divisionDown, this.btnDivisionDown.bind(this), "段位下");
        this.connect("click", this.ui.btn_selectIcons, this.btnSelectIcons.bind(this), "点击切换公会徽章");
        this.connect("click", this.ui.btn_clippingNode, this.btnClippingNode.bind(this), "点击隐藏底板");
        this.connectIcons();
    };
    GuildSettingCtrl.prototype.connectIcons = function () {
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
    GuildSettingCtrl.prototype.btnEnterTypeUp = function () {
        this.model.updateEnterType(1);
        this.view.updateEnterType();
    };
    GuildSettingCtrl.prototype.btnEnterTypeDown = function () {
        this.model.updateEnterType(-1);
        this.view.updateEnterType();
    };
    GuildSettingCtrl.prototype.btnDivisionUp = function () {
        this.model.updateNeededStage(1);
        this.view.updateNeededStage();
    };
    GuildSettingCtrl.prototype.btnDivisionDown = function () {
        this.model.updateNeededStage(-1);
        this.view.updateNeededStage();
    };
    GuildSettingCtrl.prototype.btnSelectIcons = function () {
        this.view.showIconsPanel(true);
    };
    GuildSettingCtrl.prototype.btnClippingNode = function () {
        this.view.showIconsPanel(false);
    };
    GuildSettingCtrl.prototype.btnSave = function () {
        if (this.model.guildInfo) {
            guildsMgr_1.default.getInstance().updateSetting(this.model.guildInfo.name, this.model.guildInfo.badgeId, this.model.guildInfo.enterType, this.model.guildInfo.neededStage);
        }
    };
    GuildSettingCtrl.prototype.guild_guild_updateSetting = function () {
        this.remove();
    };
    GuildSettingCtrl.prototype.btnClose = function () {
        this.remove();
    };
    // update(dt) {}
    GuildSettingCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_save", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_selectIcons", void 0);
    __decorate([
        property(cc.Label)
    ], GuildSettingCtrl.prototype, "lbl_guildName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildSettingCtrl.prototype, "lbl_guildType", void 0);
    __decorate([
        property(cc.Label)
    ], GuildSettingCtrl.prototype, "lbl_guildRank", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildSettingCtrl.prototype, "spr_guildBadge", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_enterTypeUp", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_enterTypeDown", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_divisionUp", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_divisionDown", void 0);
    __decorate([
        property(cc.Node)
    ], GuildSettingCtrl.prototype, "node_iconsPanel", void 0);
    __decorate([
        property(cc.Button)
    ], GuildSettingCtrl.prototype, "btn_clippingNode", void 0);
    GuildSettingCtrl = __decorate([
        ccclass
    ], GuildSettingCtrl);
    return GuildSettingCtrl;
}(BaseCtrl_1.default));
exports.default = GuildSettingCtrl;

cc._RF.pop();