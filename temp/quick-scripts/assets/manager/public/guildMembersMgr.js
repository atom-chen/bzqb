(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/guildMembersMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '603e5m30ihJz48lI2YAUJUb', 'guildMembersMgr', __filename);
// manager/public/guildMembersMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var GuildMembersMgr = /** @class */ (function (_super) {
    __extends(GuildMembersMgr, _super);
    function GuildMembersMgr() {
        var _this = _super.call(this) || this;
        _this.myMemberInfo = null;
        _this.routes = {
            'guild.member.quitGuild': _this.guild_member_quitGuild,
            'guild.member.kickMember': _this.guild_member_kickMember,
            'guild.member.transPresident': _this.guild_member_transPresident,
            'guild.member.appointVicePresident': _this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident': _this.guild_member_fireVicePresident,
            'guild.member.inviteJoinGuild': _this.guild_member_inviteJoinGuild,
            'guild.member.reqMyMemberInfo': _this.guild_member_reqMyMemberInfo,
            'guild.member.recBoxRewards': _this.guild_member_recBoxRewards
        };
        return _this;
    }
    //创建公会
    GuildMembersMgr.prototype.quitGuild = function () {
        var route = 'guild.member.quitGuild';
        this.send_msg(route);
    };
    //加入公会
    GuildMembersMgr.prototype.kickMember = function (guildMemberId) {
        var route = 'guild.member.kickMember';
        this.send_msg(route, { 'guildMemberId': guildMemberId });
    };
    //获取公会详情
    GuildMembersMgr.prototype.transPresident = function (guildMemberId) {
        var route = 'guild.member.transPresident';
        this.send_msg(route, { 'guildMemberId': guildMemberId });
    };
    //appointVicePresident
    GuildMembersMgr.prototype.appointVicePresident = function (guildMemberId) {
        var route = 'guild.member.appointVicePresident';
        this.send_msg(route, { 'guildMemberId': guildMemberId });
    };
    //appointVicePresident
    GuildMembersMgr.prototype.reqMyMemberInfo = function () {
        var route = 'guild.member.reqMyMemberInfo';
        this.send_msg(route);
    };
    //appointVicePresident
    GuildMembersMgr.prototype.fireVicePresident = function (guildMemberId) {
        var route = 'guild.member.fireVicePresident';
        this.send_msg(route, { 'guildMemberId': guildMemberId });
    };
    GuildMembersMgr.prototype.inviteJoinGuild = function (friendId) {
        var route = 'guild.member.inviteJoinGuild';
        this.send_msg(route, { 'friendId': friendId });
    };
    GuildMembersMgr.prototype.recBoxRewards = function () {
        var route = 'guild.member.recBoxRewards';
        this.send_msg(route);
    };
    GuildMembersMgr.prototype.guild_member_quitGuild = function (msg) {
        this.myMemberInfo = null;
        console.log("guild_member_quitGuild", msg);
    };
    GuildMembersMgr.prototype.guild_member_kickMember = function (msg) {
        console.log("guild_member_kickMember", msg);
    };
    GuildMembersMgr.prototype.guild_member_transPresident = function (msg) {
        this.guildPlayersInfoList = msg.getDataByType(dataids_1.dataids.ID_GUILDMEMBERIDS);
        this.guildInfo = msg.getDataByType(dataids_1.dataids.ID_GUILDINFO);
        console.log('guild_member_transPresident', msg);
    };
    GuildMembersMgr.prototype.guild_member_appointVicePresident = function (msg) {
        console.log("guild_member_appointVicePresident", msg);
    };
    GuildMembersMgr.prototype.guild_member_fireVicePresident = function (msg) {
        console.log("guild_member_fireVicePresident", msg);
    };
    GuildMembersMgr.prototype.guild_member_inviteJoinGuild = function (msg) {
        console.log("guild_member_inviteJoinGuild", msg);
    };
    GuildMembersMgr.prototype.guild_member_reqMyMemberInfo = function (msg) {
        console.log("guild_member_reqMyMemberInfo", msg);
        this.myMemberInfo = msg.getDataByType(dataids_1.dataids.ID_MYGUILDMEMBERINFO);
    };
    GuildMembersMgr.prototype.guild_member_recBoxRewards = function (msg) {
        console.log("guild_member_recBoxRewards", msg);
    };
    GuildMembersMgr.getInstance = function () {
        if (GuildMembersMgr._instance == null) {
            GuildMembersMgr._instance = new GuildMembersMgr();
        }
        return GuildMembersMgr._instance;
    };
    // 单例处理
    GuildMembersMgr._instance = null;
    return GuildMembersMgr;
}(BaseMgr_1.default));
exports.default = GuildMembersMgr;

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
        //# sourceMappingURL=guildMembersMgr.js.map
        