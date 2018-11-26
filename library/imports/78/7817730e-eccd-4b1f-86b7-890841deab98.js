"use strict";
cc._RF.push(module, '78177MO7M1LH4a3iQhB3quY', 'fightPlayerShootCtrl');
// modules/game/script/UI/fightPlayerShootCtrl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../../../../framework/modules/Emitter");
var PlayerCtrlData_1 = require("../modles/PlayerCtrlData");
var gameConfig_1 = require("../common/gameConfig");
var hkPhysics_1 = require("../physics/hkPhysics");
var playerCtrlData = PlayerCtrlData_1.default.getInstance();
var emitter = Emitter_1.default.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
var fightEvent = gameConfig_1.default.fightEvent;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var fightPlayerShootCtrl = /** @class */ (function (_super) {
    __extends(fightPlayerShootCtrl, _super);
    function fightPlayerShootCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.movePowerBg = null;
        _this.movePower = null;
        _this.circleNode = null;
        // 是否能操作我的玩家
        _this.canCtrlMyPlayer = false;
        // 最小操作距离
        _this.minDistance = 80;
        return _this;
        // realPoi:any;
        // startPoint:any;
        //    endPoint:any;
        // // 仰角限制
        //    onLoad () {
        //    	this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        //    	this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        //    	this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        //    	this.startPoint = null;
        //    	this.endPoint = null;
        //    }
        //    // TODO 世界坐标等转换情况
        //    move(poi:any){
        //    	this.realPoi.x = poi.x;
        //    	this.realPoi.y = poi.y;
        //    	this.node.x = poi.x;
        //    	this.node.y = poi.y;
        //    }
        //    touchStart(event) {
        //        this.startPoint = event.getLocation();
        //    }
        //    touchMove(event) {
        //        this.endPoint = event.getLocation();
        //        let newPoi = {
        //        	x:this.endPoint.x - this.startPoint.x,
        //        	y:this.endPoint.y - this.startPoint.y,
        //        }
        //        let radian = Math.atan2(newPoi.y, newPoi.x);
        //        let rotation = -radian * 180 / Math.PI;
        //        playerCtrlData.elevation = rotation;
        //    	console.log("rotation++++",rotation);
        //    }
        //    touchEnd() {
        //    	let fuck = {
        //    		x:0,
        //    		y:0
        //    	};
        //    	let disTance = this.distance(this.startPoint, this.endPoint);
        // 	console.log("disTance+++",disTance);
        //    	if(disTance < 50){
        //    		// 取消
        //    		console.log("取消");
        //    		return ;
        //    	}
        //        fuck.x = Math.round(this.startPoint.x - this.endPoint.x);
        //        fuck.y = Math.round(this.startPoint.y - this.endPoint.y);
        //        console.log("fuck", fuck.x, fuck.y);
        //        this.startPoint = null;
        //        this.endPoint = null;
        //    }
        //    distance(poi1 , poi2){
        //    	return Math.abs(Math.sqrt(Math.pow(poi2.x - poi1.x,2) + Math.pow(poi2.y - poi1.y,2)));
        //    }
    }
    fightPlayerShootCtrl.prototype.onLoad = function () {
        // 圆形区域
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        // 绑定我的ui情况
        emitter.on(fightEvent.taggerMyCtrlUi, this.taggerMyCtrlUi, this);
        // emitter.on(fightEvent.moveMyCtrlUi,this.moveCtrlPoi,this);
        emitter.on(fightEvent.updateMoveRange, this.updateMoveRange, this);
        this.guideLine = this.node.addComponent(cc.Graphics);
    };
    fightPlayerShootCtrl.prototype.taggerMyCtrlUi = function (tagger) {
        switch (tagger) {
            case "show":
                this.movePowerBg.active = true;
                this.circleNode.active = true;
                this.canCtrlMyPlayer = true;
                break;
            case "hide":
                this.movePowerBg.active = false;
                this.circleNode.active = false;
                this.guideLine.clear();
                this.canCtrlMyPlayer = false;
                emitter.emit(fightEvent.setZoomRatio, 1);
                break;
        }
    };
    // 移动位置
    fightPlayerShootCtrl.prototype.moveCtrlPoi = function (poi) {
        this.playerRealPoi = poi;
        // console.log("this.playerRealPoi1",poi)
        // this.playerRealPoi = this.getFatherPoi(poi);
        // console.log("this.playerRealPoi",this.playerRealPoi)
        this.moveCircle(this.playerRealPoi);
        this.movePowerRang(this.playerRealPoi);
    };
    // 修改移动能量
    fightPlayerShootCtrl.prototype.updateMoveRange = function (num) {
        this.movePower.fillRange = num;
    };
    // 移动能量条
    fightPlayerShootCtrl.prototype.movePowerRang = function (poi) {
        this.movePowerBg.x = poi.x;
        this.movePowerBg.y = poi.y;
    };
    // 更新玩家位置
    fightPlayerShootCtrl.prototype.moveCircle = function (poi) {
        this.circleNode.x = poi.x;
        this.circleNode.y = poi.y;
    };
    fightPlayerShootCtrl.prototype.touchStart = function (event) {
        if (!this.canCtrlMyPlayer) {
            return;
        }
        this.playerRealPoi = this.node.position;
        this.startPoint = event.getLocation();
        this.endPoint = this.startPoint;
        this.isTouchCricle = true;
    };
    fightPlayerShootCtrl.prototype.touchMove = function (event) {
        if (!this.canCtrlMyPlayer) {
            return;
        }
        this.endPoint = event.getLocation();
        var newPoi = this.getOffsetPoi();
        var radian = Math.atan2(newPoi.y, newPoi.x);
        var rotation = -radian * 180 / Math.PI;
        playerCtrlData.elevation = rotation;
        var disTance = this.distance(this.startPoint, this.endPoint);
        if (disTance > this.minDistance) {
            this.showGuideLine(this.playerRealPoi, newPoi);
        }
        else {
            this.guideLine.clear();
        }
        this.changeRatio(disTance);
    };
    // 相机焦距
    fightPlayerShootCtrl.prototype.changeRatio = function (disTance) {
        var ratio;
        if (disTance > 100) {
            ratio = 1 - (disTance - 100) / 800;
        }
        else {
            ratio = 1;
        }
        emitter.emit(fightEvent.setZoomRatio, ratio);
        emitter.emit(fightEvent.setNowLerpPoi, this.node.parent.position);
    };
    fightPlayerShootCtrl.prototype.touchEnd = function () {
        if (!this.canCtrlMyPlayer) {
            return;
        }
        if (!this.isTouchCricle) {
            return;
        }
        this.isTouchCricle = false;
        var fuck = this.getOffsetPoi();
        var disTance = this.distance(this.startPoint, this.endPoint);
        // 距离过小取消操作
        if (disTance < this.minDistance) {
            // 取消
            this.guideLine.clear();
            console.log("取消");
            return;
        }
        // console.log("fuck", fuck.x, fuck.y);
        playerCtrlData.setShootPoi(fuck);
        this.startPoint = null;
        this.endPoint = null;
    };
    // 获取偏移位置
    fightPlayerShootCtrl.prototype.getOffsetPoi = function () {
        return {
            x: Math.round(this.startPoint.x - this.endPoint.x) * 2,
            y: Math.round(this.startPoint.y - this.endPoint.y) * 2,
        };
    };
    // 距离
    fightPlayerShootCtrl.prototype.distance = function (poi1, poi2) {
        return Math.abs(Math.sqrt(Math.pow(poi2.x - poi1.x, 2) + Math.pow(poi2.y - poi1.y, 2)));
    };
    // 获取并绘制辅助线
    fightPlayerShootCtrl.prototype.showGuideLine = function (poi, force) {
        var points = hkPhysics_1.default.getBodyGuideLine(poi, force);
        this.guideLine.clear();
        this.guideLine.lineWidth = 0;
        for (var i = points.length - 1; i >= 0; i--) {
            this.guideLine.circle(points[i].x, points[i].y, 9 - i / 2);
            this.guideLine.fillColor = cc.color(30, 30, 30, 100);
            this.guideLine.fill();
            this.guideLine.circle(points[i].x, points[i].y, 7 - i / 2);
            this.guideLine.fillColor.fromHEX('#ffffff');
            this.guideLine.fill();
        }
    };
    fightPlayerShootCtrl.prototype.onDestroy = function () {
        this.circleNode.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.circleNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    };
    __decorate([
        property(cc.Node)
    ], fightPlayerShootCtrl.prototype, "movePowerBg", void 0);
    __decorate([
        property(cc.Sprite)
    ], fightPlayerShootCtrl.prototype, "movePower", void 0);
    __decorate([
        property(cc.Node)
    ], fightPlayerShootCtrl.prototype, "circleNode", void 0);
    fightPlayerShootCtrl = __decorate([
        ccclass
    ], fightPlayerShootCtrl);
    return fightPlayerShootCtrl;
}(cc.Component));
exports.default = fightPlayerShootCtrl;

cc._RF.pop();