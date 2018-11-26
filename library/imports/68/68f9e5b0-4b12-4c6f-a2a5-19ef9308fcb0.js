"use strict";
cc._RF.push(module, '68f9eWwSxJMb6KlGe+TCPyw', 'effect');
// modules/plaza/script/effects/effect.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 陈斌杰
日期:2018-11-07 18:48:54
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
        return _this;
    }
    //初始化特技数据
    Model.prototype.initEffect = function (data) {
        this.effect.name = data.name;
        this.effect.type = data.type;
        this.effect.explain = data.explain;
        this.effect.id = data.id;
        this.effect.itemId = data.itemId;
        this.effect.lv = data.lv;
        this.effect.star = data.star;
        this.effect.damage = data.damage;
        this.effect.energy = data.energy;
        this.effect.effectOther = data.effectOther;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            card: ctrl.card,
            cardCount: ctrl.cardCount,
            cardEnergy: ctrl.cardEnergy,
            cardLv: ctrl.cardLv,
            stars: ctrl.stars,
            btn_info: ctrl.btn_info,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //初始化特技UI
    View.prototype.initEffectUi = function () {
        var effect = this.model.effect;
        this.ui.cardEnergy.string = effect.energy.toString();
        this.ui.cardLv.string = "等级" + effect.lv.toString();
        this.ui.cardCount.string = effect.effectOther.effectChipNum.toString() + "/" + effect.effectOther.upEffectChipNmu.toString();
        for (var i = 0; i < this.ui.stars.childrenCount; i++) {
            if (i + 1 <= effect.star) {
                this.ui.stars.children[i].active = true;
            }
            else {
                this.ui.stars.children[i].active = false;
            }
        }
        if (!this.model.effect.effectOther.isUnlock) {
            var spArr = this.node.getComponentsInChildren(cc.Sprite);
            for (var i = 0; i < spArr.length; ++i) {
                spArr[i].setState(cc.Sprite.State.GRAY);
            }
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var EffectCtrl = /** @class */ (function (_super) {
    __extends(EffectCtrl, _super);
    function EffectCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.card = null;
        _this.cardCount = null;
        _this.cardEnergy = null;
        _this.cardLv = null;
        _this.stars = null;
        _this.btn_info = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    EffectCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    EffectCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    EffectCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    EffectCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_info, this.openEffectInfo, "显示特技信息");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化特技数据
    EffectCtrl.prototype.initEffectData = function (data) {
        this.model.initEffect(data);
        this.view.initEffectUi();
    };
    //打开特技信息预制
    EffectCtrl.prototype.openEffectInfo = function () {
        var _this = this;
        this.openSubModule("effectInfo").then(function (obj) {
            obj.initEffectInfo(_this.model.effect);
        });
    };
    // update(dt) {}
    EffectCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], EffectCtrl.prototype, "card", void 0);
    __decorate([
        property(cc.Label)
    ], EffectCtrl.prototype, "cardCount", void 0);
    __decorate([
        property(cc.Label)
    ], EffectCtrl.prototype, "cardEnergy", void 0);
    __decorate([
        property(cc.Label)
    ], EffectCtrl.prototype, "cardLv", void 0);
    __decorate([
        property(cc.Node)
    ], EffectCtrl.prototype, "stars", void 0);
    __decorate([
        property(cc.Button)
    ], EffectCtrl.prototype, "btn_info", void 0);
    EffectCtrl = __decorate([
        ccclass
    ], EffectCtrl);
    return EffectCtrl;
}(BaseCtrl_1.default));
exports.default = EffectCtrl;

cc._RF.pop();