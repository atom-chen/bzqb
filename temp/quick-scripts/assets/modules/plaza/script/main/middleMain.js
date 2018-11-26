(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/main/middleMain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '93ca5QVgJlKbqRstV5LZ7JO', 'middleMain', __filename);
// modules/plaza/script/main/middleMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var boxMgr_1 = require("../../../../manager/public/boxMgr");
var GameNet_1 = require("../../../../framework/modules/GameNet");
var itemMgr_1 = require("../../../../manager/public/itemMgr");
var roleMgr_1 = require("../../../../manager/public/roleMgr");
var shopMgr_1 = require("../../../../manager/public/shopMgr");
var ModuleMgr_1 = require("../../../../framework/modules/ModuleMgr");
var dataids_1 = require("../../../../framework/net/dataids");
var userMgr_1 = require("../../../../manager/public/userMgr");
var signInMgr_1 = require("../../../../manager/public/signInMgr");
var taskMgr_1 = require("../../../../manager/public/taskMgr");
/*
author: 蒙磊
日期:2018-11-02 18:03:26
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
var boxMgr = boxMgr_1.default.getInstance();
var itemMgr = itemMgr_1.default.getInstance();
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.user = userMgr_1.default.getInstance().user;
        //-----在线宝箱-----
        _this.onlineBox = null;
        _this.onlineBoxPercent = null; //进度条百分比
        _this.onlineBoxUnlockText = null; // 解锁进度显示文本 xx:xx  
        _this.onlineBoxEndTime = null;
        _this.serverDelay = null;
        //-----胜利宝箱-----
        _this.winBox = null;
        _this.winBoxUnlockText = null; //解锁进度显示文本 xx/xx  
        _this.winBoxPercent = 0; //进度条百分比
        return _this;
    }
    //在线宝箱
    Model.prototype.initOnlineBoxTime = function () {
        this.onlineBox = boxMgr.onlineBox;
        this.serverDelay = GameNet_1.default.getInstance().getServerDelay();
        if (this.onlineBox && this.onlineBox.boxTimes < 5) {
            var openTimes = this.onlineBox.boxTimes;
            console.log("在线宝箱打开次数", openTimes);
            //解锁的时间（毫秒）       解锁所需时间（秒）
            this.onlineBoxEndTime = this.onlineBox.unlockTime + this.onlineBox.boxInfo.Onlinetime[openTimes].time * 1000;
        }
    };
    Model.prototype.setUnlockOnlineBoxTime = function () {
        var serverTime = Date.now() + this.serverDelay;
        var unlockNeedTime = this.onlineBoxEndTime - serverTime;
        unlockNeedTime = unlockNeedTime > 0 ? unlockNeedTime : 0;
        var hour = Math.floor((unlockNeedTime / 1000) / 3600);
        var minute = Math.floor(((unlockNeedTime / 1000) % 3600) / 60);
        var hours = hour >= 10 ? hour : '0' + hour;
        var minutes = minute >= 10 ? minute : '0' + minute;
        this.onlineBoxPercent = unlockNeedTime / (this.onlineBox.boxInfo.Onlinetime[this.onlineBox.boxTimes].time * 1000);
        this.onlineBoxUnlockText = hours + ":" + minutes;
    };
    //胜利宝箱
    Model.prototype.initWinBoxTime = function () {
        this.winBox = boxMgr.winBox;
        if (this.winBox) {
            var winBoxMaxKey = this.winBox.boxInfo.unlock_prop.count;
            var winBoxCurKey = 0; //itemMgr.winKey.amount
            this.winBoxUnlockText = winBoxCurKey + "/" + winBoxMaxKey;
            this.winBoxPercent = winBoxCurKey / winBoxMaxKey;
        }
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
            btn_match: ctrl.btn_match,
            btn_friends: ctrl.btn_friends,
            btn_chats: ctrl.node.getChildByName("btn_chat"),
            btn_gm: ctrl.node.getChildByName("btn_gmMgr"),
            btn_changeRose: ctrl.btn_changeRose,
            btn_best: ctrl.btn_best,
            btn_activity: ctrl.btn_activity,
            btn_signIn: ctrl.btn_signIn,
            btn_dailyTask: ctrl.btn_dailyTask,
            btn_invitingFriends: ctrl.btn_invitingFriends,
            btn_shop: ctrl.btn_shop,
            btn_levelBox: ctrl.btn_levelBox,
            btn_winBox: ctrl.btn_winBox,
            btn_onlineBox: ctrl.btn_onlineBox,
            //label
            lab_onlineTimeText: ctrl.lab_onlineTimeText,
            lab_winTimeText: ctrl.lab_winTimeText,
            //sprite
            sp_onlineTimePercent: ctrl.sp_onlineTimePercent,
            sp_winBoxPercent: ctrl.sp_winBoxPercent,
            sp_role: ctrl.sp_role,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.refreshRole(roleMgr_1.default.getInstance().choiceRole.id);
    };
    //显示label内容
    View.prototype.showLabelString = function (obj, content) {
        obj.string = content;
    };
    //显示进度条
    View.prototype.showProgress = function (obj, percent) {
        obj.fillRange = percent;
    };
    //刷新角色显示
    View.prototype.refreshRole = function (roleId) {
        var _this = this;
        var roleListData = roleMgr_1.default.getInstance().rolesData;
        var id = null;
        for (var i = 0; i < roleListData.length; i++) {
            var roleData = roleListData[i];
            if (roleId == roleData.id) {
                id = roleData.roleId - 1001;
                break;
            }
        }
        this.loadImage("rolePic_" + id).then(function (sprf) {
            _this.ui.sp_role.spriteFrame = sprf;
        });
    };
    return View;
}(BaseView_1.default));
//c, 控制
var MiddleMainCtrl = /** @class */ (function (_super) {
    __extends(MiddleMainCtrl, _super);
    function MiddleMainCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_match = null;
        _this.btn_levelBox = null;
        _this.btn_onlineBox = null;
        _this.btn_winBox = null;
        _this.btn_friends = null;
        _this.btn_changeRose = null;
        _this.btn_best = null;
        _this.btn_activity = null;
        _this.btn_signIn = null;
        _this.btn_dailyTask = null;
        _this.btn_invitingFriends = null;
        _this.btn_shop = null;
        _this.sp_role = null;
        //label
        _this.lab_onlineTimeText = null;
        _this.lab_winTimeText = null;
        //sprite
        _this.sp_onlineTimePercent = null;
        _this.sp_winBoxPercent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    MiddleMainCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        this.initOnlineBox();
        this.initWinBox();
    };
    //定义网络事件
    MiddleMainCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'plaza.box.openBox': this.plaza_box_openBox,
            "plaza.role.reqRoleList": this.reqRoleList,
            'plaza.data.reqShopInfo': this.plaza_data_reqShopInfo,
            "plaza.role.switchRole": this.switchRole,
            "plaza.signin.reqSigninInfo": this.reqSigninInfo,
            "plaza.data.reqDailyMissionInfo": this.reqDailyMissionInfo,
        };
    };
    //定义全局事件
    MiddleMainCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    MiddleMainCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_match, function () { _this.openPrefabCB("matching"); }, "打开竞技模式");
        this.connect("click", this.ui.btn_levelBox, function () { _this.openPrefabCB("levelBoxBG"); }, "打开等级宝箱");
        this.connect("click", this.ui.btn_onlineBox, this.onlineBox, "打开在线宝箱");
        this.connect("click", this.ui.btn_winBox, this.winBox, "打开胜利宝箱");
        this.connect("click", this.ui.btn_friends, function () { _this.openPrefabCB("friends"); }, "打开邀请好友");
        this.connect("click", this.ui.btn_chats, function () { _this.openPrefabCB("chats"); }, "打开聊天窗口");
        //
        this.connect("click", this.ui.btn_gm, function () { _this.openPrefabCB("gm"); }, "打开GM模块");
        this.connect("click", this.ui.btn_changeRose, function () {
            if (roleMgr_1.default.getInstance().isFirst || roleMgr_1.default.getInstance().rolesData) {
                _this.openPrefabCB("role");
                return;
            }
            // RoleMgr.getInstance().sendReqRoleListData();
        }, "发送角色列表数据");
        //this.connect("click", this.ui.btn_best, () => {this.openPrefabCB("best")}, "打开全场最佳");
        this.connect("click", this.ui.btn_activity, function () { _this.openPrefabCB("activity"); }, "打开活动");
        this.connect("click", this.ui.btn_signIn, function () {
            if (signInMgr_1.default.getInstance().isFrist || signInMgr_1.default.getInstance().signInData.list) {
                _this.openPrefabCB("signIn");
                return;
            }
            signInMgr_1.default.getInstance().sendReqSignInInfo();
        }, "打开签到");
        this.connect("click", this.ui.btn_dailyTask, function () {
            if (taskMgr_1.default.getInstance().isFirst || taskMgr_1.default.getInstance().dailyTaskData.list) {
                _this.openPrefabCB("dailyTask");
                return;
            }
            taskMgr_1.default.getInstance().sendReqDailyTaskData();
        }, "打开每日任务");
        this.connect("click", this.ui.btn_invitingFriends, function () { _this.openPrefabCB("invitingFriends"); }, "打开邀请好友");
        this.connect("click", this.ui.btn_shop, function () {
            shopMgr_1.default.getInstance().setShopState("box");
            if (shopMgr_1.default.getInstance().isInitShop) {
                _this.openPrefabCB("shop");
            }
            else {
                shopMgr_1.default.getInstance().reqShopInfo();
            }
        }, "打开商店");
    };
    //网络事件回调begin
    //打开宝箱
    MiddleMainCtrl.prototype.plaza_box_openBox = function () {
        this.initOnlineBox();
        ModuleMgr_1.default.getInstance().showGainBox(boxMgr.boxReward);
    };
    //打开商店
    MiddleMainCtrl.prototype.plaza_data_reqShopInfo = function () {
        this.openPrefabCB("shop");
    };
    //获取服务器发送的角色列表数据
    MiddleMainCtrl.prototype.reqRoleList = function () {
        this.openPrefabCB("role");
    };
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    //在线宝箱
    MiddleMainCtrl.prototype.initOnlineBox = function () {
        this.model.initOnlineBoxTime();
        console.log("初始化在线宝箱", this.model.onlineBox);
        if (this.model.onlineBox && this.model.onlineBox.boxTimes < 5) {
            this.model.setUnlockOnlineBoxTime();
            this.view.showProgress(this.ui.sp_onlineTimePercent, this.model.onlineBoxPercent);
            if (this.model.onlineBoxPercent == 0) {
                this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), "打开宝箱");
            }
            else {
                this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), this.model.onlineBoxUnlockText);
                this.onlineBoxTiming();
            }
        }
        else {
            this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), "已经没有宝箱");
        }
    };
    MiddleMainCtrl.prototype.onlineBoxTiming = function () {
        var _this = this;
        this.schedule(function (timing) {
            _this.model.setUnlockOnlineBoxTime();
            _this.view.showProgress(_this.ui.sp_onlineTimePercent, _this.model.onlineBoxPercent);
            if (_this.model.onlineBoxPercent == 0) {
                _this.view.showLabelString(_this.ui.lab_onlineTimeText.getComponent(cc.Label), "打开宝箱");
                _this.unschedule(timing);
            }
            else {
                _this.view.showLabelString(_this.ui.lab_onlineTimeText.getComponent(cc.Label), _this.model.onlineBoxUnlockText);
            }
        }, 1);
    };
    MiddleMainCtrl.prototype.onlineBox = function () {
        if (this.model.onlineBox && this.model.onlineBoxPercent == 0) {
            cc.log("打开在线宝箱");
            cc.log(this.model.onlineBox.id_service);
            boxMgr.openBox(this.model.onlineBox.id_service);
        }
        else {
            cc.log("宝箱未解锁或没有宝箱");
        }
    };
    //胜利宝箱
    MiddleMainCtrl.prototype.initWinBox = function () {
        this.model.initWinBoxTime();
        console.log("初始化胜利宝箱", this.model.winBox);
        if (this.model.winBox && this.model.winBox.boxTimes < this.model.winBox.boxInfo.todayMaxOpenTimes) {
            this.view.showProgress(this.ui.sp_winBoxPercent, this.model.winBoxPercent);
            if (this.model.winBoxPercent == 1) {
                this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), "打开宝箱");
            }
            else {
                this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), this.model.winBoxUnlockText);
            }
        }
        else {
            this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), "已经没有宝箱");
        }
    };
    MiddleMainCtrl.prototype.winBox = function () {
        cc.log("打开胜利宝箱");
    };
    //获取服务器发送的角色使用数据
    MiddleMainCtrl.prototype.switchRole = function (msg) {
        var itemData = msg.getDataByType(dataids_1.dataids.ID_EQUIP_ROLE);
        this.view.refreshRole(itemData.autoId);
    };
    //打开签到界面
    MiddleMainCtrl.prototype.reqSigninInfo = function () {
        this.openPrefabCB("signIn");
    };
    //打开每日任务界面
    MiddleMainCtrl.prototype.reqDailyMissionInfo = function () {
        this.openPrefabCB("dailyTask");
    };
    // update(dt) {}
    MiddleMainCtrl.prototype.openPrefabCB = function (name) {
        return this.openSubModule(name);
    };
    MiddleMainCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_match", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_levelBox", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_onlineBox", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_winBox", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_friends", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_changeRose", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_best", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_activity", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_signIn", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_dailyTask", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_invitingFriends", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "btn_shop", void 0);
    __decorate([
        property(cc.Sprite)
    ], MiddleMainCtrl.prototype, "sp_role", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "lab_onlineTimeText", void 0);
    __decorate([
        property(cc.Node)
    ], MiddleMainCtrl.prototype, "lab_winTimeText", void 0);
    __decorate([
        property(cc.Sprite)
    ], MiddleMainCtrl.prototype, "sp_onlineTimePercent", void 0);
    __decorate([
        property(cc.Sprite)
    ], MiddleMainCtrl.prototype, "sp_winBoxPercent", void 0);
    MiddleMainCtrl = __decorate([
        ccclass
    ], MiddleMainCtrl);
    return MiddleMainCtrl;
}(BaseCtrl_1.default));
exports.default = MiddleMainCtrl;

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
        //# sourceMappingURL=middleMain.js.map
        