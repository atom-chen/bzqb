"use strict";
cc._RF.push(module, 'b595b8kEJ1AKLzEqr/86nS0', 'roleInfo');
// modules/plaza/script/role/roleInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
/*
author: 陈斌杰
日期:2018-11-14 19:57:33
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.roleData = {};
        return _this;
    }
    Model.prototype.setRoleData = function (data) {
        this.roleData = data;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            rolePic: ctrl.rolePic,
            lock: ctrl.lock,
            btn_showRole: ctrl.btn_showRole,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.ui.lock.active = true;
    };
    //初始化角色UI
    View.prototype.initRoleUI = function () {
        this.ui.lock.active = !this.model.roleData.isUnlock;
        this.setRoleIco();
    };
    //修改角色Ico
    View.prototype.setRoleIco = function () {
        var _this = this;
        var id = (this.model.roleData.roleId - 1001).toString();
        this.loadImage("roleIco_" + id).then(function (sprf) {
            _this.ui.rolePic.getComponent(cc.Sprite).spriteFrame = sprf;
        });
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RoleInfoCtrl = /** @class */ (function (_super) {
    __extends(RoleInfoCtrl, _super);
    function RoleInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.rolePic = null;
        _this.lock = null;
        _this.btn_showRole = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RoleInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    RoleInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    RoleInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    RoleInfoCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_showRole, function () {
            _this.gemit("refreshRolePic", _this.model.roleData);
        }, "点击显示角色");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //初始化角色
    RoleInfoCtrl.prototype.initRole = function (data) {
        this.model.setRoleData(data);
        this.view.initRoleUI();
    };
    RoleInfoCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], RoleInfoCtrl.prototype, "rolePic", void 0);
    __decorate([
        property(cc.Node)
    ], RoleInfoCtrl.prototype, "lock", void 0);
    __decorate([
        property(cc.Button)
    ], RoleInfoCtrl.prototype, "btn_showRole", void 0);
    RoleInfoCtrl = __decorate([
        ccclass
    ], RoleInfoCtrl);
    return RoleInfoCtrl;
}(BaseCtrl_1.default));
exports.default = RoleInfoCtrl;

cc._RF.pop();