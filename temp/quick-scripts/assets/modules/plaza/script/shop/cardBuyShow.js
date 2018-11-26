(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/shop/cardBuyShow.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b121cWcGOpKcI9fwDbZMgDh', 'cardBuyShow', __filename);
// modules/plaza/script/shop/cardBuyShow.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 蒙磊
日期:2018-11-26 11:02:57
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.spF_money = null;
        _this.lab_name = null;
        _this.lab_money = null;
        _this.lab_count = null;
        return _this;
    }
    Model.prototype.setData = function (spF_money, lab_name, lab_money, lab_count) {
        this.spF_money = spF_money;
        this.lab_name = lab_name;
        this.lab_money = lab_money;
        this.lab_count = lab_count;
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
            sp_money: ctrl.sp_money,
            lab_money: ctrl.lab_money,
            lab_name: ctrl.lab_name,
            lab_count: ctrl.lab_count,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.showData = function () {
        this.ui.sp_money.spriteFrame = this.model.spF_money;
        this.ui.lab_name.string = this.model.lab_name;
        this.ui.lab_money.string = this.model.lab_money;
        this.ui.lab_count.string = this.model.lab_count;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var CardBuyShowCtrl = /** @class */ (function (_super) {
    __extends(CardBuyShowCtrl, _super);
    function CardBuyShowCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //sprite
        _this.sp_money = null;
        //label
        _this.lab_money = null;
        _this.lab_name = null;
        _this.lab_count = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    CardBuyShowCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    CardBuyShowCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    CardBuyShowCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    CardBuyShowCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    CardBuyShowCtrl.prototype.setData = function (spF_money, lab_name, lab_money, lab_count) {
        this.model.setData(spF_money, lab_name, lab_money, lab_count);
        this.view.showData();
    };
    // update(dt) {}
    CardBuyShowCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], CardBuyShowCtrl.prototype, "sp_money", void 0);
    __decorate([
        property(cc.Label)
    ], CardBuyShowCtrl.prototype, "lab_money", void 0);
    __decorate([
        property(cc.Label)
    ], CardBuyShowCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Label)
    ], CardBuyShowCtrl.prototype, "lab_count", void 0);
    CardBuyShowCtrl = __decorate([
        ccclass
    ], CardBuyShowCtrl);
    return CardBuyShowCtrl;
}(BaseCtrl_1.default));
exports.default = CardBuyShowCtrl;

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
        //# sourceMappingURL=cardBuyShow.js.map
        