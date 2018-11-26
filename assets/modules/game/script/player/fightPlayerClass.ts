import Emitter from "../../../../framework/modules/Emitter";
import BaseBodyFight from "../baseClass/BaseBodyFight";
import effectBuffMgr from "../effectBuff/effectBuffMgr";
import PlayerData from "../modles/PlayerData";
import ShootData from "../modles/ShootData";
import fightPlayerModle from "./fightPlayerModle";
import fightTool from "../common/fightTool";

import fightCardFactory from "../cardFactory/fightCardFactory";

// 地图管理器
import MapMgr from "../sceneMgr/mapMgr";
// 地图管理器
let mapMgr:MapMgr = MapMgr.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
let emitter = Emitter.getInstance();

import config from "../common/gameConfig";

const { 
	netFrame , 
	fightEvent , 
	missileType , 
	waitTime , 
	playerConfig ,
	missileBuffType , 
	shootStartPoi 
} = config;


const { ccclass, property } = cc._decorator;

@ccclass
export default class fightPlayerClass extends BaseBodyFight{
	// 玩家数据模型
	playerModle:fightPlayerModle;
	// 是否是我的操作回合
	private myTrunBool:boolean = false;

	@property(cc.Sprite)
	uiPlayerHp:cc.Sprite = null;

	constructor(){
		super();
		// 玩家真实位置
		// this.realPoi = {};
		// 玩家数据模型
		this.playerModle = new fightPlayerModle();
	}

	// 初始化
	init(playerData:PlayerData):void{
		this.resetPoi(playerData.realPoi);
		this.playerModle.init(playerData);
	}

	// 爆炸后重新获取一次地图位置
	public resetPoi(realPoi:any = null){
		realPoi || (realPoi = this.getPlayerRealPoi())
		let poi = new cc.Vec2(
			Math.round(realPoi.x),
			Math.round(realPoi.y)
		);
		poi = mapMgr.getNextPoint(poi,0,0);
		this.node.x = poi.x;
		this.node.y = poi.y;
		this.node["realPoi"] = {};
		this.node["realPoi"].x = poi.x;
		this.node["realPoi"].y = poi.y;
		let rotation = this.getPlayerAngle(1);
		this.playerModle.nowElevation = rotation;

	}

	public getPlayerCardList():any{
		return this.playerModle.getPlayerCardList();
	}

	// 通过玩家流程顺序 设置初始卡牌能量
	public setCardPower(index:number):void{
		this.playerModle.setCardPower(index);
	}

	// 获取当前是否是我的回合
	public getIsMyTrun():boolean{
		return this.myTrunBool;
	}

	// 获取玩家真实位置
	public getPlayerRealPoi():any{
		return this.node["realPoi"];
	}

	// 获取行动能量值
	public getMovePower():number{
		return this.playerModle.getMovePower();
	}

	// 该玩家的回合开始了
	public startTrun(){
		// 是否到我的回合
		this.myTrunBool = true;
		// 对我的数据模型进行还原
		this.playerModle.myTurn();
		// 检测该玩家是否会被跳过
		if(this.playerModle.checkIsSkip()){
			this.changePrecess();
		}
	}

	// 切换游戏流程
	private changePrecess(){
		this.myTrunBool = false;
		emitter.emit(fightEvent.changeProcess);
	}

	// 扣血
	public subHp(hp:number){
		this.playerModle.subHp(hp);
		this.changeHpUi();
	}

	// 加血
	public addHp(hp:number){
		this.playerModle.addHp(hp);
		this.changeHpUi();
	}

	// 显示最终的hp增量
	private changeHpUi(){
		let range = this.playerModle.getHpRange();
		this.uiPlayerHp.fillRange = range;
	}

	// 获取卡牌能量值
	public getCardPower():number{
		return this.playerModle.getCardPower();
	}

