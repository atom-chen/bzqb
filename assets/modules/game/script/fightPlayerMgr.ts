import Emitter from "../../../framework/modules/Emitter";
import fightPlayerClass from "./player/fightPlayerClass";
import fightRandomSeed from "./common/fightRandomSeed";
import PlayerData from "./modles/PlayerData";

import config from "./common/gameConfig";
/*
author: 黄凯
日期:2018-11-19
*/
let emitter = Emitter.getInstance();
// 随机数控制
let randomSeed = fightRandomSeed.getInstance();
// 配置
const { netFrame , fightEvent , missileType } = config;

const teamEnumType = {
	teamOne:"1",
	teamTwo:"2"
};

// 测试数据 玩家出生点
let spownPoi = {
	"1":{
		x:-460,
		y:-143,
	},
	"2":{
		x:445,
		y:-189,
	},
	"3":{
		x:200,
		y:0,
	},
	"4":{
		x:400,
		y:0,
	},
};


// 玩家选择的角色对应的预制体索引值
let playerRoleToIndex = {
	"1":0,
	"2":1,
};


//切换玩家的几种情况 
// 1，玩家行动回合 15秒没有操作 切换
// 2，玩家行动后 发射炮弹 炮弹产生碰撞后切换
// 3，玩家被冰冻 直接切换
// 4，飞机


// 玩家控制器数据层
class PlayerMgrModle{
	// 玩家座位id对应的玩家
	seatIdToPlayer:any;
	// 流程顺序座位id
	actionProcess:any;
	// 队伍对应的座位id
	teamToSeatId:any;
	// 当前回合数
	nowTimce:number;
	// 玩家总数
	playerCount:number;
	// 我的座位id
	mySeatId:string;
	// 当前操做的玩家 TODO不存在座位id的玩家不能操作(观战)
	nowSeatId:string;

	rolePrefab:cc.Prefab[];

	constructor(){
		// 座位id对应的玩家实例化对象
		this.seatIdToPlayer = {};
		// 行动流程
		this.actionProcess = [];
		// 队伍对应的座位数组
		this.teamToSeatId = {
			"1":[],
			"2":[]
		};
		// this.nowTimce = 1;
	}

	// 初始化玩家
	init(rolePrefab:cc.Prefab[],players:any,fatherNode:cc.Node){
		this.playerCount = Object.keys(players).length;
		this.rolePrefab = rolePrefab;

		// TODO 初始化并分离玩家数据
		for(let seatId in players){
			// 玩家的数据
			let playerData:PlayerData = new PlayerData(players[seatId]);
			let index = playerRoleToIndex[playerData.roleType];
			let node:cc.Node = cc.instantiate(this.rolePrefab[index]);
			let player:fightPlayerClass = node.getComponent(fightPlayerClass);
			let team = playerData.team;
			// 设置玩家坐标
			playerData.setPoi(spownPoi[seatId]);
			// 初始化玩家数据
			player.init(playerData);
			node.parent = fatherNode;
			this.teamToSeatId[team].push(seatId);
			this.seatIdToPlayer[seatId] = player;
		}
		// 固定的流程与操作顺序
		this.initActionProcess();
		// 初始玩家卡牌能量
		this.initPlayerCardPower();
		// 初始第一个玩家座位
		this.nowSeatId = this.actionProcess[0];
		// console.log(this.actionProcess);
	}

	// 通关流程顺序设置玩家的初始能量
	initPlayerCardPower(){
		for(let i = 0;i<this.actionProcess.length;i++){
			let seatId = this.actionProcess[i];
			let player = this.seatIdToPlayer[seatId];
			player.setCardPower(i);
		}
	}

	// 初始化玩家动作流程
	initActionProcess(){
		let randomTeam:string = this.changeRandomTeam(null);
		let teamOne = this.teamToSeatId["1"].slice(0);
		let teamTwo = this.teamToSeatId["2"].slice(0);
		for(let i = 0;i < this.playerCount ; i++){
			let seadId:string;
			switch (randomTeam) {
				case "1":
				seadId = this.getRandomAndRemove(teamOne);
					break;
				case "2":
				seadId = this.getRandomAndRemove(teamTwo);
					break;
			}
			if(i%2 === 0){
				randomTeam = this.changeRandomTeam(randomTeam);
			}
			this.actionProcess.push(seadId);
		}
	}


	// 获取活着的玩家
	getLivePlayers(){
		let seatIdToRealPoi = {};
		for(let i = 0;i<this.actionProcess.length;i++){
			let seatId = this.actionProcess[i];
			let player = this.getPlayerBySeatId(seatId);
			seatIdToRealPoi[seatId] = player.getPlayerRealPoi();
		}
		return seatIdToRealPoi;
	}


