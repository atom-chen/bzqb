(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/boxRewark.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4d1a2ZGUpVON4Z08+VMWJZE', 'boxRewark', __filename);
// modules/plaza/script/boxRewark.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var enums_1 = require("../../../manager/enums");
/*
author: 陈斌杰
日期:2018-11-21 17:58:37
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.boxesRewarkData = {};
        return _this;
    }
    //设置累积宝箱奖励数据
    Model.prototype.setBoxesRewarkData = function (data) {
        this.boxesRewarkData = data;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            ico: ctrl.ico,
            amount: ctrl.amount,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.ico.spriteFrame = null;
        this.ui.amount.string = "";
    };
    //初始化累积宝箱奖励UI
    View.prototype.initBoxesRewarkUI = function () {
        var _this = this;
        var boxesRewarkData = this.model.boxesRewarkData;
        var icoName = null;
        switch (boxesRewarkData.type) {
            case enums_1.enums.Get_Gold:
                icoName = "gold";
                break;
            case enums_1.enums.Get_Crystal:
                icoName = "crystal";
                break;
            case enums_1.enums.Get_Price:
                icoName = "diamond";
                break;
            case enums_1.enums.Get_Exp:
                icoName = "exp";
                break;
            default:
                break;
        }
        if (icoName != null) {
            this.loadImage(icoName, true).then(function (sprf) {
                _this.ui.ico.spriteFrame = sprf;
            });
        }
        this.ui.amount.string = boxesRewarkData.amount.toString();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var BoxRewarkCtrl = /** @class */ (function (_super) {
    __extends(BoxRewarkCtrl, _super);
    function BoxRewarkCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.ico = null;
        _this.amount = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    BoxRewarkCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    BoxRewarkCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    BoxRewarkCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    BoxRewarkCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化累积宝箱奖励
    BoxRewarkCtrl.prototype.initTotalRewark = function (data) {
        this.model.setBoxesRewarkData(data);
        this.view.initBoxesRewarkUI();
    };
    BoxRewarkCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], BoxRewarkCtrl.prototype, "ico", void 0);
    __decorate([
        property(cc.Label)
    ], BoxRewarkCtrl.prototype, "amount", void 0);
    BoxRewarkCtrl = __decorate([
        ccclass
    ], BoxRewarkCtrl);
    return BoxRewarkCtrl;
}(BaseCtrl_1.default));
exports.default = BoxRewarkCtrl;

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
        //# sourceMappingURL=boxRewark.js.map
        