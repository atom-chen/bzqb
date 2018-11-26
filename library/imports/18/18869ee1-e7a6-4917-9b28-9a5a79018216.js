"use strict";
cc._RF.push(module, '188697h56ZJF5somlp5AYIW', 'friend');
// modules/plaza/script/friends/friend.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var friendsMgr_1 = require("../../../../manager/public/friendsMgr");
var guildMembersMgr_1 = require("../../../../manager/public/guildMembersMgr");
var userMgr_1 = require("../../../../manager/public/userMgr");
/*
author: 蔡世达
日期:2018-11-20 13:57:46
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.friendData = {}; //好友信息
        return _this;
    }
    //设置好友数据
    Model.prototype.setFriendData = function (data) {
        this.friendData = data;
    };
    //有没有工会
    Model.prototype.HaveGuild = function () {
        return (this.friendData.guildId > 0);
    };
    return Model;
}(BaseModel_1.default));
/*
    head: any;					//如果是角色头像用角色id获，其他待定
    name: string;				//好友名称
    sex: number;				//好友性别
    tank: string;				//好友段位
    vipLv: number;				//好友vip等级
    guildName: string;			//好友公会名称
    isOnline: boolean;			//是否在线
*/
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            head: ctrl.btnHead,
            btnFrame: ctrl.btnFrame,
            btnChallenge: ctrl.btnChallenge,
            playerInfo: ctrl.playerInfo,
            delFriend: ctrl.delFriend,
            guildInvite: ctrl.guildInvite,
            isSelect: ctrl.btnHead.node.getChildByName("isSelect"),
            guild: ctrl.node.getChildByName("guild"),
            vip: ctrl.node.getChildByName("vip"),
            level: ctrl.node.getChildByName("level"),
            sex: ctrl.node.getChildByName("sex"),
            name: ctrl.node.getChildByName("name"),
            online: ctrl.node.getChildByName("bg").getChildByName("onlineStatus"),
            action: ctrl.node.getChildByName("action"),
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        //this.updateUI()
    };
    //更新好友信息
    View.prototype.updateUI = function () {
        //this.ui.guild.getComponent(cc.Label).string = this.model.friendData.guildName
        this.updateFriendOnlineStatus();
        this.ui.name.getComponent(cc.Label).string = this.model.friendData.nickname;
    };
    //选中
    View.prototype.isSelect = function (bIsSelect) {
        this.ui.isSelect.active = bIsSelect;
        this.ui.action.active = false;
    };
    //更新在线状态
    View.prototype.updateFriendOnlineStatus = function () {
        if (this.model.friendData.online) {
            this.ui.online.getComponent(cc.Label).string = "在线";
            this.ui.online.color = cc.color(0, 255, 0);
            this.ui.btnChallenge.node.active = true;
        }
        else {
            this.ui.online.getComponent(cc.Label).string = "离线";
            this.ui.online.color = cc.color(0, 255, 0);
            this.ui.btnChallenge.node.active = false;
        }
    };
    View.prototype.showAction = function (bShow) {
        this.ui.action.active = bShow;
        this.ui.action.getChildByName("name").getComponent(cc.Label).string = this.model.friendData.nickname;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var FriendCtrl = /** @class */ (function (_super) {
    __extends(FriendCtrl, _super);
    function FriendCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btnFrame = null;
        _this.btnHead = null;
        _this.btnChallenge = null;
        _this.playerInfo = null;
        _this.delFriend = null;
        _this.guildInvite = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    FriendCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    FriendCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'guild.member.inviteJoinGuild': this.guild_member_inviteJoinGuild,
        };
    };
    //定义全局事件
    FriendCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    FriendCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.head, function () {
            _this.gemit("refreshFriendList", _this.model.friendData.id);
            _this.view.showAction(true);
        }, "点击头像");
        this.connect("click", this.ui.btnFrame, function () {
            _this.gemit("refreshFriendList", _this.model.friendData.id);
            _this.view.showAction(false);
        }, "点击聊天");
        this.connect("click", this.ui.btnChallenge, function () {
            _this.gemit("showChallenge", _this.model.friendData.id);
        }, "点击友谊战");
        this.connect("click", this.ui.playerInfo, function () {
            _this.gemit("ShowUserInfo", _this.model.friendData.id);
        }, "用户信息");
        this.connect("click", this.ui.delFriend, function () {
            friendsMgr_1.default.getInstance().kickFriend(_this.model.friendData.id);
        }, "删除好友");
        this.connect("click", this.ui.guildInvite, function () {
            if (_this.model.HaveGuild()) {
                console.log("弹窗------" + "该玩家已经有工会了！");
            }
            else {
                if (userMgr_1.default.getInstance().getMyInfo().guildId > 0) {
                    guildMembersMgr_1.default.getInstance().inviteJoinGuild(_this.model.friendData.id);
                    // this.gemit("guildInvite", this.model.friendData.id);
                }
                else {
                    console.log("弹窗------" + "自己还没有工会！");
                }
            }
        }, "工会邀请");
    };
    FriendCtrl.prototype.isSelect = function (bIsSelect) {
        this.view.isSelect(bIsSelect);
    };
    FriendCtrl.prototype.initFriendData = function (data) {
        this.model.setFriendData(data);
        this.view.updateUI();
    };
    //添加好友后关闭好友
    FriendCtrl.prototype.guild_member_inviteJoinGuild = function () {
        this.view.isSelect(false);
    };
    FriendCtrl.prototype.getFriendId = function () {
        return this.model.friendData.id;
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    FriendCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "btnFrame", void 0);
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "btnHead", void 0);
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "btnChallenge", void 0);
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "playerInfo", void 0);
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "delFriend", void 0);
    __decorate([
        property(cc.Button)
    ], FriendCtrl.prototype, "guildInvite", void 0);
    FriendCtrl = __decorate([
        ccclass
    ], FriendCtrl);
    return FriendCtrl;
}(BaseCtrl_1.default));
exports.default = FriendCtrl;

cc._RF.pop();