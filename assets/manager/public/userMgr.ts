import BaseMgr from "../../framework/baseClass/BaseMgr";
import { userMoney, user, userRank, userBattle } from "./interface/iUserInfo";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";
import ShopMgr from "./shopMgr";

export default class UserMgr extends BaseMgr {
    public user: user = <user>{};                   //玩家信息数据
    public userRank: userRank = <userRank>{};       //玩家段位数据
    public userBattle: userBattle = <userBattle>{}; //玩家战斗数据
    public userMoney: userMoney = <userMoney>{};    //玩家金钱数据 
    public userCfgTab: any = null;                  //玩家等级经验配置表
    public onlineBoxTimes: number;                  //今日在线宝箱开箱次数
    public winBoxTimes: number;
    constructor() {
        super();
        this.routes = {
            'gate.entry.req': this.gate_entry_req,
            'plaza.users.initUser': this.plaza_users_initUser,
            'plaza.users.createRole': this.plaza_users_createRole,
            "plaza.role.switchRole": this.switchRole,
            "plaza.guild.createGuild": this.plaza_guild_createGuild,
            'plaza.guild.joinGuild': this.plaza_guild_joinGuild,
            'guild.member.quitGuild': this.guild_member_quitGuild,
            'search.entry.reqUserBrief': this.search_entry_reqUserBrief,
        };
    }

    // 单例处理
    private static _instance: UserMgr = null;
    public static getInstance(): UserMgr {
        if (UserMgr._instance == null) {
            UserMgr._instance = new UserMgr();
        }
        return UserMgr._instance;
    }
    reqUserBrief(id) {
        let msg = {
            target: id
        }
        this.send_msg("search.entry.reqUserBrief", msg)
    }
    private gate_entry_req(msg: Package): void {
        this.user.userUID = msg.getDataByType(dataids.ID_UID);
    }

    private plaza_users_initUser(msg: Package): void {
        this.userCfgTab = this.getConfigSync("level_dengji").json;
        this.initData(msg.getDataByType(dataids.ID_USER_INFO));
    }

    public plaza_users_createRole(msg: Package): void {
        this.user.roleId = msg.getDataByType(dataids.ID_ROLEID_CHANGED);
        this.user.userName = msg.getDataByType(dataids.ID_USER_NICKNAME_CHANGED);
    }
    // public dataAdd(name, dateName, data: number) {
    //     this[name][dateName] += data;
    //     cc.log(dateName, data, this[name][dateName])
    // }

    //初始化大厅部分数据
    public initData(data: any): void {
        console.log("-----玩家信息-----", data)
        this.initUser(data);
        this.initUserRank(data);
        this.initUserBattle(data);
        this.initUserMoney(data);
        this.onlineBoxTimes = data.todayOnlineBoxOpenTimes;
        this.winBoxTimes = data.todayWinBoxOpenTimes;
        if (this.user.guildId) {
            this.requestGuildShopInfo();
        }
    }
    public requestGuildShopInfo() {
        ShopMgr.getInstance().reqShopInfo(enums.GuildShop_Card);
    }
    //初始化玩家信息数据
    public initUser(data: any): void {
        this.user.guildId = data.guildId || 0;
        this.user.userUID = data.id;
        this.user.roleId = data.roleId;
        this.user.userName = data.nickname;
        this.user.userExp = data.exp;
        for (let i = 0; i < this.userCfgTab.length; i++) {
            if (data.grade == this.userCfgTab[i].level) {
                this.user.experience = this.userCfgTab[i].experience;
            }
        }
        this.user.grade = data.grade;
        this.user.winNum = data.winBattleTimes;
        if (data.allBattleTimes != 0) {
            this.user.winProbability = data.winBattleTimes / data.allBattleTimes * 100;
        } else {
            this.user.winProbability = 0;
        }
        this.user.mostRank = data.maxStage;
        this.user.effects = 0;                  //暂无
        this.user.oftenEffect = "";             //暂无
        this.user.vipLv = data.vipLv;
    }

    //初始化玩家段位数据
    public initUserRank(data: any): void {
        this.userRank.stageStar = data.stageStar;
        this.userRank.stage = data.stage;
        this.userRank.stageScore = data.stageScore;
    }

