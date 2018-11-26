"use strict";
cc._RF.push(module, 'b45f2S2GEBGErW2LNn1+q0O', 'effectInfo');
// modules/plaza/script/effects/effectInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var effectMgr_1 = require("../../../../manager/public/effectMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 陈斌杰
日期:2018-11-08 10:28:28
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
        _this.interimCfg = effectMgr_1.default.getInstance().interimCfg;
        _this.money = userMgr_1.default.getInstance().userMoney;
        return _this;
    }
    //初始化特技信息数据
    Model.prototype.initEffectInfo = function (data) {
        this.effect = data;
    };
    //根据特技是否解锁设置是否可以加入配置或者升级
    Model.prototype.isCanAddEffectByUnlock = function () {
        return this.effect.effectOther.isUnlock;
    };
    //根据当前持有的碎片判断是否可以升级特技
    Model.prototype.isCanUpEffectByChipNum = function () {
        if (this.effect.effectOther.effectChipNum >= this.effect.effectOther.upEffectChipNmu) {
            return true;
        }
        return false;
    };
    //根据玩家身上的金钱判断是否可以升级特技
    Model.prototype.isCanUpEffectByMoney = function () {
        if (this.money.gold >= this.effect.effectOther.spendGold) {
            return true;
        }
        return false;
    };
    //根据配置的特技Id设置是否可以加入配置
    Model.prototype.isCanAddEffectById = function () {
        for (var i = 0; i < this.interimCfg.length; i++) {
            if (this.effect.itemId == this.interimCfg[i]) {
                return false;
            }
        }
        return true;
    };
    //根据配置的特技数量设置是否可以加入配置
    Model.prototype.isCanAddEffectByNum = function () {
        var effectNum = effectMgr_1.default.getInstance().effectNum;
        var allEffectNum = effectMgr_1.default.getInstance().allEffectNum;
        if (effectNum >= allEffectNum) {
            return false;
        }
        return true;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            level: ctrl.top.getChildByName("lv").getComponent(cc.Label),
            name: ctrl.top.getChildByName("name").getComponent(cc.Label),
            energy: ctrl.energy,
            stars: ctrl.stars,
            type: ctrl.type,
            explain: ctrl.explain,
            damage: ctrl.damage,
            exp: ctrl.exp,
            btn_upLv: ctrl.btn_upLv,
            btn_addCfg: ctrl.btn_addCfg,
            btn_close: ctrl.btn_close,
            upLv_lab: ctrl.upLv_lab,
            cardPiece: ctrl.cardPiece,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //初始化特技UI
    View.prototype.initEffectInfoUi = function () {
        var effect = this.model.effect;
        this.ui.level.string = effect.lv.toString() + "级";
        this.ui.name.string = effect.name;
        this.ui.energy.string = effect.energy.toString();
        for (var i = 0; i < this.ui.stars.childrenCount; i++) {
            if (i + 1 <= effect.star) {
                this.ui.stars.children[i].active = true;
            }
            else {
                this.ui.stars.children[i].active = false;
            }
        }
        if (effect.type == 1) {
            this.ui.type.string = "法术";
        }
        else {
            this.ui.type.string = "物理";
        }
        this.ui.explain.string = effect.explain;
        this.ui.damage.string = "伤害增加" + effect.damage.toString();
        this.ui.exp.string = effect.effectOther.getExp.toString();
        this.ui.upLv_lab.string = effect.effectOther.spendGold.toString();
        this.ui.cardPiece.getChildByName("chipNum").getComponent(cc.Label).string = effect.effectOther.effectChipNum + "/" + effect.effectOther.upEffectChipNmu;
        this.isShowAddConfigBtn();
    };
    //特技升级按钮是否可点击显示
    View.prototype.isShowUpEffectBtn = function () {
        //特技是否解锁
        this.ui.btn_upLv.interactable = this.model.isCanAddEffectByUnlock();
        if (!this.model.isCanAddEffectByUnlock()) {
            return;
        }
        //碎片是否满足升级
        this.ui.btn_upLv.interactable = this.model.isCanUpEffectByChipNum();
        if (!this.model.isCanAddEffectByUnlock()) {
            return;
        }
        //金钱是否满足升级
        this.ui.btn_upLv.interactable = this.model.isCanUpEffectByMoney();
    };
    //加入配置按钮是否可点击显示
    View.prototype.isShowAddConfigBtn = function () {
        //特技是否解锁
        this.ui.btn_addCfg.interactable = this.model.isCanAddEffectByUnlock();
        if (!this.model.isCanAddEffectByUnlock()) {
            return;
        }
        //配置栏配置的特技是否已满
        this.ui.btn_addCfg.interactable = this.model.isCanAddEffectByNum();
        if (!this.model.isCanAddEffectByNum()) {
            return;
        }
        //配置栏中是否存在
        this.ui.btn_addCfg.interactable = this.model.isCanAddEffectById();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var EffectInfoCtrl = /** @class */ (function (_super) {
    __extends(EffectInfoCtrl, _super);
    function EffectInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.top = null;
        _this.energy = null;
        _this.stars = null;
        _this.type = null;
        _this.explain = null;
        _this.damage = null;
        _this.exp = null;
        _this.btn_upLv = null;
        _this.btn_addCfg = null;
        _this.btn_close = null;
        _this.upLv_lab = null;
        _this.cardPiece = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    EffectInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    EffectInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    EffectInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    EffectInfoCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("effectInfo");
        }, "关闭特技信息界面");
        this.connect("click", this.ui.btn_upLv, function () {
            effectMgr_1.default.getInstance().sendReqUpEffect(_this.model.effect.id);
        }, "点击特技升级按钮" + this.model.effect.itemId);
        this.connect("click", this.ui.btn_addCfg, function () {
            _this.closeModule("effectInfo");
            _this.gemit("btn_addEffectConfig", _this.model.effect.itemId);
        }, "点击特技加入配置按钮" + this.model.effect);
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化特技信息
    EffectInfoCtrl.prototype.initEffectInfo = function (data) {
        this.model.initEffectInfo(data);
        this.view.initEffectInfoUi();
    };
    EffectInfoCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], EffectInfoCtrl.prototype, "top", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "energy", void 0);
    __decorate([
        property(cc.Node)
    ], EffectInfoCtrl.prototype, "stars", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "type", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "explain", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "damage", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "exp", void 0);
    __decorate([
        property(cc.Button)
    ], EffectInfoCtrl.prototype, "btn_upLv", void 0);
    __decorate([
        property(cc.Button)
    ], EffectInfoCtrl.prototype, "btn_addCfg", void 0);
    __decorate([
        property(cc.Node)
    ], EffectInfoCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Label)
    ], EffectInfoCtrl.prototype, "upLv_lab", void 0);
    __decorate([
        property(cc.Node)
    ], EffectInfoCtrl.prototype, "cardPiece", void 0);
    EffectInfoCtrl = __decorate([
        ccclass
    ], EffectInfoCtrl);
    return EffectInfoCtrl;
}(BaseCtrl_1.default));
exports.default = EffectInfoCtrl;

cc._RF.pop();