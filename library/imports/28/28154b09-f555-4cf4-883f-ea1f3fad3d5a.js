"use strict";
cc._RF.push(module, '28154sJ9VVM9Ig/6h8/rT1a', 'effects');
// modules/plaza/script/effects/effects.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../../manager/public/userMgr");
var effectMgr_1 = require("../../../../manager/public/effectMgr");
/*
author: 陈斌杰
日期:2018-11-07 15:28:25
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.userMoney = userMgr_1.default.getInstance().userMoney;
        _this.effectList = effectMgr_1.default.getInstance().effectList;
        _this.effectCfgList = effectMgr_1.default.getInstance().effectCfgList;
        _this.interimCfg = effectMgr_1.default.getInstance().interimCfg; //临时特技配置id数组
        _this.sortState = 0; // -1 小到大、1 大到小
        return _this;
    }
    //设置添加的特技配置数据
    Model.prototype.addEffectConfigData = function (effectId) {
        for (var i = 0; i < this.interimCfg.length; i++) {
            if (this.interimCfg[i] == 0) {
                this.interimCfg[i] = effectId;
                return;
            }
            else {
                continue;
            }
        }
    };
    //删除配置特技数据
    Model.prototype.delEffectConfigData = function (effectId) {
        for (var i = 0; i < this.interimCfg.length; i++) {
            if (this.interimCfg[i] == 0) {
                break;
            }
            if (this.interimCfg[i] == effectId) {
                this.interimCfg[i] = 0;
                continue;
            }
            if (this.interimCfg[i - 1] == 0) {
                this.interimCfg[i - 1] = this.interimCfg[i];
                this.interimCfg[i] = 0;
            }
        }
    };
    //设置按照星级排序按钮状态
    Model.prototype.setSortState = function () {
        if (this.sortState == 0) {
            this.sortState = -1;
        }
        if (this.sortState == -1) {
            this.sortState = 1;
        }
        if (this.sortState == 1) {
            this.sortState = -1;
        }
    };
    //设置特技数据按照星级排序
    Model.prototype.sortEffectData = function () {
        this.setSortState();
        effectMgr_1.default.getInstance().sortEffectData(this.sortState);
    };
    //获取保存的特技配置数据并发送
    Model.prototype.getEffectCfgData_sendReq = function () {
        var data = [];
        for (var i = 0; i < this.effectList.list.length; i++) {
            var effect = this.effectList.list[i];
            for (var j = 0; j < this.interimCfg.length; j++) {
                if (this.interimCfg[j] == 0) {
                    break;
                }
                if (effect.itemId == this.interimCfg[j]) {
                    data.push(effect.id);
                }
            }
        }
        if (data.length == effectMgr_1.default.getInstance().effectNum) {
            effectMgr_1.default.getInstance().sendReqEffectCfgData(data);
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
            btn_close: ctrl.btn_close,
            gold: ctrl.moneyFrame.getChildByName("gold").getComponent(cc.Label),
            crystal: ctrl.moneyFrame.getChildByName("crystal").getComponent(cc.Label),
            diamond: ctrl.moneyFrame.getChildByName("diamond").getComponent(cc.Label),
            effectList_content: ctrl.effectList_content,
            effectCfgList_content: ctrl.effectCfgList_content,
            effect: ctrl.effect,
            effectConfig: ctrl.effectConfig,
            effectCount: ctrl.effectCount,
            btn_sort: ctrl.btn_sort,
            btn_hold: ctrl.btn_hold,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.refreshMoneyUI();
        this.initEffectList();
        this.initEffectCfgList();
    };
    //初始化特技列表
    View.prototype.initEffectList = function () {
        var list = this.model.effectList.list;
        var row = 0;
        var column = 0;
        for (var i = 0; i < list.length; i++) {
            var effectData = list[i];
            var effect = this.addPrefabNode(this.ui.effect, this.ui.effectList_content);
            //设置坐标
            column = i % 4;
            if (i != 0 && i % 4 == 0) {
                row++;
                this.ui.effectList_content.height = 250 * (row + 1);
            }
            effect.x = -250 + 170 * column;
            effect.y = -125 - 250 * row;
            //设置特技属性
            effect.getComponent("effect").initEffectData(effectData);
        }
    };
    //刷新特技界面金钱数据
    View.prototype.refreshMoneyUI = function () {
        this.ui.gold.string = this.numberEllipsis(this.model.userMoney.gold);
        this.ui.crystal.string = this.numberEllipsis(this.model.userMoney.crystal);
        this.ui.diamond.string = this.numberEllipsis(this.model.userMoney.diamond);
    };
    //刷新特技界面
    View.prototype.refreshEffectList = function () {
        var list = this.model.effectList.list;
        for (var i = 0; i < this.ui.effectList_content.childrenCount; i++) {
            var effectNode = this.ui.effectList_content.children[i];
            effectNode.getComponent("effect").initEffectData(list[i]);
        }
    };
    //初始化特技配置列表
    View.prototype.initEffectCfgList = function () {
        var list = this.model.effectCfgList.list;
        this.ui.effectCfgList_content.height = list.length * 160;
        for (var i = 0; i < list.length; i++) {
            var effectCfgData = list[i];
            this.model.interimCfg.push(effectCfgData.effectId);
            var effectCfg = this.addPrefabNode(this.ui.effectConfig, this.ui.effectCfgList_content);
            //设置坐标
            effectCfg.y = -75 - i * 160;
            //设置配置的特技属性
            effectCfg.getComponent("effectConfig").initEffectCfg(effectCfgData);
        }
        this.refreshEffectCount();
    };
    //刷新特技数量显示
    View.prototype.refreshEffectCount = function () {
        var effectNum = 0; //当前装备特技数量
        var user = userMgr_1.default.getInstance().user;
        var list = this.model.interimCfg;
        for (var i = 0; i < list.length; i++) {
            if (list[i] != 0) {
                effectNum++;
            }
        }
        effectMgr_1.default.getInstance().setEffectNum(effectNum);
        this.ui.effectCount.string = effectMgr_1.default.getInstance().effectNum.toString() + "/" + effectMgr_1.default.getInstance().allEffectNum.toString();
    };
    //刷新特技配置
    View.prototype.refreshEffectCfg = function () {
        this.refreshEffectCount();
        if (this.model.interimCfg.length == 0) {
            return;
        }
        for (var i = 0; i < this.model.interimCfg.length; i++) {
            var effectId = this.model.interimCfg[i];
            this.ui.effectCfgList_content.children[i].getComponent("effectConfig").refreshEffectCfg(effectId);
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var CardsCtrl = /** @class */ (function (_super) {
    __extends(CardsCtrl, _super);
    function CardsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.moneyFrame = null;
        _this.effectList_content = null;
        _this.effectCfgList_content = null;
        _this.effectCount = null;
        _this.effect = null;
        _this.effectConfig = null;
        _this.btn_sort = null;
        _this.btn_hold = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    CardsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    CardsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    CardsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "btn_addEffectConfig": this.addEffectConfig,
            "btn_delEffectCfg": this.delEffectCfg,
            "upEffect": this.upEffect,
            "effectCfg": this.effectCfg,
            "refreshMoneyUI": this.refreshMoneyUI,
        };
    };
    //绑定操作的回调
    CardsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("effects");
        }, "关闭特技界面");
        this.connect("click", this.ui.btn_sort, function () {
            _this.model.sortEffectData();
            _this.view.refreshEffectList();
        }, "特技按照星级排序");
        this.connect("click", this.ui.btn_hold, function () {
            _this.model.getEffectCfgData_sendReq();
        }, "发送保存特技配置");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //加入配置的特技到特技栏
    CardsCtrl.prototype.addEffectConfig = function (effectId) {
        this.model.addEffectConfigData(effectId);
        this.view.refreshEffectCfg();
    };
    //删除配置中的特技
    CardsCtrl.prototype.delEffectCfg = function (effectId) {
        this.model.delEffectConfigData(effectId);
        this.view.refreshEffectCfg();
    };
    //升级特技
    CardsCtrl.prototype.upEffect = function () {
        //刷新界面UI
        this.view.refreshEffectList();
        this.view.refreshEffectCfg();
        this.closeModule("effectInfo");
    };
    //保存的特技配置
    CardsCtrl.prototype.effectCfg = function () {
        //刷新特技配置UI
    };
    //刷新金钱显示
    CardsCtrl.prototype.refreshMoneyUI = function () {
        this.view.refreshMoneyUI();
    };
    CardsCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], CardsCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], CardsCtrl.prototype, "moneyFrame", void 0);
    __decorate([
        property(cc.Node)
    ], CardsCtrl.prototype, "effectList_content", void 0);
    __decorate([
        property(cc.Node)
    ], CardsCtrl.prototype, "effectCfgList_content", void 0);
    __decorate([
        property(cc.Label)
    ], CardsCtrl.prototype, "effectCount", void 0);
    __decorate([
        property(cc.Prefab)
    ], CardsCtrl.prototype, "effect", void 0);
    __decorate([
        property(cc.Prefab)
    ], CardsCtrl.prototype, "effectConfig", void 0);
    __decorate([
        property(cc.Button)
    ], CardsCtrl.prototype, "btn_sort", void 0);
    __decorate([
        property(cc.Button)
    ], CardsCtrl.prototype, "btn_hold", void 0);
    CardsCtrl = __decorate([
        ccclass
    ], CardsCtrl);
    return CardsCtrl;
}(BaseCtrl_1.default));
exports.default = CardsCtrl;

cc._RF.pop();