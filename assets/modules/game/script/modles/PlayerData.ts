// fightPlayerData.ts
/*
author: 黄凯
日期:2018-11-19
*/
// 玩家初始化数据模型结构体
export default class PlayerData{
	// 玩家角色
	roleType:number;
	// 座位ID
	seatId:string;
	// 队伍
	team:string;
	// 名称
	name:string;
	// 玩家起始坐标
	realPoi:any;
	// 卡牌配置
	cardList:any;
	// 初始的卡牌能量
	// cardPower:number;
	
	constructor(playerData){
		this.roleType = playerData.roleType;
		this.seatId = playerData.seatId;
		this.team = playerData.team;
		this.name = playerData.name;
		this.cardList = playerData.cardList;
		// this.cardPower = playerData.cardPower;

	}
	setPoi(poi:any){
		this.realPoi = poi;
	}
}