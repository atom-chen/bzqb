"use strict";
cc._RF.push(module, '3a6c2+b+JhEQ7RTt0SdlZQ3', 'friends');
// modules/plaza/script/friends/friends.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var friendsMgr_1 = require("../../../../manager/public/friendsMgr");
var dataids_1 = require("../../../../framework/net/dataids");
/*
author: 蔡世达
日期:2018-11-18 15:24:08
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.friendsData = {};
        _this.curChatUid = 0;
        _this.friendsData.friendList = friendsMgr_1.default.getInstance().friendsInfoList;
        _this.friendsData.mostFriendsNum = 0;
        if (_this.friendsData.friendList) {
            _this.friendsData.friendsNum = _this.friendsData.friendList.length;
        }
        else {
            _this.friendsData.friendsNum = 0;
        }
        return _this;
    }
    Model.prototype.updateData = function () {
        this.friendsData.friendList = friendsMgr_1.default.getInstance().friendsInfoList;
        this.friendsData.mostFriendsNum = 0;
        this.friendsData.friendsNum = this.friendsData.friendList.length;
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
            lblFriend: ctrl.lbl_friendCount,
            friendList: ctrl.friendContent,
            friend: ctrl.friend,
            friendTips: ctrl.friendTips,
            rightFrame: ctrl.rightFrame,
            talkLeft: ctrl.talkLeft,
            talkRight: ctrl.talkRight,
            btn_addFriend: ctrl.btn_addFriend,
            btn_inviteFriend: ctrl.btn_inviteFriend,
            btn_close_challenge: ctrl.nodeChallenge.getChildByName("btn_close"),
            nodeChallenge: ctrl.nodeChallenge,
            nodeChatContent: ctrl.rightFrame.getChildByName("input").getChildByName("content"),
            nodeChat: ctrl.chatContent,
            btn_send: ctrl.rightFrame.getChildByName("btn_send"),
            //好友界面
            nodeAddFriend: ctrl.nodeAddFriend,
            btn_close_addFriend: ctrl.nodeAddFriend.getChildByName("btn_close"),
            btn_search: ctrl.nodeAddFriend.getChildByName("btn_search"),
            nodeUserID: ctrl.nodeAddFriend.getChildByName("inputUID").getChildByName("applyFriend"),
            lblType: ctrl.nodeAddFriend.getChildByName("label"),
            nodeAddFriendList: ctrl.nodeAddFriendList,
            AddFriend: ctrl.prefabAddFriend,
            btnRefresh: ctrl.nodeAddFriend.getChildByName("btn_refresh"),
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.updateFriendListNode();
        this.ui.friendTips.active = true;
        this.ui.rightFrame.active = false;
        this.ui.nodeAddFriend.active = false;
        this.ui.nodeChallenge.active = false;
    };
    View.prototype.updateFriendListNode = function () {
        //更新好友数量
        this.ui.lblFriend.string = "\u6211\u7684\u597D\u53CB  " + this.model.friendsData.friendsNum + "/" + this.model.friendsData.mostFriendsNum;
        //更新好友列表
        this.updateFriendList();
    };
    //好友列表整理
    View.prototype.updateFriendList = function () {
        this.ui.friendList.destroyAllChildren();
        for (var key in this.model.friendsData.friendList) {
            if (typeof this.model.friendsData.friendList[key] == "object") {
                var friendNode = this.addPrefabNode(this.ui.friend, this.ui.friendList);
                friendNode.getComponent("friend").initFriendData(this.model.friendsData.friendList[key]);
            }
        }
    };
    //是否显示添加好友界面
    View.prototype.showNodeAddFriend = function (bshow) {
        this.ui.nodeAddFriend.active = bshow;
    };
    //是否显示邀请好友界面
    View.prototype.showNodeInviteFriend = function (bshow) {
    };
    //是否显示友谊战界面
    View.prototype.showNodeChallenge = function (bshow) {
        this.ui.nodeChallenge.active = bshow;
    };
    //显示聊天界面
    View.prototype.showNodeTalk = function (uid) {
        this.ui.friendTips.active = false;
        this.ui.nodeChat.destroyAllChildren();
        //this.ui.
    };
    //添加好友界面的搜索ID
    View.prototype.getSearchUserID = function () {
        return this.ui.nodeUserID.getComponent(cc.EditBox).string;
    };
    View.prototype.getChatContent = function () {
        return this.ui.nodeChatContent.getComponent(cc.EditBox).string;
    };
    View.prototype.clearChatContent = function () {
        this.ui.nodeChatContent.getComponent(cc.EditBox).string = "";
    };
    View.prototype.clearNodeAddFriend = function () {
        this.ui.nodeAddFriendList.destroyAllChildren();
    };
    View.prototype.addNodeAddFriend = function (userInfo) {
        var addfriend = this.addPrefabNode(this.ui.AddFriend, this.ui.nodeAddFriendList);
        addfriend.getComponent("addFriend").initData(userInfo);
    };
    View.prototype.setAddFriendType = function (type) {
        this.ui.lblType.getComponent(cc.Label).string = type;
    };
    View.prototype.refreshFriendList = function (uid) {
        for (var i = 0; i < this.ui.friendList.childrenCount; i++) {
            var l_node = this.ui.friendList.children[i];
            l_node.getComponent("friend").isSelect(l_node.getComponent("friend").getFriendId() == uid);
        }
    };
    View.prototype.refreshFriendChat = function (uid) {
        this.ui.friendTips.active = false;
        this.ui.rightFrame.active = true;
        this.ui.nodeChat.destroyAllChildren();
        var l_chatContent = friendsMgr_1.default.getInstance().chatContent;
        if (l_chatContent.list && l_chatContent.list[uid]) {
            var chatCount = l_chatContent.list[uid].chatContent.length;
            var chatContent = l_chatContent.list[uid].chatContent;
            for (var i = 0; i < chatCount; i++) {
                var chatItem = chatContent[i];
                this.addNodeTalk(chatItem);
            }
        }
    };
    View.prototype.recCurUserChatContent = function (chatContent) {
        this.addNodeTalk(chatContent);
    };
    View.prototype.addNodeTalk = function (chat) {
        var chatNode;
        if (chat.fromID == friendsMgr_1.default.getInstance().myId) {
            chatNode = this.addPrefabNode(this.ui.talkRight, this.ui.nodeChat);
        }
        else {
            chatNode = this.addPrefabNode(this.ui.talkLeft, this.ui.nodeChat);
        }
        chatNode.getComponent("talk").setData(chat, friendsMgr_1.default.getInstance().getFriendInfos(chat.fromID));
    };
    View.prototype.showUnreadUser = function (uid) {
    };
    return View;
}(BaseView_1.default));
//c, 控制
var FriendsCtrl = /** @class */ (function (_super) {
    __extends(FriendsCtrl, _super);
    function FriendsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.lbl_friendCount = null;
        _this.friend = null;
        _this.friendContent = null;
        _this.btn_inviteFriend = null;
        _this.btn_addFriend = null;
        _this.friendTips = null;
        _this.rightFrame = null;
        _this.chatContent = null;
        _this.talkLeft = null;
        _this.talkRight = null;
        _this.nodeAddFriend = null;
        _this.nodeAddFriendList = null;
        _this.prefabAddFriend = null;
        _this.nodeChallenge = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    FriendsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        friendsMgr_1.default.getInstance().reqFriendInfos(friendsMgr_1.default.getInstance().friendsIds.friends);
    };
    //定义网络事件
    FriendsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
        //"plaza.friend.applyFriend": this.applyFriend,
        };
    };
    //定义全局事件
    FriendsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "refreshFriendList": this.refreshFriendList,
            "chat.recNewChat": this.chat_recNewChat,
            "showChallenge": this.showChallenge,
            'search.entry.reqFriendInfos': this.search_entry_reqFriendInfos,
            "search.entry.randomUsers": this.search_entry_randomUsers,
            "search.entry.searchUsers": this.search_entry_searchUsers,
        };
    };
    FriendsCtrl.prototype.showChallenge = function (id) {
        this.view.showNodeChallenge(true);
    };
    //返回推荐好友
    FriendsCtrl.prototype.search_entry_randomUsers = function (msg) {
        var userInfos = msg.getDataByType(dataids_1.dataids.ID_USERLIST);
        this.view.showNodeAddFriend(true);
        this.view.setAddFriendType("推荐：");
        this.view.clearChatContent();
        this.view.clearNodeAddFriend();
        for (var i = 0; i < userInfos.length; i++) {
            this.view.addNodeAddFriend(userInfos[i]);
        }
    };
    FriendsCtrl.prototype.search_entry_searchUsers = function () {
        this.view.setAddFriendType("查询结果：");
        this.view.clearNodeAddFriend();
        var l_userInfo = friendsMgr_1.default.getInstance().isAlwaysSearch(this.model.curSearchData);
        this.view.addNodeAddFriend(l_userInfo);
    };
    FriendsCtrl.prototype.chat_recNewChat = function (friendUid, chatContent) {
        //如果当前聊天对象不是现在接收的
        if (friendUid != this.model.curChatUid) {
        }
        else {
            this.view.recCurUserChatContent(chatContent);
        }
    };
    FriendsCtrl.prototype.search_entry_reqFriendInfos = function () {
        this.model.updateData();
        this.view.updateFriendListNode();
    };
    //绑定操作的回调
    FriendsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("friends");
        }, "关闭好友界面");
        this.connect("click", this.ui.btn_addFriend, function () {
            friendsMgr_1.default.getInstance().searchRandomUsers();
        }, "显示添加好友界面");
        this.connect("click", this.ui.btn_inviteFriend, function () {
            _this.view.showNodeInviteFriend(true);
        }, "邀请好友");
        this.connect("click", this.ui.btn_close_addFriend, function () {
            _this.view.showNodeAddFriend(false);
        }, "关闭添加好友界面");
        this.connect("click", this.ui.btn_close_challenge, function () {
            _this.view.showNodeChallenge(false);
        }, "关闭友谊战界面");
        this.connect("click", this.ui.btn_send, function () {
            var myInfo = friendsMgr_1.default.getInstance().myId;
            friendsMgr_1.default.getInstance().sendChat(myInfo, _this.model.curChatUid, _this.view.getChatContent());
            _this.view.clearChatContent();
        }, "发送消息");
        this.connect("click", this.ui.btn_search, function () {
            _this.model.curSearchData = _this.view.getSearchUserID();
            var l_userInfo = friendsMgr_1.default.getInstance().isAlwaysSearch(_this.view.getSearchUserID());
            if (!l_userInfo) {
                var searchUId = _this.view.getSearchUserID();
                friendsMgr_1.default.getInstance().searchFriend(searchUId);
            }
            else {
                _this.view.setAddFriendType("查询结果：");
                _this.view.clearNodeAddFriend();
                _this.view.addNodeAddFriend(l_userInfo);
            }
        }, "\u67E5\u8BE2\u7528\u6237" + this.view.getSearchUserID());
        this.connect("click", this.ui.btnRefresh, function () {
            friendsMgr_1.default.getInstance().searchRandomUsers();
        }, "刷新");
    };
    FriendsCtrl.prototype.refreshFriendList = function (uid) {
        if (uid == this.model.curChatUid) {
            return;
        }
        this.view.refreshFriendList(uid);
        this.view.refreshFriendChat(uid);
        this.model.curChatUid = uid;
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
    __decorate([
        property(cc.Button)
    ], FriendsCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Label)
    ], FriendsCtrl.prototype, "lbl_friendCount", void 0);
    __decorate([
        property(cc.Prefab)
    ], FriendsCtrl.prototype, "friend", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "friendContent", void 0);
    __decorate([
        property(cc.Button)
    ], FriendsCtrl.prototype, "btn_inviteFriend", void 0);
    __decorate([
        property(cc.Button)
    ], FriendsCtrl.prototype, "btn_addFriend", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "friendTips", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "rightFrame", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "chatContent", void 0);
    __decorate([
        property(cc.Prefab)
    ], FriendsCtrl.prototype, "talkLeft", void 0);
    __decorate([
        property(cc.Prefab)
    ], FriendsCtrl.prototype, "talkRight", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "nodeAddFriend", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "nodeAddFriendList", void 0);
    __decorate([
        property(cc.Prefab)
    ], FriendsCtrl.prototype, "prefabAddFriend", void 0);
    __decorate([
        property(cc.Node)
    ], FriendsCtrl.prototype, "nodeChallenge", void 0);
    FriendsCtrl = __decorate([
        ccclass
    ], FriendsCtrl);
    return FriendsCtrl;
}(BaseCtrl_1.default));
exports.default = FriendsCtrl;

cc._RF.pop();