	// 切换随机组队
	changeRandomTeam(randomTeam){
		switch (randomTeam) {
			case "1":
				return "2";
				break;
			case "2":
				return "1";
				break;
		}
		return randomSeed.random()>0.5?"1":"2";
	}

	// 获取就删除
	getRandomAndRemove(teamList:any){
		let count = teamList.length;
		let index = Math.floor(randomSeed.random()*count);
		return teamList.splice(index,1)[0];
	}

	// 切换玩家流程
	changePlayer():void{
		let count = this.actionProcess.length;
		if(count <= 1){
			console.log("游戏已经结束了不需要切换玩家");
			return;
		}
		let nowIndex = this.actionProcess.indexOf(this.nowSeatId);
		if(nowIndex == count-1){
			nowIndex = 0;
		}else{
			nowIndex ++;
		}
		// 重新设置座位id
		this.nowSeatId = this.actionProcess[nowIndex];
		// 流程++
		// this.nowTimce++;
	}
	
	// 检测单组玩家剩余个数
	checkIsNoPlayer(teamType:string):number{
		let { seatIdToPlayer,teamToSeatId } = this;
		let liveIndex = 0;
		let count = teamToSeatId[teamType].length;
		for(let i = 0;i < count ; i++){
			let player = teamToSeatId[teamType][i];
			// TODO 玩家是否活着
			if(player.getIsLive()){
				liveIndex++;
			}
		}
		return liveIndex;
	}

	// 某玩家翘辫子
	playerDead(seatId:string):void{
		// 每炸死一个玩家就判断一次游戏是否结束
		let index = this.actionProcess.indexOf(seatId);
		// 删除行动流程
		this.actionProcess.splice(index,1);

	}

	// 获取玩家座位id
	getPlayerBySeatId(seatId:string):fightPlayerClass{
		return this.seatIdToPlayer[seatId];
	}

	// 获取当前操作的玩家
	getNowPlayer():fightPlayerClass{
		return this.seatIdToPlayer[this.nowSeatId];
	}

	// 检测是否是该玩家的操做回合
	checkIsNowSeatId(seatId:string):boolean{
		return this.nowSeatId == seatId;
	}

	// 是否是我的回合
	checkNowPlayerIsMine():boolean{
		return this.nowSeatId == this.mySeatId;
	}

	// 获取我的玩家实例化对象
	getMyPlayer():fightPlayerClass{
		return this.seatIdToPlayer[this.mySeatId];
	}

}

let taggerEnum = {
	"show":"show",
	"hide":"hide",
};

// 显示的事件绑定
class playerMgrView{
	// 切换显示隐藏我的操作
	taggerMyCtrlUi(tagger:string){
		emitter.emit(fightEvent.taggerMyCtrlUi,tagger);
	}
	// 移动控制器和能量条等
	moveMyCtrlUi(poi:any){
		emitter.emit(fightEvent.moveMyCtrlUi,poi);
	}
	// 更新行动能量条
	updateMoveRange(range:number){
		emitter.emit(fightEvent.updateMoveRange,range);
	}
	// 移动相机
	moveCarame(lerp:cc.Vec2){
		emitter.emit(fightEvent.setNowLerpPoi,lerp);
	}

	// 切换卡牌展示 效果要重做
	changeCardList(cards){
		emitter.emit(fightEvent.onCardChange,cards);
	}
}


// 我的回合
// 1，发送数据给服务端
// 2，显示操作相关的ui

// 控制层
export default class fightPlayerMgr{
	// 模型层
	playerMgrModle:PlayerMgrModle;
	// 渲染层
	playerMgrView:playerMgrView;
	// 父节点
	fatherNode:cc.Node;
	constructor(){
		this.playerMgrModle = new PlayerMgrModle();
		this.playerMgrView = new playerMgrView();
	}

	// 设置父节点
	public setFatherNode(node:cc.Node):void{
		this.fatherNode = node;
	}


	// 初始化玩家控制器
	public init(rolePrefab:cc.Prefab[],players:any):void{
		// TODO 测试数据
		if(players == null){
			// 模拟数据
			players = {
				"1":{
					team:"1",
					name:"hk",
					seatId:"1",
					roleType:"1",
				},
				"2":{
					team:"2",
					name:"hk2",
					seatId:"2",
					roleType:"2",
				}
			};
		};
		// 数据模型初始化
		this.playerMgrModle.init(rolePrefab,players,this.fatherNode);
	}

	// 生成自身操作圈
	public setMyCircleCtrl(uiPrefab:cc.Prefab){
		let myPlayer = this.getMyPlayer();
		let node = cc.instantiate(uiPrefab);
		// console.log("myPlayer",node);
		node.parent = myPlayer.node;
		node.active = true;
	}

	getMyPlayer():fightPlayerClass{
		return this.playerMgrModle.getMyPlayer();
	}

	// 通关玩家座位获取玩家实例化对象
	getPlayerBySeatId(seatId){
		return this.playerMgrModle.getPlayerBySeatId(seatId);
	}

