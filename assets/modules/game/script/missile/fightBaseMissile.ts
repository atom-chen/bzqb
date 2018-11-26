import Emitter from "../../../../framework/modules/Emitter";
import ShootData from "../modles/ShootData";
import config from "../common/gameConfig";
import hkRigidBody from "../physics/hkRigidBody";
let wmCollisionManager = require("hkCollisionManager");

let emitter = Emitter.getInstance();

const { fightEvent,colliderConfig,netFrame } = config;
const { ccclass, property } = cc._decorator;
const hz = 1000/netFrame;
/*
author: 黄凯
日期:2018-11-19
*/
// 基础导弹
@ccclass
export default class fightBaseMissile extends cc.Component {
    // 是否绑定相机
    isBindCarame:boolean;
    // 伤害
    power:number;
    // 座位id
    seatId:string;
    // 帧数记录器
    frameCount:number;
    // 爆炸后的椭圆范围
    ellipseRange:number;

    missileBuffType:number;
    // 延迟时间
    delay:number = 0;
    // 父节点
    fatherNode:cc.Node;
    // 发射力
    shootPoi:any;
    // 刚体
    rigidBody:hkRigidBody;
    // 显示
    onEnable():void{
    	emitter.on(fightEvent.netFrame,this.netFrame,this);
    	emitter.on(fightEvent.netUpdate,this.netUpdate,this);
        let collider = this.getComponent(cc.Collider);
        if(collider){
            wmCollisionManager.addCollider(collider);
        }
    }
    // 隐藏
    onDisable():void{
        this.remove();
    }
    onDestroy(){
        this.remove();
    }
    remove(){
        emitter.off(fightEvent.netFrame,this);
        emitter.off(fightEvent.netUpdate,this);
        let collider = this.getComponent(cc.Collider);
        if(collider){
            wmCollisionManager.removeCollider(collider);
        }
        // console.log("onDisable")
    }

    // 设置真实坐标点
    public setRealPoi(poi:any){
        poi.x = Math.round(poi.x);
        poi.y = Math.round(poi.y);
        this.node["realPoi"].x = poi.x;
        this.node["realPoi"].y = poi.y;
        this.node.x = poi.x;
        this.node.y = poi.y;
        this.oldX = poi.x;
        this.oldY = poi.y;
    }

    // 获取真实坐标点
    public getRealPoi():any{
        return new cc.Vec2(this.node["realPoi"].x,this.node["realPoi"].y);
    }

    // 初始化
    // 导弹数据  父节点 通过是否延迟绑定相机 
    init(shootData:ShootData,fatherNode:cc.Node,shootPoi:any,delay:number = 0){
        this.frameCount = 0;
        this.rigidBody = this.getComponent(hkRigidBody);
        this.node["realPoi"] = {};
        this.setRealPoi(shootData.startPoi);
		this.power = shootData.power;
		this.seatId = shootData.seatId;
        this.node.parent = fatherNode;
        this.ellipseRange = shootData.ellipseRange;
        this.missileBuffType = shootData.missileBuffType;

        // 如果不是延迟炮弹 立即发射
        if(delay === 0){
            this.rigidBody.setLineVelocity(shootPoi);
            this.isBindCarame = true;
        }else{
            // 延迟炮弹
            this.node.opacity = 0;
            this.delay = delay;
            this.shootPoi = shootPoi;
            this.fatherNode = fatherNode;
            this.rigidBody.bodyEnable = false;
        }

    }

    // 和地图碰撞时
    public onMapCollider(){

    }

    // 炮弹死亡 是否是爆炸了
    dead(isBoomType:boolean,isPlane:boolean = false){
        // console.log("isPlane+++++",isPlane)
        emitter.emit(fightEvent.onMissileDead,this,isBoomType,isPlane);

    }


    // 飞出场景 碰撞回调
    wmCollisionExit(otherCollider:cc.Collider,collider:cc.Collider){
        // console.log("otherCollider.tag:",otherCollider.node.name,"collider:",collider.node.name);
        switch(otherCollider.tag){
            case colliderConfig.bgBound:
            // TODO 删除导弹
            this.dead(false,false);
            
            break;
        }
    }

    nowFrameTime:number;
    oldX:number;
    oldY:number;
    // 网络帧数驱动
    netFrame():void{

        // 如果绑定相机
        if(this.isBindCarame){
            emitter.emit(fightEvent.setNowLerpPoi,this.getRealPoi());
        }

        // 如果有延迟
        if(this.delay){
            this.delay --;
            if(this.delay === 0){
                this.delayMissile();
            }
        }else{
            this.doLerp();
            this.frameCount ++;
        }


    }

    doLerp(){
        // 插值
        let realPoi = this.getRealPoi();
        if (realPoi) {
            this.nowFrameTime = +new Date();
            this.oldX = realPoi.x;
            this.oldY = realPoi.y;
        }
    }

    // 延迟导弹的发射
    delayMissile(){
        this.node.opacity = 255;
        this.rigidBody.bodyEnable = true;
        this.rigidBody.setLineVelocity(this.shootPoi);
    }


    // TODO 导弹插值运算
    netUpdate(dt):void{
        let realPoi = this.getRealPoi();
        // return;
        if (realPoi) {
            if(this.nowFrameTime){
                let sd = ((+new Date())-this.nowFrameTime)/hz;
                sd>1 && (sd = 1);
                this.node.x = (realPoi.x - this.oldX) * sd+this.oldX;
                this.node.y = (realPoi.y - this.oldY) * sd+this.oldY;
            }
        }
    }
}

