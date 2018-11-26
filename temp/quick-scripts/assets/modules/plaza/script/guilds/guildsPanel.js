(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/guilds/guildsPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'acebdzJw5pJe6T+zbBptmWP', 'guildsPanel', __filename);
// modules/plaza/script/guilds/guildsPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
var dataids_1 = require("../../../../framework/net/dataids");
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
        _this.searchName = null;
        _this.guildList = guildsMgr_1.default.getInstance().getRandomGuildList();
        return _this;
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_search: ctrl.btn_search,
            btn_invitationReceive: ctrl.btn_invitationReceive,
            btn_createGuild: ctrl.btn_createGuild,
            btn_refreshGuilds: ctrl.btn_refreshGuilds,
            edit_searchName: ctrl.edit_searchName,
            pref_guild: ctrl.pref_guild,
            node_guildListNode: ctrl.node_guildListNode,
            scroll_bar: ctrl.scroll_bar,
            pref_guildInvitedPanel: ctrl.pref_guildInvitedPanel,
            node_guildInvitedPanelContent: ctrl.node_guildInvitedPanelContent
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.freshGuildList = function () {
        this.ui.node_guildListNode.destroyAllChildren();
        for (var guildIdx = 0; guildIdx < this.model.guildList.length; guildIdx++) {
            var guildItemData = this.model.guildList[guildIdx];
            var guildItem = cc.instantiate(this.ui.pref_guild);
            this.ui.node_guildListNode.addChild(guildItem);
            guildItem.getComponent('guildItem').updateAndShowGuildItem(guildItemData);
        }
    };
    View.prototype.addGuildInvitedPanel = function () {
        this.ui.node_guildInvitedPanelContent.destroyAllChildren();
        var guildInvitedPanel = cc.instantiate(this.ui.pref_guildInvitedPanel);
        this.ui.node_guildInvitedPanelContent.addChild(guildInvitedPanel);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsPanelCtrl, _super);
    function GuildsPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_search = null;
        _this.btn_invitationReceive = null;
        _this.btn_createGuild = null;
        _this.btn_refreshGuilds = null;
        _this.pref_createGuild = null;
        _this.edit_searchName = null;
        _this.pref_guild = null;
        _this.node_guildListNode = null;
        _this.scroll_bar = null;
        _this.pref_guildInvitedPanel = null;
        _this.node_guildInvitedPanelContent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.randomGuildList': this.search_entry_randomGuildList,
            'search.entry.searchGuild': this.search_entry_searchGuild,
        };
    };
    //定义全局事件
    GuildsPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsPanelCtrl.prototype.connectUi = function () {
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
        this.connect("click", this.ui.btn_search, this.btnSearch.bind(this), "搜索公会");
        this.connect("click", this.ui.btn_invitationReceive, this.btnInvitationReceive.bind(this), "收到公会邀请");
        this.connect("click", this.ui.btn_createGuild, this.btnCreateGuild.bind(this), "创建公会");
        this.connect("click", this.ui.btn_refreshGuilds, this.btnRefreshGuilds.bind(this), "换一批");
        this.connect("editing-did-ended", this.ui.edit_searchName, this.editSearchNameChangedEnd.bind(this), "输入公会名称");
        this.connect("scroll-to-bottom", this.ui.scroll_bar.node, this.scrollToBottom.bind(this), "拉到末尾");
        this.connect("scroll-to-top", this.ui.scroll_bar.node, this.scrollToTop.bind(this), "拉到头");
    };
    GuildsPanelCtrl.prototype.search_entry_randomGuildList = function () {
        this.model.guildList = guildsMgr_1.default.getInstance().getRandomGuildList();
        this.view.freshGuildList();
    };
    GuildsPanelCtrl.prototype.scrollToBottom = function (event) {
        console.log("scrollToBottom", event);
    };
    GuildsPanelCtrl.prototype.scrollToTop = function (event) {
        console.log("scrollToTop", event);
    };
    GuildsPanelCtrl.prototype.search_entry_searchGuild = function (msg) {
        console.log('search_entry_searchGuild', msg);
        this.model.guildList = msg.getDataByType(dataids_1.dataids.ID_GUILDLIST);
        this.view.freshGuildList();
    };
    GuildsPanelCtrl.prototype.btnSearch = function () {
        if (this.model.searchName) {
            guildsMgr_1.default.getInstance().reqSearchGuild(this.model.searchName);
        }
    };
    GuildsPanelCtrl.prototype.btnInvitationReceive = function () {
        this.view.addGuildInvitedPanel();
    };
    GuildsPanelCtrl.prototype.btnCreateGuild = function () {
        var createGuildNode = cc.instantiate(this.pref_createGuild);
        this.node.addChild(createGuildNode);
        // GuildsMgr.getInstance().reqCreateGuild();
    };
    GuildsPanelCtrl.prototype.btnRefreshGuilds = function () {
        guildsMgr_1.default.getInstance().reqRandomGuildList();
    };
    GuildsPanelCtrl.prototype.editSearchNameChangedEnd = function (event) {
        this.model.searchName = event.string;
    };
    GuildsPanelCtrl.prototype.btnGuildItemClick = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsPanelCtrl.prototype, "btn_search", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsPanelCtrl.prototype, "btn_invitationReceive", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsPanelCtrl.prototype, "btn_createGuild", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsPanelCtrl.prototype, "btn_refreshGuilds", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsPanelCtrl.prototype, "pref_createGuild", void 0);
    __decorate([
        property(cc.EditBox)
    ], GuildsPanelCtrl.prototype, "edit_searchName", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsPanelCtrl.prototype, "pref_guild", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsPanelCtrl.prototype, "node_guildListNode", void 0);
    __decorate([
        property(cc.ScrollView)
    ], GuildsPanelCtrl.prototype, "scroll_bar", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsPanelCtrl.prototype, "pref_guildInvitedPanel", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsPanelCtrl.prototype, "node_guildInvitedPanelContent", void 0);
    GuildsPanelCtrl = __decorate([
        ccclass
    ], GuildsPanelCtrl);
    return GuildsPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsPanelCtrl;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=guildsPanel.js.map
        