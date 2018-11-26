import Emitter from "../../../../framework/modules/Emitter";
let emitter = Emitter.getInstance();
import config from "../common/gameConfig";

const { fightEvent } = config;

const {ccclass, property} = cc._decorator;

/*
author: 黄凯
日期:2018-11-19
*/
    
// TODO 初始化包围盒
// TODO 滑动屏幕

@ccclass
export default class fightCameraMgr extends cc.Component {

    // 当前趋近的点
    nowLerpPoi:cc.Vec2;
    nowZoomRatio:number;
    cameraNode:cc.Camera;

    cameraAABB:any;

    setNowAABB(ratio:number){
        // 设置包围盒限制 TODO
        let size = {
            x:2340/2,
            y:1080/2
        };
        let winSize = {
            x:(cc.winSize.width/2+20)/ratio,
            y:(cc.winSize.height/2+20)/ratio
        };

        this.cameraAABB = {
            top:size.y-winSize.y,
            bottom:-size.y+winSize.y,
            left:-size.x+winSize.x,
            right:size.x-winSize.x
        };
        // console.log("this.cameraAABB",this.cameraAABB)

    }

    onLoad () {
    	this.nowLerpPoi = new cc.Vec2(this.node.x,this.node.y); 
    	this.cameraNode = this.getComponent(cc.Camera);
    	this.nowZoomRatio = 1;
    	// 绑定相机趋近事件
    	emitter.on(fightEvent.setNowLerpPoi,this.setNowLerpPoi,this);
    	emitter.on(fightEvent.setZoomRatio,this.setZoomRatio,this);
        this.setNowAABB(1);
    }

    // 设置现行插值
    setNowLerpPoi(poi:cc.Vec2){
        this.nowLerpPoi = new cc.Vec2(poi.x,poi.y);
        if(this.nowLerpPoi.y > this.cameraAABB.top){
            this.nowLerpPoi.y = this.cameraAABB.top;
        }else if(this.nowLerpPoi.y < this.cameraAABB.bottom){
            this.nowLerpPoi.y = this.cameraAABB.bottom;
        }
        if(this.nowLerpPoi.x > this.cameraAABB.right){
            this.nowLerpPoi.x = this.cameraAABB.right;
        }else if(this.nowLerpPoi.x < this.cameraAABB.left){
            this.nowLerpPoi.x = this.cameraAABB.left;
        }
    }

    // 设置焦距
    setZoomRatio(num:number):void{
        num < 0.8 && (num = 0.8);
    	this.nowZoomRatio = num;
        this.setNowAABB(num);
    }

    // 相机的渐进
    update (dt) {
    	if(this.nowLerpPoi){
    		this.node.position = this.node.position.lerp(this.nowLerpPoi , 0.05);
    	}
    	if(Math.abs(this.cameraNode.zoomRatio - this.nowZoomRatio)>0.02){
    		this.cameraNode.zoomRatio += (this.nowZoomRatio-this.cameraNode.zoomRatio)*0.02;
    	}
    }
    

    onDestroy(){
    	emitter.off(fightEvent.setNowLerpPoi,this);
    	emitter.off(fightEvent.setZoomRatio,this);
    }
}
