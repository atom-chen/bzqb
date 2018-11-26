(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/fightMissileMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43825Lux8VPlqaOlTlop1vQ', 'fightMissileMgr', __filename);
// modules/game/script/fightMissileMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../framework/modules/Emitter");
var fightBaseMissile_1 = require("./missile/fightBaseMissile");
var gameConfig_1 = require("./common/gameConfig");
/*
author: 黄凯
日期:2018-11-19
*/
var emitter = Emitter_1.default.getInstance();
// 预制体关键字对应的索引值
var missileType = gameConfig_1.default.missileType, fightEvent = gameConfig_1.default.fightEvent, netFrame = gameConfig_1.default.netFrame;
// 子弹管理器
var fightMissileMgr = /** @class */ (function () {
    function fightMissileMgr() {
        this.prefabObj = [];
        this.fatherNode = null;
        this.nowLiveMissile = [];
    }
    // 初始化
    fightMissileMgr.prototype.init = function (prefabs, fatherNode) {
        this.prefabObj = prefabs;
        this.fatherNode = fatherNode;
        // 绑定射击事件
        emitter.on(fightEvent.onMissileShoot, this.shoot, this);
        // 绑定死亡事件
        emitter.on(fightEvent.onMissileDead, this.deadMissile, this);
    };
    // 射击方法
    fightMissileMgr.prototype.shoot = function (shootData) {
        // let index = this.getPrefabIndex(shootData.missileType);
        // 目前只有一种通常弹 和飞机
        console.log("发射炮弹", shootData);
        // 三发
        for (var i = 0; i < shootData.continuousFire; i++) {
            // 延迟秒数
            var delar = i * (netFrame / 2);
            // 分裂
            for (var s = 0; s < shootData.divisionFire; s++) {
                var shootPoi = null;
                // 连发分裂各自角度
                switch (s) {
                    case 0:
                        shootPoi = shootData.shootPoi;
                        break;
                    case 1:
                        shootPoi = new cc.Vec2(shootData.shootPoi.x, shootData.shootPoi.y).rotateSelf(0.1);
                        break;
                    case 2:
                        shootPoi = new cc.Vec2(shootData.shootPoi.x, shootData.shootPoi.y).rotateSelf(-0.1);
                        break;
                }
                // 浮点误差
                shootPoi.x = Math.round(shootPoi.x);
                shootPoi.y = Math.round(shootPoi.y);
                var missileScript = this.getMissile(shootData.missileType);
                if (!missileScript) {
                    console.error("该炮弹的实例化有问题");
                    return;
                }
                this.nowLiveMissile.push(missileScript);
                this.switchDifferenceMissile(missileScript, shootData, shootPoi, delar);
            }
        }
    };
    // 根据不同导弹切换
    fightMissileMgr.prototype.switchDifferenceMissile = function (missileScript, shootData, shootPoi, delar) {
        switch (shootData.missileType) {
            case missileType.normal:
                missileScript.init(shootData, this.fatherNode, shootPoi, delar);
                break;
            case missileType.plane:
                missileScript.init(shootData, this.fatherNode, shootPoi, delar);
                break;
            default:
                break;
        }
    };
    // 获取导弹实例化脚本
    fightMissileMgr.prototype.getMissile = function (missileType) {
        console.log("this.prefabObj[missileType]", missileType, this.prefabObj[missileType]);
        var node = cc.instantiate(this.prefabObj[missileType]);
        var script = node.getComponent(fightBaseMissile_1.default);
        return script;
    };
    // 获取所有活着的导弹
    fightMissileMgr.prototype.getAllLiveMissile = function () {
        return this.nowLiveMissile;
    };
    // 导弹碰撞后的效果
    fightMissileMgr.prototype.deadMissile = function (missile, isBoomType, isPlane) {
        if (isPlane === void 0) { isPlane = false; }
        var index = this.nowLiveMissile.indexOf(missile);
        if (index !== -1) {
            this.nowLiveMissile.splice(index, 1);
        }
        // TODO 删除子弹 播放特效
        // TODO 暂时没有做对象池
        missile.node.destroy();
        // 如果碰撞的位置能够爆炸 形成爆炸效果 挖出弹坑
        if (isBoomType) {
            emitter.emit(fightEvent.colliderSettle, {
                // 爆炸范围
                ellipseRange: missile.ellipseRange,
                // 导弹类型 加血还是扣血
                missileBuffType: missile.missileBuffType,
                // 威力
                power: missile.power,
                // 爆炸的点位
                realPoi: missile.getRealPoi(),
                // 是否是飞机
                isPlane: isPlane,
                // 导弹所属玩家
                seatId: missile.seatId
            });
            // 如果使用飞机的话
        }
        else if (isPlane) {
            emitter.emit(fightEvent.colliderSettle, {
                // 爆炸的点位
                realPoi: missile.getRealPoi(),
                // 是否是飞机
                isPlane: isPlane,
                // 导弹所属玩家
                seatId: missile.seatId
            });
        }
    };
    // 池子里的子弹用完了
    fightMissileMgr.prototype.spown = function (hasTeturn) {
        // let node = cc.instantiate(this.prefabObj);
        // let missileScript = node.getComponent(cc.baseNet);
        // missileScript.setBase(
        // 	this.fatherNode,
        // 	this.dead.bind(this),
        // 	this.emitter);
        // if (hasTeturn) {
        // 	return node;
        // } else {
        // 	this.missilepool.put(node);
        // }
        // return null;
    };
    return fightMissileMgr;
}());
exports.default = fightMissileMgr;

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
        //# sourceMappingURL=fightMissileMgr.js.map
        