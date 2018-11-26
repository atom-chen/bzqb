"use strict";
cc._RF.push(module, '0c358pHTdpE+5Wy6Z95LXT5', 'guildsMgr');
// manager/public/guildsMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var GuildsMgr = /** @class */ (function (_super) {
    __extends(GuildsMgr, _super);
    function GuildsMgr() {
        var _this = _super.call(this) || this;
        _this.randomGuildList = null;
        _this.guildPlayersInfoList = null;
        _this.guildPlayersIds = null;
        _this.guildInfo = null;
        _this.guildId = null;
        _this.myGuildInfo = null;
        _this.guildInvitedInfo = null;
        _this.membersPage = 0;
        _this.routes = {
            'plaza.guild.createGuild': _this.plaza_guild_createGuild,
            'plaza.guild.joinGuild': _this.plaza_guild_joinGuild,
            'plaza.guild.reqGuildDetail': _this.plaza_guild_reqGuildDetail,
            'search.entry.reqGuildMembers': _this.search_entry_reqGuildMembers,
            'search.entry.randomGuildList': _this.search_entry_randomGuildList,
            'search.entry.searchGuild': _this.search_entry_searchGuild,
            'guild.guild.reqMyGuildDetail': _this.guild_guild_reqMyGuildDetail,
            'guild.guild.updateAnnouncement': _this.guild_guild_updateAnnouncement,
            'guild.member.quitGuild': _this.guild_member_quitGuild,
            'guild.guild.updateSetting': _this.guild_guild_updateSetting,
            'search.entry.reqGuildInviteBrief': _this.search_entry_reqGuildInviteBrief,
            'plaza.guild.agreeInvitation': _this.plaza_guild_agreeInvitation,
            'plaza.guild.refuseInvitation': _this.plaza_guild_refuseInvitation,
            'plaza.guild.applyJoinGuild': _this.plaza_guild_applyJoinGuild,
            'guild.guild.agreeApply': _this.guild_guild_agreeApply,
            'guild.guild.refuseApply': _this.guild_guild_refuseApply,
        };
        return _this;
    }
    GuildsMgr.prototype.clearDatas = function () {
        this.randomGuildList = null;
        this.guildPlayersInfoList = null;
        this.guildPlayersIds = null;
        this.guildInfo = null;
        this.guildId = null;
        this.myGuildInfo = null;
        this.guildInvitedInfo = null;
        this.membersPage = 0;
    };
    GuildsMgr.prototype.getGuildInvitedInfo = function () {
        return this.guildInvitedInfo;
    };
    GuildsMgr.prototype.getRandomGuildList = function () {
        return this.randomGuildList;
    };
    GuildsMgr.prototype.getMyGuildInfo = function () {
        return this.myGuildInfo;
    };
    GuildsMgr.prototype.getGuildPlayersInfoList = function () {
        return this.guildPlayersInfoList;
    };
    GuildsMgr.prototype.getGuildPlayersIds = function () {
        return this.guildPlayersIds;
    };
    GuildsMgr.prototype.getGuildInfo = function () {
        return this.guildInfo;
    };
    GuildsMgr.prototype.getGuildId = function () {
        return this.guildId;
    };
    GuildsMgr.prototype.guild_member_quitGuild = function () {
        this.clearDatas();
    };
    GuildsMgr.prototype.agreeApply = function (index) {
        var route = 'guild.guild.agreeApply';
        this.send_msg(route, { 'index': index });
    };
    GuildsMgr.prototype.refuseApply = function (index) {
        var route = 'guild.guild.refuseApply';
        this.send_msg(route, { 'index': index });
    };
    GuildsMgr.prototype.agreeInvitation = function (index) {
        var route = 'plaza.guild.agreeInvitation';
        this.send_msg(route, { 'index': index });
    };
    GuildsMgr.prototype.refuseInvitation = function (index) {
        var route = 'plaza.guild.refuseInvitation';
        this.send_msg(route, { 'index': index });
    };
    //创建公会
    GuildsMgr.prototype.reqCreateGuild = function (name, badgeId, enterType, neededStage) {
        var route = 'plaza.guild.createGuild';
        this.send_msg(route, { 'name': name, 'badgeId': badgeId, 'enterType': enterType, 'neededStage': neededStage });
    };
    //加入公会
    GuildsMgr.prototype.reqJoinGuild = function (guildId) {
        var route = 'plaza.guild.joinGuild';
        this.send_msg(route, { 'guildId': guildId });
    };
    //获取公会详情
    GuildsMgr.prototype.reqGuildDetail = function (guildId) {
        var route = 'plaza.guild.reqGuildDetail';
        this.send_msg(route, { 'guildId': guildId });
    };
    //获取公会成员信息列表
    GuildsMgr.prototype.reqGuildMembers = function (guildId, page) {
        var route = 'search.entry.reqGuildMembers';
        this.send_msg(route, { 'guildId': guildId, 'page': page });
    };
    GuildsMgr.prototype.reqRandomGuildList = function () {
        var route = 'search.entry.randomGuildList';
        this.send_msg(route);
    };
    GuildsMgr.prototype.reqSearchGuild = function (guildName) {
        var route = 'search.entry.searchGuild';
        this.send_msg(route, { 'key': guildName });
    };
    GuildsMgr.prototype.reqMyGuildDetail = function () {
        var route = 'guild.guild.reqMyGuildDetail';
        this.send_msg(route);
    };
    GuildsMgr.prototype.updateAnnouncement = function () {
        var route = 'guild.guild.updateAnnouncement';
        this.send_msg(route);
    };
    GuildsMgr.prototype.updateSetting = function (name, badgeId, enterType, neededStage) {
        var route = 'guild.guild.updateSetting';
        this.send_msg(route, { 'name': name, 'badgeId': badgeId, 'enterType': enterType, 'neededStage': neededStage });
    };
    GuildsMgr.prototype.applyJoinGuild = function (guildId) {
        var route = 'plaza.guild.applyJoinGuild';
        this.send_msg(route, { 'guildId': guildId });
    };
    GuildsMgr.prototype.reqGuildInviteBrief = function () {
        var route = 'search.entry.reqGuildInviteBrief';
        this.send_msg(route);
    };
    GuildsMgr.prototype.plaza_guild_createGuild = function (msg) {
        console.log("plaza_guild_createGuild", msg);
        this.guildId = msg.getDataByType(dataids_1.dataids.ID_USREGUILDID_CHANGED);
    };
    GuildsMgr.prototype.plaza_guild_joinGuild = function (msg) {
        console.log("plaza_guild_joinGuild", msg);
        this.guildId = msg.getDataByType(dataids_1.dataids.ID_USREGUILDID_CHANGED);
    };
    GuildsMgr.prototype.plaza_guild_reqGuildDetail = function (msg) {
        this.guildInfo = msg.getDataByType(dataids_1.dataids.ID_GUILDINFO);
        console.log('plaza_guild_reqGuildDetail', msg);
    };
    GuildsMgr.prototype.search_entry_reqGuildMembers = function (msg) {
        var guildPlayersInfoList = msg.getDataByType(dataids_1.dataids.ID_GUILDMEMBERS);
        if (guildPlayersInfoList && guildPlayersInfoList.members.length > 0 && guildPlayersInfoList.page > this.membersPage) {
            this.guildPlayersInfoList.page = guildPlayersInfoList.page;
            this.guildPlayersInfoList.members = this.guildPlayersInfoList.members.concat(guildPlayersInfoList.members);
            this.membersPage = guildPlayersInfoList.page;
        }
        else if (guildPlayersInfoList && guildPlayersInfoList.members.length > 0) {
            this.guildPlayersInfoList = guildPlayersInfoList;
        }
        console.log('search_entry_reqGuildMembers', msg);
    };
    GuildsMgr.prototype.search_entry_randomGuildList = function (msg) {
        this.randomGuildList = msg.getDataByType(dataids_1.dataids.ID_GUILDLIST);
        console.log('search_entry_randomGuildList', msg, this.randomGuildList);
    };
    GuildsMgr.prototype.search_entry_searchGuild = function (msg) {
        console.log('search_entry_searchGuild', msg);
    };
    GuildsMgr.prototype.guild_guild_reqMyGuildDetail = function (msg) {
        this.guildInfo = msg.getDataByType(dataids_1.dataids.ID_GUILDINFO);
        this.myGuildInfo = msg.getDataByType(dataids_1.dataids.ID_MYGUILDMEMBERINFO);
        console.log('guidl_guild_reqMyGuildDetail', msg);
    };
    GuildsMgr.prototype.guild_guild_updateAnnouncement = function (msg) {
        this.guildInfo = msg.getDataByType(dataids_1.dataids.ID_GUILDINFO);
        this.guildPlayersIds = msg.getDataByType(dataids_1.dataids.ID_GUILDMEMBERIDS);
        console.log('guild_guild_updateAnnouncement', msg);
    };
    GuildsMgr.prototype.guild_guild_updateSetting = function (msg) {
        this.guildInfo = msg.getDataByType(dataids_1.dataids.ID_GUILDINFO);
    };
    GuildsMgr.prototype.search_entry_reqGuildInviteBrief = function (msg) {
        console.log('search_entry_reqGuildInviteBrief', msg);
        this.guildInvitedInfo = msg.getDataByType(dataids_1.dataids.ID_GUILD_INVITE);
    };
    GuildsMgr.prototype.plaza_guild_refuseInvitation = function (msg) {
        console.log('plaza_guild_refuseInvitation', msg);
    };
    GuildsMgr.prototype.plaza_guild_agreeInvitation = function (msg) {
        console.log('plaza_guild_agreeInvitation', msg);
    };
    GuildsMgr.prototype.plaza_guild_applyJoinGuild = function (msg) {
        console.log('plaza_guild_agreeInvitation', msg);
    };
    GuildsMgr.prototype.guild_guild_agreeApply = function (msg) {
        console.log('guild_guild_agreeApply', msg);
    };
    GuildsMgr.prototype.guild_guild_refuseApply = function (msg) {
        console.log('guild_guild_refuseApply', msg);
    };
    GuildsMgr.getInstance = function () {
        if (GuildsMgr._instance == null) {
            GuildsMgr._instance = new GuildsMgr();
        }
        return GuildsMgr._instance;
    };
    // 单例处理
    GuildsMgr._instance = null;
    return GuildsMgr;
}(BaseMgr_1.default));
exports.default = GuildsMgr;

cc._RF.pop();