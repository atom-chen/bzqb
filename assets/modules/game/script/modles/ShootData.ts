// ShootData.ts
/*
author: 黄凯
日期:2018-11-19
*/
// import config from "../common/gameConfig";
// 发射导弹的一些必要参数
export default class ShootData{
	// 导弹类型
	missileType:number;
	// 发射向量
	shootPoi:any;
	// 起始发射点
	startPoi:any;
	// 威力
	power:number;
	// 预制体对应的关键子
	// missilePrefab:string;
	// 座位id 标识玩家
	seatId:string;
	// 爆炸后的椭圆范围
	ellipseRange:number;
	// 导弹状态
	missileBuffType:number;
	// 连发次数
	continuousFire:number;
	// 分裂次数
	divisionFire:number;

	// 初始化导弹数据结构
	init(dataObj:any){
		this.missileType = dataObj.missileType;
		this.shootPoi = dataObj.shootPoi;
		this.startPoi = dataObj.startPoi;
		this.power = dataObj.power;
		this.seatId = dataObj.seatId;
		this.missileBuffType = dataObj.missileBuffType;
		this.ellipseRange = dataObj.ellipseRange;
		this.continuousFire = dataObj.continuousFire;
		this.divisionFire = dataObj.divisionFire;
	}

}