	// 设置玩家真实位置
	public setPlayerNewPoi(seatId,realPoi){
		let player:fightPlayerClass = this.getPlayerBySeatId(seatId);
		player.resetPoi(realPoi);
	}

	// 当前是不是自己的回合
	public checkPlayerIsMine():boolean{
		return this.playerMgrModle.checkNowPlayerIsMine();
	}

	// 返回seatId 对应 真实坐标
	public getLivePlayers(){
		return this.playerMgrModle.getLivePlayers();
	}

	// 通知当前操作的玩家 
	public goPlayerAction(){
		// 获取当前玩家
		let player:fightPlayerClass = this.playerMgrModle.getNowPlayer();

		// 镜头移动
		let playerRealPoi = player.getPlayerRealPoi();
		this.playerMgrView.moveCarame(playerRealPoi);
		// 开始即时操做等
		player.startTrun();
		// TODO 如果是自己 显示ui 等
		if(this.checkPlayerIsMine()){
			let cardList = player.getPlayerCardList();
			this.playerMgrView.changeCardList(cardList);
			this.playerMgrView.taggerMyCtrlUi(taggerEnum.show);
		}else{
			this.playerMgrView.taggerMyCtrlUi(taggerEnum.hide);
		}
	}

	// 我的座位id
	public setMySeatId(seatId:string){
		this.playerMgrModle.mySeatId = seatId;
	}

	// 切换玩家
	public changePlayer(){
		// 切换后玩家开始动起来
		this.playerMgrModle.changePlayer();
		// 切换后玩家开始动起来
		this.goPlayerAction();
	}

	// 某玩家翘辫子了
	public playerDead(seatId:string){
		this.playerMgrModle.playerDead(seatId);
	}

	// 通过玩家各队死活 判断是否结束游戏
	public checkIsGameOver():boolean{
		// 队伍1 或者的数量
		let teamOneLive:number = this.playerMgrModle.checkIsNoPlayer(teamEnumType["teamOne"]);
		// 队伍2 或者的数量
		let teamTwoLive:number = this.playerMgrModle.checkIsNoPlayer(teamEnumType["teamTwo"]);
		if(teamOneLive <= 1){
			return true;
		}else{
			return false;
		}
	}

	// 干玩家
	doPlayer(msg:any):void{
		if(!msg || msg.length < 1){ return; }
		msg = msg[0];
		let seatId:string = msg.seatId+"";
		// 检测是否该玩家的回合
		if(!this.playerMgrModle.checkIsNowSeatId(seatId)){
			console.log("不是该玩家的回合不能操作");
			return;
		}
		// 玩家对象
		let player:fightPlayerClass = this.playerMgrModle.getNowPlayer();
		if(!player.getIsMyTrun()){
			// console.log("该玩家的回合已经结束");
			return;
		}
		let data:any = msg.data;
		// 射击向量
		let shootPoi:any = data.shootPoi;
		// 移动方向
		let direction:number = data.direction;
		// 玩家当前举枪角度
		let elevation:number = data.elevation;
		// 使用卡牌
		let userCard:number = data.userCard;
		// 切换飞机
		let changePlane:number = data.changePlane;
		// 移动1，-1
		if(direction){
			// 玩家移动
			player.move(direction);
		}
		// 使用纸飞机
		if(changePlane){
			console.log("使用飞机",changePlane);
			player.changePlane(changePlane);
		}
		// 发射炮弹
		if(shootPoi){
			this.playerMgrView.taggerMyCtrlUi(taggerEnum.hide);
			player.shootMis(shootPoi);
		}
		// 玩家当前角度
		if(elevation){
			player.changeAngle(elevation);
		}
		// 玩家使用卡牌
		if(userCard){
			// 使用成功返回true 使用失败不管
			if(player.useCard(userCard) && this.checkPlayerIsMine()){
				// 使用成功刷新ui
				let cardList = player.getPlayerCardList();
				this.playerMgrView.changeCardList(cardList);
			}
		}
	}

	// 检测是否是我的回合 然后操作ui位移等
	checkIsMyTrun():void{
		if(this.checkPlayerIsMine()){
			let player:fightPlayerClass = this.playerMgrModle.getNowPlayer();
			let myRealPoi:any = player.getPlayerRealPoi();
			let movePower:number = player.getMovePower();
			// myRealPoi = this.getWorldPoi(myRealPoi);
			this.playerMgrView.moveMyCtrlUi(myRealPoi);
			this.playerMgrView.updateMoveRange(movePower);
		}
	}

	// getWorldPoi(poi:any){
	// 	return this.fatherNode.convertToWorldSpaceAR(poi);
	// }

	// 网络帧驱动
	netFrame(msg:any):void{
		this.doPlayer(msg);
		this.checkIsMyTrun();
	}


}

