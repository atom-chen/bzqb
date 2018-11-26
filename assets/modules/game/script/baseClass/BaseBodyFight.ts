import Emitter from "../../../../framework/modules/Emitter";
import config from "../common/gameConfig";
let wmCollisionManager = require("hkCollisionManager");

const { fightEvent } = config;

const { ccclass, property } = cc._decorator;
/*
author: 黄凯
日期:2018-11-19
*/

@ccclass
export default class BaseBodyFight extends cc.Component {

    // constructor() {
    	// super()
    // }
    // realPoi:any;
    onEnable():void{
    	Emitter.getInstance().on(fightEvent.netFrame,this.netFrame,this);
    	Emitter.getInstance().on(fightEvent.netUpdate,this.netUpdate,this);
    	let collider = this.getComponent(cc.Collider);
    	if(collider){
        	wmCollisionManager.addCollider(collider);
    	}
    }
    // 网络帧数驱动
    netFrame(){
    	
    }
    // TODO 插值算法
    netUpdate(dt){
    	if(this.node["realPoi"]){
    		this.node.position = this.node["realPoi"];
    	}
    }
    onDisable():void{
    	Emitter.getInstance().off(fightEvent.netFrame,this);
    	Emitter.getInstance().off(fightEvent.netUpdate,this);
    	let collider = this.getComponent(cc.Collider);
    	if(collider){
        	wmCollisionManager.removeCollider(collider);
    	}
    }
}