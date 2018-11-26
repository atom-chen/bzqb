"use strict";
cc._RF.push(module, 'b161c1dGbtH+4E+QXDqTaWI', 'day');
// modules/plaza/script/signIn/day.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var enums_1 = require("../../../../manager/enums");
var signInMgr_1 = require("../../../../manager/public/signInMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 陈斌杰
日期:2018-11-21 10:38:16
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.signInData = {};
        _this.isNoDoubleSignIn = false; //是否放弃双倍签到
        return _this;
    }
    //设置第N天签到数据
    Model.prototype.setSignInData = function (data) {
        this.signInData = data;
    };
    //设置数据已经签到
    Model.prototype.setDataIsSignIn = function () {
        this.signInData.isSignIn = true;
        this.signInData.again_signIn = false;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            bg: ctrl.bg,
            rewark_Ico: ctrl.rewark.getChildByName("ico").getComponent(cc.Sprite),
            rewark_amount: ctrl.rewark.getChildByName("amount").getComponent(cc.Label),
            hook: ctrl.hook,
            again_signIn: ctrl.again_signIn,
            vipIco: ctrl.vipIco,
            bnt_signIn: ctrl.bnt_signIn,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.rewark_Ico.spriteFrame = null;
        this.ui.rewark_amount.string = "";
        this.ui.hook.active = false;
        this.ui.again_signIn.active = false;
        this.ui.vipIco.active = false;
    };
    //初始化第N天签到UI
    View.prototype.initSignInUI = function () {
        var _this = this;
        var signInData = this.model.signInData;
        var icoName = null;
        switch (signInData.rewark.type) {
            case enums_1.enums.Get_Gold:
                icoName = "gold";
                break;
            case enums_1.enums.Get_Crystal:
                icoName = "crystal";
                break;
            case enums_1.enums.Get_Price:
                icoName = "diamond";
                break;
            default:
                break;
        }
        if (icoName != null) {
            this.loadImage(icoName, true).then(function (sprf) {
                _this.ui.rewark_Ico.spriteFrame = sprf;
            });
        }
        this.ui.rewark_amount.string = signInData.rewark.amount.toString();
        this.ui.hook.active = signInData.isSignIn;
        this.ui.again_signIn.active = signInData.again_signIn;
        if (signInData.vipLv == 0) {
            this.ui.vipIco.active = false;
        }
        else if (signInData.vipLv > 1) {
            this.ui.vipIco.active = true;
            this.loadImage("vipIco_" + signInData.vipLv).then(function (sprf) {
                _this.ui.vipIco.getComponent(cc.Sprite).spriteFrame = sprf;
            });
        }
    };
    //刷新签到UI
    View.prototype.refreshSignIn = function () {
        this.ui.hook.active = this.model.signInData.isSignIn;
        this.ui.again_signIn.active = this.model.signInData.again_signIn;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var DayCtrl = /** @class */ (function (_super) {
    __extends(DayCtrl, _super);
    function DayCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.bg = null;
        _this.rewark = null;
        _this.hook = null;
        _this.again_signIn = null;
        _this.vipIco = null;
        _this.bnt_signIn = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    DayCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    DayCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    DayCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    DayCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.bnt_signIn, function () {
            _this.signInBtn();
        }, "点击签到");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化第N天签到
    DayCtrl.prototype.initSignIn = function (data) {
        this.model.setSignInData(data);
        this.view.initSignInUI();
    };
    //刷新签到UI显示
    DayCtrl.prototype.refreshUI = function () {
        this.model.setDataIsSignIn();
        this.view.refreshSignIn();
    };
    //签到按钮处理
    DayCtrl.prototype.signInBtn = function () {
        var isCanSignIn = signInMgr_1.default.getInstance().getIsCanSignIn(this.model.signInData.signInDay);
        if (this.model.signInData.isSignIn) {
            return;
        }
        //签到
        if (isCanSignIn) { //今天还没签到可签到
            //vip双倍签到处理
            if (this.model.signInData.vipLv && this.model.signInData.vipLv > userMgr_1.default.getInstance().user.vipLv && !this.model.isNoDoubleSignIn) {
                this.gemit("openDoubleSignIn", this.model.signInData.signInDay);
                return;
            }
            signInMgr_1.default.getInstance().sendReqSignIn();
            return;
        }
        //补签		补签次数不等于0  可补签  前面的天数已经补签完
        var canSignIn = signInMgr_1.default.getInstance().getIsCanShowRepairSignIn(this.model.signInData.signInDay);
        if (!canSignIn) {
            console.log("----------------当前还有未补签天数，请先补签前面的天数------------------");
        }
        if (this.model.signInData.again_signIn && canSignIn) {
            //vip双倍签到处理
            if (this.model.signInData.vipLv && this.model.signInData.vipLv > userMgr_1.default.getInstance().user.vipLv && !this.model.isNoDoubleSignIn) {
                this.gemit("openDoubleSignIn", this.model.signInData.signInDay);
                return;
            }
            this.gemit("openRepairSignIn", this.model.signInData.signInDay);
        }
    };
    DayCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "bg", void 0);
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "rewark", void 0);
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "hook", void 0);
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "again_signIn", void 0);
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "vipIco", void 0);
    __decorate([
        property(cc.Node)
    ], DayCtrl.prototype, "bnt_signIn", void 0);
    DayCtrl = __decorate([
        ccclass
    ], DayCtrl);
    return DayCtrl;
}(BaseCtrl_1.default));
exports.default = DayCtrl;

cc._RF.pop();