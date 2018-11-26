"use strict";
cc._RF.push(module, 'e2133qSe29JvZaX5uH5+HBv', 'talent');
// modules/plaza/script/talent/talent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var talentMgr_1 = require("../../../../manager/public/talentMgr");
/*
author: 蒙磊
日期:2018-11-16 21:27:15
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.index = null;
        _this.curSuspensionFrame = null;
        _this.talentData = null;
        _this.level = null;
        return _this;
    }
    Model.prototype.setLevel = function () {
        if (!this.talentData.curLevel) {
            this.talentData.curLevel = 0;
        }
        var curLevel = this.talentData.curLevel;
        this.level = curLevel + "/" + this.talentData.maxLevel;
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
            suspensionFrame: ctrl.suspensionFrame,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.showIcon = function (icon) {
        var iconNode = new cc.Node();
        var sp_icon = iconNode.addComponent(cc.Sprite);
        sp_icon.spriteFrame = this.getImageSync(icon);
        this.node.addChild(iconNode);
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    View.prototype.initUi = function () {
    };
    View.prototype.addPrefab = function (obj_node, obj_Prefab) {
        return this.addPrefabNode(obj_Prefab, obj_node);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TalentCtrl = /** @class */ (function (_super) {
    __extends(TalentCtrl, _super);
    function TalentCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //Prefab
        _this.suspensionFrame = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    TalentCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //绑定天赋信息
    TalentCtrl.prototype.setTalentData = function (data, index) {
        this.model.index = index;
        this.model.talentData = data;
    };
    //绑定升级预制体
    TalentCtrl.prototype.setSuspensionFrame = function (obj) {
        this.ui.suspensionFrame = obj;
    };
    //显示升级界面
    TalentCtrl.prototype.showSuspensionFrame = function () {
        this.model.curSuspensionFrame = this.view.addPrefab(this.node.parent, this.ui.suspensionFrame);
        this.model.curSuspensionFrame.getComponent("suspensionframe").setData(this.model.talentData);
        this.model.curSuspensionFrame.getComponent("suspensionframe").showData();
        talentMgr_1.default.getInstance().curTalent = this;
    };
    //刷新等级level
    TalentCtrl.prototype.refreshLevel = function () {
        this.model.setLevel();
        //console.log(this.node.children[0])
        if (this.node.children[0].getComponent(cc.Label)) {
            this.view.showLabelString(this.node.children[0].getComponent(cc.Label), this.model.level);
        }
    };
    //增加图标
    TalentCtrl.prototype.addIcon = function (icon) {
        this.view.showIcon(icon);
    };
    // closeSuspensionFrame() {
    // 	this.model.curSuspensionFrame.destroy();
    // 	this.model.curSuspensionFrame = null;
    // }
    //定义网络事件
    TalentCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    TalentCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TalentCtrl.prototype.connectUi = function () {
        this.connect("click", this.node, this.showSuspensionFrame, "学习天赋");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    TalentCtrl.prototype.updataTalentData = function (data) {
        this.model.talentData = data;
        this.model.curSuspensionFrame.getComponent("suspensionframe").setData(data);
        this.model.curSuspensionFrame.getComponent("suspensionframe").showData();
    };
    // update(dt) {}
    TalentCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Prefab)
    ], TalentCtrl.prototype, "suspensionFrame", void 0);
    TalentCtrl = __decorate([
        ccclass
    ], TalentCtrl);
    return TalentCtrl;
}(BaseCtrl_1.default));
exports.default = TalentCtrl;

cc._RF.pop();