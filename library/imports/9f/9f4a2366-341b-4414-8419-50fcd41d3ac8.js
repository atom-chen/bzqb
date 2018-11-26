"use strict";
cc._RF.push(module, '9f4a2NmNBtEFIQZUPzUHTrI', 'game');
// modules/game/script/game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../framework/modules/Emitter");
var fightRandomSeed_1 = require("./common/fightRandomSeed");
var BaseGameFight_1 = require("./baseClass/BaseGameFight");
/*
author: 黄凯
日期:2018-11-19
*/
// 碰撞
var wmCollisionManager = require("hkCollisionManager");
// 物理
var hkPhysics_1 = require("./physics/hkPhysics");
// 玩家操作数据单利
var PlayerCtrlData_1 = require("./modles/PlayerCtrlData");
// 玩家管理器
var fightPlayerMgr_1 = require("./fightPlayerMgr");
// 炮弹管理器
var fightMissileMgr_1 = require("./fightMissileMgr");
// 快速开始游戏
var fightNetMgr_1 = require("./net/fightNetMgr");
// 帧数池管理器
var fightNetPoolMgr_1 = require("./net/fightNetPoolMgr");
// 工具
var fightTool_1 = require("./common/fightTool");
// 游戏配置
var gameConfig_1 = require("./common/gameConfig");
// 地图管理器
var mapMgr_1 = require("./sceneMgr/mapMgr");
var netFrame = gameConfig_1.default.netFrame, fightEvent = gameConfig_1.default.fightEvent, missileType = gameConfig_1.default.missileType, missileBuffType = gameConfig_1.default.missileBuffType;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// 随机数
var randomSeed = fightRandomSeed_1.default.getInstance();
// 事件
var emitter = Emitter_1.default.getInstance();
// 物理
var wmPhysicsManager = hkPhysics_1.default.getInstance();
// 单例玩家操作数据模型
var playerCtrlData = PlayerCtrlData_1.default.getInstance();
// 地图管理器
var mapMgr = mapMgr_1.default.getInstance();
var GameCtrl = /** @class */ (function (_super) {
    __extends(GameCtrl, _super);
    function GameCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // UI组件
        // 玩家的预制体数组
        _this.rolePrefab = [];
        // 导弹的预制体数组
        _this.missilePrefab = [];
        // 父级节点
        _this.fatherNode = null;
        // 玩家操作的ui
        _this.playerCircleCtrl = null;
        // 前景图片节点
        _this.prospectNode = null;
        // 地图前景图片
        _this.prospectPicture = null;
        // 弹坑图片
        _this.craterPicture = null;
        return _this;
    }
    GameCtrl.prototype.init = function () {
        this.fightPlayerMgr = new fightPlayerMgr_1.default();
        this.fightNetMgr = new fightNetMgr_1.default();
        this.fightNetPoolMgr = new fightNetPoolMgr_1.default();
        this.fightMissileMgr = new fightMissileMgr_1.default();
        wmPhysicsManager.enabled = true;
        wmCollisionManager.enabled = true;
        this.bindInit();
        this.bindEvent();
        mapMgr.initMap(this.fatherNode, this.prospectNode, this.prospectPicture, this.craterPicture);
    };
    GameCtrl.prototype.bindEvent = function () {
        // 绑定切换玩家事件 
        emitter.on(fightEvent.changeProcess, this.changeProcess, this);
        // 碰撞结算
        emitter.on(fightEvent.colliderSettle, this.colliderSettle, this);
    };
    // 初始化一些绑定
    GameCtrl.prototype.bindInit = function () {
        var netEvent = {
            "onMatch": this.onMatch.bind(this),
            "onFightState": this.onFightState.bind(this),
            "onFightFrame": this.onFightFrame.bind(this),
            "matchState": this.matchState.bind(this),
            "matchSuccess": this.matchSuccess.bind(this)
        };
        this.fightNetMgr.init(netEvent);
        this.fightMissileMgr.init(this.missilePrefab, this.fatherNode);
        this.fightPlayerMgr.setFatherNode(this.fatherNode);
    };
    GameCtrl.prototype.onLoad = function () {
        var _this = this;
        // 测试匹配直接进入房间
        this.init();
        // 测试连接
        this.fightNetMgr.connect(function (data) {
            console.log(data);
            _this.fightNetMgr.match("1", function (data2) {
                console.log(data2);
            });
        });
    };
    // ----------这部分某些是测试代码-------------
    GameCtrl.prototype.onMatch = function (data) {
        console.log(data);
    };
    // 战斗的状态情况
    GameCtrl.prototype.onFightState = function (data) {
        console.log(data);
    };
    // 将网络帧推送给真管理器
    GameCtrl.prototype.onFightFrame = function (data) {
        this.fightNetPoolMgr.addFrame(data.msg);
    };
    // 匹配中的状态
    GameCtrl.prototype.matchState = function (data) {
        var msg = data.msg;
        switch (msg.state) {
            case 7:
                var info = msg.info;
                // 这里初始化要注意和后面游戏正式准备产生冲突
                console.log("开始游戏", info);
                // TODO 随机种子下发
                randomSeed.init(2333);
                this.fightPlayerMgr.init(this.rolePrefab, null);
                // this.fightPlayerMgr.init(this.rolePrefab,info.playerInfo);
                this.fightPlayerMgr.setMySeatId(info.mySeatId.toString());
                this.fightPlayerMgr.setMyCircleCtrl(this.playerCircleCtrl);
                // 战斗前准备
                this.fightNetMgr.gameParpare(function () {
                    console.log("玩家准备了");
                });
                // 这里可能暂时不同步
                this.gameSwitch = true;
                break;
        }
    };
    // 匹配成功
    GameCtrl.prototype.matchSuccess = function (data) {
        console.log("匹配成功", data);
        // console.log(data);
        // TODO 初始化随机种子
    };
    // ---------测试代码结束--------------
    // 游戏流程切换
    GameCtrl.prototype.changeProcess = function () {
        // TODO 单独做一个管理模块管理游戏进程中的事物
        var _this = this;
        // 1，检测游戏是否已经结束 游戏结束不继续切换
        // 2，场景物品切换 如宝箱 空投 龙卷风 火主 风向 等
        // 3，玩家操作切换
        this.frameTimeout(function () {
            _this.fightPlayerMgr.changePlayer();
            // 相机回弹
            emitter.emit(fightEvent.setZoomRatio, 1);
        }, 3 * netFrame);
        console.log("切换流程");
    };
    // 炮弹碰撞结算
    GameCtrl.prototype.colliderSettle = function (obj) {
        // 是否是飞机
        var isPlane = obj.isPlane;
        // 玩家的座位id
        var seatId = obj.seatId;
        // 炮弹的位置
        var realPoi = obj.realPoi;
        // 飞机不参与任何结算 爆炸等
        if (isPlane) {
            // 位移玩家 
            this.fightPlayerMgr.setPlayerNewPoi(seatId, realPoi);
            return;
        }
        // 活着的玩家的点位信息
        var seatIdToRealPoi = this.fightPlayerMgr.getLivePlayers();
        // 椭圆半径
        var ellipseRange = obj.ellipseRange;
        // 导弹类型
        var missBuffType = obj.missileBuffType;
        // 子弹威力
        var power = obj.power;
        // 绘制弹坑碰撞体
        var missilePoints = fightTool_1.default.createPoint(ellipseRange, realPoi);
        // 挖坑实现
        mapMgr.digHole(realPoi, ellipseRange);
        // 碰撞检测 与 加血扣血
        for (var seatId_1 in seatIdToRealPoi) {
            var playerPoi = seatIdToRealPoi[seatId_1];
            var isCollider = fightTool_1.default.pointInPolygon(playerPoi, missilePoints);
            if (isCollider) {
                var player = this.fightPlayerMgr.getPlayerBySeatId(seatId_1);
                player.resetPoi();
                // 根据炮弹类型对玩家加血或者扣血操作
                switch (missBuffType) {
                    case missileBuffType.sub:
                        player.subHp(power);
                        break;
                    case missileBuffType.add:
                        player.addHp(power);
                        break;
                }
            }
        }
    };
    // TODO 发送玩家操作数据
    GameCtrl.prototype.getSendFrameMsg = function () {
        // 当前是我的回合
        if (this.fightPlayerMgr.checkPlayerIsMine()) {
            var data = playerCtrlData.getData();
            var msg = {
                data: data
            };
            this.fightNetMgr.send(msg);
        }
        playerCtrlData.clear();
    };
    // 运行帧数据
    GameCtrl.prototype.doFrame = function () {
        var hisFrameCount = this.fightNetPoolMgr.hisTroyFrameCount;
        // 当开始1秒钟后 开始第一名玩家的操作
        if (hisFrameCount === netFrame) {
            this.fightPlayerMgr.goPlayerAction();
        }
        // 获取玩家操作并发送操作数据
        this.getSendFrameMsg();
        // 获取最后一条数据
        var msg = this.fightNetPoolMgr.getLastFrame();
        // 更新玩家管理器
        this.fightPlayerMgr.netFrame(msg);
        // 触发逻辑运算
        emitter.emit(fightEvent.netFrame);
        // 检测地图与导弹的碰撞
        this.checkMissileMapCollider();
        // 物理更新
        wmPhysicsManager.netFrame();
        // 检测碰撞
        wmCollisionManager.netFrame();
        // 延迟事件
        this.frameRun();
    };
    // 检测地图与炮弹的碰撞
    GameCtrl.prototype.checkMissileMapCollider = function () {
        var missiles = this.fightMissileMgr.getAllLiveMissile();
        for (var i = missiles.length - 1; i >= 0; i--) {
            var missile = missiles[i];
            var realPoi = missile.getRealPoi();
            if (mapMgr.checkCollideGround(realPoi)) {
                missile.setRealPoi(mapMgr.getNextPoint(realPoi, 0, 0));
                missile.onMapCollider();
            }
        }
    };
    // 整战斗中只有一个
    GameCtrl.prototype.update = function (dt) {
        emitter.emit(fightEvent.netUpdate);
        if (!this.gameSwitch)
            return;
        // 是否可以运行逻辑
        if (this.fightNetPoolMgr.getCanDoNetFrame(dt)) {
            this.doFrame();
            // 帧数滞留的时候出现菊花
            while (this.fightNetPoolMgr.checkCanWhile()) {
                this.doFrame();
            }
        }
    };
    // 销毁该管理器
    GameCtrl.prototype.onDestroy = function () {
        emitter.off(fightEvent.changeProcess, this);
        // super.onDestroy();
    };
    __decorate([
        property([cc.Prefab])
    ], GameCtrl.prototype, "rolePrefab", void 0);
    __decorate([
        property([cc.Prefab])
    ], GameCtrl.prototype, "missilePrefab", void 0);
    __decorate([
        property(cc.Node)
    ], GameCtrl.prototype, "fatherNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], GameCtrl.prototype, "playerCircleCtrl", void 0);
    __decorate([
        property(cc.Node)
    ], GameCtrl.prototype, "prospectNode", void 0);
    __decorate([
        property({ type: cc.Texture2D })
    ], GameCtrl.prototype, "prospectPicture", void 0);
    __decorate([
        property({ type: cc.Texture2D })
    ], GameCtrl.prototype, "craterPicture", void 0);
    GameCtrl = __decorate([
        ccclass
    ], GameCtrl);
    return GameCtrl;
}(BaseGameFight_1.default));
exports.default = GameCtrl;

cc._RF.pop();