import Emitter from "../../../../framework/modules/Emitter";
import PlayerCtrlData from "../modles/PlayerCtrlData";
import config from "../common/gameConfig";
import HkPhysics from "../physics/hkPhysics";

let playerCtrlData = PlayerCtrlData.getInstance();
let emitter = Emitter.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
const { fightEvent } = config;

const {ccclass, property} = cc._decorator;

@ccclass
export default class fightPlayerShootCtrl extends cc.Component {

	@property(cc.Node)
    movePowerBg : cc.Node = null;

    @property(cc.Sprite)
    movePower : cc.Sprite = null;

    @property(cc.Node)
    circleNode : cc.Node = null;

    // 是否能操作我的玩家
    canCtrlMyPlayer:boolean = false;
    // 绘图组件
    guideLine:cc.Graphics;

    onLoad(){
    	// 圆形区域
    	this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
    	this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
    	this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);

    	// 绑定我的ui情况
    	emitter.on(fightEvent.taggerMyCtrlUi,this.taggerMyCtrlUi,this);
    	// emitter.on(fightEvent.moveMyCtrlUi,this.moveCtrlPoi,this);
    	emitter.on(fightEvent.updateMoveRange,this.updateMoveRange,this);

        this.guideLine = this.node.addComponent(cc.Graphics);
    }


    public taggerMyCtrlUi(tagger:string):void{
    	switch(tagger){
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
            emitter.emit(fightEvent.setZoomRatio,1);
    		break;
    	}
    }

    // 移动位置
    public moveCtrlPoi(poi:any):void{
    	this.playerRealPoi = poi;
    	// console.log("this.playerRealPoi1",poi)
    	// this.playerRealPoi = this.getFatherPoi(poi);
    	// console.log("this.playerRealPoi",this.playerRealPoi)
    	this.moveCircle(this.playerRealPoi);
    	this.movePowerRang(this.playerRealPoi);
    }

    // 修改移动能量
    public updateMoveRange(num:number):void{
    	this.movePower.fillRange = num;
    }

    // 移动能量条
    public movePowerRang(poi:any):void{
    	this.movePowerBg.x = poi.x;
    	this.movePowerBg.y = poi.y;
    }


    // 是否点击了操作圆
    isTouchCricle:boolean;
    // 开始位置
	startPoint:any;
	// 结束点
    endPoint:any;
    // 玩家当前的真实位置
    playerRealPoi:any;
    // 最小操作距离
    minDistance:number = 80;

    // 更新玩家位置
    moveCircle(poi:any){
    	this.circleNode.x = poi.x;
    	this.circleNode.y = poi.y;
    }

    touchStart(event) {
        if(!this.canCtrlMyPlayer){return;}
    	this.playerRealPoi = this.node.position;
        this.startPoint = event.getLocation();
        this.endPoint = this.startPoint;
        this.isTouchCricle = true;
    }

    touchMove(event) {
        if(!this.canCtrlMyPlayer){return;}
        this.endPoint = event.getLocation();
        let newPoi = this.getOffsetPoi();
        let radian = Math.atan2(newPoi.y, newPoi.x);
        let rotation = -radian * 180 / Math.PI;
        playerCtrlData.elevation = rotation;


    	let disTance = this.distance(this.startPoint, this.endPoint);
        if(disTance > this.minDistance){
            this.showGuideLine(this.playerRealPoi , newPoi);
        }else{
            this.guideLine.clear();
        }
        this.changeRatio(disTance);

    }

    // 相机焦距
    changeRatio(disTance){
    	let ratio;
    	if(disTance > 100){
    		ratio = 1 - (disTance - 100)/800;
    	}else{
    		ratio = 1;
    	}
        emitter.emit(fightEvent.setZoomRatio,ratio);
    	emitter.emit(fightEvent.setNowLerpPoi,this.node.parent.position);
    }

    touchEnd() {
        if(!this.canCtrlMyPlayer){return;}
    	if(!this.isTouchCricle){ return; }
        this.isTouchCricle = false;
    	let fuck = this.getOffsetPoi();
    	let disTance = this.distance(this.startPoint, this.endPoint);
		// 距离过小取消操作
    	if(disTance < this.minDistance){
    		// 取消
        	this.guideLine.clear();
    		console.log("取消");
    		return ;
    	}
        // console.log("fuck", fuck.x, fuck.y);
        playerCtrlData.setShootPoi(fuck);

        this.startPoint = null;
        this.endPoint = null;
    }

    // 获取偏移位置
    getOffsetPoi(){
    	return {
        	x:Math.round(this.startPoint.x - this.endPoint.x)*2,
        	y:Math.round(this.startPoint.y - this.endPoint.y)*2,
        };
    }

    // 距离
    distance(poi1 , poi2){
    	return Math.abs(Math.sqrt(Math.pow(poi2.x - poi1.x,2) + Math.pow(poi2.y - poi1.y,2)));
    }

    // 获取并绘制辅助线
    showGuideLine(poi , force){
        var points = HkPhysics.getBodyGuideLine(poi,force);
        this.guideLine.clear();
        this.guideLine.lineWidth = 0;
        for(var i = points.length-1 ; i >= 0 ; i--){
            this.guideLine.circle(points[i].x,points[i].y, 9-i/2);
            this.guideLine.fillColor = cc.color(30,30,30,100);
            this.guideLine.fill();
            this.guideLine.circle(points[i].x,points[i].y, 7-i/2);
            this.guideLine.fillColor.fromHEX('#ffffff');
            this.guideLine.fill();
        }
    }

    onDestroy(){
    	this.circleNode.off(cc.Node.EventType.TOUCH_START,this.touchStart,this);
    	this.circleNode.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
    	this.node.off(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
    }


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
