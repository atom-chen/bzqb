import Emitter from "../../../framework/modules/Emitter";
import ShootData from "./modles/ShootData";
import fightBaseMissile from "./missile/fightBaseMissile";
import config from "./common/gameConfig";
import boomCollider from "./physics/boomCollider";

/*
author: 黄凯
日期:2018-11-19
*/

let emitter = Emitter.getInstance();

// 预制体关键字对应的索引值
const { missileType ,fightEvent ,netFrame } = config;

// 子弹管理器
export default class fightMissileMgr {
	// minNum:number;
	// 导弹的预制体数组
	prefabObj:cc.Prefab[];
	// 导弹出生的父节点
	fatherNode:cc.Node;
	// 当前活着的导弹们
	nowLiveMissile:any;
	constructor() {
		this.prefabObj = [];
		this.fatherNode = null;
		this.nowLiveMissile = [];
	}

	// 初始化
	init(prefabs:cc.Prefab[], fatherNode:cc.Node) {
		this.prefabObj = prefabs;
		this.fatherNode = fatherNode;
		// 绑定射击事件
		emitter.on(fightEvent.onMissileShoot, this.shoot, this);
		// 绑定死亡事件
		emitter.on(fightEvent.onMissileDead, this.deadMissile, this);

	}


	// 射击方法
	shoot(shootData : ShootData) {
		// let index = this.getPrefabIndex(shootData.missileType);
		// 目前只有一种通常弹 和飞机
		console.log("发射炮弹",shootData);
		
		// 三发
		for(let i = 0 ; i < shootData.continuousFire ; i++){
			// 延迟秒数
			let delar:number = i*(netFrame/2);
			// 分裂
			for(let s = 0 ; s < shootData.divisionFire ; s++){
				let shootPoi:any = null;
				// 连发分裂各自角度
				switch(s){
					case 0:
					shootPoi = shootData.shootPoi;
					break;
					case 1:
					shootPoi = new cc.Vec2(shootData.shootPoi.x,shootData.shootPoi.y).rotateSelf(0.1);
					break;
					case 2:
					shootPoi = new cc.Vec2(shootData.shootPoi.x,shootData.shootPoi.y).rotateSelf(-0.1);
					break;
				}
				// 浮点误差
				shootPoi.x = Math.round(shootPoi.x);
				shootPoi.y = Math.round(shootPoi.y);

				let missileScript = this.getMissile( shootData.missileType );
				if(!missileScript){
					console.error("该炮弹的实例化有问题");
					return;
				}
				this.nowLiveMissile.push(missileScript);
				this.switchDifferenceMissile( missileScript , shootData , shootPoi, delar);
			}
		}
	}


	// 根据不同导弹切换
	switchDifferenceMissile(missileScript:fightBaseMissile,shootData:any,shootPoi:any,delar:number){
		switch (shootData.missileType) {
			case missileType.normal:
				missileScript.init(shootData,this.fatherNode,shootPoi,delar);
				break;
			case missileType.plane:
				missileScript.init(shootData,this.fatherNode,shootPoi,delar);
				break;
			default:
				break;
		}
	}


	// 获取导弹实例化脚本
	getMissile(missileType):fightBaseMissile{
		console.log("this.prefabObj[missileType]",missileType,this.prefabObj[missileType])
		let node:cc.Node = cc.instantiate(this.prefabObj[missileType]);
		let script:fightBaseMissile = node.getComponent(fightBaseMissile);
		return script;
	}


	// 获取所有活着的导弹
	getAllLiveMissile(){
		return this.nowLiveMissile;
	}


	// 导弹碰撞后的效果
	deadMissile(missile:fightBaseMissile,isBoomType:boolean,isPlane:boolean = false) {
		let index = this.nowLiveMissile.indexOf(missile);

		// TODO 删除子弹 播放特效
		// TODO 暂时没有做对象池
		console.log("missile.getRealPoi()",missile.getRealPoi())

		// 如果碰撞的位置能够爆炸 形成爆炸效果 挖出弹坑
		if(isBoomType){
	        emitter.emit(fightEvent.colliderSettle,{
	        	// 爆炸范围
	        	ellipseRange:missile.ellipseRange,
	        	// 导弹类型 加血还是扣血
	        	missileBuffType:missile.missileBuffType,
	        	// 威力
	        	power:missile.power,
	        	// 爆炸的点位
	        	realPoi:missile.getRealPoi(),
	        	// 是否是飞机
	        	isPlane:isPlane,
	        	// 导弹所属玩家
	        	seatId:missile.seatId
	        });
	    // 如果使用飞机的话
		}else if(isPlane){
			emitter.emit(fightEvent.colliderSettle,{
	        	// 爆炸的点位
	        	realPoi:missile.getRealPoi(),
	        	// 是否是飞机
	        	isPlane:isPlane,
	        	// 导弹所属玩家
	        	seatId:missile.seatId
	        });
		}
		if(index !== -1){
			this.nowLiveMissile.splice(index,1);
		}
		missile.node.destroy();
	}

	// 池子里的子弹用完了
	spown(hasTeturn) {
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
	}

}