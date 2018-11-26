import Emitter from "../../../../framework/modules/Emitter";
import BaseBodyFight from "../baseClass/BaseBodyFight";
import effectBuffMgr from "../effectBuff/effectBuffMgr";
import PlayerData from "../modles/PlayerData";
import ShootData from "../modles/ShootData";
import fightRandomSeed from "../common/fightRandomSeed";
import fightTool from "../common/fightTool";

// 随机数
let randomSeed = fightRandomSeed.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
let emitter = Emitter.getInstance();

import config from "../common/gameConfig";

const { netFrame , fightEvent , missileType , waitTime , playerConfig ,missileBuffType , maxCard } = config;
// 装备 TODO 护甲等
class equipment{

}

// 测试用的牌组 卡牌消耗的能量
let cardForPower = {
	"1":2,
	"2":3,
	"3":4,
	"4":5,
	"5":1,
	"6":2,
	"7":3,
	"8":4,
	"9":5,
	"10":3
};

export default class fightPlayerModle{
	// 角色类型
	characterType:string;
	// 血量上限
	maxHp:number;
	// 移动速度
	moveSpeed:number;
	// 是否使用飞机
	isPlane:number;
	// 天赋 TODO

	// 特技 TODO

	// 血量
	hp:number;
	// 移动能量
	movePower:number;
	// 卡牌使用的能量
	cardPower:number;
	// 能量最大值
	maxCardPower:number;
	// 初始攻击力
	atkPower:number;
	// 当前攻击力
	nowAtkPower:number;
	// 暴击率
	critRate:number;
	// buff管理器
	effectBuffMgr:effectBuffMgr;
	// 每次回复卡牌能量点数
	oneTrunCardPower:number;
	// 行动秒数
	trunTime:number;
	// 检测是否会被跳过
	isSkip:boolean;
	// 玩家真实位置
	// realPoi:any;
	// 玩家所在的队伍
	team:string;
	// 玩家名称
	name:string;
	// 玩家座位id
	seatId:string;
	// 连射次数
	continuousFire:number;
	// 分裂次数
	divisionFire:number;
	// 卡牌池子
	cardList:any = [];
	// 当前卡牌 最后一张不可用
	nowCardList:any;
	// 当前仰角
	nowElevation:number;

	// 初始化
	init(playerData:PlayerData){
		this.isPlane = 0;
		this.movePower = playerConfig.maxMovePower;
		this.effectBuffMgr = new effectBuffMgr();
		this.moveSpeed = 1;
		this.atkPower = 40;
		this.nowAtkPower = this.atkPower;
		this.critRate = 0.1;
		this.hp = 500;
		this.maxHp = 500;
		// this.cardPower = playerData.cardPower;
		this.maxCardPower = 10;
		this.oneTrunCardPower = 4;
		// this.realPoi = playerData.realPoi;
		this.team = playerData.team;
		this.name = playerData.name;
		this.seatId = playerData.seatId;
		this.isSkip = false;
		this.continuousFire = 1;
		this.divisionFire = 1;
		// 测试数据 初始牌组
		this.cardList = playerData.cardList || [1,2,3,4,5,6,7,8,9,10];
		this.initCardList();
		// TODO 初始特技与天赋
	}
	// 缓冲池里的卡牌
	cacheList:any;
	// 初始化手牌和接下来要抽的牌
	initCardList(){
		this.cacheList = [];
		let firstCardList = fightTool.shuffle(this.cardList.slice(0));
		this.nowCardList = firstCardList.splice(0,maxCard);
		this.cacheList = firstCardList;
		// console.log("this.nowCardList",this.nowCardList,this.cacheList);
	}

	// 回合开始重置数值
	myTurn(){
		// 15秒行动时间
		this.trunTime = netFrame * waitTime;
		// 回复行动能量
		this.movePower = playerConfig.maxMovePower;
		// 关闭飞机
		this.isPlane = 0;
		// 回复卡牌能量
		this.cardPower += this.oneTrunCardPower;
		this.cardPower > this.maxCardPower && (this.cardPower = this.maxCardPower);
		// buff结算
		this.effectBuffMgr.buffSettle();
		// 连射次数
		this.continuousFire = 1;
		// 分裂
		this.divisionFire = 1;
		// 重置攻击力
		this.nowAtkPower = this.atkPower;
		// 补充卡牌
		this.supplementaryCard();
	}

