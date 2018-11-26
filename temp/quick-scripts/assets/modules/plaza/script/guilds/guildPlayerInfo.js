(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/guilds/guildPlayerInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd9e3c3MPntKLq/Shc5c6X/n', 'guildPlayerInfo', __filename);
// modules/plaza/script/guilds/guildPlayerInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var enums_1 = require("../../../../manager/enums");
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
        _this.guildPlayerInfo = null;
        _this.positionChangeArr = null;
        _this.positionChangeData = null;
        return _this;
    }
    Model.prototype.changePosition = function () {
        if (this.positionChangeData && this.positionChangeData.uid == this.guildPlayerInfo.id) {
            this.guildPlayerInfo.position = this.positionChangeData.position;
        }
    };
    Model.prototype.changePositionWithDataArr = function (positionChangeData) {
        if (positionChangeData) {
            if (positionChangeData.uid == this.guildPlayerInfo.id) {
                this.guildPlayerInfo.position = positionChangeData.position;
            }
        }
    };
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
            lbl_guildPlayerStage: ctrl.lbl_guildPlayerStage,
            lbl_guildPlayerDonate: ctrl.lbl_guildPlayerDonate,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showGuildPlayerInfo();
    };
    View.prototype.showGuildPlayerInfo = function () {
        if (this.model.guildPlayerInfo) {
            this.ui.lbl_guildPlayerName.string = this.model.guildPlayerInfo.nickname;
            var guildPlayerPosition = '';
            switch (this.model.guildPlayerInfo.position) {
                case enums_1.enums.Guild_Member:
                    guildPlayerPosition = '普通成员';
                    break;
                case enums_1.enums.Guild_President:
                    guildPlayerPosition = '会长';
                    break;
                case enums_1.enums.Guild_VicePresident:
                    guildPlayerPosition = '副会长';
                    break;
            }
            this.ui.lbl_guildPlayerPosition.string = guildPlayerPosition;
            var stageName = '';
            switch (this.model.guildPlayerInfo.stageIndex) {
                case enums_1.enums.Guild_Member:
                    stageName = '普通成员';
                    break;
                case enums_1.enums.Guild_President:
                    stageName = '会长';
                    break;
                case enums_1.enums.Guild_VicePresident:
                    stageName = '副会长';
                    break;
            }
            this.ui.lbl_guildPlayerStage.string = this.model.guildPlayerInfo.stageIndex;
            this.ui.lbl_guildPlayerDonate.string = this.model.guildPlayerInfo.donate;
            // this.ui.spr_guildPlayerIcon
            // this.ui.spr_guildPlayerStageIcon 
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildPlayerInfoCtrl = /** @class */ (function (_super) {
    __extends(GuildPlayerInfoCtrl, _super);
    function GuildPlayerInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.spr_guildPlayerIcon = null;
        _this.spr_guildPlayerStageIcon = null;
        _this.lbl_guildPlayerName = null;
        _this.lbl_guildPlayerPosition = null;
        _this.lbl_guildPlayerStage = null;
        _this.lbl_guildPlayerDonate = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildPlayerInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildPlayerInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.member.kickMember': this.guild_member_kickMember,
            'guild.member.transPresident': this.guild_member_transPresident,
            'guild.member.appointVicePresident': this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident': this.guild_member_fireVicePresident,
        };
    };
    //定义全局事件
    GuildPlayerInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildPlayerInfoCtrl.prototype.connectUi = function () {
        this.connect("click", this.node, this.guildPlayerNodeClick.bind(this), "点击公会成员");
    };
    GuildPlayerInfoCtrl.prototype.updateAndShowGuildPlayerInfo = function (data) {
        console.log('updateAndShowGuildPlayerInfo', data);
        this.model.guildPlayerInfo = data;
        this.view.showGuildPlayerInfo();
    };
    GuildPlayerInfoCtrl.prototype.guildPlayerNodeClick = function () {
        this.gemit('guild.playerOperation', this.model.guildPlayerInfo);
    };
    GuildPlayerInfoCtrl.prototype.guild_member_kickMember = function (msg) {
        var kickMebmerId = msg.getDataByType(dataids_1.dataids.ID_KIKGUILDMEMBER);
        if (kickMebmerId == this.model.guildPlayerInfo.id) {
            this.remove();
        }
    };
    GuildPlayerInfoCtrl.prototype.guild_member_transPresident = function (msg) {
        this.model.positionChangeArr = msg.getDatasByType(dataids_1.dataids.ID_GUILDPOSITION_CHANGED);
        for (var i = 0; i < this.model.positionChangeArr.length; i++) {
            var positionChangeData = this.model.positionChangeArr[i];
            if (positionChangeData.uid == this.model.guildPlayerInfo.id) {
                this.model.changePositionWithDataArr(positionChangeData);
                this.view.showGuildPlayerInfo();
            }
        }
        //if(this.model.positionChangeArr==this.model.guildPlayerInfo.id) {
        //}
    };
    GuildPlayerInfoCtrl.prototype.guild_member_appointVicePresident = function (msg) {
        this.model.positionChangeData = msg.getDataByType(dataids_1.dataids.ID_GUILDPOSITION_CHANGED);
        if (this.model.positionChangeData.uid == this.model.guildPlayerInfo.id) {
            this.model.changePosition();
            this.view.showGuildPlayerInfo();
        }
    };
    GuildPlayerInfoCtrl.prototype.guild_member_fireVicePresident = function (msg) {
        this.model.positionChangeData = msg.getDataByType(dataids_1.dataids.ID_GUILDPOSITION_CHANGED);
        if (this.model.positionChangeData.uid == this.model.guildPlayerInfo.id) {
            this.model.changePosition();
            this.view.showGuildPlayerInfo();
        }
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildPlayerInfoCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], GuildPlayerInfoCtrl.prototype, "spr_guildPlayerIcon", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildPlayerInfoCtrl.prototype, "spr_guildPlayerStageIcon", void 0);
    __decorate([
        property(cc.Label)
    ], GuildPlayerInfoCtrl.prototype, "lbl_guildPlayerName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildPlayerInfoCtrl.prototype, "lbl_guildPlayerPosition", void 0);
    __decorate([
        property(cc.Label)
    ], GuildPlayerInfoCtrl.prototype, "lbl_guildPlayerStage", void 0);
    __decorate([
        property(cc.Label)
    ], GuildPlayerInfoCtrl.prototype, "lbl_guildPlayerDonate", void 0);
    GuildPlayerInfoCtrl = __decorate([
        ccclass
    ], GuildPlayerInfoCtrl);
    return GuildPlayerInfoCtrl;
}(BaseCtrl_1.default));
exports.default = GuildPlayerInfoCtrl;

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
        //# sourceMappingURL=guildPlayerInfo.js.map
        