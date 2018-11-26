import HkPhysics from "./hkPhysics";
let hkPhysics = HkPhysics.getInstance();
import config from "../common/gameConfig";
/*
author: 黄凯
日期:2018-11-19
*/
const { physicsConfig } = config;

const { ccclass, property } = cc._decorator;

// 简单的刚体
@ccclass
export default class rigidbody extends cc.Component{
	mass:number;
	force:any;
	// realPoi:any;
	lineVelocity:any;
	// 是否启用
	bodyEnable:boolean = true;
	// 监听真实值发生变化
	constructor(){
		super();
		this.mass = 1;
		this.force = {
			x:0,
			y:0
		};
		this.lineVelocity = {
			x:0,
			y:0
		};
	}

	// 设置线性速度
	public setLineVelocity(vector:any){
		this.lineVelocity.x = vector.x;
		this.lineVelocity.y = vector.y;
	}
	// 设置力度
	public setForce(force:any){
		this.force.x = force.x;
		this.force.y = force.y;
	}
	// 增量
	public applyForce(force:any){
		this.force.x += force.x;
	    this.force.y += force.y;
	}
	// 增量
	public applyLineVelocity(vector:any){
		this.lineVelocity.x += vector.x;
	    this.lineVelocity.y += vector.y;
	}

	onEnable(){
		if(hkPhysics){
			hkPhysics.addBody(this);
		}
	}

	onDisable(){
		if(hkPhysics){
			hkPhysics.removeBody(this);
		}
	}

	// 施加重力
	private addGravity(){
		this.force.x = Math.round(this.force.x*1000 + this.mass * (physicsConfig.gravity.x*1000))/1000;
	    this.force.y = Math.round(this.force.y*1000 + this.mass * (physicsConfig.gravity.y*1000))/1000;
	}

	// 立转化成速度
	private addAllForce(){

	    this.lineVelocity.x = Math.round(this.lineVelocity.x*1000 + this.force.x / this.mass*1000)/1000;
	    this.lineVelocity.y = Math.round(this.lineVelocity.y*1000 + this.force.y / this.mass*1000)/1000;
	}

	// 运行计算
	public step(){

		if(!this.bodyEnable){return;}

		this.addGravity();
		this.addAllForce();

	    if(this.node["realPoi"]){
		    this.node["realPoi"].x += Math.round(this.lineVelocity.x / physicsConfig.physicsScale);
		    this.node["realPoi"].y += Math.round(this.lineVelocity.y / physicsConfig.physicsScale);
	    }else{
		    this.node.x += Math.round(this.lineVelocity.x / physicsConfig.physicsScale);
		    this.node.y += Math.round(this.lineVelocity.y / physicsConfig.physicsScale);
	    }
	}
}