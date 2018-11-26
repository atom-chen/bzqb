(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/vip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e20dfMu0Y1LQpjikFfYYnMM', 'vip', __filename);
// modules/plaza/script/vip.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var vipMgr_1 = require("../../../manager/public/vipMgr");
var userMgr_1 = require("../../../manager/public/userMgr");
var shopMgr_1 = require("../../../manager/public/shopMgr");
var ModuleMgr_1 = require("../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-09 15:55:04
*/
//MVC模块,
var VIP;
(function (VIP) {
    VIP[VIP["V1"] = 0] = "V1";
    VIP[VIP["V2"] = 1] = "V2";
    VIP[VIP["V3"] = 2] = "V3";
    VIP[VIP["V4"] = 3] = "V4";
    VIP[VIP["V5"] = 4] = "V5";
    VIP[VIP["V6"] = 5] = "V6";
    VIP[VIP["V7"] = 6] = "V7";
    VIP[VIP["V8"] = 7] = "V8";
    VIP[VIP["V9"] = 8] = "V9";
})(VIP || (VIP = {}));
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var vipMgr = vipMgr_1.default.getInstance();
var userMgr = userMgr_1.default.getInstance();
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        //获取的信息
        _this.curVipLevel = null;
        _this.vip = [];
        _this.userVip = null;
        _this.vipLevel = null;
        _this.vipWeekPrizeInfo = null;
        _this.vipGiftInfo = null;
        //显示信息
        _this.vipShopText = null;
        _this.vipWelfareText = null;
        _this.vipExeText = null;
        _this.vipNeedText = null;
        _this.vipNextLevelText = null;
        _this.vipExePercent = 0; //进度条百分比
        return _this;
    }
    Model.prototype.initData = function () {
        this.vip = vipMgr.vip;
        this.vipLevel = vipMgr.vipLv;
        this.userVip = this.vip[this.vipLevel];
        this.vipWeekPrizeInfo = vipMgr.vipWeekPrizeInfo;
        this.vipGiftInfo = vipMgr.vipGiftInfo;
    };
    Model.prototype.setVipShopText = function (index) {
        this.vipShopText = 'VIP' + (index + 1) + "礼包";
    };
    Model.prototype.setvipWelfareText = function (index) {
        this.vipWelfareText = 'VIP' + (index + 1) + "福利";
    };
    Model.prototype.setExeData = function () {
        var curExe = vipMgr.vipScore;
        if (this.userVip) {
            var targetExe = this.userVip.recharge;
            this.vipExeText = curExe + "/" + targetExe;
            this.vipNeedText = '再充值' + (targetExe - curExe);
            this.vipNextLevelText = '可升级v' + (this.vipLevel + 1);
            this.vipExePercent = curExe / targetExe;
        }
        else {
            this.vipExeText = curExe + "/---";
            this.vipNeedText = "";
            this.vipNextLevelText = "您已达到最高vip等级";
            this.vipExePercent = 1;
        }
    };
    Model.prototype.setText = function (name, text) {
        this[name] = text;
    };
    Model.prototype.setCurVipLevel = function (level) {
        this.curVipLevel = level;
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
            //note
            note_vip: ctrl.note_vip,
            //label
            lab_des: ctrl.lab_des,
            lab_vipShopText: ctrl.lab_vipShopText,
            lab_vipWelfareText: ctrl.lab_vipWelfareText,
            lab_exe: ctrl.lab_exe,
            lab_need: ctrl.lab_need,
            lab_nextLevel: ctrl.lab_nextLevel,
            lab_cost: ctrl.lab_cost,
            //sprite
            sp_vipExePercent: ctrl.sp_vipExePercent,
            sp_vipIcon: ctrl.sp_vipIcon,
            //button
            btn_treasureBox: ctrl.btn_treasureBox,
            btn_welfareBox: ctrl.btn_welfareBox,
            btn_buy: ctrl.btn_buy,
            btn_receive: ctrl.btn_receive,
            btn_recharge: ctrl.btn_recharge,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    View.prototype.showIcon = function (name) {
        var SPF = this.getImageSync(name);
        this.ui.sp_vipIcon.spriteFrame = SPF;
    };
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    //显示进度条
    View.prototype.showProgress = function (obj, percent) {
        obj.fillRange = percent;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var VipCtrl = /** @class */ (function (_super) {
    __extends(VipCtrl, _super);
    function VipCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        //note
        _this.note_vip = null;
        //label
        _this.lab_des = null;
        _this.lab_vipShopText = null;
        _this.lab_vipWelfareText = null;
        _this.lab_exe = null;
        _this.lab_need = null;
        _this.lab_nextLevel = null;
        _this.lab_cost = null;
        //button
        _this.btn_treasureBox = null;
        _this.btn_welfareBox = null;
        _this.btn_buy = null;
        _this.btn_receive = null;
        _this.btn_recharge = null;
        //sprite
        _this.sp_vipIcon = null;
        _this.sp_vipExePercent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    VipCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        vipMgr.initData();
        this.initData();
    };
    //定义网络事件
    VipCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.vip.recVipWeekPrize': this.recVipWeekPrize,
            'plaza.vip.buyVipGift': this.buyVipGift,
        };
    };
    //定义全局事件
    VipCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    VipCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, this.close, "关闭");
        var _loop_1 = function (i) {
            this_1.connect("click", this_1.ui.note_vip.children[i], function () {
                _this.choseVip(i);
            }, "选中vip");
        };
        var this_1 = this;
        for (var i = 0; i < this.ui.note_vip.childrenCount; i++) {
            _loop_1(i);
        }
        this.connect("click", this.ui.btn_recharge, function () {
            shopMgr_1.default.getInstance().setShopState("diamond");
            if (shopMgr_1.default.getInstance().isInitShop) {
                _this.openSubModule("shop").then(function (obj) {
                    obj.choseShop("diamond");
                });
            }
            else {
                shopMgr_1.default.getInstance().reqShopInfo();
            }
        }, "打开砖石商店");
        this.connect("click", this.ui.btn_receive, this.receive, "领取周宝箱");
        this.connect("click", this.ui.btn_buy, this.buy, "购买宝箱");
    };
    //网络事件回调begin
    VipCtrl.prototype.recVipWeekPrize = function () {
        this.model.initData();
        this.btn_receive.getComponent(cc.Button).interactable = false;
        ModuleMgr_1.default.getInstance().showGainBox(vipMgr.dictItemInfo);
    };
    VipCtrl.prototype.buyVipGift = function () {
        this.model.initData();
        this.btn_buy.getComponent(cc.Button).interactable = false;
        ModuleMgr_1.default.getInstance().showGainBox(vipMgr.vipGift);
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    VipCtrl.prototype.initData = function () {
        this.model.initData();
        this.note_vip.children[0].getComponent(cc.Toggle).isChecked = false;
        var level = this.model.vipLevel == 0 ? 0 : this.model.vipLevel - 1;
        this.note_vip.children[level].getComponent(cc.Toggle).isChecked = true;
        this.choseVip(level);
        this.model.setExeData();
        this.view.showIcon("vip_" + this.model.vipLevel);
        this.view.showLabelString(this.ui.lab_exe.getComponent(cc.Label), this.model.vipExeText);
        this.view.showLabelString(this.ui.lab_need.getComponent(cc.Label), this.model.vipNeedText);
        this.view.showLabelString(this.ui.lab_nextLevel.getComponent(cc.Label), this.model.vipNextLevelText);
        this.view.showProgress(this.ui.sp_vipExePercent.getComponent(cc.Sprite), this.model.vipExePercent);
    };
    VipCtrl.prototype.choseVip = function (index) {
        this.model.setCurVipLevel(index + 1);
        this.model.setVipShopText(index);
        this.model.setvipWelfareText(index);
        this.setShopBox(index);
        this.setWelfareBox(index);
        this.view.showLabelString(this.ui.lab_cost.getComponent(cc.Label), this.model.vip[index].price.toString());
        this.view.showLabelString(this.ui.lab_des.getComponent(cc.Label), this.model.vip[index].des);
        this.view.showLabelString(this.ui.lab_vipShopText.getComponent(cc.Label), this.model.vipShopText);
        this.view.showLabelString(this.ui.lab_vipWelfareText.getComponent(cc.Label), this.model.vipWelfareText);
    };
    VipCtrl.prototype.setShopBox = function (index) {
        if (index + 1 > this.model.vipLevel) {
            this.btn_buy.getComponent(cc.Button).interactable = false;
        }
        else if (this.model.vipGiftInfo[index + 1]) {
            this.btn_buy.getComponent(cc.Button).interactable = false;
        }
        else {
            this.btn_buy.getComponent(cc.Button).interactable = true;
        }
    };
    VipCtrl.prototype.setWelfareBox = function (index) {
        if (index + 1 > this.model.vipLevel) {
            this.btn_receive.getComponent(cc.Button).interactable = false;
        }
        else if (this.model.vipWeekPrizeInfo[index + 1]) {
            this.btn_receive.getComponent(cc.Button).interactable = false;
        }
        else {
            this.btn_receive.getComponent(cc.Button).interactable = true;
        }
    };
    //领取周宝箱
    VipCtrl.prototype.receive = function () {
        vipMgr.sendRecVipWeekPrize(this.model.curVipLevel);
    };
    VipCtrl.prototype.buy = function () {
        vipMgr.sendBuyVipGift(this.model.curVipLevel);
    };
    // update(dt) {}
    VipCtrl.prototype.close = function () {
        this.closeModule("vip");
    };
    VipCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "note_vip", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_des", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_vipShopText", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_vipWelfareText", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_exe", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_need", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_nextLevel", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_treasureBox", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_welfareBox", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_buy", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_receive", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "btn_recharge", void 0);
    __decorate([
        property(cc.Sprite)
    ], VipCtrl.prototype, "sp_vipIcon", void 0);
    __decorate([
        property(cc.Node)
    ], VipCtrl.prototype, "sp_vipExePercent", void 0);
    VipCtrl = __decorate([
        ccclass
    ], VipCtrl);
    return VipCtrl;
}(BaseCtrl_1.default));
exports.default = VipCtrl;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=vip.js.map
        