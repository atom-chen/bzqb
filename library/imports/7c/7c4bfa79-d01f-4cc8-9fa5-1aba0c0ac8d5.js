"use strict";
cc._RF.push(module, '7c4bfp50B9MyJ+lGroMCsjV', 'msgBox');
// modules/public/script/msgBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
/*
author: 张志强
日期:2018-11-09 16:51:50
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
    Model.prototype.setWords = function (title, content) {
        this.title = title || "温馨提示";
        this.content = content;
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
            titleLbl: ctrl.titleLbl,
            contentLbl: ctrl.contentLbl,
            cancelBtn: ctrl.cancelBtn,
            confirmBtn: ctrl.confirmBtn
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addGrayLayer();
    };
    View.prototype.refresh = function () {
        this.ui.titleLbl.string = this.model.title;
        this.ui.contentLbl.string = this.model.content;
        this.ui.cancelBtn.active = !ctrl.isSingle;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MsgBoxCtrl = /** @class */ (function (_super) {
    __extends(MsgBoxCtrl, _super);
    function MsgBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.titleLbl = null;
        _this.contentLbl = null;
        _this.cancelBtn = null;
        _this.confirmBtn = null;
        // 声明ui组件end
        // 这是ui组件的map,将ui和控制器或试图普通变量分离
        _this.isSingle = true;
        _this._okcb = null;
        _this._cancelcb = null;
        return _this;
    }
    MsgBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    MsgBoxCtrl.prototype.init = function (title, content, okcb, cancelcb, isSingle) {
        if (isSingle === void 0) { isSingle = true; }
        this.model.setWords(title, content);
        this._okcb = okcb || (function () { });
        this._cancelcb = cancelcb || (function () { });
        this.isSingle = isSingle;
        this.view.refresh();
    };
    //绑定操作的回调
    MsgBoxCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.cancelBtn, this._cancelCB, "点击消息框取消按钮");
        this.connect("click", this.ui.confirmBtn, this._confirmCB, "点击消息框确定按钮");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    MsgBoxCtrl.prototype._cancelCB = function () {
        this._cancelcb();
        this.remove();
    };
    MsgBoxCtrl.prototype._confirmCB = function () {
        this._okcb();
        this.remove();
    };
    //end
    // update(dt) {}
    MsgBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Label)
    ], MsgBoxCtrl.prototype, "titleLbl", void 0);
    __decorate([
        property(cc.Label)
    ], MsgBoxCtrl.prototype, "contentLbl", void 0);
    __decorate([
        property(cc.Node)
    ], MsgBoxCtrl.prototype, "cancelBtn", void 0);
    __decorate([
        property(cc.Node)
    ], MsgBoxCtrl.prototype, "confirmBtn", void 0);
    MsgBoxCtrl = __decorate([
        ccclass
    ], MsgBoxCtrl);
    return MsgBoxCtrl;
}(BaseCtrl_1.default));
exports.default = MsgBoxCtrl;

cc._RF.pop();