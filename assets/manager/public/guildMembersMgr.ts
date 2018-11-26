import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import GameNet from "../../framework/modules/GameNet";
export default class GuildMembersMgr extends BaseMgr {
    myMemberInfo = null;
    constructor() {
        super();
        this.routes = {
            'guild.member.quitGuild': this.guild_member_quitGuild,
            'guild.member.kickMember':this.guild_member_kickMember,
            'guild.member.transPresident':this.guild_member_transPresident,
            'guild.member.appointVicePresident':this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident':this.guild_member_fireVicePresident,
            'guild.member.inviteJoinGuild':this.guild_member_inviteJoinGuild,
            'guild.member.reqMyMemberInfo':this.guild_member_reqMyMemberInfo,
            'guild.member.recBoxRewards': this.guild_member_recBoxRewards
        };
    }
    //创建公会
    quitGuild()
    {
        let route = 'guild.member.quitGuild';
        this.send_msg(route);
    }
    //加入公会
    kickMember(guildMemberId)
    {
        let route = 'guild.member.kickMember';
        this.send_msg(route,{'guildMemberId':guildMemberId});
    }
    //获取公会详情
    transPresident(guildMemberId)
    {
        let route = 'guild.member.transPresident';
        this.send_msg(route,{'guildMemberId':guildMemberId});
    }
    //appointVicePresident
    appointVicePresident(guildMemberId)
    {
        let route = 'guild.member.appointVicePresident';
        this.send_msg(route,{'guildMemberId':guildMemberId});
    }
    //appointVicePresident
    reqMyMemberInfo()
    {
        let route = 'guild.member.reqMyMemberInfo';
        this.send_msg(route);
    }
    //appointVicePresident
    fireVicePresident(guildMemberId)
    {
        let route = 'guild.member.fireVicePresident';
        this.send_msg(route,{'guildMemberId':guildMemberId});
    }
    inviteJoinGuild(friendId)
    {
        let route = 'guild.member.inviteJoinGuild';
        this.send_msg(route,{'friendId':friendId});
    }
    recBoxRewards()
    {
        let route = 'guild.member.recBoxRewards';
        this.send_msg(route);
    }
    guild_member_quitGuild(msg: Package )
    {
        this.myMemberInfo = null;
        console.log("guild_member_quitGuild",msg);
    }
    guild_member_kickMember(msg: Package)
    {
        console.log("guild_member_kickMember",msg);
    }
    guild_member_transPresident(msg: Package)
    {
        this.guildPlayersInfoList = msg.getDataByType(dataids.ID_GUILDMEMBERIDS);
        this.guildInfo = msg.getDataByType(dataids.ID_GUILDINFO);
        console.log('guild_member_transPresident',msg);
    }
    guild_member_appointVicePresident(msg: Package)
    {
        console.log("guild_member_appointVicePresident",msg);
    }
    guild_member_fireVicePresident(msg: Package)
    {
        console.log("guild_member_fireVicePresident",msg);
    }
    guild_member_inviteJoinGuild(msg: Package)
    {
        console.log("guild_member_inviteJoinGuild",msg);
    }
    guild_member_reqMyMemberInfo(msg: Package)
    {
        console.log("guild_member_reqMyMemberInfo",msg);
        this.myMemberInfo = msg.getDataByType(dataids.ID_MYGUILDMEMBERINFO);
    }
    guild_member_recBoxRewards(msg: Package)
    {
        console.log("guild_member_recBoxRewards",msg);
    }
    // 单例处理
    private static _instance: GuildMembersMgr = null;
    public static getInstance(): GuildMembersMgr {
        if (GuildMembersMgr._instance == null) {
            GuildMembersMgr._instance = new GuildMembersMgr();
        }
        return GuildMembersMgr._instance;
    }
}

