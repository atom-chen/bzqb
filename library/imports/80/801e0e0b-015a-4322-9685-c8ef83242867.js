"use strict";
cc._RF.push(module, '801e04LAVpDIpaFyO+DJChn', 'login');
// modules/login/script/login.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var GameNet_1 = require("../../../framework/modules/GameNet");
var Cache_1 = require("../../../framework/modules/Cache");
var loginMgr_1 = require("../../../manager/public/loginMgr");
var ModuleMgr_1 = require("../../../framework/modules/ModuleMgr");
var ServerMgr_1 = require("../../../framework/modules/ServerMgr");
var MgrInit_1 = require("../../../manager/MgrInit");
/*
author: 张志强
日期:2018-11-01 17:06:58
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
        //在这里声明ui
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var LoginCtrl = /** @class */ (function (_super) {
    __extends(LoginCtrl, _super);
    function LoginCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    LoginCtrl.prototype.onLoad = function () {
        var _this = this;
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        ModuleMgr_1.default.getInstance().showLoading({
            resPaths: require("publicResPath"),
            complete: function () {
                MgrInit_1.default();
                ServerMgr_1.default.getInstance().loadLoacalSetting(function (code) {
                    _this.loadDataCb(code);
                });
            }
        });
    };
    //定义网络事件
    LoginCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    LoginCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "goToCreateRole": this.goToCreateRole,
            "platTokenError": this.platTokenError,
        };
    };
    //绑定操作的回调
    LoginCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    LoginCtrl.prototype.goToCreateRole = function () {
        loginMgr_1.default.getInstance().getNicknameCfgTab();
        this.openSubModule("registerPanel");
    };
    LoginCtrl.prototype.platTokenError = function () {
        var _this = this;
        ModuleMgr_1.default.getInstance().showMsgBox({
            content: "token错误!",
            okcb: function () {
                Cache_1.default.getInstance().removeItemByKey("loginCache");
                _this.openSubModule("loginPanel");
            }
        });
    };
    //end
    //按钮或任何控件操作的回调begin
    //end
    LoginCtrl.prototype.loadDataCb = function (code) {
        if (code == 0) {
            platSdk.setPlatUrl(GameNet_1.default.getInstance().getPlatSvrUrl());
            var loginCache = Cache_1.default.getInstance().getItem("loginCache");
            if (loginCache && this._checkLoginCache(loginCache)) {
                loginMgr_1.default.getInstance().login(loginCache);
            }
            else {
                this.openSubModule("loginPanel");
            }
        }
        else {
            ServerMgr_1.default.getInstance().loadSettingCb();
        }
    };
    LoginCtrl.prototype._checkLoginCache = function (data) {
        var uid = data.uid, token = data.token;
        return Boolean(uid && token);
    };
    // update(dt) {}
    LoginCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    LoginCtrl = __decorate([
        ccclass
    ], LoginCtrl);
    return LoginCtrl;
}(BaseCtrl_1.default));
exports.default = LoginCtrl;

cc._RF.pop();