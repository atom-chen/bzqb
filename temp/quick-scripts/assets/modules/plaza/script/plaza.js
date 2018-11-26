(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/plaza.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2a6b3DoiRVBVrC+kFtfMQsU', 'plaza', __filename);
// modules/plaza/script/plaza.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
/*
author: 蒙磊
日期:2018-11-05 11:25:44
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
var PlazaCtrl = /** @class */ (function (_super) {
    __extends(PlazaCtrl, _super);
    function PlazaCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    PlazaCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        //打开大厅
        this.openSubModule("main");
    };
    //定义网络事件
    PlazaCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    PlazaCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    PlazaCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    PlazaCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    PlazaCtrl = __decorate([
        ccclass
    ], PlazaCtrl);
    return PlazaCtrl;
}(BaseCtrl_1.default));
exports.default = PlazaCtrl;

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
        //# sourceMappingURL=plaza.js.map
        