(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/guilds/guildsInvitedPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2a4c95UC4dPUp9qzXaXXg+4', 'guildsInvitedPanel', __filename);
// modules/plaza/script/guilds/guildsInvitedPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var dataids_1 = require("../../../../framework/net/dataids");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
var unsettledMgr_1 = require("../../../../manager/public/unsettledMgr");
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
        _this.guildInvitedIndexInfo = unsettledMgr_1.default.getInstance().getGuildInvited();
        _this.guildInvitedFullInfo = null;
        if (_this.guildInvitedIndexInfo) {
            guildsMgr_1.default.getInstance().reqGuildInviteBrief();
        }
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
            btn_refussAll: ctrl.btn_refussAll,
            btn_close: ctrl.btn_close,
            pref_guildInvitedInfo: ctrl.pref_guildInvitedInfo,
            node_guildInvitedInfoPanel: ctrl.node_guildInvitedInfoPanel,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addGuildInvitedInfo();
    };
    View.prototype.addGuildInvitedInfo = function () {
        if (this.model.guildInvitedFullInfo) {
            this.ui.node_guildInvitedInfoPanel.destroyAllChildren();
            for (var guildInvitedFullInfoIdx = 0; guildInvitedFullInfoIdx < this.model.guildInvitedFullInfo.length; guildInvitedFullInfoIdx++) {
                var invitedData = this.model.guildInvitedFullInfo[guildInvitedFullInfoIdx];
                var prefabNode = cc.instantiate(this.ui.pref_guildInvitedInfo);
                this.ui.node_guildInvitedInfoPanel.addChild(prefabNode);
                prefabNode.getComponent('guildInviteInfo').updateInvitedInfoAndShow(invitedData);
            }
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsInvitedPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsInvitedPanelCtrl, _super);
    function GuildsInvitedPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_refussAll = null;
        _this.pref_guildInvitedInfo = null;
        _this.btn_close = null;
        _this.node_guildInvitedInfoPanel = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsInvitedPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsInvitedPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.reqGuildInviteBrief': this.search_entry_reqGuildInviteBrief,
            'plaza.guild.agreeInvitation': this.plaza_guild_agreeInvitation,
            'plaza.guild.refuseInvitation': this.plaza_guild_refuseInvitation,
        };
    };
    //定义全局事件
    GuildsInvitedPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsInvitedPanelCtrl.prototype.connectUi = function () {
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
        this.connect("click", this.ui.btn_refussAll, this.btnRefussAll.bind(this), "全部拒绝");
        this.connect("click", this.ui.btn_close, this.btnClose.bind(this), "关闭");
    };
    GuildsInvitedPanelCtrl.prototype.btnRefussAll = function () {
        guildsMgr_1.default.getInstance().refuseInvitation();
        console.log("全部拒绝");
    };
    GuildsInvitedPanelCtrl.prototype.btnClose = function () {
        this.remove();
    };
    GuildsInvitedPanelCtrl.prototype.search_entry_reqGuildInviteBrief = function () {
        this.model.guildInvitedFullInfo = guildsMgr_1.default.getInstance().getGuildInvitedInfo();
        this.view.addGuildInvitedInfo();
    };
    GuildsInvitedPanelCtrl.prototype.plaza_guild_agreeInvitation = function (msg) {
        var guildId = msg.getDataByType(dataids_1.dataids.ID_USREGUILDID_CHANGED);
        console.log("plaza_guild_agreeInvitation", guildId);
        if (guildId) {
            guildsMgr_1.default.getInstance().reqMyGuildDetail();
            guildsMgr_1.default.getInstance().reqGuildMembers(guildId, 0);
            this.remove();
            this.closeModule("guilds");
            this.openSubModule('guildsInfo');
        }
    };
    GuildsInvitedPanelCtrl.prototype.plaza_guild_refuseInvitation = function () {
        this.remove();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsInvitedPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsInvitedPanelCtrl.prototype, "btn_refussAll", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsInvitedPanelCtrl.prototype, "pref_guildInvitedInfo", void 0);
    __decorate([
        property(cc.Button)
    ], GuildsInvitedPanelCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsInvitedPanelCtrl.prototype, "node_guildInvitedInfoPanel", void 0);
    GuildsInvitedPanelCtrl = __decorate([
        ccclass
    ], GuildsInvitedPanelCtrl);
    return GuildsInvitedPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsInvitedPanelCtrl;

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
        //# sourceMappingURL=guildsInvitedPanel.js.map
        