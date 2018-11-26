(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/foreverCard.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '174658tQ3JAyIWoupPKZkyp', 'foreverCard', __filename);
// modules/plaza/script/foreverCard.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var cardMgr_1 = require("../../../manager/public/cardMgr");
/*
author: 蒙磊
日期:2018-11-09 15:49:16
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
        return _this;
    }
    Model.prototype.initData = function () {
        this.isHave = cardMgr_1.default.getInstance().lifetimeCardInfo.isHave;
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
            btn_beBuy: ctrl.btn_beBuy,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var ForeverCardCtrl = /** @class */ (function (_super) {
    __extends(ForeverCardCtrl, _super);
    function ForeverCardCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.btn_buy = null;
        _this.btn_beBuy = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    ForeverCardCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initData();
    };
    //定义网络事件
    ForeverCardCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.privilege.buyLifetimeCard": this.buyLifetimeCard,
        };
    };
    //定义全局事件
    ForeverCardCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    ForeverCardCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.btn_close, this.close, "关闭");
        this.connect("click", this.ui.btn_buy, this.buy, "购买终身卡");
    };
    ForeverCardCtrl.prototype.initData = function () {
        this.model.initData();
        if (this.model.isHave == 0) {
            this.btn_buy.active = true;
        }
        else {
            this.btn_beBuy.active = true;
        }
    };
    ForeverCardCtrl.prototype.buy = function () {
        cardMgr_1.default.getInstance().sendBuyLifetimeCard();
    };
    //网络事件回调begin
    ForeverCardCtrl.prototype.buyLifetimeCard = function () {
        this.model.initData();
        this.btn_buy.active = false;
        this.btn_beBuy.active = true;
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    ForeverCardCtrl.prototype.close = function () {
        this.closeModule("foreverCard");
    };
    // update(dt) {}
    ForeverCardCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], ForeverCardCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], ForeverCardCtrl.prototype, "btn_buy", void 0);
    __decorate([
        property(cc.Node)
    ], ForeverCardCtrl.prototype, "btn_beBuy", void 0);
    ForeverCardCtrl = __decorate([
        ccclass
    ], ForeverCardCtrl);
    return ForeverCardCtrl;
}(BaseCtrl_1.default));
exports.default = ForeverCardCtrl;

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
        //# sourceMappingURL=foreverCard.js.map
        