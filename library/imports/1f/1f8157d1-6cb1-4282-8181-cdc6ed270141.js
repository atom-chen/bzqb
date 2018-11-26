"use strict";
cc._RF.push(module, '1f815fRbLFCgoGBzcbtJwFB', 'gainBox');
// modules/public/script/gainBox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        return _super.call(this) || this;
    }
    Model.prototype.initData = function (arr) {
        this.itemList = arr;
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
            content: ctrl.content,
            closeBtn: ctrl.closeBtn
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addGrayLayer();
    };
    /**@todo 暂时显示文字，等资源到了替换为图标*/
    View.prototype.refresh = function () {
        var list = this.model.itemList;
        var item = this.ui.content.children[0];
        var words = ["金币", "粉晶", "钻石", "特技", "宝箱", "碎片", "喇叭"];
        for (var i = 0; i < list.length; ++i) {
            var curItem = i == 0 ? item : this.addPrefabNode(item, this.ui.content);
            var data = list[i];
            curItem.getComponent(cc.Label).string = words[data.type - 1] + "X" + data.amount;
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GainBoxCtrl = /** @class */ (function (_super) {
    __extends(GainBoxCtrl, _super);
    function GainBoxCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.content = null;
        _this.closeBtn = null;
        return _this;
    }
    GainBoxCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    GainBoxCtrl.prototype.setGainData = function (arr, CB) {
        this.model.initData(arr);
        this.view.refresh();
        this._callback = CB ? CB : function () { };
    };
    //绑定操作的回调
    GainBoxCtrl.prototype.connectUi = function () {
        this.connect("click", this.ui.closeBtn, this._closeBtnCB, "关闭获得物品界面");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    GainBoxCtrl.prototype._closeBtnCB = function () {
        this.remove();
        this._callback();
    };
    //end
    // update(dt) {}
    GainBoxCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], GainBoxCtrl.prototype, "content", void 0);
    __decorate([
        property(cc.Node)
    ], GainBoxCtrl.prototype, "closeBtn", void 0);
    GainBoxCtrl = __decorate([
        ccclass
    ], GainBoxCtrl);
    return GainBoxCtrl;
}(BaseCtrl_1.default));
exports.default = GainBoxCtrl;

cc._RF.pop();