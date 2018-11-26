(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/mails/mailRewark.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3f52cTAfJVNKIqn0dqiPmCs', 'mailRewark', __filename);
// modules/plaza/script/mails/mailRewark.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var enums_1 = require("../../../../manager/enums");
/*
author: 陈斌杰
日期:2018-11-19 14:12:24
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.mailRewarkData = {};
        return _this;
    }
    //设置邮件奖励数据
    Model.prototype.setMailRewarkData = function (data) {
        this.mailRewarkData = data;
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
            count: ctrl.count,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    //初始化邮件奖励UI
    View.prototype.initMailRewarkUI = function () {
        var _this = this;
        var picName = null;
        switch (this.model.mailRewarkData.type) {
            case enums_1.enums.Get_Gold:
                picName = "gold";
                break;
            case enums_1.enums.Get_Crystal:
                picName = "crystal";
                break;
            case enums_1.enums.Get_Price:
                picName = "diamond";
                break;
            default:
                break;
        }
        this.loadImage(picName, true).then(function (sprf) {
            _this.ui.ico.spriteFrame = sprf;
        });
        this.ui.count.string = this.numberEllipsis(this.model.mailRewarkData.amount);
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MailRewarkCtrl = /** @class */ (function (_super) {
    __extends(MailRewarkCtrl, _super);
    function MailRewarkCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.ico = null;
        _this.count = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MailRewarkCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    MailRewarkCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    MailRewarkCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    MailRewarkCtrl.prototype.connectUi = function () {
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化邮件奖励
    MailRewarkCtrl.prototype.initMailRewark = function (data) {
        this.model.setMailRewarkData(data);
        this.view.initMailRewarkUI();
    };
    MailRewarkCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], MailRewarkCtrl.prototype, "ico", void 0);
    __decorate([
        property(cc.Label)
    ], MailRewarkCtrl.prototype, "count", void 0);
    MailRewarkCtrl = __decorate([
        ccclass
    ], MailRewarkCtrl);
    return MailRewarkCtrl;
}(BaseCtrl_1.default));
exports.default = MailRewarkCtrl;

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
        //# sourceMappingURL=mailRewark.js.map
        