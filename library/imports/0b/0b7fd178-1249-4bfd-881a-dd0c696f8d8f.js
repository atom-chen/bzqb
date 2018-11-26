"use strict";
cc._RF.push(module, '0b7fdF4EklL/Yga3Qxpb42P', 'guilds');
// modules/plaza/script/guilds/guilds.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
/*
author: 陈斌杰
日期:2018-11-09 15:25:14
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
            btn_close: ctrl.btn_close,
            pref_guildsPanel: ctrl.pref_guildsPanel,
            pref_guildsFrame: ctrl.pref_guildsFrame,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.initGuildFrame = function () {
        var prefabNode = cc.instantiate(this.ui.pref_guildsFrame);
        this.node.addChild(prefabNode);
    };
    View.prototype.initGuildPanel = function () {
        var prefabNode = cc.instantiate(this.ui.pref_guildsPanel);
        this.node.addChild(prefabNode);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsCtrl = /** @class */ (function (_super) {
    __extends(GuildsCtrl, _super);
    function GuildsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.pref_guildsPanel = null;
        _this.pref_guildsFrame = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        guildsMgr_1.default.getInstance().reqRandomGuildList();
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.view.initGuildFrame();
        this.view.initGuildPanel();
    };
    //定义网络事件
    GuildsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    GuildsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("guilds");
        }, "关闭公会界面");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], GuildsCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsCtrl.prototype, "pref_guildsPanel", void 0);
    __decorate([
        property(cc.Prefab)
    ], GuildsCtrl.prototype, "pref_guildsFrame", void 0);
    GuildsCtrl = __decorate([
        ccclass
    ], GuildsCtrl);
    return GuildsCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsCtrl;

cc._RF.pop();