    //初始化玩家战斗数据
    public initUserBattle(data: any): void {
        this.userBattle.hp = data.hp;
        this.userBattle.atk = data.attack;
        this.userBattle.ctr = data.critsRate;
        this.userBattle.crtdamage = data.critsValueRate;
        this.userBattle.effectList = null;
    }
    plaza_guild_joinGuild(msg: Package) {
        if (this.user) {
            this.user.guildId = msg.getDataByType(dataids.ID_USREGUILDID_CHANGED);
        }
    }
    guild_member_quitGuild() {
        if (this.user) {
            this.user.guildId = 0;
        }
    }

    //初始化大厅玩家金钱数据
    public initUserMoney(data: any): void {
        this.userMoney.gold = data.moneyGold;
        this.userMoney.crystal = data.moneyFen;
        this.userMoney.diamond = data.moneyStone;
    }

    //刷新玩家数据
    public refreshData(id: number, data: any): void {
        console.log(this.userMoney.gold)
        switch (id) {
            case dataids.ID_USER_MONEYGOLD:
                this.userMoney.gold = data.userGold;
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_USER_MONEYSTONE:
                this.userMoney.diamond = data;
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_USER_MONEYFEN:
                this.userMoney.crystal = data;
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_USRE_LEVEL:
                this.user.grade = data.userLv;
                this.user.userExp = data.userExp;
                this.gemit("refreshLevelUI");
                break;
            case dataids.ID_GET_MONEY_GOLD:
                if (typeof data == "number") {
                    this.userMoney.gold += data
                }
                else {
                    this.userMoney.gold += data.moneyGold
                }
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_GET_MAILITEMS:
                this.mailRewark(data.dictPrize);
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_GET_BOXPRIZE:
                this.userMoney.gold += data.addMoneyGold
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_GET_WEEKVIPPRIZE:
                console.log(this.userMoney.gold, data)
                this.userMoney.gold += data.dictItemInfo[1];
                this.userMoney.crystal += data.dictItemInfo[2];
                this.gemit("refreshMoneyUI");
                break;
            case dataids.ID_DOSIGNIN_RECINFO:
                this.rewark(data.dictRecItems);
                break;
            case dataids.ID_MULTISIGNIN_RECINFO:
                this.rewark(data.dictRecItems);
                this.gemit("refreshMoneyUI");
            default:
                break;
        }
    }
    getAllTypeItem(data) {
        if (data[enums.Get_Gold]) {
            this.userMoney.gold += data[enums.Get_Gold]
        }
        if (data[enums.Get_Crystal]) {
            this.userMoney.crystal += data[enums.Get_Crystal]
        }
        if (data[enums.Get_Price]) {
            this.userMoney.diamond += data[enums.Get_Price]
        }
        this.gemit("refreshMoneyUI");
    }
    //邮件奖励处理  特殊处理
    public mailRewark(data: any): void {
        for (let key in data) {             //暂时只有金钱
            switch (Number(key)) {
                case enums.Get_Gold:        //金币奖励
                    this.userMoney.gold += data[key][0].amount;
                    break;
                case enums.Get_Crystal:     //粉晶奖励
                    this.userMoney.crystal += data[key][0].amount;
                    break;
                case enums.Get_Price:       //钻石奖励
                    this.userMoney.diamond += data[key][0].amount;
                    break;
                default:
                    break;
            }
        }
    }

    //奖励处理  数据结构类型：
    public rewark(data: any): void {
        for (let key in data) {
            switch (Number(key)) {
                case enums.Get_Gold:        //金币奖励
                    this.userMoney.gold += data[key];
                    break;
                case enums.Get_Crystal:     //粉晶奖励
                    this.userMoney.crystal += data[key];
                    break;
                case enums.Get_Price:       //钻石奖励
                    this.userMoney.diamond += data[key];
                    break;
                default:
                    break;
            }
        }
    }

    //获取服务器发送的角色使用数据
    public switchRole(msg: Package): void {
        let itemData = msg.getDataByType(dataids.ID_EQUIP_ROLE);
        //将玩家信息中的roleId替换
        this.user.roleId = itemData.autoId;
    }
    plaza_guild_createGuild(msg: Package) {
        this.user.guildId = msg.getDataByType(dataids.ID_USREGUILDID_CHANGED);
    }
    search_entry_reqUserBrief() {

    }
    getMyInfo() {
        return this.user;
    }
}
