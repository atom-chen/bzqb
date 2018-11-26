(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/chats/chats.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1e6c1xJ5gZFUqTR1NxgxaZw', 'chats', __filename);
// modules/plaza/script/chats/chats.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var userMgr_1 = require("../../../../manager/public/userMgr");
var chatsMgr_1 = require("../../../../manager/public/chatsMgr");
var dataids_1 = require("../../../../framework/net/dataids");
/*
author: 蔡世达
日期:2018-11-23 14:08:08
*/
var ChannelType = {
    Channel_World: 1,
    Channel_Guild: 2,
};
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.curChannelType = ChannelType.Channel_World;
        return _this;
    }
    Model.prototype.setCurChannelType = function (type) {
        this.curChannelType = type;
    };
    Model.prototype.getCurChannelType = function () {
        return this.curChannelType;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_world: ctrl.nodeChannelList.getChildByName("toggle1"),
            btn_guild: ctrl.nodeChannelList.getChildByName("toggle2"),
            btn_troops: ctrl.nodeChannelList.getChildByName("toggle3"),
            btn_close: ctrl.node.getChildByName("bg1"),
            nodeChats: ctrl.nodeChat,
            nodeContent: ctrl.nodeInput.getChildByName("input"),
            nodeBarrage: ctrl.nodeInput.getChildByName("tog_barrage"),
            btn_send: ctrl.nodeInput.getChildByName("btn_send"),
            talkLeft: ctrl.talkLeft,
            talkRight: ctrl.talkRight,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.addNodeTalk = function (chat) {
        var chatNode;
        var myInfo = userMgr_1.default.getInstance().getMyInfo();
        if (chat.fromID == myInfo.userUID) {
            chatNode = this.addPrefabNode(this.ui.talkRight, this.ui.nodeChats);
        }
        else {
            chatNode = this.addPrefabNode(this.ui.talkLeft, this.ui.nodeChats);
        }
        chatNode.getComponent("talk").setData(chat);
        return chatNode;
    };
    View.prototype.updateGuildChatList = function () {
        this.ui.nodeChats.destroyAllChildren();
        this.updateChatList(ChannelType.Channel_Guild);
    };
    View.prototype.updateWorldChatList = function () {
        this.ui.nodeChats.destroyAllChildren();
        this.updateChatList(ChannelType.Channel_World);
    };
    View.prototype.getChatContent = function () {
        return this.ui.nodeContent.getComponent(cc.EditBox).string;
    };
    View.prototype.updateChatList = function (channelType) {
        var l_chatContent = chatsMgr_1.default.getInstance().chatContent;
        if (l_chatContent.list && l_chatContent.list[channelType]) {
            var chatCount = l_chatContent.list[channelType].chatContent.length;
            var chatContent = l_chatContent.list[channelType].chatContent;
            for (var i = 0; i < chatCount; i++) {
                var chatItem_1 = chatContent[i];
                this.addNodeTalk(chatItem_1);
            }
        }
    };
    View.prototype.updateUserInfo = function (userInfo) {
        for (var i = 0; i < this.ui.nodeChats.childrenCount; i++) {
            var id = this.ui.nodeChats.children[i].getComponent("talk").getID();
            if (userInfo.id == id) {
                this.ui.nodeChats.children[i].getComponent("talk").setUserInfo(userInfo);
            }
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var ChatsCtrl = /** @class */ (function (_super) {
    __extends(ChatsCtrl, _super);
    function ChatsCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.nodeChannelList = null;
        _this.nodeChat = null;
        _this.nodeInput = null;
        _this.talkLeft = null;
        _this.talkRight = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    ChatsCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    ChatsCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
        //"plaza.friend.applyFriend": this.applyFriend,
        };
    };
    //定义全局事件
    ChatsCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {
            "worldChat.recNewChat": this.worldChat_recNewChat,
            "guildChat.recNewChat": this.guildChat_recNewChat,
            "search.entry.reqUserBrief": this.search_ertry_reqUserBrief,
            "chats.updateUserInfo": this.chats_updateUserInfo,
            "onWorldChat": this.onWorldChat,
        };
    };
    ChatsCtrl.prototype.onWorldChat = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_CHAT_TO_WORLD);
        var l_chat = {};
        l_chat.fromID = data.from;
        l_chat.content = data.content;
        this.worldChat_recNewChat(l_chat, chatsMgr_1.default.getInstance().usersInfo[l_chat.fromID]);
    };
    ChatsCtrl.prototype.search_ertry_reqUserBrief = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_USER_BRIEF);
        this.view.updateUserInfo(data);
    };
    ChatsCtrl.prototype.chats_updateUserInfo = function (userInfo) {
        this.view.updateUserInfo(userInfo);
    };
    ChatsCtrl.prototype.worldChat_recNewChat = function (chat, userInfo) {
        if (this.model.getCurChannelType() != ChannelType.Channel_World) {
            return;
        }
        var chatNode = this.view.addNodeTalk(chat);
        if (userInfo) {
            chatNode.getComponent("talk").setUserInfo(userInfo);
        }
    };
    ChatsCtrl.prototype.guildChat_recNewChat = function (chat) {
        if (this.model.getCurChannelType() != ChannelType.Channel_Guild) {
            return;
        }
        this.view.addNodeTalk(chat);
    };
    //绑定操作的回调
    ChatsCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            _this.closeModule("chats");
        }, "");
        this.connect("click", this.ui.btn_send, function () {
            var l_curChannelType = _this.model.getCurChannelType();
            if (ChannelType.Channel_World == l_curChannelType) {
                chatsMgr_1.default.getInstance().sendWorldChat(_this.view.getChatContent());
            }
            else if (ChannelType.Channel_Guild == l_curChannelType) {
                chatsMgr_1.default.getInstance().sendGuildChat(_this.view.getChatContent());
            }
        }, "\u53D1\u9001\u4FE1\u606F");
        this.connect("click", this.ui.btn_world, function () {
            console.log("世界频道");
            if (_this.model.getCurChannelType() == ChannelType.Channel_World) {
                return;
            }
            _this.view.updateWorldChatList();
            _this.model.setCurChannelType(ChannelType.Channel_World);
        }, "\u4E16\u754C\u9891\u9053");
        this.connect("click", this.ui.btn_guild, function () {
            console.log("公会频道");
            if (_this.model.getCurChannelType() == ChannelType.Channel_Guild) {
                return;
            }
            _this.view.updateGuildChatList();
            _this.model.setCurChannelType(ChannelType.Channel_Guild);
        }, "\u516C\u4F1A\u9891\u9053");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    ChatsCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Node)
    ], ChatsCtrl.prototype, "nodeChannelList", void 0);
    __decorate([
        property(cc.Node)
    ], ChatsCtrl.prototype, "nodeChat", void 0);
    __decorate([
        property(cc.Node)
    ], ChatsCtrl.prototype, "nodeInput", void 0);
    __decorate([
        property(cc.Prefab)
    ], ChatsCtrl.prototype, "talkLeft", void 0);
    __decorate([
        property(cc.Prefab)
    ], ChatsCtrl.prototype, "talkRight", void 0);
    ChatsCtrl = __decorate([
        ccclass
    ], ChatsCtrl);
    return ChatsCtrl;
}(BaseCtrl_1.default));
exports.default = ChatsCtrl;

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
        //# sourceMappingURL=chats.js.map
        