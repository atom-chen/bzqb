(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/main/topMain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6c98aLIbD9JQKdhFNAzzaFW', 'topMain', __filename);
// modules/plaza/script/main/topMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../../manager/public/userMgr");
var mailMgr_1 = require("../../../../manager/public/mailMgr");
var cardMgr_1 = require("../../../../manager/public/cardMgr");
var vipMgr_1 = require("../../../../manager/public/vipMgr");
/*
author: 蒙磊
日期:2018-11-02 16:47:30
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var userMgr = userMgr_1.default.getInstance();
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
            //button
            btn_userInfoPanel: ctrl.btn_userInfoPanel,
            btn_vip: ctrl.btn_vip,
            btn_monthlyCard: ctrl.btn_monthlyCard,
            btn_foreverCard: ctrl.btn_foreverCard,
            btn_mail: ctrl.btn_mail,
            btn_set: ctrl.btn_set,
            //label
            lab_level: ctrl.lab_level,
            lab_name: ctrl.lab_name,
            lab_exe: ctrl.lab_exe,
            sp_exePercent: ctrl.sp_exePercent,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    View.prototype.updateLevel = function () {
        this.ui.lab_level.getComponent(cc.Label).string = (userMgr.user.grade).toString();
    };
    View.prototype.updateName = function () {
        this.ui.lab_name.getComponent(cc.Label).string = userMgr.user.userName;
    };
    View.prototype.updateExe = function () {
        this.ui.lab_exe.getComponent(cc.Label).string = this.numberEllipsis(userMgr.user.userExp) + '/' + userMgr.user.experience;
        this.showProgress(this.ui.sp_exePercent, userMgr.user.userExp / userMgr.user.experience);
    };
    //显示进度条
    View.prototype.showProgress = function (obj, percent) {
        obj.fillRange = percent;
    };
    //初始化ui
    View.prototype.initUi = function () {
        this.updateLevel();
        this.updateName();
        this.updateExe();
    };
    return View;
}(BaseView_1.default));
//c, 控制
var TopMainCtrl = /** @class */ (function (_super) {
    __extends(TopMainCtrl, _super);
    function TopMainCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        //button
        _this.btn_userInfoPanel = null;
        _this.btn_vip = null;
        _this.btn_monthlyCard = null;
        _this.btn_foreverCard = null;
        _this.btn_mail = null;
        _this.btn_set = null;
        //label
        _this.lab_name = null;
        _this.lab_exe = null;
        _this.lab_level = null;
        //sprite
        _this.sp_exePercent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    //定义网络事件
    TopMainCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.mail.reqMailList": this.reqMailList,
            "plaza.privilege.reqMonthlyCardInfo": this.reqMonthlyCardInfo,
            "plaza.privilege.reqLifetimeCardInfo": this.reqLifetimeCardInfo,
            'plaza.vip.reqVipInfo': this.reqVipInfo,
        };
    };
    //定义全局事件
    TopMainCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    TopMainCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_userInfoPanel, function () { _this.openPrefabCB("userInfoPanel"); }, "打开角色信息");
        this.connect("click", this.ui.btn_vip, function () {
            if (vipMgr_1.default.getInstance().isInit) {
                _this.openPrefabCB("vip");
            }
            else {
                vipMgr_1.default.getInstance().sendReqVipInfo();
            }
        }, "打开vip");
        this.connect("click", this.ui.btn_monthlyCard, function () {
            if (cardMgr_1.default.getInstance().monthlyIsInit) {
                _this.openPrefabCB("monthlyCard");
            }
            else {
                cardMgr_1.default.getInstance().sendReqMonthlyCardInfo();
            }
        }, "打开月卡");
        this.connect("click", this.ui.btn_foreverCard, function () {
            if (cardMgr_1.default.getInstance().LifeIsInit) {
                _this.openPrefabCB("foreverCard");
            }
            else {
                cardMgr_1.default.getInstance().sendReqLifetimeCardInfo();
            }
        }, "打开永久卡");
        this.connect("click", this.ui.btn_mail, function () {
            if (mailMgr_1.default.getInstance().isFrist || mailMgr_1.default.getInstance().mailsData.list) {
                _this.openPrefabCB("mails");
                return;
            }
            mailMgr_1.default.getInstance().sendReqMailsData();
        }, "打开邮箱");
        this.connect("click", this.ui.btn_set, function () { _this.openPrefabCB("setting", true); }, "打开设置");
    };
    //网络事件回调begin
    TopMainCtrl.prototype.reqMonthlyCardInfo = function () {
        this.openPrefabCB("monthlyCard");
    };
    TopMainCtrl.prototype.reqLifetimeCardInfo = function () {
        this.openPrefabCB("foreverCard");
    };
    TopMainCtrl.prototype.reqVipInfo = function () {
        this.openPrefabCB("vip");
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    TopMainCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //打开邮箱预制
    TopMainCtrl.prototype.reqMailList = function () {
        this.openPrefabCB("mails");
    };
    TopMainCtrl.prototype.openPrefabCB = function (name, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        return this.openSubModule(name, isPublic);
    };
    TopMainCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_userInfoPanel", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_vip", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_monthlyCard", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_foreverCard", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_mail", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "btn_set", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "lab_name", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "lab_exe", void 0);
    __decorate([
        property(cc.Node)
    ], TopMainCtrl.prototype, "lab_level", void 0);
    __decorate([
        property(cc.Sprite)
    ], TopMainCtrl.prototype, "sp_exePercent", void 0);
    TopMainCtrl = __decorate([
        ccclass
    ], TopMainCtrl);
    return TopMainCtrl;
}(BaseCtrl_1.default));
exports.default = TopMainCtrl;

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
        //# sourceMappingURL=topMain.js.map
        