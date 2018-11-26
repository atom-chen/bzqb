"use strict";
cc._RF.push(module, '9975aHoWGBDmqBn5eQyIH+E', 'guildApplicationItem');
// modules/plaza/script/guilds/guildApplicationItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
var dataids_1 = require("../../../../framework/net/dataids");
/*
author: 汤凯
日期:2018-11-20 15:25:14
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
        _this.guildApplicationInfo = null;
        _this.guildApplicationInfoIdx = 0;
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
            spr_guildPlayerIcon: ctrl.spr_guildPlayerIcon,
            spr_guildPlayerStageIcon: ctrl.spr_guildPlayerStageIcon,
            lbl_guildPlayerName: ctrl.lbl_guildPlayerName,
            lbl_guildPlayerPosition: ctrl.lbl_guildPlayerPosition,
            btn_agress: ctrl.btn_agress,
            btn_refuss: ctrl.btn_refuss,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        // this.showGuildApplicationInfo();
    };
    View.prototype.showGuildApplicationInfo = function () {
        if (this.model.guildApplicationInfo) {
            this.ui.lbl_guildPlayerName.string = "test";
            // this.ui.lbl_guildPlayerStage.string = this.model.guildPlayerInfo.stageIndex;
            // this.ui.lbl_guildPlayerDonate.string = this.model.guildPlayerInfo.donate;
            // this.ui.spr_guildPlayerIcon
            // this.ui.spr_guildPlayerStageIcon 
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildApplicationItemCtrl = /** @class */ (function (_super) {
    __extends(GuildApplicationItemCtrl, _super);
    function GuildApplicationItemCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.spr_guildPlayerIcon = null;
        _this.spr_guildPlayerStageIcon = null;
        _this.lbl_guildPlayerName = null;
        _this.lbl_guildPlayerPosition = null;
        _this.btn_agress = null;
        _this.btn_refuss = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildApplicationItemCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildApplicationItemCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.guild.agreeApply': this.guild_guild_agreeApply,
            'guild.guild.refuseApply': this.guild_guild_refuseApply,
        };
    };
    //定义全局事件
    GuildApplicationItemCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildApplicationItemCtrl.prototype.connectUi = function () {
        // this.connect("click",this.node,this.guildPlayerNodeClick.bind(this),"点击公会成员");
        this.connect("click", this.ui.btn_agress, this.btnAgress.bind(this), "允许加入");
        this.connect("click", this.ui.btn_refuss, this.btnRefuss.bind(this), "拒绝");
    };
    GuildApplicationItemCtrl.prototype.btnAgress = function () {
        guildsMgr_1.default.getInstance().agreeApply(this.model.guildApplicationInfoIdx);
        console.log("btnAgress");
    };
    GuildApplicationItemCtrl.prototype.btnRefuss = function () {
        console.log("btnRefuss");
        guildsMgr_1.default.getInstance().refuseApply(this.model.guildApplicationInfoIdx);
    };
    GuildApplicationItemCtrl.prototype.UpdateAndShowGuildApplicationInfo = function (data, index) {
        console.log("UpdateAndShowGuildApplicationInfo", data);
        this.model.guildApplicationInfo = data;
        this.model.guildApplicationInfoIdx = index;
        this.view.showGuildApplicationInfo();
    };
    GuildApplicationItemCtrl.prototype.guild_guild_agreeApply = function (msg) {
        var applicationIdx = msg.getDataByType(dataids_1.dataids.ID_AGREE_GUILD_APPLY);
        if (applicationIdx == this.model.guildApplicationInfoIdx) {
            this.remove();
        }
    };
    GuildApplicationItemCtrl.prototype.guild_guild_refuseApply = function (msg) {
        var applicationIdx = msg.getDataByType(dataids_1.dataids.ID_REFUSE_GUILD_APPLY);
        if (applicationIdx == this.model.guildApplicationInfoIdx) {
            this.remove();
        }
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildApplicationItemCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], GuildApplicationItemCtrl.prototype, "spr_guildPlayerIcon", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildApplicationItemCtrl.prototype, "spr_guildPlayerStageIcon", void 0);
    __decorate([
        property(cc.Label)
    ], GuildApplicationItemCtrl.prototype, "lbl_guildPlayerName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildApplicationItemCtrl.prototype, "lbl_guildPlayerPosition", void 0);
    __decorate([
        property(cc.Button)
    ], GuildApplicationItemCtrl.prototype, "btn_agress", void 0);
    __decorate([
        property(cc.Button)
    ], GuildApplicationItemCtrl.prototype, "btn_refuss", void 0);
    GuildApplicationItemCtrl = __decorate([
        ccclass
    ], GuildApplicationItemCtrl);
    return GuildApplicationItemCtrl;
}(BaseCtrl_1.default));
exports.default = GuildApplicationItemCtrl;

cc._RF.pop();