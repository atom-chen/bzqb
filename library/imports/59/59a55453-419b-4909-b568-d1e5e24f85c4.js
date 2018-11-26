"use strict";
cc._RF.push(module, '59a55RTQZtJCbVo0eXiT4XE', 'registerPanel');
// modules/login/script/registerPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var userMgr_1 = require("../../../manager/public/userMgr");
var loginMgr_1 = require("../../../manager/public/loginMgr");
/*
author: 陈斌杰
日期:2018-11-05 10:09:04
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.sendRegisterData = {}; //创建角色数据
        _this.nicknameCfgTab = loginMgr_1.default.getInstance().nicknameCfgTab;
        return _this;
    }
    //记录设置选择的性别  roleID  1001 男  1002 女
    Model.prototype.setChoiceSexState = function (sex) {
        this.sendRegisterData.roleID = sex + 1000;
    };
    //初始化玩家数据
    Model.prototype.setUserData = function (UID) {
        this.sendRegisterData = { UID: UID, nickname: UID.toString(), roleID: 1001 };
    };
    //设置玩家昵称
    Model.prototype.setUserNickname = function (nickname) {
        this.sendRegisterData.nickname = nickname;
    };
    //随机昵称数据
    Model.prototype.randomNickname = function () {
        var random = Math.floor(Math.random() * (this.nicknameCfgTab.length));
        if (this.sendRegisterData.roleID == 1001) {
            this.setUserNickname(this.nicknameCfgTab[random].boyname);
        }
        else if (this.sendRegisterData.roleID == 1002) {
            this.setUserNickname(this.nicknameCfgTab[random].girlname);
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
            btn_sex: ctrl.btn_sex,
            btn_register: ctrl.btn_register,
            nickname_input: ctrl.nickname_input,
            btn_random: ctrl.btn_random,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //刷新选择的性别
    View.prototype.refreshSexBtn = function (sex) {
        if (this.model.sendRegisterData.roleID == sex) {
            return;
        }
        this.model.setChoiceSexState(sex);
    };
    //选择性别的按钮处理
    View.prototype.selectSexBtn = function (sex, picPath) {
        var _this = this;
        this.loadImage(picPath).then(function (sprf) {
            _this.ui.btn_sex.children[sex].getComponent(cc.Sprite).spriteFrame = sprf;
        });
    };
    //随机昵称显示
    View.prototype.showRandomNickname = function () {
        this.model.randomNickname();
        this.ui.nickname_input.string = this.model.sendRegisterData.nickname;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RegisterCtrl = /** @class */ (function (_super) {
    __extends(RegisterCtrl, _super);
    function RegisterCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_sex = null;
        _this.btn_register = null;
        _this.nickname_input = null;
        _this.btn_random = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RegisterCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        // 直接设置玩家UID和昵称（临时）
        var UID = userMgr_1.default.getInstance().user.userUID;
        this.model.setUserData(UID);
    };
    //定义网络事件
    RegisterCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    RegisterCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    RegisterCtrl.prototype.connectUi = function () {
        var _this = this;
        var _loop_1 = function (i) {
            this_1.connect("toggle", this_1.ui.btn_sex.children[i], function () {
                _this.view.refreshSexBtn(i + 1);
            }, "\u70B9\u51FB\u9009\u62E9\u89D2\u8272\u6309\u94AE" + i);
        };
        var this_1 = this;
        for (var i = 0; i < 2; i++) {
            _loop_1(i);
        }
        this.connect("click", this.ui.btn_register, function () {
            _this._sendRegisterUser();
        }, "创建角色");
        this.connect("editing-did-ended", this.ui.nickname_input, function () {
            _this.model.setUserNickname(_this.ui.nickname_input.string);
        }, "修改玩家昵称");
        this.connect("click", this.ui.btn_random, function () {
            _this.view.showRandomNickname();
        }, "随机昵称");
    };
    // 网络事件回调begin
    // end
    // 全局事件回调begin
    // end
    // 按钮或任何控件操作的回调begin
    RegisterCtrl.prototype._sendRegisterUser = function () {
        var _a = this.model.sendRegisterData, nickname = _a.nickname, roleID = _a.roleID;
        loginMgr_1.default.getInstance().sendRegisterUser(nickname, roleID);
    };
    // end
    RegisterCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], RegisterCtrl.prototype, "btn_sex", void 0);
    __decorate([
        property(cc.Button)
    ], RegisterCtrl.prototype, "btn_register", void 0);
    __decorate([
        property(cc.EditBox)
    ], RegisterCtrl.prototype, "nickname_input", void 0);
    __decorate([
        property(cc.Button)
    ], RegisterCtrl.prototype, "btn_random", void 0);
    RegisterCtrl = __decorate([
        ccclass
    ], RegisterCtrl);
    return RegisterCtrl;
}(BaseCtrl_1.default));
exports.default = RegisterCtrl;

cc._RF.pop();