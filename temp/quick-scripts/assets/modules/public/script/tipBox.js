(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/public/script/tipBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f96b47hftK+bOSAD7RXh9I', 'tipBox', __filename);
// modules/public/script/tipBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
/*
author: 张志强
日期:2018-11-21 11:12:12
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
    Model.prototype.setContent = function (s) {
        this.content = s;
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
            content: ctrl.content
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.refresh = function () {
        var _this = this;
        this.ui.content.string = this.model.content;
        var delay = cc.delayTime(1.0);
        var move = cc.moveBy(0.5, cc.v2(0, 200));
        var fade = cc.fadeOut(0.5);
        var CB = cc.callFunc(function () { _this.node.destroy(); });
        this.node.runAction(cc.sequence(delay, cc.spawn(move, fade), CB));
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TipBoxCtrl = /** @class */ (function (_super) {
    __extends(TipBoxCtrl, _super);
    function TipBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.content = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    TipBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    TipBoxCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    TipBoxCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TipBoxCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    TipBoxCtrl.prototype.setContent = function (content) {
        this.model.setContent(content);
        this.view.refresh();
    };
    // update(dt) {}
    TipBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], TipBoxCtrl.prototype, "content", void 0);
    TipBoxCtrl = __decorate([
        ccclass
    ], TipBoxCtrl);
    return TipBoxCtrl;
}(BaseCtrl_1.default));
exports.default = TipBoxCtrl;

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
        //# sourceMappingURL=tipBox.js.map
        