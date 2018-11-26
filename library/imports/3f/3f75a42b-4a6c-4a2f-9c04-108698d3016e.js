"use strict";
cc._RF.push(module, '3f75aQrSmxKL5wEEIaY0wFu', 'roleUnlock');
// modules/plaza/script/role/roleUnlock.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../../manager/public/userMgr");
var roleMgr_1 = require("../../../../manager/public/roleMgr");
/*
author: 陈斌杰
日期:2018-11-15 13:53:27
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.roleData = {};
        _this.ChipUnlockState = false; //碎片是否可以解锁
        _this.unlockState = false; //金钱是否可以解锁
        return _this;
    }
    //初始化角色数据
    Model.prototype.initRoleData = function (data) {
        this.roleData = data;
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
            btn_chip: ctrl.btn_chip,
            spendChip: ctrl.spendChip,
            btn_lock: ctrl.btn_lock,
            spendMoney: ctrl.spendMoney,
            chipCount: ctrl.chipCount,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //初始化解锁界面UI显示
    View.prototype.initUnlock = function () {
        var _this = this;
        this.ui.spendChip.string = "X " + this.model.roleData.roleChipNum.toString();
        if (this.model.roleData.roleChipNum != 0 && this.model.roleData.userRoleChipNum >= this.model.roleData.roleChipNum) {
            this.loadImage("btn_unlock").then(function (sprf) {
                _this.ui.btn_chip.getComponent(cc.Sprite).spriteFrame = sprf;
            });
            this.model.ChipUnlockState = true;
        }
        this.ui.chipCount.string = this.model.roleData.userRoleChipNum.toString() + "个";
        this.moneyUnlock();
    };
    //金钱解锁界面显示
    View.prototype.moneyUnlock = function () {
        var _this = this;
        var uiName = null;
        var spend = 0;
        var money = userMgr_1.default.getInstance().userMoney;
        if (this.model.roleData.spendGold) {
            uiName = "gold";
            spend = this.model.roleData.spendGold;
            this.refreshUnlockBtn(money.gold, spend);
        }
        else if (this.model.roleData.spendCrystal) {
            uiName = "crystal";
            spend = this.model.roleData.spendCrystal;
            this.refreshUnlockBtn(money.crystal, spend);
        }
        else if (this.model.roleData.spendDiamond && !this.model.roleData.vipLimite) {
            uiName = "diamond";
            spend = this.model.roleData.spendDiamond;
            this.refreshUnlockBtn(money.diamond, spend);
        }
        else if (this.model.roleData.vipLimite) {
            this.ui.spendMoney.node.parent.getComponent(cc.Sprite).spriteFrame = null;
            this.ui.spendMoney.string = "VIP" + this.model.roleData.vipLimite.toString();
            this.ui.spendMoney.node.parent.x = 30;
            this.refreshUnlockBtn(money.diamond, spend);
            return;
        }
        this.model.ChipUnlockState = true;
        this.ui.spendMoney.string = "X " + spend.toString();
        this.ui.spendMoney.node.parent.x -= spend.toString().length * 10;
        this.loadImage(uiName, true).then(function (sprf) {
            _this.ui.spendMoney.node.parent.getComponent(cc.Sprite).spriteFrame = sprf;
        });
    };
    //解锁按钮显示
    View.prototype.refreshUnlockBtn = function (data, spendMoney) {
        if (data < spendMoney) {
            this.ui.btn_lock.getComponent(cc.Button).interactable = false;
        }
        else {
            this.ui.btn_lock.getComponent(cc.Button).interactable = true;
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RoleUnlockCtrl = /** @class */ (function (_super) {
    __extends(RoleUnlockCtrl, _super);
    function RoleUnlockCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.btn_chip = null;
        _this.spendChip = null;
        _this.btn_lock = null;
        _this.spendMoney = null;
        _this.chipCount = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RoleUnlockCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    RoleUnlockCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    RoleUnlockCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    RoleUnlockCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("roleUnlock");
        }, "关闭解锁角色界面");
        this.connect("click", this.ui.btn_lock, function () {
            roleMgr_1.default.getInstance().sendReqUnlockRole(_this.model.roleData.roleId);
            _this.closeModule("roleUnlock");
        }, "发送金钱解锁角色服务请求");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    //初始化解锁界面数据和UI显示
    RoleUnlockCtrl.prototype.initUnlock = function (data) {
        this.model.initRoleData(data);
        this.view.initUnlock();
    };
    RoleUnlockCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], RoleUnlockCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], RoleUnlockCtrl.prototype, "btn_chip", void 0);
    __decorate([
        property(cc.Label)
    ], RoleUnlockCtrl.prototype, "spendChip", void 0);
    __decorate([
        property(cc.Node)
    ], RoleUnlockCtrl.prototype, "btn_lock", void 0);
    __decorate([
        property(cc.Label)
    ], RoleUnlockCtrl.prototype, "spendMoney", void 0);
    __decorate([
        property(cc.Label)
    ], RoleUnlockCtrl.prototype, "chipCount", void 0);
    RoleUnlockCtrl = __decorate([
        ccclass
    ], RoleUnlockCtrl);
    return RoleUnlockCtrl;
}(BaseCtrl_1.default));
exports.default = RoleUnlockCtrl;

cc._RF.pop();