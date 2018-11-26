"use strict";
cc._RF.push(module, '20061xXslJEIq06Ikm3LII5', 'signIn');
// modules/plaza/script/signIn/signIn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var signInMgr_1 = require("../../../../manager/public/signInMgr");
var dataids_1 = require("../../../../framework/net/dataids");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 陈斌杰
日期:2018-11-20 16:29:17
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.signInListData = signInMgr_1.default.getInstance().signInData; //全部签到数据
        _this.totalBoxesData = signInMgr_1.default.getInstance().totalBoxesData; //全部累积宝箱数据
        _this.nowCloseSignIn = null; //当前放弃双倍签到的天数
        _this.nowRepairSignIn = null; //当前补签天数
        return _this;
    }
    //判断玩家身上的金钱是否足够补签
    Model.prototype.getIsCanSpend = function () {
        var money = userMgr_1.default.getInstance().userMoney.diamond;
        if (signInMgr_1.default.getInstance().signIn_ReissuesCost < money) {
            return true;
        }
        return false;
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
            content: ctrl.content,
            boxes: ctrl.boxes,
            day: ctrl.day,
            signInBox: ctrl.signInBox,
            doubleSignIn: ctrl.doubleSignIn,
            btn_doubleClose: ctrl.doubleSignIn.getChildByName("btn_doubleClose"),
            close: ctrl.doubleSignIn.getChildByName("close"),
            repairSignin: ctrl.repairSignin,
            btn_yqrx: ctrl.repairSignin.getChildByName("btn_yqrx"),
            btn_shareGame: ctrl.repairSignin.getChildByName("btn_shareGame"),
            btn_repairClose: ctrl.repairSignin.getChildByName("btn_repairClose"),
            repairnum: ctrl.repairSignin.getChildByName("repairNum").getComponent(cc.Label),
            totalDay: ctrl.totalDay,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.initSignInUI();
        this.initTotalBoxesUI();
        this.ui.doubleSignIn.active = false;
    };
    //初始化签到界面
    View.prototype.initSignInUI = function () {
        var row = 0;
        var column = 0;
        for (var i = 0; i < this.model.signInListData.list.length; i++) {
            var signInData = this.model.signInListData.list[i];
            var signInNode = this.addPrefabNode(this.ui.day, this.ui.content);
            //设置坐标
            column = i % 7;
            if (i != 0 && i % 7 == 0) {
                row++;
            }
            signInNode.x = -255 + 85 * column;
            signInNode.y = 140 - 85 * row;
            signInNode.getComponent("day").initSignIn(signInData);
        }
        this.ui.totalDay.string = signInMgr_1.default.getInstance().multiDay.toString();
    };
    //初始化签到累积宝箱
    View.prototype.initTotalBoxesUI = function () {
        for (var i = 0; i < this.model.totalBoxesData.list.length; i++) {
            var boxesData = this.model.totalBoxesData.list[i];
            var boxesNode = this.addPrefabNode(this.ui.signInBox, this.ui.boxes);
            //设置坐标
            boxesNode.x = -225 + i * 150;
            boxesNode.y = -210;
            boxesNode.getComponent("signInBox").initTotalBoxes(boxesData);
        }
    };
    //刷新签到UI
    View.prototype.refreshSignInUI = function (index) {
        this.ui.content.children[index - 1].getComponent("day").refreshUI();
    };
    //开启双倍签到界面
    View.prototype.showDoubleSignIn = function () {
        this.ui.doubleSignIn.active = true;
    };
    //设置遗憾放弃签到数据
    View.prototype.setCloseSignIn = function () {
        this.ui.content.children[this.model.nowCloseSignIn - 1].getComponent("day").model.isNoDoubleSignIn = true;
        this.ui.doubleSignIn.active = false;
        this.model.nowCloseSignIn = null;
    };
    //开启补签界面
    View.prototype.showRepairSignIn = function () {
        this.ui.repairnum.string = signInMgr_1.default.getInstance().signIn_Reissues + "\u6B21";
        this.ui.repairSignin.active = true;
    };
    //刷新累积签到天数
    View.prototype.refreshTotalDayUI = function () {
        this.ui.totalDay.string = signInMgr_1.default.getInstance().multiDay.toString();
    };
    //刷新累积宝箱显示UI
    View.prototype.refreshBoxesUI = function (data) {
        for (var i = 0; i < this.model.totalBoxesData.list.length; i++) {
            var boxesData = this.model.totalBoxesData.list[i];
            if (boxesData.totalSignInDay == data.multiDayIndex) {
                this.ui.boxes.children[i].getComponent("signInBox").refreshBoxes(data.dictRecItems);
            }
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var SignInCtrl = /** @class */ (function (_super) {
    __extends(SignInCtrl, _super);
    function SignInCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.content = null;
        _this.boxes = null;
        _this.day = null;
        _this.signInBox = null;
        _this.doubleSignIn = null;
        _this.repairSignin = null;
        _this.totalDay = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    SignInCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    SignInCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.signin.signin": this.signin,
            "plaza.signin.repairSignin": this.getRepairSignin,
            "plaza.signin.recMultiSignin": this.recMultiSignin,
        };
    };
    //定义全局事件
    SignInCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "openDoubleSignIn": this.openDoubleSignIn,
            "openRepairSignIn": this.openRepairSignIn,
        };
    };
    //绑定操作的回调
    SignInCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("signIn");
        }, "关闭签到界面");
        this.connect("click", this.ui.btn_doubleClose, function () {
            _this.ui.doubleSignIn.active = false;
        }, "关闭双倍签到界面");
        this.connect("click", this.ui.close, function () {
            _this.view.setCloseSignIn();
        }, "遗憾放弃");
        this.connect("click", this.ui.btn_yqrx, function () {
            if (signInMgr_1.default.getInstance().signIn_Reissues == 0) {
                console.log("-------补签次数不足------");
                return;
            }
            if (!_this.model.getIsCanSpend()) {
                console.log("-------钻石不够，请充值！------");
                return;
            }
            signInMgr_1.default.getInstance().sendReqRepairSignIn(_this.model.nowRepairSignIn);
        }, "点击有钱任性按钮发送补签");
        this.connect("click", this.ui.btn_shareGame, function () {
            console.log("-------分享游戏------");
        }, "点击分享游戏按钮发送补签");
        this.connect("click", this.ui.btn_repairClose, function () {
            _this.ui.repairSignin.active = false;
        }, "关闭补签界面");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    //服务器下发的签到数据  刷新签到UI
    SignInCtrl.prototype.signin = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_DOSIGNIN_RECINFO);
        this.view.refreshSignInUI(data.dayIndex);
        this.view.refreshTotalDayUI();
    };
    //服务器下发补签数据  刷新UI
    SignInCtrl.prototype.getRepairSignin = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_DOSIGNIN_RECINFO);
        this.ui.repairSignin.active = false;
        this.view.refreshSignInUI(data.dayIndex);
        this.view.refreshTotalDayUI();
    };
    //服务器下发累积宝箱开启数据
    SignInCtrl.prototype.recMultiSignin = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_MULTISIGNIN_RECINFO);
        this.view.refreshBoxesUI(data);
    };
    //打开双倍签到界面
    SignInCtrl.prototype.openDoubleSignIn = function (dayIndex) {
        this.model.nowCloseSignIn = dayIndex;
        this.view.showDoubleSignIn();
    };
    //打开补签界面
    SignInCtrl.prototype.openRepairSignIn = function (dayIndex) {
        this.model.nowRepairSignIn = dayIndex;
        this.view.showRepairSignIn();
    };
    SignInCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], SignInCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], SignInCtrl.prototype, "content", void 0);
    __decorate([
        property(cc.Node)
    ], SignInCtrl.prototype, "boxes", void 0);
    __decorate([
        property(cc.Prefab)
    ], SignInCtrl.prototype, "day", void 0);
    __decorate([
        property(cc.Prefab)
    ], SignInCtrl.prototype, "signInBox", void 0);
    __decorate([
        property(cc.Node)
    ], SignInCtrl.prototype, "doubleSignIn", void 0);
    __decorate([
        property(cc.Node)
    ], SignInCtrl.prototype, "repairSignin", void 0);
    __decorate([
        property(cc.Label)
    ], SignInCtrl.prototype, "totalDay", void 0);
    SignInCtrl = __decorate([
        ccclass
    ], SignInCtrl);
    return SignInCtrl;
}(BaseCtrl_1.default));
exports.default = SignInCtrl;

cc._RF.pop();