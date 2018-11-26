"use strict";
cc._RF.push(module, 'f06d4EvgA5HnLXs+46Zm6jo', 'signInBox');
// modules/plaza/script/signIn/signInBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var signInMgr_1 = require("../../../../manager/public/signInMgr");
/*
author: 陈斌杰
日期:2018-11-21 16:20:00
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.boxesData = {};
        return _this;
    }
    //设置宝箱数据
    Model.prototype.setBoxesData = function (data) {
        this.boxesData = data;
    };
    //设置宝箱开启数据
    Model.prototype.setBoxesOpenState = function (data) {
        this.boxesData.isOpen = true;
        this.boxesData.rewarkList = [];
        for (var key in data) {
            var signInRewark_1 = {};
            signInRewark_1.type = Number(key);
            signInRewark_1.amount = data[key];
            signInRewark_1.itemId = null;
            this.boxesData.rewarkList.push(signInRewark_1);
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
            box: ctrl.box,
            total_lab: ctrl.total_lab,
            rewarkInfo: ctrl.rewarkInfo,
            boxRewark: ctrl.boxRewark,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.rewarkInfo.active = false;
    };
    //初始化宝箱UI
    View.prototype.initBoxesUI = function () {
        var _this = this;
        var picName = null;
        if (this.model.boxesData.isOpen) {
            picName = "openBox_" + this.model.boxesData.totalSignInDay;
        }
        else {
            picName = "box_" + this.model.boxesData.totalSignInDay;
        }
        this.loadImage(picName).then(function (sprf) {
            _this.ui.box.spriteFrame = sprf;
        });
        this.ui.total_lab.string = "\u7B7E\u5230" + this.model.boxesData.totalSignInDay;
    };
    //显示宝箱奖励
    View.prototype.showBoxesRewarks = function () {
        this.ui.rewarkInfo.getChildByName("bg").width = 80 * this.model.boxesData.rewarkList.length;
        if (this.ui.rewarkInfo.active == true) {
            this.ui.rewarkInfo.active = false;
        }
        else {
            this.ui.rewarkInfo.active = true;
        }
        if (this.ui.rewarkInfo.childrenCount > 2) {
            return;
        }
        for (var i = 0; i < this.model.boxesData.rewarkList.length; i++) {
            var boxData = this.model.boxesData.rewarkList[i];
            var boxNode = this.addPrefabNode(this.ui.boxRewark, this.ui.rewarkInfo);
            boxNode.x = -40 * (this.model.boxesData.rewarkList.length - 1) + i * 80;
            boxNode.getComponent("boxRewark").initTotalRewark(boxData);
        }
    };
    //刷新宝箱图片显示
    View.prototype.refreshBoxesUI = function () {
        this.initBoxesUI();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var SignInBoxCtrl = /** @class */ (function (_super) {
    __extends(SignInBoxCtrl, _super);
    function SignInBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.box = null;
        _this.total_lab = null;
        _this.rewarkInfo = null;
        _this.boxRewark = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    SignInBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    SignInBoxCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    SignInBoxCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    SignInBoxCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.node, function () {
            if (_this.model.boxesData.isOpen) {
                return;
            }
            if (signInMgr_1.default.getInstance().getIsCanOpenBoxes(_this.model.boxesData.totalSignInDay)) {
                signInMgr_1.default.getInstance().sendReqMultiSignIn(_this.model.boxesData.totalSignInDay);
                return;
            }
            _this.view.showBoxesRewarks();
        }, "点击宝箱显示宝箱奖励");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化累积宝箱
    SignInBoxCtrl.prototype.initTotalBoxes = function (data) {
        this.model.setBoxesData(data);
        this.view.initBoxesUI();
    };
    //刷新宝箱显示
    SignInBoxCtrl.prototype.refreshBoxes = function (data) {
        var _this = this;
        this.model.setBoxesOpenState(data);
        this.view.refreshBoxesUI();
        this.openSubModule("gainBox", true).then(function (script) {
            script.setGainData(_this.model.boxesData.rewarkList);
        });
    };
    SignInBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], SignInBoxCtrl.prototype, "box", void 0);
    __decorate([
        property(cc.Label)
    ], SignInBoxCtrl.prototype, "total_lab", void 0);
    __decorate([
        property(cc.Node)
    ], SignInBoxCtrl.prototype, "rewarkInfo", void 0);
    __decorate([
        property(cc.Prefab)
    ], SignInBoxCtrl.prototype, "boxRewark", void 0);
    SignInBoxCtrl = __decorate([
        ccclass
    ], SignInBoxCtrl);
    return SignInBoxCtrl;
}(BaseCtrl_1.default));
exports.default = SignInBoxCtrl;

cc._RF.pop();