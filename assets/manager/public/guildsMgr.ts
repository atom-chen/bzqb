import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import GameNet from "../../framework/modules/GameNet";
export default class GuildsMgr extends BaseMgr {
    randomGuildList = null;
    guildPlayersInfoList = null;
    guildPlayersIds = null;
    guildInfo = null;
    guildId = null;
    myGuildInfo = null;
    guildInvitedInfo =null;
    membersPage = 0;
    constructor() {
        super();
        this.routes = {
            'plaza.guild.createGuild': this.plaza_guild_createGuild,
            'plaza.guild.joinGuild':this.plaza_guild_joinGuild,
            'plaza.guild.reqGuildDetail':this.plaza_guild_reqGuildDetail,
            'search.entry.reqGuildMembers':this.search_entry_reqGuildMembers,
            'search.entry.randomGuildList':this.search_entry_randomGuildList,
            'search.entry.searchGuild':this.search_entry_searchGuild,
            'guild.guild.reqMyGuildDetail':this.guild_guild_reqMyGuildDetail,
            'guild.guild.updateAnnouncement':this.guild_guild_updateAnnouncement,
            'guild.member.quitGuild': this.guild_member_quitGuild,
            'guild.guild.updateSetting': this.guild_guild_updateSetting,
            'search.entry.reqGuildInviteBrief': this.search_entry_reqGuildInviteBrief,
            'plaza.guild.agreeInvitation': this.plaza_guild_agreeInvitation,
            'plaza.guild.refuseInvitation': this.plaza_guild_refuseInvitation,
            'plaza.guild.applyJoinGuild': this.plaza_guild_applyJoinGuild,
            'guild.guild.agreeApply': this.guild_guild_agreeApply,
            'guild.guild.refuseApply': this.guild_guild_refuseApply,
        };
    }
    clearDatas()
    {
        this.randomGuildList = null;
        this.guildPlayersInfoList = null;
        this.guildPlayersIds = null;
        this.guildInfo = null;
        this.guildId = null; 
        this.myGuildInfo = null;
        this.guildInvitedInfo = null;
        this.membersPage = 0;
    }
    getGuildInvitedInfo()
    {
        return this.guildInvitedInfo;
    }
    getRandomGuildList()
    {
        return this.randomGuildList;
    }
    getMyGuildInfo()
    {
        return this.myGuildInfo;
    }
    getGuildPlayersInfoList()
    {
        return this.guildPlayersInfoList;
    }
    getGuildPlayersIds()
    {
        return this.guildPlayersIds;
    }
    getGuildInfo()
    {
        return this.guildInfo;
    }
    getGuildId()
    {
        return this.guildId;
    }
    guild_member_quitGuild()
    {
        this.clearDatas();
    }
    agreeApply(index)
    {
        let route = 'guild.guild.agreeApply';
        this.send_msg(route,{'index':index});
    }
    refuseApply(index)
    {
        let route = 'guild.guild.refuseApply';
        this.send_msg(route,{'index':index});
    }
    agreeInvitation(index)
    {
        let route = 'plaza.guild.agreeInvitation';
        this.send_msg(route,{'index':index});
    }
    refuseInvitation(index)
    {
        let route = 'plaza.guild.refuseInvitation';
        this.send_msg(route,{'index':index});
    }
    //创建公会
    reqCreateGuild(name,badgeId,enterType,neededStage)
    {
        let route = 'plaza.guild.createGuild';
        this.send_msg(route,{'name':name,'badgeId':badgeId,'enterType':enterType,'neededStage':neededStage});
    }
    //加入公会
    reqJoinGuild(guildId)
    {
        let route = 'plaza.guild.joinGuild';
        this.send_msg(route,{'guildId':guildId});
    }
    //获取公会详情
    reqGuildDetail(guildId)
    {
        let route = 'plaza.guild.reqGuildDetail';
        this.send_msg(route,{'guildId':guildId});
    }
    //获取公会成员信息列表
    reqGuildMembers(guildId,page)
    {
        let route = 'search.entry.reqGuildMembers';
        this.send_msg(route,{'guildId':guildId,'page':page});
    }
    reqRandomGuildList()
    {
        let route = 'search.entry.randomGuildList';
        this.send_msg(route);
    }
    reqSearchGuild(guildName)
    {
        let route = 'search.entry.searchGuild';
        this.send_msg(route,{'key':guildName});
    }
    reqMyGuildDetail()
    {
        let route = 'guild.guild.reqMyGuildDetail';
        this.send_msg(route);
    }
    updateAnnouncement()
    {
        let route = 'guild.guild.updateAnnouncement';
        this.send_msg(route);
    }
    updateSetting(name,badgeId,enterType,neededStage)
    {
        let route = 'guild.guild.updateSetting';
        this.send_msg(route,{'name':name,'badgeId':badgeId,'enterType':enterType,'neededStage':neededStage});
    }
    applyJoinGuild(guildId)
    {
        let route = 'plaza.guild.applyJoinGuild';
        this.send_msg(route,{'guildId':guildId});
    }
    reqGuildInviteBrief()
    {
        let route ='search.entry.reqGuildInviteBrief';
        this.send_msg(route);
    }
    plaza_guild_createGuild(msg: Package )
    {
        console.log("plaza_guild_createGuild",msg);
        this.guildId = msg.getDataByType(dataids.ID_USREGUILDID_CHANGED);
    }
    plaza_guild_joinGuild(msg: Package)
    {
        console.log("plaza_guild_joinGuild",msg);
        this.guildId = msg.getDataByType(dataids.ID_USREGUILDID_CHANGED);
    }
    plaza_guild_reqGuildDetail(msg: Package)
    {
        this.guildInfo = msg.getDataByType(dataids.ID_GUILDINFO);
        console.log('plaza_guild_reqGuildDetail',msg);
    }
    search_entry_reqGuildMembers(msg: Package)
    {
        let guildPlayersInfoList = msg.getDataByType(dataids.ID_GUILDMEMBERS);
        if(guildPlayersInfoList&&guildPlayersInfoList.members.length>0&&guildPlayersInfoList.page>this.membersPage) {
            this.guildPlayersInfoList.page = guildPlayersInfoList.page;
            this.guildPlayersInfoList.members = this.guildPlayersInfoList.members.concat(guildPlayersInfoList.members);
            this.membersPage = guildPlayersInfoList.page;
        }
        else if(guildPlayersInfoList&&guildPlayersInfoList.members.length>0)
        {
            this.guildPlayersInfoList = guildPlayersInfoList;
        }
        console.log('search_entry_reqGuildMembers',msg);
    }
    search_entry_randomGuildList(msg: Package)
    {
        this.randomGuildList = msg.getDataByType(dataids.ID_GUILDLIST);
        console.log('search_entry_randomGuildList',msg,this.randomGuildList);
    }
    search_entry_searchGuild(msg: Package)
    {
        console.log('search_entry_searchGuild',msg);
    }
    guild_guild_reqMyGuildDetail(msg: Package)
    {
        this.guildInfo = msg.getDataByType(dataids.ID_GUILDINFO);
        this.myGuildInfo = msg.getDataByType(dataids.ID_MYGUILDMEMBERINFO);
        console.log('guidl_guild_reqMyGuildDetail',msg);
    }
    guild_guild_updateAnnouncement(msg: Package)
    {
        this.guildInfo = msg.getDataByType(dataids.ID_GUILDINFO);
        this.guildPlayersIds = msg.getDataByType(dataids.ID_GUILDMEMBERIDS);
        console.log('guild_guild_updateAnnouncement',msg);
    }
    guild_guild_updateSetting(msg: Package)
    {
        this.guildInfo = msg.getDataByType(dataids.ID_GUILDINFO);
    }
    search_entry_reqGuildInviteBrief(msg: Package)
    {
        console.log('search_entry_reqGuildInviteBrief',msg);
        this.guildInvitedInfo = msg.getDataByType(dataids.ID_GUILD_INVITE);
    }
    plaza_guild_refuseInvitation(msg: Package)
    {
        console.log('plaza_guild_refuseInvitation',msg);
    }
    plaza_guild_agreeInvitation(msg: Package)
    {
        console.log('plaza_guild_agreeInvitation',msg);
    }
    plaza_guild_applyJoinGuild(msg: Package)
    {
        console.log('plaza_guild_agreeInvitation',msg);
    }
    guild_guild_agreeApply(msg: Package)
    {
        console.log('guild_guild_agreeApply',msg);
    }
    guild_guild_refuseApply(msg: Package)
    {
        console.log('guild_guild_refuseApply',msg);
    }
    // 单例处理
    private static _instance: GuildsMgr = null;
    public static getInstance(): GuildsMgr {
        if (GuildsMgr._instance == null) {
            GuildsMgr._instance = new GuildsMgr();
        }
        return GuildsMgr._instance;
    }
}

