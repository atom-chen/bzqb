"use strict";
cc._RF.push(module, '3c37acGhd9BhZaFDzQfB2nF', 'guildsApplicationsPanel');
// modules/plaza/script/guilds/guildsApplicationsPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
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
        _this.guildsApplicationsList = null;
        _this.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        if (!_this.guildInfo) {
            guildsMgr_1.default.getInstance().reqMyGuildDetail();
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
            lbl_currentMembers: ctrl.lbl_currentMembers,
            pref_guildApplicationItem: ctrl.pref_guildApplicationItem,
            node_guildInfoContent: ctrl.node_guildInfoContent
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showGuildMembers();
        this.addApplications();
    };
    View.prototype.addApplications = function () {
        if (this.model.guildInfo && this.model.guildInfo.apply) {
            for (var guildInfoIdx = 0; guildInfoIdx < this.model.guildInfo.apply.length; guildInfoIdx++) {
                var guildInfoData = this.model.guildInfo.apply[guildInfoIdx];
                var prefabNode = cc.instantiate(this.ui.pref_guildApplicationItem);
                this.ui.node_guildInfoContent.addChild(prefabNode);
                prefabNode.getComponent('guildApplicationItem').UpdateAndShowGuildApplicationInfo(guildInfoData, guildInfoIdx);
            }
        }
    };
    View.prototype.showGuildMembers = function () {
        this.ui.lbl_currentMembers.string = this.model.guildInfo.memberAmount + "/";
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsApplicationsPanelCtrl = /** @class */ (function (_super) {
    __extends(GuildsApplicationsPanelCtrl, _super);
    function GuildsApplicationsPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_refussAll = null;
        _this.pref_guildApplicationItem = null;
        _this.lbl_currentMembers = null;
        _this.node_guildInfoContent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsApplicationsPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsApplicationsPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.guild.reqMyGuildDetail': this.guild_guild_reqMyGuildDetail,
        };
    };
    //定义全局事件
    GuildsApplicationsPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsApplicationsPanelCtrl.prototype.connectUi = function () {
        // this.connect("click",this.ui.btn_close,()=>{
        // 	this.closeModule("guilds");
        // },"关闭公会界面");
        this.connect("click", this.ui.btn_refussAll, this.btnRefussAll.bind(this), "全部拒绝");
    };
    GuildsApplicationsPanelCtrl.prototype.btnRefussAll = function () {
        console.log("全部拒绝");
        guildsMgr_1.default.getInstance().refuseApply();
    };
    GuildsApplicationsPanelCtrl.prototype.guild_guild_reqMyGuildDetail = function () {
        this.model.guildInfo = guildsMgr_1.default.getInstance().getGuildInfo();
        this.view.showGuildMembers();
        this.view.addApplications();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsApplicationsPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsApplicationsPanelCtrl.prototype, "btn_refussAll", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsApplicationsPanelCtrl.prototype, "pref_guildApplicationItem", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsApplicationsPanelCtrl.prototype, "lbl_currentMembers", void 0);
    __decorate([
        property(cc.Node)
    ], GuildsApplicationsPanelCtrl.prototype, "node_guildInfoContent", void 0);
    GuildsApplicationsPanelCtrl = __decorate([
        ccclass
    ], GuildsApplicationsPanelCtrl);
    return GuildsApplicationsPanelCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsApplicationsPanelCtrl;

cc._RF.pop();