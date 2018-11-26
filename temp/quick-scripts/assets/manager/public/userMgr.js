(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/manager/public/userMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '282f7bbeAFCaIYLW7vzSEw7', 'userMgr', __filename);
// manager/public/userMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var enums_1 = require("../enums");
var shopMgr_1 = require("./shopMgr");
var UserMgr = /** @class */ (function (_super) {
    __extends(UserMgr, _super);
    function UserMgr() {
        var _this = _super.call(this) || this;
        _this.user = {}; //玩家信息数据
        _this.userRank = {}; //玩家段位数据
        _this.userBattle = {}; //玩家战斗数据
        _this.userMoney = {}; //玩家金钱数据 
        _this.userCfgTab = null; //玩家等级经验配置表
        _this.routes = {
            'gate.entry.req': _this.gate_entry_req,
            'plaza.users.initUser': _this.plaza_users_initUser,
            'plaza.users.createRole': _this.plaza_users_createRole,
            "plaza.role.switchRole": _this.switchRole,
            "plaza.guild.createGuild": _this.plaza_guild_createGuild,
            'plaza.guild.joinGuild': _this.plaza_guild_joinGuild,
            'guild.member.quitGuild': _this.guild_member_quitGuild,
            'search.entry.reqUserBrief': _this.search_entry_reqUserBrief,
        };
        return _this;
    }
    UserMgr.getInstance = function () {
        if (UserMgr._instance == null) {
            UserMgr._instance = new UserMgr();
        }
        return UserMgr._instance;
    };
    UserMgr.prototype.reqUserBrief = function (id) {
        var msg = {
            target: id
        };
        this.send_msg("search.entry.reqUserBrief", msg);
    };
    UserMgr.prototype.gate_entry_req = function (msg) {
        this.user.userUID = msg.getDataByType(dataids_1.dataids.ID_UID);
    };
    UserMgr.prototype.plaza_users_initUser = function (msg) {
        this.userCfgTab = this.getConfigSync("level_dengji").json;
        this.initData(msg.getDataByType(dataids_1.dataids.ID_USER_INFO));
    };
    UserMgr.prototype.plaza_users_createRole = function (msg) {
        this.user.roleId = msg.getDataByType(dataids_1.dataids.ID_ROLEID_CHANGED);
        this.user.userName = msg.getDataByType(dataids_1.dataids.ID_USER_NICKNAME_CHANGED);
    };
    // public dataAdd(name, dateName, data: number) {
    //     this[name][dateName] += data;
    //     cc.log(dateName, data, this[name][dateName])
    // }
    //初始化大厅部分数据
    UserMgr.prototype.initData = function (data) {
        console.log("-----玩家信息-----", data);
        this.initUser(data);
        this.initUserRank(data);
        this.initUserBattle(data);
        this.initUserMoney(data);
        this.onlineBoxTimes = data.todayOnlineBoxOpenTimes;
        this.winBoxTimes = data.todayWinBoxOpenTimes;
        if (this.user.guildId) {
            this.requestGuildShopInfo();
        }
    };
    UserMgr.prototype.requestGuildShopInfo = function () {
        shopMgr_1.default.getInstance().reqShopInfo(enums_1.enums.GuildShop_Card);
    };
    //初始化玩家信息数据
    UserMgr.prototype.initUser = function (data) {
        this.user.guildId = data.guildId || 0;
        this.user.userUID = data.id;
        this.user.roleId = data.roleId;
        this.user.userName = data.nickname;
        this.user.userExp = data.exp;
        for (var i = 0; i < this.userCfgTab.length; i++) {
            if (data.grade == this.userCfgTab[i].level) {
                this.user.experience = this.userCfgTab[i].experience;
            }
        }
        this.user.grade = data.grade;
        this.user.winNum = data.winBattleTimes;
        if (data.allBattleTimes != 0) {
            this.user.winProbability = data.winBattleTimes / data.allBattleTimes * 100;
        }
        else {
            this.user.winProbability = 0;
        }
        this.user.mostRank = data.maxStage;
        this.user.effects = 0; //暂无
        this.user.oftenEffect = ""; //暂无
        this.user.vipLv = data.vipLv;
    };
    //初始化玩家段位数据
    UserMgr.prototype.initUserRank = function (data) {
        this.userRank.stageStar = data.stageStar;
        this.userRank.stage = data.stage;
        this.userRank.stageScore = data.stageScore;
    };
    //初始化玩家战斗数据
    UserMgr.prototype.initUserBattle = function (data) {
        this.userBattle.hp = data.hp;
        this.userBattle.atk = data.attack;
        this.userBattle.ctr = data.critsRate;
        this.userBattle.crtdamage = data.critsValueRate;
        this.userBattle.effectList = null;
    };
    UserMgr.prototype.plaza_guild_joinGuild = function (msg) {
        if (this.user) {
            this.user.guildId = msg.getDataByType(dataids_1.dataids.ID_USREGUILDID_CHANGED);
        }
    };
    UserMgr.prototype.guild_member_quitGuild = function () {
        if (this.user) {
            this.user.guildId = 0;
        }
    };
    //初始化大厅玩家金钱数据
    UserMgr.prototype.initUserMoney = function (data) {
        this.userMoney.gold = data.moneyGold;
        this.userMoney.crystal = data.moneyFen;
        this.userMoney.diamond = data.moneyStone;
    };
    //刷新玩家数据
    UserMgr.prototype.refreshData = function (id, data) {
        console.log(this.userMoney.gold);
        switch (id) {
            case dataids_1.dataids.ID_USER_MONEYGOLD:
                this.userMoney.gold = data.userGold;
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_USER_MONEYSTONE:
                this.userMoney.diamond = data;
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_USER_MONEYFEN:
                this.userMoney.crystal = data;
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_USRE_LEVEL:
                this.user.grade = data.userLv;
                this.user.userExp = data.userExp;
                this.gemit("refreshLevelUI");
                break;
            case dataids_1.dataids.ID_GET_MONEY_GOLD:
                if (typeof data == "number") {
                    this.userMoney.gold += data;
                }
                else {
                    this.userMoney.gold += data.moneyGold;
                }
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_GET_MAILITEMS:
                this.mailRewark(data.dictPrize);
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_GET_BOXPRIZE:
                this.userMoney.gold += data.addMoneyGold;
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_GET_WEEKVIPPRIZE:
                console.log(this.userMoney.gold, data);
                this.userMoney.gold += data.dictItemInfo[1];
                this.userMoney.crystal += data.dictItemInfo[2];
                this.gemit("refreshMoneyUI");
                break;
            case dataids_1.dataids.ID_DOSIGNIN_RECINFO:
                this.rewark(data.dictRecItems);
                break;
            case dataids_1.dataids.ID_MULTISIGNIN_RECINFO:
                this.rewark(data.dictRecItems);
                this.gemit("refreshMoneyUI");
            default:
                break;
        }
    };
    UserMgr.prototype.getAllTypeItem = function (data) {
        if (data[enums_1.enums.Get_Gold]) {
            this.userMoney.gold += data[enums_1.enums.Get_Gold];
        }
        if (data[enums_1.enums.Get_Crystal]) {
            this.userMoney.crystal += data[enums_1.enums.Get_Crystal];
        }
        if (data[enums_1.enums.Get_Price]) {
            this.userMoney.diamond += data[enums_1.enums.Get_Price];
        }
        this.gemit("refreshMoneyUI");
    };
    //邮件奖励处理  特殊处理
    UserMgr.prototype.mailRewark = function (data) {
        for (var key in data) { //暂时只有金钱
            switch (Number(key)) {
                case enums_1.enums.Get_Gold: //金币奖励
                    this.userMoney.gold += data[key][0].amount;
                    break;
                case enums_1.enums.Get_Crystal: //粉晶奖励
                    this.userMoney.crystal += data[key][0].amount;
                    break;
                case enums_1.enums.Get_Price: //钻石奖励
                    this.userMoney.diamond += data[key][0].amount;
                    break;
                default:
                    break;
            }
        }
    };
    //奖励处理  数据结构类型：
    UserMgr.prototype.rewark = function (data) {
        for (var key in data) {
            switch (Number(key)) {
                case enums_1.enums.Get_Gold: //金币奖励
                    this.userMoney.gold += data[key];
                    break;
                case enums_1.enums.Get_Crystal: //粉晶奖励
                    this.userMoney.crystal += data[key];
                    break;
                case enums_1.enums.Get_Price: //钻石奖励
                    this.userMoney.diamond += data[key];
                    break;
                default:
                    break;
            }
        }
    };
    //获取服务器发送的角色使用数据
    UserMgr.prototype.switchRole = function (msg) {
        var itemData = msg.getDataByType(dataids_1.dataids.ID_EQUIP_ROLE);
        //将玩家信息中的roleId替换
        this.user.roleId = itemData.autoId;
    };
    UserMgr.prototype.plaza_guild_createGuild = function (msg) {
        this.user.guildId = msg.getDataByType(dataids_1.dataids.ID_USREGUILDID_CHANGED);
    };
    UserMgr.prototype.search_entry_reqUserBrief = function () {
    };
    UserMgr.prototype.getMyInfo = function () {
        return this.user;
    };
    // 单例处理
    UserMgr._instance = null;
    return UserMgr;
}(BaseMgr_1.default));
exports.default = UserMgr;

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
        //# sourceMappingURL=userMgr.js.map
        