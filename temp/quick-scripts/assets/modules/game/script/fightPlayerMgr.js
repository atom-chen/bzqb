(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/fightPlayerMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dfab0HplgtFrJQvQa8q+Z2A', 'fightPlayerMgr', __filename);
// modules/game/script/fightPlayerMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../framework/modules/Emitter");
var fightPlayerClass_1 = require("./player/fightPlayerClass");
var fightRandomSeed_1 = require("./common/fightRandomSeed");
var PlayerData_1 = require("./modles/PlayerData");
var gameConfig_1 = require("./common/gameConfig");
/*
author: 黄凯
日期:2018-11-19
*/
var emitter = Emitter_1.default.getInstance();
// 随机数控制
var randomSeed = fightRandomSeed_1.default.getInstance();
// 配置
var netFrame = gameConfig_1.default.netFrame, fightEvent = gameConfig_1.default.fightEvent, missileType = gameConfig_1.default.missileType;
var teamEnumType = {
    teamOne: "1",
    teamTwo: "2"
};
// 测试数据 玩家出生点
var spownPoi = {
    "1": {
        x: -460,
        y: -143,
    },
    "2": {
        x: 445,
        y: -189,
    },
    "3": {
        x: 200,
        y: 0,
    },
    "4": {
        x: 400,
        y: 0,
    },
};
// 玩家选择的角色对应的预制体索引值
var playerRoleToIndex = {
    "1": 0,
    "2": 1,
};
//切换玩家的几种情况 
// 1，玩家行动回合 15秒没有操作 切换
// 2，玩家行动后 发射炮弹 炮弹产生碰撞后切换
// 3，玩家被冰冻 直接切换
// 4，飞机
// 玩家控制器数据层
var PlayerMgrModle = /** @class */ (function () {
    function PlayerMgrModle() {
        // 座位id对应的玩家实例化对象
        this.seatIdToPlayer = {};
        // 行动流程
        this.actionProcess = [];
        // 队伍对应的座位数组
        this.teamToSeatId = {
            "1": [],
            "2": []
        };
        // this.nowTimce = 1;
    }
    // 初始化玩家
    PlayerMgrModle.prototype.init = function (rolePrefab, players, fatherNode) {
        this.playerCount = Object.keys(players).length;
        this.rolePrefab = rolePrefab;
        // TODO 初始化并分离玩家数据
        for (var seatId in players) {
            // 玩家的数据
            var playerData = new PlayerData_1.default(players[seatId]);
            var index = playerRoleToIndex[playerData.roleType];
            var node = cc.instantiate(this.rolePrefab[index]);
            var player = node.getComponent(fightPlayerClass_1.default);
            var team = playerData.team;
            // 设置玩家坐标
            playerData.setPoi(spownPoi[seatId]);
            // 初始化玩家数据
            player.init(playerData);
            node.parent = fatherNode;
            this.teamToSeatId[team].push(seatId);
            this.seatIdToPlayer[seatId] = player;
        }
        // 固定的流程与操作顺序
        this.initActionProcess();
        // 初始玩家卡牌能量
        this.initPlayerCardPower();
        // 初始第一个玩家座位
        this.nowSeatId = this.actionProcess[0];
        // console.log(this.actionProcess);
    };
    // 通关流程顺序设置玩家的初始能量
    PlayerMgrModle.prototype.initPlayerCardPower = function () {
        for (var i = 0; i < this.actionProcess.length; i++) {
            var seatId = this.actionProcess[i];
            var player = this.seatIdToPlayer[seatId];
            player.setCardPower(i);
        }
    };
    // 初始化玩家动作流程
    PlayerMgrModle.prototype.initActionProcess = function () {
        var randomTeam = this.changeRandomTeam(null);
        var teamOne = this.teamToSeatId["1"].slice(0);
        var teamTwo = this.teamToSeatId["2"].slice(0);
        for (var i = 0; i < this.playerCount; i++) {
            var seadId = void 0;
            switch (randomTeam) {
                case "1":
                    seadId = this.getRandomAndRemove(teamOne);
                    break;
                case "2":
                    seadId = this.getRandomAndRemove(teamTwo);
                    break;
            }
            if (i % 2 === 0) {
                randomTeam = this.changeRandomTeam(randomTeam);
            }
            this.actionProcess.push(seadId);
        }
    };
    // 获取活着的玩家
    PlayerMgrModle.prototype.getLivePlayers = function () {
        var seatIdToRealPoi = {};
        for (var i = 0; i < this.actionProcess.length; i++) {
            var seatId = this.actionProcess[i];
            var player = this.getPlayerBySeatId(seatId);
            seatIdToRealPoi[seatId] = player.getPlayerRealPoi();
        }
        return seatIdToRealPoi;
    };
    // 切换随机组队
    PlayerMgrModle.prototype.changeRandomTeam = function (randomTeam) {
        switch (randomTeam) {
            case "1":
                return "2";
                break;
            case "2":
                return "1";
                break;
        }
        return randomSeed.random() > 0.5 ? "1" : "2";
    };
    // 获取就删除
    PlayerMgrModle.prototype.getRandomAndRemove = function (teamList) {
        var count = teamList.length;
        var index = Math.floor(randomSeed.random() * count);
        return teamList.splice(index, 1)[0];
    };
    // 切换玩家流程
    PlayerMgrModle.prototype.changePlayer = function () {
        var count = this.actionProcess.length;
        if (count <= 1) {
            console.log("游戏已经结束了不需要切换玩家");
            return;
        }
        var nowIndex = this.actionProcess.indexOf(this.nowSeatId);
        if (nowIndex == count - 1) {
            nowIndex = 0;
        }
        else {
            nowIndex++;
        }
        // 重新设置座位id
        this.nowSeatId = this.actionProcess[nowIndex];
        // 流程++
        // this.nowTimce++;
    };
    // 检测单组玩家剩余个数
    PlayerMgrModle.prototype.checkIsNoPlayer = function (teamType) {
        var _a = this, seatIdToPlayer = _a.seatIdToPlayer, teamToSeatId = _a.teamToSeatId;
        var liveIndex = 0;
        var count = teamToSeatId[teamType].length;
        for (var i = 0; i < count; i++) {
            var player = teamToSeatId[teamType][i];
            // TODO 玩家是否活着
            if (player.getIsLive()) {
                liveIndex++;
            }
        }
        return liveIndex;
    };
    // 某玩家翘辫子
    PlayerMgrModle.prototype.playerDead = function (seatId) {
        // 每炸死一个玩家就判断一次游戏是否结束
        var index = this.actionProcess.indexOf(seatId);
        // 删除行动流程
        this.actionProcess.splice(index, 1);
    };
    // 获取玩家座位id
    PlayerMgrModle.prototype.getPlayerBySeatId = function (seatId) {
        return this.seatIdToPlayer[seatId];
    };
    // 获取当前操作的玩家
    PlayerMgrModle.prototype.getNowPlayer = function () {
        return this.seatIdToPlayer[this.nowSeatId];
    };
    // 检测是否是该玩家的操做回合
    PlayerMgrModle.prototype.checkIsNowSeatId = function (seatId) {
        return this.nowSeatId == seatId;
    };
    // 是否是我的回合
    PlayerMgrModle.prototype.checkNowPlayerIsMine = function () {
        return this.nowSeatId == this.mySeatId;
    };
    // 获取我的玩家实例化对象
    PlayerMgrModle.prototype.getMyPlayer = function () {
        return this.seatIdToPlayer[this.mySeatId];
    };
    return PlayerMgrModle;
}());
var taggerEnum = {
    "show": "show",
    "hide": "hide",
};
// 显示的事件绑定
var playerMgrView = /** @class */ (function () {
    function playerMgrView() {
    }
    // 切换显示隐藏我的操作
    playerMgrView.prototype.taggerMyCtrlUi = function (tagger) {
        emitter.emit(fightEvent.taggerMyCtrlUi, tagger);
    };
    // 移动控制器和能量条等
    playerMgrView.prototype.moveMyCtrlUi = function (poi) {
        emitter.emit(fightEvent.moveMyCtrlUi, poi);
    };
    // 更新行动能量条
    playerMgrView.prototype.updateMoveRange = function (range) {
        emitter.emit(fightEvent.updateMoveRange, range);
    };
    // 移动相机
    playerMgrView.prototype.moveCarame = function (lerp) {
        emitter.emit(fightEvent.setNowLerpPoi, lerp);
    };
    // 切换卡牌展示 效果要重做
    playerMgrView.prototype.changeCardList = function (cards) {
        emitter.emit(fightEvent.onCardChange, cards);
    };
    return playerMgrView;
}());
// 我的回合
// 1，发送数据给服务端
// 2，显示操作相关的ui
// 控制层
var fightPlayerMgr = /** @class */ (function () {
    function fightPlayerMgr() {
        this.playerMgrModle = new PlayerMgrModle();
        this.playerMgrView = new playerMgrView();
    }
    // 设置父节点
    fightPlayerMgr.prototype.setFatherNode = function (node) {
        this.fatherNode = node;
    };
    // 初始化玩家控制器
    fightPlayerMgr.prototype.init = function (rolePrefab, players) {
        // TODO 测试数据
        if (players == null) {
            // 模拟数据
            players = {
                "1": {
                    team: "1",
                    name: "hk",
                    seatId: "1",
                    roleType: "1",
                },
                "2": {
                    team: "2",
                    name: "hk2",
                    seatId: "2",
                    roleType: "2",
                }
            };
        }
        ;
        // 数据模型初始化
        this.playerMgrModle.init(rolePrefab, players, this.fatherNode);
    };
    // 生成自身操作圈
    fightPlayerMgr.prototype.setMyCircleCtrl = function (uiPrefab) {
        var myPlayer = this.getMyPlayer();
        var node = cc.instantiate(uiPrefab);
        // console.log("myPlayer",node);
        node.parent = myPlayer.node;
        node.active = true;
    };
    fightPlayerMgr.prototype.getMyPlayer = function () {
        return this.playerMgrModle.getMyPlayer();
    };
    // 通关玩家座位获取玩家实例化对象
    fightPlayerMgr.prototype.getPlayerBySeatId = function (seatId) {
        return this.playerMgrModle.getPlayerBySeatId(seatId);
    };
    // 设置玩家真实位置
    fightPlayerMgr.prototype.setPlayerNewPoi = function (seatId, realPoi) {
        var player = this.getPlayerBySeatId(seatId);
        player.resetPoi(realPoi);
    };
    // 当前是不是自己的回合
    fightPlayerMgr.prototype.checkPlayerIsMine = function () {
        return this.playerMgrModle.checkNowPlayerIsMine();
    };
    // 返回seatId 对应 真实坐标
    fightPlayerMgr.prototype.getLivePlayers = function () {
        return this.playerMgrModle.getLivePlayers();
    };
    // 通知当前操作的玩家 
    fightPlayerMgr.prototype.goPlayerAction = function () {
        // 获取当前玩家
        var player = this.playerMgrModle.getNowPlayer();
        // 镜头移动
        var playerRealPoi = player.getPlayerRealPoi();
        this.playerMgrView.moveCarame(playerRealPoi);
        // 开始即时操做等
        player.startTrun();
        // TODO 如果是自己 显示ui 等
        if (this.checkPlayerIsMine()) {
            var cardList = player.getPlayerCardList();
            this.playerMgrView.changeCardList(cardList);
            this.playerMgrView.taggerMyCtrlUi(taggerEnum.show);
        }
        else {
            this.playerMgrView.taggerMyCtrlUi(taggerEnum.hide);
        }
    };
    // 我的座位id
    fightPlayerMgr.prototype.setMySeatId = function (seatId) {
        this.playerMgrModle.mySeatId = seatId;
    };
    // 切换玩家
    fightPlayerMgr.prototype.changePlayer = function () {
        // 切换后玩家开始动起来
        this.playerMgrModle.changePlayer();
        // 切换后玩家开始动起来
        this.goPlayerAction();
    };
    // 某玩家翘辫子了
    fightPlayerMgr.prototype.playerDead = function (seatId) {
        this.playerMgrModle.playerDead(seatId);
    };
    // 通过玩家各队死活 判断是否结束游戏
    fightPlayerMgr.prototype.checkIsGameOver = function () {
        // 队伍1 或者的数量
        var teamOneLive = this.playerMgrModle.checkIsNoPlayer(teamEnumType["teamOne"]);
        // 队伍2 或者的数量
        var teamTwoLive = this.playerMgrModle.checkIsNoPlayer(teamEnumType["teamTwo"]);
        if (teamOneLive <= 1) {
            return true;
        }
        else {
            return false;
        }
    };
    // 干玩家
    fightPlayerMgr.prototype.doPlayer = function (msg) {
        if (!msg || msg.length < 1) {
            return;
        }
        msg = msg[0];
        var seatId = msg.seatId + "";
        // 检测是否该玩家的回合
        if (!this.playerMgrModle.checkIsNowSeatId(seatId)) {
            console.log("不是该玩家的回合不能操作");
            return;
        }
        // 玩家对象
        var player = this.playerMgrModle.getNowPlayer();
        if (!player.getIsMyTrun()) {
            // console.log("该玩家的回合已经结束");
            return;
        }
        var data = msg.data;
        // 射击向量
        var shootPoi = data.shootPoi;
        // 移动方向
        var direction = data.direction;
        // 玩家当前举枪角度
        var elevation = data.elevation;
        // 使用卡牌
        var userCard = data.userCard;
        // 切换飞机
        var changePlane = data.changePlane;
        // 移动1，-1
        if (direction) {
            // 玩家移动
            player.move(direction);
        }
        // 使用纸飞机
        if (changePlane) {
            console.log("使用飞机", changePlane);
            player.changePlane(changePlane);
        }
        // 发射炮弹
        if (shootPoi) {
            this.playerMgrView.taggerMyCtrlUi(taggerEnum.hide);
            player.shootMis(shootPoi);
        }
        // 玩家当前角度
        if (elevation) {
            player.changeAngle(elevation);
        }
        // 玩家使用卡牌
        if (userCard) {
            // 使用成功返回true 使用失败不管
            if (player.useCard(userCard) && this.checkPlayerIsMine()) {
                // 使用成功刷新ui
                var cardList = player.getPlayerCardList();
                this.playerMgrView.changeCardList(cardList);
            }
        }
    };
    // 检测是否是我的回合 然后操作ui位移等
    fightPlayerMgr.prototype.checkIsMyTrun = function () {
        if (this.checkPlayerIsMine()) {
            var player = this.playerMgrModle.getNowPlayer();
            var myRealPoi = player.getPlayerRealPoi();
            var movePower = player.getMovePower();
            // myRealPoi = this.getWorldPoi(myRealPoi);
            this.playerMgrView.moveMyCtrlUi(myRealPoi);
            this.playerMgrView.updateMoveRange(movePower);
        }
    };
    // getWorldPoi(poi:any){
    // 	return this.fatherNode.convertToWorldSpaceAR(poi);
    // }
    // 网络帧驱动
    fightPlayerMgr.prototype.netFrame = function (msg) {
        this.doPlayer(msg);
        this.checkIsMyTrun();
    };
    return fightPlayerMgr;
}());
exports.default = fightPlayerMgr;

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
        //# sourceMappingURL=fightPlayerMgr.js.map
        