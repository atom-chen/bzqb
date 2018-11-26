(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/mails/mail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'aa8a5xMJUtPdIU023ykwSbD', 'mail', __filename);
// modules/plaza/script/mails/mail.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var mailMgr_1 = require("../../../../manager/public/mailMgr");
/*
author: 陈斌杰
日期:2018-11-17 15:26:10
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.mailData = {};
        return _this;
    }
    //设置邮件数据
    Model.prototype.setMailData = function (data) {
        this.mailData = data;
    };
    //刷新邮件读取状态数据
    Model.prototype.setBReadedState = function () {
        this.mailData.bReaded = true;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            mailIco: ctrl.mailIco,
            mailIco_unopen: ctrl.mailIco.getChildByName("mail_unopen"),
            mailIco_open: ctrl.mailIco.getChildByName("mail_open"),
            tip_lab: ctrl.tip_lab,
            time_lab: ctrl.time_lab,
            countDown_lab: ctrl.countDown_lab,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.mailIco.active = false;
        this.ui.mailIco_unopen.active = false;
        this.ui.mailIco_open.active = false;
    };
    //初始化邮件UI
    View.prototype.initMailUI = function () {
        if (!this.model.mailData.id) {
            return;
        }
        this.ui.mailIco.active = true;
        this.ui.mailIco_unopen.active = !this.model.mailData.bReaded;
        this.ui.mailIco_open.active = this.model.mailData.bReaded;
        this.ui.tip_lab.string = this.model.mailData.title;
        this.ui.time_lab.string = this.model.mailData.sendTime;
        if (this.model.mailData.residueTime <= 0) {
            this.ui.countDown_lab.string = "即将删除";
        }
        else {
            this.ui.countDown_lab.string = "\u5269\u4F59\u65F6\u95F4" + this.model.mailData.residueTime.toString() + "\u5929";
        }
    };
    //刷新邮件Ico
    View.prototype.refreshMailIco = function () {
        this.ui.mailIco_unopen.active = false;
        this.ui.mailIco_open.active = true;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MailCtrl = /** @class */ (function (_super) {
    __extends(MailCtrl, _super);
    function MailCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.mailIco = null;
        _this.tip_lab = null;
        _this.time_lab = null;
        _this.countDown_lab = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MailCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    MailCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    MailCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    MailCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.node.getComponent(cc.Button), function () {
            if (_this.model.mailData.content) {
                //刷新邮件详细内容显示
                _this.gemit("refreshMailExplain", _this.model.mailData.id);
                return;
            }
            var listId = [];
            listId.push(_this.model.mailData.id);
            mailMgr_1.default.getInstance().sendReqMailExplainData(listId);
        }, "点击邮件发送请求获取邮件数据");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化邮件数据
    MailCtrl.prototype.initMailData = function (data) {
        this.model.setMailData(data);
        this.view.initMailUI();
    };
    //刷新邮件读取状态
    MailCtrl.prototype.refreshMailState = function () {
        if (this.ui.mailIco_open.active == true) {
            return;
        }
        this.model.setBReadedState();
        this.view.refreshMailIco();
    };
    MailCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MailCtrl.prototype, "mailIco", void 0);
    __decorate([
        property(cc.Label)
    ], MailCtrl.prototype, "tip_lab", void 0);
    __decorate([
        property(cc.Label)
    ], MailCtrl.prototype, "time_lab", void 0);
    __decorate([
        property(cc.Label)
    ], MailCtrl.prototype, "countDown_lab", void 0);
    MailCtrl = __decorate([
        ccclass
    ], MailCtrl);
    return MailCtrl;
}(BaseCtrl_1.default));
exports.default = MailCtrl;

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
        //# sourceMappingURL=mail.js.map
        