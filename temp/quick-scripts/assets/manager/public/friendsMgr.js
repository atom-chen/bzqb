(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/friendsMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4cba4M7oUtDQbBKhzcQm70z', 'friendsMgr', __filename);
// manager/public/friendsMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var FriendsMgr = /** @class */ (function (_super) {
    __extends(FriendsMgr, _super);
    function FriendsMgr() {
        var _this = _super.call(this) || this;
        _this.friendsIds = null;
        _this.friendsInfoList = null;
        _this.friendsId = null;
        _this.friendsIdKicked = null;
        _this.myId = null;
        _this.searchResult = [];
        _this.chatContent = {};
        _this.routes = {
            'plaza.data.reqFriendIds': _this.plaza_data_reqFriendIds,
            'search.entry.reqFriendInfos': _this.search_entry_reqFriendInfos,
            'plaza.friends.addFriend': _this.plaza_friends_addFriend,
            "plaza.friends.kickFriend": _this.plaza_friends_kickFriend,
            "search.entry.searchUsers": _this.search_entry_searchUsers,
            "search.entry.randomUsers": _this.search_entry_randomUsers,
            "onChat": _this.onChat,
            "onNewFriend": _this.onNewFriend,
            "onKickedByFriend": _this.onKickedByFriend,
        };
        return _this;
    }
    FriendsMgr.prototype.clearDatas = function () {
        this.friendsIds = null;
        this.friendsInfoList = null;
        this.friendsId = null;
        this.friendsIdKicked = null;
    };
    //返回推荐好友
    FriendsMgr.prototype.search_entry_randomUsers = function (msg) {
        var userInfo = msg.getDataByType(dataids_1.dataids.ID_USERLIST);
    };
    FriendsMgr.prototype.isAlwaysSearch = function (data) {
        var count = this.searchResult.length;
        for (var i = 0; i < count; i++) {
            var userInfo = this.searchResult[i];
            if (userInfo.nickname == data || userInfo.id == parseInt(data)) {
                return userInfo;
            }
        }
        return null;
    };
    //搜索用户返回
    FriendsMgr.prototype.search_entry_searchUsers = function (msg) {
        var userInfo = msg.getDataByType(dataids_1.dataids.ID_USERLIST);
        for (var i = 0; i < userInfo.length; i++) {
            this.searchResult.push(userInfo[i]);
        }
        this.searchResult = userInfo;
        if (userInfo.length > 0) {
            this.gemit("friends_search_Result", userInfo[0]);
        }
    };
    //判断是否好友
    FriendsMgr.prototype.isFriend = function (id) {
        for (var friendsIdsIdx = 0; friendsIdsIdx < this.friendsIds.friends.length; friendsIdsIdx++) {
            if (this.friendsIds.friends[friendsIdsIdx] == id) {
                return true;
            }
        }
        return false;
    };
    FriendsMgr.getInstance = function () {
        if (FriendsMgr._instance == null) {
            FriendsMgr._instance = new FriendsMgr();
        }
        return FriendsMgr._instance;
    };
    FriendsMgr.prototype.plaza_data_reqFriendIds = function (msg) {
        this.friendsIds = msg.getDataByType(dataids_1.dataids.ID_FRIEND_IDS);
        if (this.friendsIds) {
            this.myId = this.friendsIds.id;
            this.reqFriendInfos(this.friendsIds.friends);
        }
    };
    FriendsMgr.prototype.search_entry_reqFriendInfos = function (msg) {
        this.friendsInfoList = msg.getDataByType(dataids_1.dataids.ID_FRIENDINFOLIST);
    };
    FriendsMgr.prototype.onNewFriend = function (msg) {
        var addFriendId = msg.getData().friendId;
        this.addnewIdToIDs(addFriendId);
        this.reqFriendInfos(this.friendsIds.friends);
    };
    FriendsMgr.prototype.plaza_friends_addFriend = function (msg) {
        var addFriendId = msg.getDataByType(dataids_1.dataids.ID_ADDFRIEND);
        this.addnewIdToIDs(addFriendId);
        this.reqFriendInfos(this.friendsIds.friends);
    };
    FriendsMgr.prototype.addnewIdToIDs = function (id) {
        if (this.friendsIds && this.friendsIds.friends) {
            this.friendsIds.friends.push(id);
        }
        else {
            this.friendsIds = {};
            this.friendsIds.friends = [];
            this.friendsIds.friends.push(id);
        }
    };
    FriendsMgr.prototype.onKickedByFriend = function (msg) {
        var friendsIdKicked = msg.getData().friendId;
        this.delIdFromIds(friendsIdKicked);
        this.reqFriendInfos(this.friendsIds.friends);
    };
    FriendsMgr.prototype.plaza_friends_kickFriend = function (msg) {
        var friendsIdKicked = msg.getDataByType(dataids_1.dataids.ID_KICKFRIEND);
        this.delIdFromIds(friendsIdKicked);
        this.reqFriendInfos(this.friendsIds.friends);
    };
    FriendsMgr.prototype.delIdFromIds = function (id) {
        var count = this.friendsIds.friends.length;
        for (var i = 0; i < count; i++) {
            if (id == this.friendsIds.friends[i]) {
                this.friendsIds.friends.splice(i, 1);
                break;
            }
        }
    };
    FriendsMgr.prototype.onChat = function (msg) {
        var data = msg.getDataByType(dataids_1.dataids.ID_CHAT_WITH_FRIEND);
        if (!this.chatContent.list) {
            this.chatContent.list = [];
        }
        var l_chat = {};
        l_chat.fromID = data.from;
        l_chat.content = data.content;
        var uid;
        if (data.from == this.myId) {
            uid = data.to;
        }
        else if (data.to == this.myId) {
            uid = data.from;
        }
        if (!this.chatContent.list[uid]) {
            this.chatContent.list[uid] = {};
            this.chatContent.list[uid].chatContent = [];
        }
        this.chatContent.list[uid].chatContent.push(l_chat);
        this.gemit("chat.recNewChat", uid, l_chat);
    };
    FriendsMgr.prototype.getFriendInfos = function (id) {
        var l_count = this.friendsInfoList.length;
        var info;
        for (var i = 0; i < l_count; i++) {
            if (this.friendsInfoList[i].id == id) {
                info = this.friendsInfoList[i];
                break;
            }
        }
        return info;
    };
    FriendsMgr.prototype.reqFriendIds = function () {
        var route = 'plaza.data.reqFriendIds';
        this.send_msg(route);
    };
    FriendsMgr.prototype.reqFriendInfos = function (data) {
        var route = 'search.entry.reqFriendInfos';
        this.send_msg(route, { 'ids': data });
    };
    FriendsMgr.prototype.addFriend = function (data) {
        var route = 'plaza.friends.addFriend';
        this.send_msg(route, { 'friendId': data });
    };
    FriendsMgr.prototype.kickFriend = function (data) {
        var route = 'plaza.friends.kickFriend';
        this.send_msg(route, { 'friendId': data });
    };
    FriendsMgr.prototype.searchFriend = function (data) {
        var route = 'search.entry.searchUsers';
        this.send_msg(route, { 'key': data });
    };
    FriendsMgr.prototype.searchRandomUsers = function () {
        var route = 'search.entry.randomUsers';
        this.send_msg(route);
    };
    FriendsMgr.prototype.sendChat = function (from, to, content) {
        var route = 'chat.entry.chatWithFriend';
        this.send_msg(route, { 'from': from, 'to': to, 'content': content });
    };
    // 单例处理
    FriendsMgr._instance = null;
    return FriendsMgr;
}(BaseMgr_1.default));
exports.default = FriendsMgr;

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
        //# sourceMappingURL=friendsMgr.js.map
        