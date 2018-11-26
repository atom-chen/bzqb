(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/guilds/guildInviteInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd012449x7dHJLTC8Z3mJ5Dr', 'guildInviteInfo', __filename);
// modules/plaza/script/guilds/guildInviteInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
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
        _this.invitedInfo = null;
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
            lbl_guildPlayerName: ctrl.lbl_guildPlayerName,
            lbl_guildName: ctrl.lbl_guildName,
            btn_agress: ctrl.btn_agress,
            btn_refuss: ctrl.btn_refuss,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        // this.showGuildPlayerInfo();
    };
    View.prototype.showInvitedInfo = function () {
        if (this.model.invitedInfo) {
            this.ui.lbl_guildPlayerName.string = this.model.invitedInfo.nickname;
            this.ui.lbl_guildName.string = this.model.invitedInfo.guildName;
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildInviteInfoCtrl = /** @class */ (function (_super) {
    __extends(GuildInviteInfoCtrl, _super);
    function GuildInviteInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.lbl_guildPlayerName = null;
        _this.lbl_guildName = null;
        _this.btn_agress = null;
        _this.btn_refuss = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildInviteInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildInviteInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    GuildInviteInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildInviteInfoCtrl.prototype.connectUi = function () {
        // this.connect("click",this.node,this.guildPlayerNodeClick.bind(this),"点击公会成员");
        this.connect("click", this.ui.btn_agress, this.btnAgress.bind(this), "接受");
        this.connect("click", this.ui.btn_refuss, this.btnRefuss.bind(this), "拒绝");
    };
    GuildInviteInfoCtrl.prototype.btnAgress = function () {
        if (this.model.invitedInfo) {
            guildsMgr_1.default.getInstance().agreeInvitation(this.model.invitedInfo.index);
        }
        console.log("btnAgress");
    };
    GuildInviteInfoCtrl.prototype.btnRefuss = function () {
        if (this.model.invitedInfo) {
            guildsMgr_1.default.getInstance().refuseInvitation(this.model.invitedInfo.index);
        }
        console.log("btnRefuss");
    };
    GuildInviteInfoCtrl.prototype.updateInvitedInfoAndShow = function (data) {
        this.model.invitedInfo = data;
        this.view.showInvitedInfo();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildInviteInfoCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], GuildInviteInfoCtrl.prototype, "lbl_guildPlayerName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildInviteInfoCtrl.prototype, "lbl_guildName", void 0);
    __decorate([
        property(cc.Button)
    ], GuildInviteInfoCtrl.prototype, "btn_agress", void 0);
    __decorate([
        property(cc.Button)
    ], GuildInviteInfoCtrl.prototype, "btn_refuss", void 0);
    GuildInviteInfoCtrl = __decorate([
        ccclass
    ], GuildInviteInfoCtrl);
    return GuildInviteInfoCtrl;
}(BaseCtrl_1.default));
exports.default = GuildInviteInfoCtrl;

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
        //# sourceMappingURL=guildInviteInfo.js.map
        