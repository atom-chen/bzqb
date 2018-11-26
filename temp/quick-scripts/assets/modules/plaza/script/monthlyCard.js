(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/monthlyCard.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cb70bt5BLZBWrPaOKuLMuYB', 'monthlyCard', __filename);
// modules/plaza/script/monthlyCard.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var cardMgr_1 = require("../../../manager/public/cardMgr");
var ModuleMgr_1 = require("../../../framework/modules/ModuleMgr");
/*
author: 蒙磊
日期:2018-11-09 15:52:44
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.isHave = null;
        _this.isOpenBox = null;
        _this.createTime = null;
        _this.closingDate = null;
        return _this;
    }
    Model.prototype.initData = function () {
        this.isHave = cardMgr_1.default.getInstance().monthlyCardInfo.isHave;
        this.isOpenBox = cardMgr_1.default.getInstance().monthlyCardInfo.isOpenBox;
        this.createTime = cardMgr_1.default.getInstance().monthlyCardInfo.createTime;
    };
    Model.prototype.setClosingDate = function () {
        var endTime = this.createTime + cardMgr_1.default.getInstance().monthlyCardTime;
        var time = new Date(endTime);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        this.closingDate = year + "年" + month + "月" + date + "日结束";
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
            btn_buy: ctrl.btn_buy,
            btn_receiveReward: ctrl.btn_receiveReward,
            btn_beReceived: ctrl.btn_beReceived,
            note_closingDate: ctrl.note_closingDate,
            lab_closingDate: ctrl.lab_closingDate,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MonthlyCardCtrl = /** @class */ (function (_super) {
    __extends(MonthlyCardCtrl, _super);
    function MonthlyCardCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.btn_buy = null;
        _this.btn_receiveReward = null;
        _this.btn_beReceived = null;
        //note
        _this.note_closingDate = null;
        //label
        _this.lab_closingDate = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MonthlyCardCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initData();
    };
    MonthlyCardCtrl.prototype.initData = function () {
        this.model.initData();
        if (this.model.isHave == 0) {
            this.btn_buy.active = true;
        }
        else {
            this.model.setClosingDate();
            this.view.showLabelString(this.ui.lab_closingDate, this.model.closingDate);
            this.note_closingDate.active = true;
            if (this.model.isOpenBox == 0) {
                this.btn_receiveReward.active = true;
            }
            else {
                this.btn_beReceived.active = true;
            }
        }
    };
    //定义网络事件
    MonthlyCardCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.privilege.buyMonthlyCard": this.buyMonthlyCard,
            "plaza.privilege.recMonthlyDailyBox": this.recMonthlyDailyBox,
        };
    };
    //定义全局事件
    MonthlyCardCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    MonthlyCardCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.close, "关闭");
        this.connect("click", this.ui.btn_buy, this.buy, "购买月卡");
        this.connect("click", this.ui.btn_receiveReward, this.openBox, "开启宝箱");
    };
    //网络事件回调begin
    MonthlyCardCtrl.prototype.buyMonthlyCard = function () {
        this.model.initData();
        this.model.setClosingDate();
        this.btn_buy.active = false;
        this.btn_receiveReward.active = true;
        this.note_closingDate.active = true;
        this.view.showLabelString(this.ui.lab_closingDate, this.model.closingDate);
    };
    MonthlyCardCtrl.prototype.recMonthlyDailyBox = function () {
        ModuleMgr_1.default.getInstance().showGainBox(cardMgr_1.default.getInstance().monthlyCardBox);
        this.btn_receiveReward.active = false;
        this.btn_beReceived.active = true;
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    MonthlyCardCtrl.prototype.buy = function () {
        cardMgr_1.default.getInstance().sendBuyMonthlyCard();
    };
    MonthlyCardCtrl.prototype.openBox = function () {
        cardMgr_1.default.getInstance().sendRecMonthlyDailyBox();
    };
    // update(dt) {}
    MonthlyCardCtrl.prototype.close = function () {
        this.closeModule("monthlyCard");
    };
    MonthlyCardCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MonthlyCardCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], MonthlyCardCtrl.prototype, "btn_buy", void 0);
    __decorate([
        property(cc.Node)
    ], MonthlyCardCtrl.prototype, "btn_receiveReward", void 0);
    __decorate([
        property(cc.Node)
    ], MonthlyCardCtrl.prototype, "btn_beReceived", void 0);
    __decorate([
        property(cc.Node)
    ], MonthlyCardCtrl.prototype, "note_closingDate", void 0);
    __decorate([
        property(cc.Label)
    ], MonthlyCardCtrl.prototype, "lab_closingDate", void 0);
    MonthlyCardCtrl = __decorate([
        ccclass
    ], MonthlyCardCtrl);
    return MonthlyCardCtrl;
}(BaseCtrl_1.default));
exports.default = MonthlyCardCtrl;

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
        //# sourceMappingURL=monthlyCard.js.map
        