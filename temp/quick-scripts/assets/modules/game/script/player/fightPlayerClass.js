(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/player/fightPlayerClass.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3b86126T4BPX4hJz3EOoAxy', 'fightPlayerClass', __filename);
// modules/game/script/player/fightPlayerClass.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var BaseBodyFight_1 = require("../baseClass/BaseBodyFight");
var ShootData_1 = require("../modles/ShootData");
var fightPlayerModle_1 = require("./fightPlayerModle");
var fightTool_1 = require("../common/fightTool");
var fightCardFactory_1 = require("../cardFactory/fightCardFactory");
// 地图管理器
var mapMgr_1 = require("../sceneMgr/mapMgr");
// 地图管理器
var mapMgr = mapMgr_1.default.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
var emitter = Emitter_1.default.getInstance();
var gameConfig_1 = require("../common/gameConfig");
var netFrame = gameConfig_1.default.netFrame, fightEvent = gameConfig_1.default.fightEvent, missileType = gameConfig_1.default.missileType, waitTime = gameConfig_1.default.waitTime, playerConfig = gameConfig_1.default.playerConfig, missileBuffType = gameConfig_1.default.missileBuffType, shootStartPoi = gameConfig_1.default.shootStartPoi;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var fightPlayerClass = /** @class */ (function (_super) {
    __extends(fightPlayerClass, _super);
    function fightPlayerClass() {
        var _this = _super.call(this) || this;
        // 是否是我的操作回合
        _this.myTrunBool = false;
        _this.uiPlayerHp = null;
        // 玩家真实位置
        // this.realPoi = {};
        // 玩家数据模型
        _this.playerModle = new fightPlayerModle_1.default();
        return _this;
    }
    // 初始化
    fightPlayerClass.prototype.init = function (playerData) {
        this.resetPoi(playerData.realPoi);
        this.playerModle.init(playerData);
    };
    // 爆炸后重新获取一次地图位置
    fightPlayerClass.prototype.resetPoi = function (realPoi) {
        if (realPoi === void 0) { realPoi = null; }
        realPoi || (realPoi = this.getPlayerRealPoi());
        var poi = new cc.Vec2(Math.round(realPoi.x), Math.round(realPoi.y));
        poi = mapMgr.getNextPoint(poi, 0, 0);
        this.node.x = poi.x;
        this.node.y = poi.y;
        this.node["realPoi"] = {};
        this.node["realPoi"].x = poi.x;
        this.node["realPoi"].y = poi.y;
    };
    fightPlayerClass.prototype.getPlayerCardList = function () {
        return this.playerModle.getPlayerCardList();
    };
    // 通过玩家流程顺序 设置初始卡牌能量
    fightPlayerClass.prototype.setCardPower = function (index) {
        this.playerModle.setCardPower(index);
    };
    // 获取当前是否是我的回合
    fightPlayerClass.prototype.getIsMyTrun = function () {
        return this.myTrunBool;
    };
    // 获取玩家真实位置
    fightPlayerClass.prototype.getPlayerRealPoi = function () {
        return this.node["realPoi"];
    };
    // 获取行动能量值
    fightPlayerClass.prototype.getMovePower = function () {
        return this.playerModle.getMovePower();
    };
    // 该玩家的回合开始了
    fightPlayerClass.prototype.startTrun = function () {
        // 是否到我的回合
        this.myTrunBool = true;
        // 对我的数据模型进行还原
        this.playerModle.myTurn();
        // 检测该玩家是否会被跳过
        if (this.playerModle.checkIsSkip()) {
            this.changePrecess();
        }
    };
    // 切换游戏流程
    fightPlayerClass.prototype.changePrecess = function () {
        this.myTrunBool = false;
        emitter.emit(fightEvent.changeProcess);
    };
    // 扣血
    fightPlayerClass.prototype.subHp = function (hp) {
        this.playerModle.subHp(hp);
        this.changeHpUi();
    };
    // 加血
    fightPlayerClass.prototype.addHp = function (hp) {
        this.playerModle.addHp(hp);
        this.changeHpUi();
    };
    // 显示最终的hp增量
    fightPlayerClass.prototype.changeHpUi = function () {
        var range = this.playerModle.getHpRange();
        this.uiPlayerHp.fillRange = range;
    };
    // 获取卡牌能量值
    fightPlayerClass.prototype.getCardPower = function () {
        return this.playerModle.getCardPower();
    };
    // 玩家移动移动方向
    fightPlayerClass.prototype.move = function (direction) {
        // TODO 玩家行动
        if (this.playerModle.checkCanMove()) {
            // 玩家移动
            var newPoi = mapMgr.getNextPoint(this.node["realPoi"], direction, 1);
            var myPoi = this.getPlayerRealPoi();
            var vec = {
                x: newPoi.x - myPoi.x,
                y: newPoi.y - myPoi.y,
            };
            // 设置玩家仰角
            var rotation = this.getPlayerAngle(direction);
            this.playerModle.nowElevation = rotation;
            // if(this.checkCanMoveToAngle(direction,rotation)){
            if (vec.y <= 2) {
                this.node["realPoi"] = newPoi;
            }
            // 扣除能量
            this.playerModle.subMovePower();
        }
        else {
            console.log("没有能量了");
        }
    };
    // 获取玩家当前角度
    fightPlayerClass.prototype.getPlayerElevation = function () {
        return this.playerModle.nowElevation;
    };
    // 仰角检测功能
    fightPlayerClass.prototype.getPlayerAngle = function (direction) {
        var realPoi = this.getPlayerRealPoi();
        var poi1 = mapMgr.getNextPoint(realPoi, -1, 15);
        var poi2 = mapMgr.getNextPoint(realPoi, 1, 15);
        var newPoi = {};
        switch (direction) {
            case 1:
                newPoi.x = poi2.x - poi1.x;
                newPoi.y = poi2.y - poi1.y;
                break;
            case -1:
                newPoi.x = poi1.x - poi2.x;
                newPoi.y = poi1.y - poi2.y;
                break;
        }
        var rotation = fightTool_1.default.getAngleByVector(newPoi.x, newPoi.y);
        return rotation;
    };
    // 
    fightPlayerClass.prototype.checkCanMoveToAngle = function (direction, rotation) {
        switch (direction) {
            case 1:
                if (rotation < 45) {
                    return true;
                }
                else {
                    return false;
                }
                break;
            case -1:
                if (rotation > 135) {
                    return true;
                }
                else {
                    return false;
                }
                break;
        }
        return false;
    };
    // 0 不使用 1使用
    fightPlayerClass.prototype.changePlane = function (typeNum) {
        this.playerModle.changePlane(typeNum);
    };
    // 射击
    fightPlayerClass.prototype.shootMis = function (poi) {
        // TODO 根据自身配置生成炮弹
        var shootData = new ShootData_1.default();
        shootData.shootPoi = poi;
        var shootPoi = shootData.shootPoi;
        var startPoi = new cc.Vec2(this.node["realPoi"].x, this.node["realPoi"].y);
        startPoi.y += shootStartPoi;
        // 通过玩家属性配置当前炮弹类型
        var dataObj = {
            // 炮弹类型
            missileType: missileType.normal,
            // 发射向量
            shootPoi: shootPoi,
            // 发射点
            startPoi: startPoi,
            // 当前威力
            power: this.playerModle.getNowAtkPower(),
            // 当前座位id
            seatId: this.playerModle.seatId,
            // 连发次数
            continuousFire: this.playerModle.continuousFire,
            // 分裂次数
            divisionFire: this.playerModle.divisionFire,
            // TODO 扣血效果还是其它效果
            missileBuffType: missileBuffType.sub,
            // TODO 椭圆值
            ellipseRange: 300
        };
        // 如果使用飞机
        if (this.playerModle.isPlane) {
            dataObj.missileType = missileType.plane;
            dataObj.continuousFire = 1;
            dataObj.divisionFire = 1;
        }
        // 构造数据
        shootData.init(dataObj);
        // 触发导弹发射事件
        emitter.emit(fightEvent.onMissileShoot, shootData);
        // 发射后切换流程
        this.changePrecess();
    };
    // 玩家举枪瞄准角度
    fightPlayerClass.prototype.changeAngle = function (angle) {
    };
    // 使用卡牌 是否成功
    fightPlayerClass.prototype.useCard = function (cardNum) {
        // 卡牌工厂处理该玩家属性 使用成功
        if (this.playerModle.useCard(cardNum)) {
            fightCardFactory_1.default.doMain(this.playerModle, cardNum);
            // 删除该牌并刷新界面
            return true;
        }
        ;
        return false;
        // 显示玩家使用的卡牌
    };
    // 网络帧驱动
    fightPlayerClass.prototype.netFrame = function () {
        // TODO 判断是不是自己的行动回合
        if (this.myTrunBool) {
            emitter.emit(fightEvent.updateCountDown, this.playerModle.getSecond());
            // 判断行动帧是否为0 为0时 玩家操作超时 切换玩家
            if (this.playerModle.checkIsTimeout()) {
                // 切换游戏流程
                this.changePrecess();
            }
            // 行动帧减少
            this.playerModle.goFrame();
        }
        _super.prototype.netFrame.call(this);
    };
    // update
    fightPlayerClass.prototype.netUpdate = function (dt) {
        _super.prototype.netUpdate.call(this, dt);
    };
    __decorate([
        property(cc.Sprite)
    ], fightPlayerClass.prototype, "uiPlayerHp", void 0);
    fightPlayerClass = __decorate([
        ccclass
    ], fightPlayerClass);
    return fightPlayerClass;
}(BaseBodyFight_1.default));
exports.default = fightPlayerClass;

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
        //# sourceMappingURL=fightPlayerClass.js.map
        