"use strict";
cc._RF.push(module, '31d1bi099xF6qLb8jLdFWwy', 'guildsInfo');
// modules/plaza/script/guilds/guildsInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
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
        _this.ui = {
            btn_close: ctrl.btn_close,
            pref_guildsInfoPanel: ctrl.pref_guildsInfoPanel,
            pref_guildsFrame: ctrl.pref_guildsFrame,
            node_funcBlocks: ctrl.node_funcBlocks,
            btn_guildMembers: ctrl.btn_guildMembers,
            btn_guildTreasureCase: ctrl.btn_guildTreasureCase,
            btn_guildShop: ctrl.btn_guildShop,
            btn_guildApplication: ctrl.btn_guildApplication,
            node_panel: ctrl.node_panel,
            pref_guildShop: ctrl.pref_guildShop,
            pref_guildTreasureCasesPanel: ctrl.pref_guildTreasureCasesPanel,
            pref_guildsApplicationPanel: ctrl.pref_guildsApplicationPanel,
            guildsInfoPanel: null,
            guildsShopPanel: null,
            guildsTreasureCasePanel: null,
            guildsApplicationPanel: null,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.guildsInfoPanel = cc.instantiate(this.ui.pref_guildsInfoPanel);
        this.ui.node_panel.addChild(this.ui.guildsInfoPanel);
        this.ui.guildsShopPanel = cc.instantiate(this.ui.pref_guildShop);
        this.ui.guildsShopPanel.active = false;
        this.ui.node_panel.addChild(this.ui.guildsShopPanel);
        this.ui.guildsTreasureCasePanel = cc.instantiate(this.ui.pref_guildTreasureCasesPanel);
        this.ui.guildsTreasureCasePanel.active = false;
        this.ui.node_panel.addChild(this.ui.guildsTreasureCasePanel);
        this.ui.guildsApplicationPanel = cc.instantiate(this.ui.pref_guildsApplicationPanel);
        this.ui.guildsApplicationPanel.active = false;
        this.ui.node_panel.addChild(this.ui.guildsApplicationPanel);
    };
    View.prototype.initGuildFrame = function () {
        var prefabNode = cc.instantiate(this.ui.pref_guildsFrame);
        this.node.addChild(prefabNode);
        this.ui.node_funcBlocks.active = true;
    };
    View.prototype.addGuildMembersPanel = function () {
        //this.ui.node_panel.removeAllChildren();
        if (this.ui.guildsShopPanel) {
            this.ui.guildsShopPanel.active = false;
        }
        if (this.ui.guildsInfoPanel) {
            this.ui.guildsInfoPanel.active = true;
        }
        if (this.ui.guildsApplicationPanel) {
            this.ui.guildsApplicationPanel.active = false;
        }
        if (this.ui.guildsTreasureCasePanel) {
            this.ui.guildsTreasureCasePanel.active = false;
        }
    };
    View.prototype.addGuildShopPanel = function () {
        //this.ui.node_panel.removeAllChildren();
        if (this.ui.guildsInfoPanel) {
            this.ui.guildsInfoPanel.active = false;
        }
        if (this.ui.guildsShopPanel) {
            this.ui.guildsShopPanel.active = true;
        }
        if (this.ui.guildsApplicationPanel) {
            this.ui.guildsApplicationPanel.active = false;
        }
        if (this.ui.guildsTreasureCasePanel) {
            this.ui.guildsTreasureCasePanel.active = false;
        }
    };
    View.prototype.addGuildTreasureCasePanel = function () {
        if (this.ui.guildsInfoPanel) {
            this.ui.guildsInfoPanel.active = false;
        }
        if (this.ui.guildsShopPanel) {
            this.ui.guildsShopPanel.active = false;
        }
        if (this.ui.guildsApplicationPanel) {
            this.ui.guildsApplicationPanel.active = false;
        }
        if (this.ui.guildsTreasureCasePanel) {
            this.ui.guildsTreasureCasePanel.active = true;
        }
    };
    View.prototype.addGuildsApplicationPanel = function () {
        if (this.ui.guildsInfoPanel) {
            this.ui.guildsInfoPanel.active = false;
        }
        if (this.ui.guildsShopPanel) {
            this.ui.guildsShopPanel.active = false;
        }
        if (this.ui.guildsApplicationPanel) {
            this.ui.guildsApplicationPanel.active = true;
        }
        if (this.ui.guildsTreasureCasePanel) {
            this.ui.guildsTreasureCasePanel.active = false;
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsInfoCtrl = /** @class */ (function (_super) {
    __extends(GuildsInfoCtrl, _super);
    function GuildsInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.pref_guildsInfoPanel = null;
        _this.pref_guildsFrame = null;
        _this.node_funcBlocks = null;
        _this.btn_guildMembers = null;
        _this.btn_guildTreasureCase = null;
        _this.btn_guildShop = null;
        _this.btn_guildApplication = null;
        _this.node_panel = null;
        _this.pref_guildShop = null;
        _this.pref_guildTreasureCasesPanel = null;
        _this.pref_guildsApplicationPanel = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.view.initGuildFrame();
        this.view.addGuildMembersPanel();
    };
    //定义网络事件
    GuildsInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.member.quitGuild': this.guild_member_quitGuild,
        };
    };
    //定义全局事件
    GuildsInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsInfoCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            guildsMgr_1.default.getInstance().clearDatas();
            _this.closeModule("guildsInfo");
        }, "关闭公会界面");
        this.connect("click", this.ui.btn_guildMembers, this.btnGuildMembers.bind(this), "公会成员");
        this.connect("click", this.ui.btn_guildTreasureCase, this.btnGuildTreasureCase.bind(this), "公会宝箱");
        this.connect("click", this.ui.btn_guildShop, this.btnGuildShop.bind(this), "公会商店");
        this.connect("click", this.ui.btn_guildApplication, this.btnGuildApplication.bind(this), "公会申请");
    };
    GuildsInfoCtrl.prototype.btnGuildApplication = function () {
        this.view.addGuildsApplicationPanel();
    };
    GuildsInfoCtrl.prototype.btnGuildShop = function () {
        this.view.addGuildShopPanel();
    };
    GuildsInfoCtrl.prototype.btnGuildTreasureCase = function () {
        this.view.addGuildTreasureCasePanel();
    };
    GuildsInfoCtrl.prototype.btnGuildMembers = function () {
        this.view.addGuildMembersPanel();
    };
    GuildsInfoCtrl.prototype.guild_member_quitGuild = function () {
        guildsMgr_1.default.getInstance().clearDatas();
        this.closeModule("guildsInfo");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsInfoCtrl.prototype.onDestroy = function () {
        guildsMgr_1.default.getInstance().clearDatas();
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsInfoCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoCtrl.prototype, "pref_guildsInfoPanel", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoCtrl.prototype, "pref_guildsFrame", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsInfoCtrl.prototype, "node_funcBlocks", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoCtrl.prototype, "btn_guildMembers", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoCtrl.prototype, "btn_guildTreasureCase", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoCtrl.prototype, "btn_guildShop", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInfoCtrl.prototype, "btn_guildApplication", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsInfoCtrl.prototype, "node_panel", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoCtrl.prototype, "pref_guildShop", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoCtrl.prototype, "pref_guildTreasureCasesPanel", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInfoCtrl.prototype, "pref_guildsApplicationPanel", void 0);
    GuildsInfoCtrl = __decorate([
        ccclass
    ], GuildsInfoCtrl);
    return GuildsInfoCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsInfoCtrl;

cc._RF.pop();