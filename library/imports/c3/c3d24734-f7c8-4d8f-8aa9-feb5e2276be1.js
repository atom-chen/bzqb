"use strict";
cc._RF.push(module, 'c3d24c098hNj4qp/rXiJ2vh', 'chatsMgr');
// manager/public/chatsMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var ChannelType = {
    Channel_World: 1,
    Channel_Guild: 2,
};
var ChatsMgr = /** @class */ (function (_super) {
    __extends(ChatsMgr, _super);
    function ChatsMgr() {
        var _this = _super.call(this) || this;
        _this.chatContent = {};
        _this.usersInfo = [];
        _this.routes = {
            "onWorldChat": _this.onWorldChat,
            "onGuildChat": _this.onGuildChat,
            "search.entry.reqUserBrief": _this.search_entry_reqUserBrief,
        };
        return _this;
    }
    ChatsMgr.prototype.search_entry_reqUserBrief = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_USER_BRIEF);
        this.usersInfo[data.id] = data;
        //this.gemit("chats.updateUserInfo", data);
    };
    ChatsMgr.getInstance = function () {
        if (ChatsMgr._instance == null) {
            ChatsMgr._instance = new ChatsMgr();
        }
        return ChatsMgr._instance;
    };
    ChatsMgr.prototype.onWorldChat = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_CHAT_TO_WORLD);
        if (!this.chatContent.list) {
            this.chatContent.list = [];
        }
        var l_chat = {};
        l_chat.fromID = data.from;
        l_chat.content = data.content;
        if (!this.chatContent.list[ChannelType.Channel_World]) {
            this.chatContent.list[ChannelType.Channel_World] = {};
            this.chatContent.list[ChannelType.Channel_World].chatContent = [];
        }
        this.chatContent.list[ChannelType.Channel_World].chatContent.push(l_chat);
        if (!this.usersInfo) {
            this.usersInfo = [];
        }
    };
    ChatsMgr.prototype.onGuildChat = function (msg) {
        var data = msg.getData();
        if (!this.chatContent.list) {
            this.chatContent.list = [];
        }
        var l_chat = {};
        l_chat.fromID = data.from;
        l_chat.content = data.content;
        if (!this.chatContent.list[ChannelType.Channel_Guild]) {
            this.chatContent.list[ChannelType.Channel_Guild] = {};
            this.chatContent.list[ChannelType.Channel_Guild].chatContent = [];
        }
        this.chatContent.list[ChannelType.Channel_Guild].chatContent.push(l_chat);
        this.gemit("guildChat.recNewChat", l_chat);
    };
    ChatsMgr.prototype.sendReqUserBrief = function (data) {
        var msg = {
            target: data
        };
        this.send_msg("search.entry.reqUserBrief", msg);
    };
    ChatsMgr.prototype.sendWorldChat = function (data) {
        this.sendChat("chat.entry.chatToWorld", data);
    };
    ChatsMgr.prototype.sendGuildChat = function (data) {
        this.sendChat("chat.entry.chatToGuild", data);
    };
    ChatsMgr.prototype.sendChat = function (route, data) {
        var msg = {
            content: data
        };
        this.send_msg(route, msg);
    };
    // 单例处理
    ChatsMgr._instance = null;
    return ChatsMgr;
}(BaseMgr_1.default));
exports.default = ChatsMgr;

cc._RF.pop();