	// 补充卡牌
	supplementaryCard(){
		// 需要补充多少张牌
		let cardNeedLen = maxCard - this.nowCardList.length;
		let cacheLen = this.cacheList.length;
		// console.log("cardNeedLen+++",cardNeedLen,cacheLen);
		// 取出缓存中的卡牌
		if(cacheLen > 0 ){
			if(cardNeedLen >= cacheLen){
				// 取出所有的缓存卡牌
				let cacheArr = this.cacheList.splice(0,cacheLen);
				cardNeedLen -= cacheLen;
				this.nowCardList = this.nowCardList.concat(cacheArr);
			}else{
				// 取出部分卡牌
				let cacheArr = this.cacheList.splice(0,cardNeedLen);
				cardNeedLen = 0;
				this.nowCardList = this.nowCardList.concat(cacheArr);
			}
		}
		// 还没取够 继续取卡
		if(cardNeedLen > 0){
			let canChooseCardList = fightTool.differenceArray(this.cardList , this.nowCardList);
			let cacheArr = canChooseCardList.splice(0,cardNeedLen);
			this.nowCardList = this.nowCardList.concat(cacheArr);
		}
		console.log("当前能量：",this.cardPower,"当前卡牌列表：",this.nowCardList);
	}

	// 返回当前攻击力
	public getNowAtkPower():number{
		return this.nowAtkPower;
	}

	// 拷贝一份传出 避免被修改
	public getPlayerCardList():any{
		return this.nowCardList.slice(0);
	}

	// 设置初始卡牌能量
	public setCardPower(index:number):void{
		if(index === 0){
			this.cardPower = 0;
		}else{
			this.cardPower = 2;
		}
	}

	// 使用卡牌
	public useCard(card:number):boolean{
		// console.log("useCard--------",card,typeof card == "number")
		// 判断能量是否满足
		let newCardPower = cardForPower[card];
		// 判断玩家是否有这张牌
		let index = this.nowCardList.indexOf(card);

		if((index !== -1 && index < (this.nowCardList.length-1))  && this.cardPower >= newCardPower){
			this.nowCardList.splice(index,1);
			// 使用成功
			this.cardPower -= newCardPower;
			return true;
		}else{
			console.log("能量不够 不能使用");
			return false;
		}
	}

	// 加连射
	public addContinuousFire(num:number){
		this.continuousFire += (num-1);
		this.continuousFire > 4 && (this.continuousFire = 4);
	}

	// 加分裂
	public addDivisionFire(){
		this.divisionFire = 3;
	}

	// 增加攻击力
	public addAtkPower(atk:number){
		this.nowAtkPower += atk;
	}

	// 切换死战模式
	changeDeathPattern():void{
		this.oneTrunCardPower = 8;
	}

	// 检测玩家是否可以移动
	checkCanMove():boolean{
		return this.movePower > 0;
	}

	// 扣去能量
	subMovePower():void{
		this.movePower -= playerConfig.trunMovePower;
		this.movePower < 0 && ( this.movePower = 0 );
	}

	// 切换飞机模式
	changePlane(typeNum:number):void{
		this.isPlane = typeNum;
	}

	// 扣血时 hp最小值为0
	subHp(power:number):void{
		this.hp -= power;
		this.hp < 0 && (this.hp = 0);
	}

	// 加血效果
	addHp(power:number):void{
		this.hp += power;
		this.hp > this.maxHp && (this.hp = this.maxHp);
	}

	// 检测是否会被跳过回合 如(冰冻)等
	checkIsSkip():boolean{
		return this.isSkip;
	}

	// 获取当前剩余操作 单位秒
	getSecond():string{
		let second = Math.ceil(this.trunTime / netFrame)+"";
		return second;
	}

	// 检测玩家是否操作超时
	checkIsTimeout():boolean{
		return this.trunTime === 0;
	}

	// 每次运行帧数时
	goFrame():void{
		this.trunTime --;
	}

	// 获取移动能量百分比 0-1
	getMovePower():number{
		return this.movePower / playerConfig.maxMovePower;
	}

	// 获取hp百分比 0-1
	getHpRange():number{
		return this.hp / this.maxHp;
	}

	// 修改卡牌能量
	getCardPower():number{
		return this.cardPower;
	}

}