	// 玩家移动移动方向
	public move(direction:number):void{
		// TODO 玩家行动
		if(this.playerModle.checkCanMove()){
			// 玩家移动
			let newPoi = mapMgr.getNextPoint(this.node["realPoi"],direction,1);
			let myPoi = this.getPlayerRealPoi();
			let vec = {
				x:newPoi.x - myPoi.x,
				y:newPoi.y - myPoi.y,
			};
			// 设置玩家仰角
			let rotation = this.getPlayerAngle(direction);
			this.playerModle.nowElevation = rotation;
			// if(this.checkCanMoveToAngle(direction,rotation)){
			if(vec.y <= 2){
				this.node["realPoi"] = newPoi;
			}
			// 扣除能量
			this.playerModle.subMovePower();
		}else{
			console.log("没有能量了");
		}
	}

	// 获取玩家当前角度
	public getPlayerElevation(){
		return this.playerModle.nowElevation;
	}

	// 仰角检测功能
	getPlayerAngle(direction:number){
		let realPoi = this.getPlayerRealPoi();
		let poi1 = mapMgr.getNextPoint(realPoi,-1,15);
		let poi2 = mapMgr.getNextPoint(realPoi, 1,15);
		let newPoi:any = {};
		switch(direction){
			case 1:
			newPoi.x = poi2.x - poi1.x;
			newPoi.y = poi2.y - poi1.y;
			break;
			case -1:
			newPoi.x = poi1.x - poi2.x;
			newPoi.y = poi1.y - poi2.y;
			break;
		}
		let rotation = fightTool.getAngleByVector(newPoi.x, newPoi.y);
		return rotation;
	}

	// 
	checkCanMoveToAngle(direction:number,rotation:number){
		switch(direction){
			case 1:
				if(rotation < 45){
					return true;
				}else{
					return false;
				}
			break;
			case -1:
			if(rotation > 135){
				return true;
			}else{
				return false;
			}
			break;
		}
		return false;
	}


	// 0 不使用 1使用
	changePlane(typeNum:number):void{
		this.playerModle.changePlane(typeNum);
	}

	// 射击
	shootMis(poi:any):void{
		// TODO 根据自身配置生成炮弹
		let shootData:ShootData = new ShootData();
		shootData.shootPoi = poi;
		let shootPoi = shootData.shootPoi;
		let startPoi = new cc.Vec2(this.node["realPoi"].x,this.node["realPoi"].y);
		startPoi.y += shootStartPoi;

		// 通过玩家属性配置当前炮弹类型
		let dataObj = {
			// 炮弹类型
			missileType:missileType.normal, 
			// 发射向量
			shootPoi:shootPoi, 
			// 发射点
			startPoi:startPoi, 
			// 当前威力
			power:this.playerModle.getNowAtkPower(), 
			// 当前座位id
			seatId:this.playerModle.seatId,
			// 连发次数
			continuousFire:this.playerModle.continuousFire,
			// 分裂次数
			divisionFire:this.playerModle.divisionFire,
			// TODO 扣血效果还是其它效果
			missileBuffType:missileBuffType.sub,
			// TODO 椭圆值
			ellipseRange:300
		};

		// 如果使用飞机
		if(this.playerModle.isPlane){
			dataObj.missileType = missileType.plane;
			dataObj.continuousFire = 1;
			dataObj.divisionFire = 1;
		}
		// 构造数据
		shootData.init(dataObj);
		// 触发导弹发射事件
		emitter.emit(fightEvent.onMissileShoot, shootData);
		// 发射后切换流程
		this.changePrecess();

	}

	// 玩家举枪瞄准角度
	changeAngle(angle:number){

	}

	// 使用卡牌 是否成功
	useCard(cardNum:number):boolean{
		// 卡牌工厂处理该玩家属性 使用成功
		if(this.playerModle.useCard(cardNum)){
			fightCardFactory.doMain(this.playerModle , cardNum);
			// 删除该牌并刷新界面
			return true;
		};
		return false;
		// 显示玩家使用的卡牌
	}

	// 网络帧驱动
	netFrame(){
		// TODO 判断是不是自己的行动回合
		if(this.myTrunBool){
			emitter.emit(fightEvent.updateCountDown,this.playerModle.getSecond());
			// 判断行动帧是否为0 为0时 玩家操作超时 切换玩家
			if(this.playerModle.checkIsTimeout()){
				// 切换游戏流程
				this.changePrecess();
			}
			// 行动帧减少
			this.playerModle.goFrame();
		}
		super.netFrame();
	}

	// update
	netUpdate(dt){
		super.netUpdate(dt);
	}

}

