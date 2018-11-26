import Emitter from "../../../../framework/modules/Emitter";
import fightBaseMissile from "./fightBaseMissile";
import ShootData from "../modles/ShootData";
import hkRigidBody from "../physics/hkRigidBody";
import config from "../common/gameConfig";

const { ccclass, property } = cc._decorator;
let emitter = Emitter.getInstance();
const { fightEvent } = config;
/*
author: 黄凯
日期:2018-11-19
*/

// 基础导弹
@ccclass
export default class fightNormalMis extends fightBaseMissile {
	// 初始化 炮弹
    init(shootData:ShootData,fatherNode:cc.Node,shootPoi:any,delay:number = 0){
		
		super.init(shootData,fatherNode,shootPoi,delay);
	}

	// 和地图碰撞时
	public onMapCollider(){
        this.dead(true,false);
	}

	// 碰撞回调
	wmCollisionEnter(otherCollider:cc.Collider,collider:cc.Collider){
		// 防止打到自己
		if(this.frameCount < 3){
			return;
		}
        this.dead(true,false);
	}

	// 网络帧
	netFrame(){
		super.netFrame();
	}
}