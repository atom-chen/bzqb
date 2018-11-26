(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/public/script/setting.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0be5ckOgv9OUItyCnZ18Has', 'setting', __filename);
// modules/public/script/setting.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var Audio_1 = require("../../../framework/modules/Audio");
var loginMgr_1 = require("../../../manager/public/loginMgr");
/*
author: 张志强
日期:2018-11-09 18:35:49
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this._initState();
        return _this;
    }
    Model.prototype._initState = function () {
        var audioSe = Audio_1.default.getInstance().getAudioState();
        this.bgmEnable = audioSe.bgmEnable;
        this.soundEnable = audioSe.soundEnable;
    };
    Model.prototype.refreshState = function (key, state) {
        switch (key) {
            case "music":
                this._changeMusic(state);
                break;
            case "effect":
                this._changeEffect(state);
                break;
        }
    };
    Model.prototype._changeMusic = function (bool) {
        this.bgmEnable = bool;
        if (this.bgmEnable) {
            Audio_1.default.getInstance().openBgm();
        }
        else {
            Audio_1.default.getInstance().closeBgm();
        }
    };
    Model.prototype._changeEffect = function (bool) {
        this.soundEnable = bool;
        if (this.soundEnable) {
            Audio_1.default.getInstance().openSoundEffect();
        }
        else {
            Audio_1.default.getInstance().closeSoundEffect();
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
            //在这里声明ui
            musicTgl: ctrl.musicTgl,
            effectTgl: ctrl.effectTgl,
            friendTgl: ctrl.friendTgl,
            barrageTgl: ctrl.barrageTgl,
            switchBtn: ctrl.switchBtn,
            bindingBtn: ctrl.bindingBtn,
            closeBtn: ctrl.closeBtn
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.musicTgl.isChecked = this.model.bgmEnable;
        this.ui.musicTgl.node.getChildByName("background").active = !this.model.bgmEnable;
        this.ui.effectTgl.isChecked = this.model.soundEnable;
        this.ui.effectTgl.node.getChildByName("background").active = !this.model.soundEnable;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var SettingCtrl = /** @class */ (function (_super) {
    __extends(SettingCtrl, _super);
    function SettingCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.musicTgl = null;
        _this.effectTgl = null;
        _this.friendTgl = null;
        _this.barrageTgl = null;
        _this.switchBtn = null;
        _this.bindingBtn = null;
        _this.closeBtn = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    SettingCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    SettingCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    SettingCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    SettingCtrl.prototype.connectUi = function () {
        this.connect("toggle", this.ui.musicTgl, this._toggleCB, "点击设置音乐开关");
        this.connect("toggle", this.ui.effectTgl, this._toggleCB, "点击设置音效开关");
        this.connect("toggle", this.ui.friendTgl, this._friendTglCB, "点击设置是否允许添加好友开关");
        this.connect("toggle", this.ui.barrageTgl, this._barrageTglCB, "点击设置弹幕开关");
        this.connect("click", this.ui.switchBtn, this._switchBtnCB, "点击设置切换账号按钮");
        this.connect("click", this.ui.bindingBtn, this._bindingBtnCB, "点击设置绑定账号按钮");
        this.connect("click", this.ui.closeBtn, this._closeBtnCB, "点击设置界面关闭按钮");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    SettingCtrl.prototype._toggleCB = function (event) {
        var bool = event.target.getComponent(cc.Toggle).isChecked;
        event.target.getChildByName("background").active = !bool;
        this.model.refreshState(event.target.name, bool);
    };
    SettingCtrl.prototype._friendTglCB = function () {
    };
    SettingCtrl.prototype._barrageTglCB = function () {
    };
    SettingCtrl.prototype._switchBtnCB = function () {
        loginMgr_1.default.getInstance().switchAccount();
    };
    SettingCtrl.prototype._bindingBtnCB = function () {
    };
    SettingCtrl.prototype._closeBtnCB = function () {
        this.remove();
    };
    //end
    // update(dt) {}
    SettingCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Toggle)
    ], SettingCtrl.prototype, "musicTgl", void 0);
    __decorate([
        property(cc.Toggle)
    ], SettingCtrl.prototype, "effectTgl", void 0);
    __decorate([
        property(cc.Toggle)
    ], SettingCtrl.prototype, "friendTgl", void 0);
    __decorate([
        property(cc.Toggle)
    ], SettingCtrl.prototype, "barrageTgl", void 0);
    __decorate([
        property(cc.Node)
    ], SettingCtrl.prototype, "switchBtn", void 0);
    __decorate([
        property(cc.Node)
    ], SettingCtrl.prototype, "bindingBtn", void 0);
    __decorate([
        property(cc.Node)
    ], SettingCtrl.prototype, "closeBtn", void 0);
    SettingCtrl = __decorate([
        ccclass
    ], SettingCtrl);
    return SettingCtrl;
}(BaseCtrl_1.default));
exports.default = SettingCtrl;

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
        //# sourceMappingURL=setting.js.map
        