"use strict";
cc._RF.push(module, '13cbet9F/xNZrohNZpFHlGo', 'userInfoPanel');
// modules/plaza/script/userInfoPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../manager/public/userMgr");
var roleMgr_1 = require("../../../manager/public/roleMgr");
/*
author: 陈斌杰
日期:2018-11-02 18:42:02
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.dataChoiceState = 0; //玩家数据选择显示状态  0 显示基础数据，1 显示对战数据
        _this.user = userMgr_1.default.getInstance().user; //玩家信息数据
        _this.userName = _this.user.userName;
        _this.userUID = _this.user.userUID;
        _this.userRank = userMgr_1.default.getInstance().userRank; //玩家段位数据
        _this.userBattle = userMgr_1.default.getInstance().userBattle; //玩家战斗数据
        _this.isModifyName = true;
        return _this;
    }
    //修改昵称数据
    Model.prototype.setUserName = function (name) {
        this.userName = name;
    };
    //设置昵称是否可修改
    Model.prototype.setModifyState = function (state) {
        this.isModifyName = state;
    };
    //修改选择显示数据按钮的状态
    Model.prototype.setDataChoiceState = function (btnId) {
        this.dataChoiceState = btnId;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            userUID: ctrl.userUID,
            userName: ctrl.userName,
            roleId: ctrl.frame_left.getChildByName("playerIco"),
            vipLv: ctrl.frame_left.getChildByName("vipLv"),
            btn_modify: ctrl.frame_left.getChildByName("btn_modify"),
            modifyName: ctrl.modifyName,
            btn_closeModify: ctrl.modifyName.getChildByName("btn_closeModify"),
            inputName: ctrl.modifyName.getChildByName("inputName").getComponent(cc.EditBox),
            btn_modifyName: ctrl.modifyName.getChildByName("btn_modifyName"),
            vipPic: ctrl.vipPic,
            grade: ctrl.frame_left.getChildByName("level").getComponent(cc.Label),
            userExp: ctrl.frame_left.getChildByName("exp").getComponent(cc.Label),
            btn_data: ctrl.btn_data,
            btn_baseData: ctrl.btn_data.getChildByName("btn_baseData").getComponent(cc.Button),
            btn_battleData: ctrl.btn_data.getChildByName("btn_battleData").getComponent(cc.Button),
            baseData: ctrl.baseData,
            battleData: ctrl.battleData,
            propertyData: ctrl.propertyData,
            statisticsData: ctrl.statisticsData,
            btn_close: ctrl.btn_close,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.initUser();
        this.initBaseData();
        this.initBattleData();
        this.ui.modifyName.active = false;
        this.ui.inputName.string = this.model.userName;
        this.ui.baseData.active = true;
        this.ui.battleData.active = false;
    };
    //初始化玩家信息数据
    View.prototype.initUser = function () {
        this.ui.userUID.string = this.model.user.userUID.toString();
        this.refreshRole(this.model.user.roleId);
        this.ui.vipLv.getComponent(cc.Sprite).spriteFrame = this.ui.vipPic;
        this.ui.userName.string = this.model.userName;
        this.ui.grade.string = this.model.user.grade.toString();
        this.ui.userExp.string = this.model.user.userExp.toString() + "/" + this.model.user.experience.toString();
    };
    //初始化基础数据
    View.prototype.initBaseData = function () {
    };
    //初始化对战数据
    View.prototype.initBattleData = function () {
        this.ui.propertyData.getChildByName("hpData").getComponent(cc.Label).string = this.model.userBattle.hp.toString(); //血量
        this.ui.propertyData.getChildByName("ctrData").getComponent(cc.Label).string = this.model.userBattle.ctr.toString(); //暴击
        this.ui.propertyData.getChildByName("hurtData").getComponent(cc.Label).string = this.model.userBattle.atk.toString(); //伤害
        this.ui.propertyData.getChildByName("ctrHurtData").getComponent(cc.Label).string = this.model.userBattle.crtdamage.toString(); //暴击伤害
        this.ui.statisticsData.getChildByName("winData").getComponent(cc.Label).string = this.model.user.winNum.toString(); //胜利局数
        this.ui.statisticsData.getChildByName("winOddsData").getComponent(cc.Label).string = this.model.user.winProbability.toString() + "%"; //胜率
        this.ui.statisticsData.getChildByName("rankData").getComponent(cc.Label).string = this.model.user.mostRank.toString(); //最高段位
        this.ui.statisticsData.getChildByName("haveEffectsData").getComponent(cc.Label).string = this.model.user.effects.toString() + "/36"; //已解锁特技数量
        // this.ui.statisticsData.getChildByName("cmdUsingData").getComponent(cc.Label).string = this.model.user.effects.toString();		//最常用特技
    };
    //刷新昵称
    View.prototype.refreshName = function (name) {
        this.model.setUserName(name);
        this.ui.userName.string = this.model.userName;
    };
    //刷新数据显示界面
    View.prototype.refreshShowData = function (btnId) {
        if (btnId == this.model.dataChoiceState) {
            return;
        }
        if (btnId == 0) {
            this.ui.baseData.active = true;
            this.ui.battleData.active = false;
        }
        else {
            this.ui.baseData.active = false;
            this.ui.battleData.active = true;
        }
        this.model.setDataChoiceState(btnId);
    };
    //刷新角色显示
    View.prototype.refreshRole = function (roleId) {
        var _this = this;
        var roleListData = roleMgr_1.default.getInstance().rolesData;
        var id = null;
        for (var i = 0; i < roleListData.length; i++) {
            var roleData = roleListData[i];
            if (roleId == roleData.id) {
                id = roleData.roleId - 1001;
                break;
            }
        }
        this.loadImage("rolePic_" + id).then(function (sprf) {
            _this.ui.roleId.getComponent(cc.Sprite).spriteFrame = sprf;
        });
    };
    return View;
}(BaseView_1.default));
//c, 控制
var UserInfoPanelCtrl = /** @class */ (function (_super) {
    __extends(UserInfoPanelCtrl, _super);
    function UserInfoPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userUID = null;
        _this.userName = null;
        _this.frame_left = null;
        _this.modifyName = null;
        _this.vipPic = null;
        _this.btn_data = null;
        _this.baseData = null;
        _this.battleData = null;
        _this.propertyData = null;
        _this.statisticsData = null;
        _this.btn_close = null;
        return _this;
    }
    UserInfoPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    UserInfoPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    UserInfoPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    UserInfoPanelCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_modify, this.showModifyName, "显示修改昵称界面");
        this.connect("click", this.ui.btn_closeModify, this.closeModify, "关闭昵称界面");
        this.connect("editing-did-ended", this.ui.inputName, this.inputModifyName, "输入修改的名称");
        this.connect("click", this.ui.btn_modifyName, this.refreshName, "输入修改的名称");
        this.connect("click", this.ui.btn_close, this.closeUserInfoPanel, "关闭玩家信息界面");
        var _loop_1 = function (i) {
            var refreshShowData = function () {
                _this.view.refreshShowData(i);
            };
            this_1.connect("click", this_1.ui.btn_data.children[i], refreshShowData, "显示对战数据");
        };
        var this_1 = this;
        for (var i = 0; i < this.ui.btn_data.childrenCount; i++) {
            _loop_1(i);
        }
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    //显示修改昵称界面
    UserInfoPanelCtrl.prototype.showModifyName = function () {
        this.ui.modifyName.active = true;
    };
    //关闭修改昵称界面
    UserInfoPanelCtrl.prototype.closeModify = function () {
        this.ui.modifyName.active = false;
    };
    //输入修改的名称
    UserInfoPanelCtrl.prototype.inputModifyName = function (editbox) {
        if (!editbox.string || editbox.string == "") {
            this.model.setModifyState(false);
        }
        else {
            this.model.setModifyState(true);
        }
    };
    //修改昵称数据并刷新UI
    UserInfoPanelCtrl.prototype.refreshName = function () {
        if (!this.model.isModifyName) {
            return;
        }
        this.view.refreshName(this.ui.inputName.string);
        this.closeModify();
    };
    //关闭玩家信息界面
    UserInfoPanelCtrl.prototype.closeUserInfoPanel = function () {
        this.closeModule("userInfoPanel");
    };
    UserInfoPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label) //玩家UID
    ], UserInfoPanelCtrl.prototype, "userUID", void 0);
    __decorate([
        property(cc.Label) //玩家名称
    ], UserInfoPanelCtrl.prototype, "userName", void 0);
    __decorate([
        property(cc.Node) //左边玩家信息
    ], UserInfoPanelCtrl.prototype, "frame_left", void 0);
    __decorate([
        property(cc.Node) //修改昵称界面
    ], UserInfoPanelCtrl.prototype, "modifyName", void 0);
    __decorate([
        property(cc.SpriteFrame) //玩家vip等级图片  后期用图集
    ], UserInfoPanelCtrl.prototype, "vipPic", void 0);
    __decorate([
        property(cc.Node) //玩家显示数据按钮
    ], UserInfoPanelCtrl.prototype, "btn_data", void 0);
    __decorate([
        property(cc.Node) //玩家基础数据
    ], UserInfoPanelCtrl.prototype, "baseData", void 0);
    __decorate([
        property(cc.Node) //玩家战斗数据
    ], UserInfoPanelCtrl.prototype, "battleData", void 0);
    __decorate([
        property(cc.Node) //玩家属性
    ], UserInfoPanelCtrl.prototype, "propertyData", void 0);
    __decorate([
        property(cc.Node) //玩家数据统计
    ], UserInfoPanelCtrl.prototype, "statisticsData", void 0);
    __decorate([
        property(cc.Button) //关闭玩家信息按钮
    ], UserInfoPanelCtrl.prototype, "btn_close", void 0);
    UserInfoPanelCtrl = __decorate([
        ccclass
    ], UserInfoPanelCtrl);
    return UserInfoPanelCtrl;
}(BaseCtrl_1.default));
exports.default = UserInfoPanelCtrl;

cc._RF.pop();