(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/role/role.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c71fav+CCpAeKY77XWFCygx', 'role', __filename);
// modules/plaza/script/role/role.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var userMgr_1 = require("../../../../manager/public/userMgr");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var roleMgr_1 = require("../../../../manager/public/roleMgr");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var dataids_1 = require("../../../../framework/net/dataids");
/*
author: 陈斌杰
日期:2018-11-09 15:44:09
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.userMoney = userMgr_1.default.getInstance().userMoney;
        _this.rolesData = roleMgr_1.default.getInstance().rolesData; //角色列表数据
        _this.choiceRole = roleMgr_1.default.getInstance().choiceRole; //当前选择使用的角色的数据
        _this.nowShowRoleData = _this.choiceRole; //当前显示的角色的数据
        return _this;
    }
    //设置当前显示的角色的数据
    Model.prototype.setNowShowRoleData = function (data) {
        this.nowShowRoleData = data;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_close: ctrl.btn_close,
            gold: ctrl.moneyFrame.getChildByName("gold").getComponent(cc.Label),
            crystal: ctrl.moneyFrame.getChildByName("crystal").getComponent(cc.Label),
            diamond: ctrl.moneyFrame.getChildByName("diamond").getComponent(cc.Label),
            roleInfo: ctrl.roleInfo,
            roleFrame: ctrl.roleFrame,
            rolePic: ctrl.rolePic,
            isChoice: ctrl.isChoice,
            btn_use: ctrl.btn_use,
            btn_unlock: ctrl.btn_unlock,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.refreshMoneyUI();
        this.initRoleList();
        this.refreshShowRole(this.model.choiceRole);
    };
    //刷新特技界面金钱数据
    View.prototype.refreshMoneyUI = function () {
        this.ui.gold.string = this.numberEllipsis(this.model.userMoney.gold);
        this.ui.crystal.string = this.numberEllipsis(this.model.userMoney.crystal);
        this.ui.diamond.string = this.numberEllipsis(this.model.userMoney.diamond);
    };
    //初始化角色列表
    View.prototype.initRoleList = function () {
        var rolesData = this.model.rolesData;
        var row = 0;
        var column = 0;
        for (var i = 0; i < rolesData.length; i++) {
            var role_1 = rolesData[i];
            var roleNode = this.addPrefabNode(this.ui.roleInfo, this.ui.roleFrame);
            column = i % 3;
            if (i != 0 && i % 3 == 0) {
                row++;
                this.ui.roleFrame.height = 190 * (row + 1);
            }
            roleNode.x = -170 + 170 * column;
            roleNode.y = -95 - 190 * row;
            roleNode.getComponent("roleInfo").initRole(role_1);
        }
    };
    //刷新显示的角色图片
    View.prototype.refreshShowRole = function (data) {
        var _this = this;
        var id = data.roleId - 1001;
        this.loadImage("rolePic_" + id).then(function (sprf) {
            _this.ui.rolePic.spriteFrame = sprf;
        });
        this.ui.isChoice.active = false;
        this.ui.btn_use.active = false;
        this.ui.btn_unlock.active = false;
        if (data.isUsing) {
            this.ui.isChoice.active = true;
        }
        else {
            this.ui.btn_use.active = data.isUnlock;
            this.ui.btn_unlock.active = !data.isUnlock;
        }
    };
    //刷新角色列表解锁的角色UI
    View.prototype.refreshRoleList = function () {
        for (var i = 0; i < this.ui.roleFrame.childrenCount; i++) {
            var roleNode = this.ui.roleFrame.children[i];
            var roleData = roleNode.getComponent("roleInfo").model.roleData;
            if (this.model.nowShowRoleData.roleId == roleData.roleId) {
                roleNode.getComponent("roleInfo").ui.lock.active = false;
            }
        }
        this.ui.btn_unlock.active = false;
        this.ui.btn_use.active = true;
    };
    //刷新使用按钮
    View.prototype.refreshUsingBtn = function () {
        this.ui.isChoice.active = true;
        this.ui.btn_unlock.active = false;
        this.ui.btn_use.active = false;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RoleCtrl = /** @class */ (function (_super) {
    __extends(RoleCtrl, _super);
    function RoleCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.moneyFrame = null;
        _this.roleInfo = null;
        _this.roleFrame = null;
        _this.rolePic = null;
        _this.isChoice = null;
        _this.btn_use = null;
        _this.btn_unlock = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RoleCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    RoleCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            "plaza.role.unlockRole": this.unlockRole,
            "plaza.role.switchRole": this.switchRole,
        };
    };
    //定义全局事件
    RoleCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "refreshMoneyUI": this.refreshMoneyUI,
            "refreshRolePic": this.refreshRolePic,
        };
    };
    //绑定操作的回调
    RoleCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("role");
        }, "关闭角色界面");
        this.connect("click", this.ui.btn_unlock, function () {
            _this.openSubModule("roleUnlock").then(function (obj) {
                obj.initUnlock(_this.model.nowShowRoleData);
            });
        }, "打开角色解锁界面");
        this.connect("click", this.ui.btn_use, function () {
            roleMgr_1.default.getInstance().sendReqUsingRole(_this.model.nowShowRoleData.id);
        }, "使用当前角色");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //刷新金钱显示
    RoleCtrl.prototype.refreshMoneyUI = function () {
        this.view.refreshMoneyUI();
    };
    //刷新显示的角色
    RoleCtrl.prototype.refreshRolePic = function (data) {
        this.model.setNowShowRoleData(data);
        this.view.refreshShowRole(data);
    };
    //刷新解锁的角色UI
    RoleCtrl.prototype.unlockRole = function (msg) {
        var unlockRoleData = msg.getDataByType(dataids_1.dataids.ID_UNLOCK_ROLE);
        var data = roleMgr_1.default.getInstance().getRoleDataByItem(unlockRoleData[0].itemId);
        this.refreshRolePic(data);
        this.view.refreshRoleList();
    };
    //刷新使用的角色
    RoleCtrl.prototype.switchRole = function () {
        this.view.refreshUsingBtn();
    };
    RoleCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], RoleCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Node)
    ], RoleCtrl.prototype, "moneyFrame", void 0);
    __decorate([
        property(cc.Prefab)
    ], RoleCtrl.prototype, "roleInfo", void 0);
    __decorate([
        property(cc.Node)
    ], RoleCtrl.prototype, "roleFrame", void 0);
    __decorate([
        property(cc.Sprite)
    ], RoleCtrl.prototype, "rolePic", void 0);
    __decorate([
        property(cc.Node)
    ], RoleCtrl.prototype, "isChoice", void 0);
    __decorate([
        property(cc.Node)
    ], RoleCtrl.prototype, "btn_use", void 0);
    __decorate([
        property(cc.Node)
    ], RoleCtrl.prototype, "btn_unlock", void 0);
    RoleCtrl = __decorate([
        ccclass
    ], RoleCtrl);
    return RoleCtrl;
}(BaseCtrl_1.default));
exports.default = RoleCtrl;

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
        //# sourceMappingURL=role.js.map
        