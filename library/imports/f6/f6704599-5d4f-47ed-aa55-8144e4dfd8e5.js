"use strict";
cc._RF.push(module, 'f6704WZXU9H7apVgUTk39jl', 'effectConfig');
// modules/plaza/script/effects/effectConfig.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var effectMgr_1 = require("../../../../manager/public/effectMgr");
/*
author: 陈斌杰
日期:2018-11-08 14:25:40
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.effect = {};
        _this.effectCfg = {};
        return _this;
    }
    //初始化特技配置数据
    Model.prototype.initEffectCfgData = function (data) {
        this.effectCfg.isConfig = data.isConfig;
        this.effectCfg.effectId = data.effectId;
        this.initEffectData();
    };
    Model.prototype.initEffectData = function () {
        this.effect = effectMgr_1.default.getInstance().getEffectDataById(this.effectCfg.effectId);
    };
    //设置特技配置数据
    Model.prototype.setEffectCfgData = function (id) {
        if (id == 0) {
            this.effectCfg.isConfig = false;
            this.effectCfg.effectId = id;
            return;
        }
        this.effect = effectMgr_1.default.getInstance().getEffectDataById(id);
        this.effectCfg.isConfig = true;
        this.effectCfg.effectId = id;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            effect: ctrl.effect,
            isConfig: ctrl.isConfig,
            energy: ctrl.energy,
            stars: ctrl.stars,
            effectName: ctrl.effectName,
            level: ctrl.level,
            btn_del: ctrl.btn_del,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.effect.active = false;
        this.ui.isConfig.active = false;
    };
    //初始化配置特技UI
    View.prototype.initEffectCfgUi = function () {
        var effectCfg = this.model.effectCfg;
        if (effectCfg.effectId != 0) {
            this.ui.effect.active = true;
            this.initEffectUi();
        }
        else {
            this.ui.isConfig.active = true;
        }
    };
    //初始化特技UI
    View.prototype.initEffectUi = function () {
        this.ui.energy.string = this.model.effect.energy.toString();
        this.ui.effectName.string = this.model.effect.name.toString();
        this.ui.level.string = "等级" + this.model.effect.lv.toString();
        for (var i = 0; i < this.ui.stars.childrenCount; i++) {
            if (i + 1 <= this.model.effect.star) {
                this.ui.stars.children[i].active = true;
            }
            else {
                this.ui.stars.children[i].active = false;
            }
        }
    };
    //刷新特技配置UI
    View.prototype.refreshEffectUI = function () {
        if (this.model.effectCfg.effectId == 0) {
            this.ui.effect.active = false;
        }
        else {
            this.ui.effect.active = true;
        }
        this.ui.isConfig.active = false;
        this.initEffectCfgUi();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var EffectConfigCtrl = /** @class */ (function (_super) {
    __extends(EffectConfigCtrl, _super);
    function EffectConfigCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.effect = null;
        _this.isConfig = null;
        _this.energy = null;
        _this.stars = null;
        _this.effectName = null;
        _this.level = null;
        _this.btn_del = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    EffectConfigCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    EffectConfigCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    EffectConfigCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    EffectConfigCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_del, function () {
            _this.gemit("btn_delEffectCfg", _this.model.effect.itemId);
        }, "删除配置的特技");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化特技配置数据和UI
    EffectConfigCtrl.prototype.initEffectCfg = function (data) {
        this.model.initEffectCfgData(data);
        this.view.initEffectCfgUi();
    };
    //刷新特技配置数据和UI
    EffectConfigCtrl.prototype.refreshEffectCfg = function (id) {
        this.model.setEffectCfgData(id);
        this.view.refreshEffectUI();
    };
    EffectConfigCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], EffectConfigCtrl.prototype, "effect", void 0);
    __decorate([
        property(cc.Node)
    ], EffectConfigCtrl.prototype, "isConfig", void 0);
    __decorate([
        property(cc.Label)
    ], EffectConfigCtrl.prototype, "energy", void 0);
    __decorate([
        property(cc.Node)
    ], EffectConfigCtrl.prototype, "stars", void 0);
    __decorate([
        property(cc.Label)
    ], EffectConfigCtrl.prototype, "effectName", void 0);
    __decorate([
        property(cc.Label)
    ], EffectConfigCtrl.prototype, "level", void 0);
    __decorate([
        property(cc.Button)
    ], EffectConfigCtrl.prototype, "btn_del", void 0);
    EffectConfigCtrl = __decorate([
        ccclass
    ], EffectConfigCtrl);
    return EffectConfigCtrl;
}(BaseCtrl_1.default));
exports.default = EffectConfigCtrl;

cc._RF.pop();