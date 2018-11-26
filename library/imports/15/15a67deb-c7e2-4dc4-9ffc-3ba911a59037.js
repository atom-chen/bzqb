"use strict";
cc._RF.push(module, '15a673rx+JNxJ/8O6kRpZA3', 'addFriend');
// modules/plaza/script/friends/addFriend.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var friendsMgr_1 = require("../../../../manager/public/friendsMgr");
/*
author: 蔡世达
日期:2018-11-22 10:36:08
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.uid = 0;
        //public chatsData: chatList = FriendsMgr.getInstance().chatList
        _this.curChatUid = 0;
        return _this;
    }
    Model.prototype.setUId = function (uid) {
        this.uid = uid;
    };
    Model.prototype.getUId = function () {
        return this.uid;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_addFriend: ctrl.node.getChildByName("btn_add"),
            btn_info: ctrl.node.getChildByName("btn_xxx"),
            lbl_name: ctrl.node.getChildByName("name"),
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.updateData = function (userInfo) {
        this.ui.lbl_name.getComponent(cc.Label).string = userInfo.nickname;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var FriendsCtrl = /** @class */ (function (_super) {
    __extends(FriendsCtrl, _super);
    function FriendsCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //这边去声明ui组件
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    FriendsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    FriendsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    FriendsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    FriendsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_addFriend, function () {
            friendsMgr_1.default.getInstance().addFriend(_this.model.getUId());
        }, "\u6DFB\u52A0\u7528\u6237ID");
    };
    FriendsCtrl.prototype.initData = function (userInfo) {
        this.model.setUId(userInfo.id);
        this.view.updateData(userInfo);
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    FriendsCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    FriendsCtrl = __decorate([
        ccclass
    ], FriendsCtrl);
    return FriendsCtrl;
}(BaseCtrl_1.default));
exports.default = FriendsCtrl;

cc._RF.pop();