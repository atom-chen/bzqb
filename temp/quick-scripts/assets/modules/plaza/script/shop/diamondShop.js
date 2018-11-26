(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/shop/diamondShop.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6af2eEf0EVB6p1mww1E4zJl', 'diamondShop', __filename);
// modules/plaza/script/shop/diamondShop.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 蒙磊
日期:2018-11-13 20:42:14
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
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            //在这里声明ui
            lab_cost: ctrl.lab_cost,
            lab_gift: ctrl.lab_gift,
            lab_reward: ctrl.lab_reward,
            lab_name: ctrl.lab_name,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), ctrl.cost.toString());
        this.showLabelString(this.ui.lab_gift.getComponent(cc.Label), ctrl.gift.toString());
        this.showLabelString(this.ui.lab_reward.getComponent(cc.Label), ctrl.reward.toString());
        this.showLabelString(this.ui.lab_name.getComponent(cc.Label), ctrl.name);
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var DiamondShopCtrl = /** @class */ (function (_super) {
    __extends(DiamondShopCtrl, _super);
    function DiamondShopCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.lab_cost = null;
        _this.lab_gift = null;
        _this.lab_reward = null;
        _this.lab_name = null;
        return _this;
    }
    DiamondShopCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    DiamondShopCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    DiamondShopCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    DiamondShopCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    DiamondShopCtrl.prototype.setData = function (cost, gift, reward, name) {
        this.cost = cost ? cost + "元" : 0;
        this.gift = gift ? gift : 0;
        this.reward = reward ? reward : 0;
        this.name = name;
    };
    DiamondShopCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], DiamondShopCtrl.prototype, "lab_cost", void 0);
    __decorate([
        property(cc.Node)
    ], DiamondShopCtrl.prototype, "lab_gift", void 0);
    __decorate([
        property(cc.Node)
    ], DiamondShopCtrl.prototype, "lab_reward", void 0);
    __decorate([
        property(cc.Node)
    ], DiamondShopCtrl.prototype, "lab_name", void 0);
    DiamondShopCtrl = __decorate([
        ccclass
    ], DiamondShopCtrl);
    return DiamondShopCtrl;
}(BaseCtrl_1.default));
exports.default = DiamondShopCtrl;

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
        //# sourceMappingURL=diamondShop.js.map
        