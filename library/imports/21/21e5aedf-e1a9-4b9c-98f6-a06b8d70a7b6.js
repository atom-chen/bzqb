"use strict";
cc._RF.push(module, '21e5a7f4alLnJj2oGuNcKe2', 'fightPlayerModle');
// modules/game/script/player/fightPlayerModle.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var effectBuffMgr_1 = require("../effectBuff/effectBuffMgr");
var fightRandomSeed_1 = require("../common/fightRandomSeed");
var fightTool_1 = require("../common/fightTool");
// 随机数
var randomSeed = fightRandomSeed_1.default.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
var emitter = Emitter_1.default.getInstance();
var gameConfig_1 = require("../common/gameConfig");
var netFrame = gameConfig_1.default.netFrame, fightEvent = gameConfig_1.default.fightEvent, missileType = gameConfig_1.default.missileType, waitTime = gameConfig_1.default.waitTime, playerConfig = gameConfig_1.default.playerConfig, missileBuffType = gameConfig_1.default.missileBuffType, maxCard = gameConfig_1.default.maxCard;
// 装备 TODO 护甲等
var equipment = /** @class */ (function () {
    function equipment() {
    }
    return equipment;
}());
// 测试用的牌组 卡牌消耗的能量
var cardForPower = {
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 1,
    "6": 2,
    "7": 3,
    "8": 4,
    "9": 5,
    "10": 3
};
var fightPlayerModle = /** @class */ (function () {
    function fightPlayerModle() {
        // 卡牌池子
        this.cardList = [];
    }
    // 初始化
    fightPlayerModle.prototype.init = function (playerData) {
        this.isPlane = 0;
        this.movePower = playerConfig.maxMovePower;
        this.effectBuffMgr = new effectBuffMgr_1.default();
        this.moveSpeed = 1;
        this.atkPower = 40;
        this.nowAtkPower = this.atkPower;
        this.critRate = 0.1;
        this.hp = 500;
        this.maxHp = 500;
        // this.cardPower = playerData.cardPower;
        this.maxCardPower = 10;
        this.oneTrunCardPower = 4;
        // this.realPoi = playerData.realPoi;
        this.team = playerData.team;
        this.name = playerData.name;
        this.seatId = playerData.seatId;
        this.isSkip = false;
        this.continuousFire = 1;
        this.divisionFire = 1;
        // 测试数据 初始牌组
        this.cardList = playerData.cardList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.initCardList();
        // TODO 初始特技与天赋
    };
    // 初始化手牌和接下来要抽的牌
    fightPlayerModle.prototype.initCardList = function () {
        this.cacheList = [];
        var firstCardList = fightTool_1.default.shuffle(this.cardList.slice(0));
        this.nowCardList = firstCardList.splice(0, maxCard);
        this.cacheList = firstCardList;
        // console.log("this.nowCardList",this.nowCardList,this.cacheList);
    };
    // 回合开始重置数值
    fightPlayerModle.prototype.myTurn = function () {
        // 15秒行动时间
        this.trunTime = netFrame * waitTime;
        // 回复行动能量
        this.movePower = playerConfig.maxMovePower;
        // 关闭飞机
        this.isPlane = 0;
        // 回复卡牌能量
        this.cardPower += this.oneTrunCardPower;
        this.cardPower > this.maxCardPower && (this.cardPower = this.maxCardPower);
        // buff结算
        this.effectBuffMgr.buffSettle();
        // 连射次数
        this.continuousFire = 1;
        // 分裂
        this.divisionFire = 1;
        // 重置攻击力
        this.nowAtkPower = this.atkPower;
        // 补充卡牌
        this.supplementaryCard();
    };
    // 补充卡牌
    fightPlayerModle.prototype.supplementaryCard = function () {
        // 需要补充多少张牌
        var cardNeedLen = maxCard - this.nowCardList.length;
        var cacheLen = this.cacheList.length;
        // console.log("cardNeedLen+++",cardNeedLen,cacheLen);
        // 取出缓存中的卡牌
        if (cacheLen > 0) {
            if (cardNeedLen >= cacheLen) {
                // 取出所有的缓存卡牌
                var cacheArr = this.cacheList.splice(0, cacheLen);
                cardNeedLen -= cacheLen;
                this.nowCardList = this.nowCardList.concat(cacheArr);
            }
            else {
                // 取出部分卡牌
                var cacheArr = this.cacheList.splice(0, cardNeedLen);
                cardNeedLen = 0;
                this.nowCardList = this.nowCardList.concat(cacheArr);
            }
        }
        // 还没取够 继续取卡
        if (cardNeedLen > 0) {
            var canChooseCardList = fightTool_1.default.differenceArray(this.cardList, this.nowCardList);
            var cacheArr = canChooseCardList.splice(0, cardNeedLen);
            this.nowCardList = this.nowCardList.concat(cacheArr);
        }
        console.log("当前能量：", this.cardPower, "当前卡牌列表：", this.nowCardList);
    };
    // 返回当前攻击力
    fightPlayerModle.prototype.getNowAtkPower = function () {
        return this.nowAtkPower;
    };
    // 拷贝一份传出 避免被修改
    fightPlayerModle.prototype.getPlayerCardList = function () {
        return this.nowCardList.slice(0);
    };
    // 设置初始卡牌能量
    fightPlayerModle.prototype.setCardPower = function (index) {
        if (index === 0) {
            this.cardPower = 0;
        }
        else {
            this.cardPower = 2;
        }
    };
    // 使用卡牌
    fightPlayerModle.prototype.useCard = function (card) {
        // console.log("useCard--------",card,typeof card == "number")
        // 判断能量是否满足
        var newCardPower = cardForPower[card];
        // 判断玩家是否有这张牌
        var index = this.nowCardList.indexOf(card);
        if ((index !== -1 && index < (this.nowCardList.length - 1)) && this.cardPower >= newCardPower) {
            this.nowCardList.splice(index, 1);
            // 使用成功
            this.cardPower -= newCardPower;
            return true;
        }
        else {
            console.log("能量不够 不能使用");
            return false;
        }
    };
    // 加连射
    fightPlayerModle.prototype.addContinuousFire = function (num) {
        this.continuousFire += (num - 1);
        this.continuousFire > 4 && (this.continuousFire = 4);
    };
    // 加分裂
    fightPlayerModle.prototype.addDivisionFire = function () {
        this.divisionFire = 3;
    };
    // 增加攻击力
    fightPlayerModle.prototype.addAtkPower = function (atk) {
        this.nowAtkPower += atk;
    };
    // 切换死战模式
    fightPlayerModle.prototype.changeDeathPattern = function () {
        this.oneTrunCardPower = 8;
    };
    // 检测玩家是否可以移动
    fightPlayerModle.prototype.checkCanMove = function () {
        return this.movePower > 0;
    };
    // 扣去能量
    fightPlayerModle.prototype.subMovePower = function () {
        this.movePower -= playerConfig.trunMovePower;
        this.movePower < 0 && (this.movePower = 0);
    };
    // 切换飞机模式
    fightPlayerModle.prototype.changePlane = function (typeNum) {
        this.isPlane = typeNum;
    };
    // 扣血时 hp最小值为0
    fightPlayerModle.prototype.subHp = function (power) {
        this.hp -= power;
        this.hp < 0 && (this.hp = 0);
    };
    // 加血效果
    fightPlayerModle.prototype.addHp = function (power) {
        this.hp += power;
        this.hp > this.maxHp && (this.hp = this.maxHp);
    };
    // 检测是否会被跳过回合 如(冰冻)等
    fightPlayerModle.prototype.checkIsSkip = function () {
        return this.isSkip;
    };
    // 获取当前剩余操作 单位秒
    fightPlayerModle.prototype.getSecond = function () {
        var second = Math.ceil(this.trunTime / netFrame) + "";
        return second;
    };
    // 检测玩家是否操作超时
    fightPlayerModle.prototype.checkIsTimeout = function () {
        return this.trunTime === 0;
    };
    // 每次运行帧数时
    fightPlayerModle.prototype.goFrame = function () {
        this.trunTime--;
    };
    // 获取移动能量百分比 0-1
    fightPlayerModle.prototype.getMovePower = function () {
        return this.movePower / playerConfig.maxMovePower;
    };
    // 获取hp百分比 0-1
    fightPlayerModle.prototype.getHpRange = function () {
        return this.hp / this.maxHp;
    };
    // 修改卡牌能量
    fightPlayerModle.prototype.getCardPower = function () {
        return this.cardPower;
    };
    return fightPlayerModle;
}());
exports.default = fightPlayerModle;

cc._RF.pop();