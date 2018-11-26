"use strict";
cc._RF.push(module, 'fd2f2RMOJZFrZQl5V7KD8Lf', 'levelBoxBG');
// modules/plaza/script/levelBox/levelBoxBG.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var boxMgr_1 = require("../../../../manager/public/boxMgr");
/*
author: 蒙磊
日期:2018-11-09 15:51:13
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
    Model.prototype.initData = function () {
        this.levelBoxInfo = boxMgr_1.default.getInstance().levelBoxInfo;
        this.levelBoxTable = boxMgr_1.default.getInstance().levelBoxTable;
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
            btn_close: ctrl.btn_close,
            content: ctrl.content,
            levelBox: ctrl.levelBox,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.addPrefab = function (obj_node, obj_Prefab) {
        return this.addPrefabNode(obj_Prefab, obj_node);
    };
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var LevelBoxCtrl = /** @class */ (function (_super) {
    __extends(LevelBoxCtrl, _super);
    function LevelBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        //note
        _this.content = null;
        //Prefab
        _this.levelBox = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    LevelBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        boxMgr_1.default.getInstance().sendReqLevelBox();
    };
    //定义网络事件
    LevelBoxCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.box.reqLevelBox': this.reqLevelBox,
        };
    };
    //定义全局事件
    LevelBoxCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    LevelBoxCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.close, "关闭");
    };
    //网络事件回调begin
    LevelBoxCtrl.prototype.reqLevelBox = function () {
        this.initData();
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    LevelBoxCtrl.prototype.initData = function () {
        this.model.initData();
        console.log(this.model.levelBoxTable);
        this.ui.content.width = 40 + (this.model.levelBoxTable.length) * 345;
        for (var i = 0; i < this.model.levelBoxTable.length; i++) {
            var levelBox = this.view.addPrefab(this.ui.content, this.ui.levelBox);
            levelBox.setPosition(cc.v2(194 + (i * 345), -20));
            var level = this.model.levelBoxTable[i].condition_level;
            var have = this.model.levelBoxInfo[level];
            levelBox.getComponent("levelBox").setData(this.model.levelBoxTable[i], have);
        }
    };
    LevelBoxCtrl.prototype.close = function () {
        this.closeModule("levelBoxBG");
    };
    // update(dt) {}
    LevelBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], LevelBoxCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], LevelBoxCtrl.prototype, "content", void 0);
    __decorate([
        property(cc.Prefab)
    ], LevelBoxCtrl.prototype, "levelBox", void 0);
    LevelBoxCtrl = __decorate([
        ccclass
    ], LevelBoxCtrl);
    return LevelBoxCtrl;
}(BaseCtrl_1.default));
exports.default = LevelBoxCtrl;

cc._RF.pop();