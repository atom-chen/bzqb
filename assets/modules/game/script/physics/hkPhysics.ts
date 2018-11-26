// 简单的物理实现
import HkRigidBody from "./hkRigidBody";
import config from "../common/gameConfig";
/*
author: 黄凯
日期:2018-11-19
*/
const { physicsConfig } = config;

export default class hkPhysics{
    private static _instance: hkPhysics = new hkPhysics();
    public static getInstance(): hkPhysics {
        return hkPhysics._instance;
    }
	bodies:any;
	gravity:any;
	enabled:boolean;
	
	constructor(){
		this.bodies = [];
		this.gravity = physicsConfig.gravity;
		this.enabled = false;
	}
	// 获取模拟效果
	static getBodyGuideLine(poi , force){
    	var newVec = [];
    	var body = {
	        force: {
	            x: 0,
	            y: 0
	        },
	        lineVelocity: {
	            x: force.x,
	            y: force.y
	        },
	        position: {
	            x: poi.x,
	            y: poi.y
	        },
	        mass: 1,
	    };
		for (var i = 0; i < 30; i++) {
	        hkPhysics.doBodyMonitor(body);
			if(i%3 == 0){
		        newVec.push({
		            x: body.position.x,
		            y: body.position.y
		        });
	        }
	    }
	    return newVec;
	}

	static doBodyMonitor(body){
		
		body.force.x += body.mass * physicsConfig.gravity.x;
	    body.force.y += body.mass * physicsConfig.gravity.y;

	    body.lineVelocity.x += body.force.x / body.mass;
	    body.lineVelocity.y += body.force.y / body.mass;

	    body.position.x += Math.round(body.lineVelocity.x / physicsConfig.physicsScale);
	    body.position.y += Math.round(body.lineVelocity.y / physicsConfig.physicsScale);
	}
	// 添加刚体
	addBody(body:HkRigidBody){
		this.bodies.push(body);
	}
	// 删除刚体
	removeBody(body:HkRigidBody){
		let index = this.bodies.indexOf(body);
		if(index !== -1){
			this.bodies.splice(index,1);
		}
	}
	netFrame(){
		if(!this.enabled){ return; }
		let count = this.bodies.length;
		// 遍历所有的body
		for(var i = count-1 ; i >= 0 ;i--){
			let body = this.bodies[i];
			body.step();
		}
	}
}

