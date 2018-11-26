(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/login/script/loginPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fef46ujxWdF9oaPE1nM0VrP', 'loginPanel', __filename);
// modules/login/script/loginPanel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var loginMgr_1 = require("../../../manager/public/loginMgr");
/*
author: 张志强
日期:2018-11-05 10:37:04
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
            testBtnPanel: ctrl.testBtnPanel,
            touristBtn: ctrl.touristBtn,
            accountBtn: ctrl.accountBtn,
            registerBtn: ctrl.registerBtn,
            wechatBtn: ctrl.wechatBtn,
            QQBtn: ctrl.QQBtn,
            account: ctrl.account,
            password: ctrl.password,
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
var LoginPanelCtrl = /** @class */ (function (_super) {
    __extends(LoginPanelCtrl, _super);
    function LoginPanelCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.testBtnPanel = null;
        _this.touristBtn = null;
        _this.accountBtn = null;
        _this.registerBtn = null;
        _this.wechatBtn = null;
        _this.QQBtn = null;
        _this.account = null;
        _this.password = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    LoginPanelCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    LoginPanelCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    LoginPanelCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "goToCreateRole": this.goToCreateRole,
        };
    };
    //绑定操作的回调
    LoginPanelCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.touristBtn, this.touristLogin, "点击游客登录");
        this.connect("click", this.ui.accountBtn, this.accountBtnCB, "点击账号登录");
        this.connect("click", this.ui.registerBtn, this.registerBtnCB, "点击注册账号");
        this.connect("click", this.ui.wechatBtn, this.wechatBtnCB, "点击微信登录");
        var _loop_1 = function (i) {
            this_1.connect("click", this_1.ui.testBtnPanel.children[i], function () {
                var str = "" + (1000 + i);
                _this.login(str, str);
                // this.register(str, str);
            }, "\u70B9\u51FB\u6D4B\u8BD5\u8D26\u53F7\u6309\u94AE" + (i + 1));
        };
        var this_1 = this;
        for (var i = 0; i < this.ui.testBtnPanel.childrenCount; ++i) {
            _loop_1(i);
        }
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //创建角色处理
    LoginPanelCtrl.prototype.goToCreateRole = function (num) {
        this.remove();
    };
    //end
    //按钮或任何控件操作的回调begin
    LoginPanelCtrl.prototype.touristLogin = function () {
        platSdk.touristLogin({
            success: function (data) {
                loginMgr_1.default.getInstance().login(data.head);
            }
        });
    };
    LoginPanelCtrl.prototype.accountBtnCB = function () {
        this.login(this.ui.account.string, this.ui.password.string);
    };
    LoginPanelCtrl.prototype.registerBtnCB = function () {
        this.register(this.ui.account.string, this.ui.password.string);
    };
    LoginPanelCtrl.prototype.wechatBtnCB = function () {
    };
    //end
    LoginPanelCtrl.prototype.login = function (username, password) {
        platSdk.login({
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                loginMgr_1.default.getInstance().login(data.head);
            }
        });
    };
    LoginPanelCtrl.prototype.register = function (username, password) {
        platSdk.register({
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                loginMgr_1.default.getInstance().login(data.head);
            }
        });
    };
    // update(dt) {}
    LoginPanelCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "testBtnPanel", void 0);
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "touristBtn", void 0);
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "accountBtn", void 0);
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "registerBtn", void 0);
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "wechatBtn", void 0);
    __decorate([
        property(cc.Node)
    ], LoginPanelCtrl.prototype, "QQBtn", void 0);
    __decorate([
        property(cc.EditBox)
    ], LoginPanelCtrl.prototype, "account", void 0);
    __decorate([
        property(cc.EditBox)
    ], LoginPanelCtrl.prototype, "password", void 0);
    LoginPanelCtrl = __decorate([
        ccclass
    ], LoginPanelCtrl);
    return LoginPanelCtrl;
}(BaseCtrl_1.default));
exports.default = LoginPanelCtrl;

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
        //# sourceMappingURL=loginPanel.js.map
        