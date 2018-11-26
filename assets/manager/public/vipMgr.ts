import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
import EffectMgr from "./effectMgr";
import BoxMgr from "./boxMgr";
let userMgr = UserMgr.getInstance();

export default class VipMgr extends BaseMgr {
	//vip模块
	public isInit: boolean = false;
	public vipTabal: any = null
	public vip: any = [];

	//玩家vip信息
	public vipScore: number = null;
	public vipLv: number = null;
	public vipGiftInfo: any = [];
	public vipWeekPrizeInfo: any = [];
	//周宝箱
	public dictItemInfo: any = [];
	//购买宝箱
	public vipGift: any = [];
	constructor() {
		super();
		this.routes = {
			'plaza.vip.reqVipInfo': this.reqVipInfo,
			'plaza.vip.recVipWeekPrize': this.recVipWeekPrize,
			'plaza.vip.buyVipGift': this.buyVipGift,
		};
	}
	//发包和接包
	testGm1() {
		let route = 'plaza.box.gm';
		let msg = {
			oprType: 5,//操作类型
			vipScore: 77777,
		}
		this.send_msg(route, msg);
	}
	sendReqVipInfo() {
		let route = 'plaza.vip.reqVipInfo';
		this.send_msg(route);
		//this.testGm1();
	}
	reqVipInfo(msg: Package): void {
		this.isInit = true;
		let vipInfo = msg.getDataByType(dataids.ID_GET_VIPINFO);
		console.log("--------vip信息-------", vipInfo);
		this.vipScore = vipInfo.vipScore;
		this.vipLv = vipInfo.vipLv;
		this.vipGiftInfo = vipInfo.vipGiftInfo;
		this.vipWeekPrizeInfo = vipInfo.vipWeekPrizeInfo;
	}
	//周宝箱
	sendRecVipWeekPrize(level) {
		let route = 'plaza.vip.recVipWeekPrize';
		let msg = {
			recVipLv: level,
		}
		this.send_msg(route, msg);
	}
	recVipWeekPrize(msg: Package): void {
		let vipWeekPrize = msg.getDataByType(dataids.ID_GET_WEEKVIPPRIZE);
		console.log("--------vip周宝箱信息-------", vipWeekPrize);
		this.dictItemInfo = vipWeekPrize.dictItemInfo;
		this.vipWeekPrizeInfo = vipWeekPrize.vipWeekPrizeInfo;
		this.dictItemInfo = [];
		for (var key in vipWeekPrize.dictItemInfo) {
			this.dictItemInfo.push({
				type: key,
				amount: vipWeekPrize.dictItemInfo[key]
			})
		}
		this.dictItemInfo
	}
	sendBuyVipGift(level) {
		let route = 'plaza.vip.buyVipGift';
		let msg = {
			buyVipLv: level,
		}
		this.send_msg(route, msg);
	}
	buyVipGift(msg: Package): void {
		let VipGift = msg.getDataByType(dataids.ID_GET_BUYVIPGIFT);
		console.log("--------vip购买宝箱信息-------", VipGift);
		this.vipGift = []
		this.vipGiftInfo = VipGift.vipGiftInfo;
		for (var key in VipGift.dictItemInfo) {
			for (let i = 0; i < VipGift.dictItemInfo[key].length; i++) {
				let amount = VipGift.dictItemInfo[key][i].amount;
				switch (key) {
					case "4":
						EffectMgr.getInstance().addEffect(VipGift.dictItemInfo[key][i])
						break;
					case "5":
						BoxMgr.getInstance().addBox(VipGift.dictItemInfo[key][i])
						break;
					default:
						break;
				}
				this.vipGift.push({
					type: key,
					amount: amount,
				})
			}
			
		}

	}

	//发包和接包结束
	initData() {
		//查表
		this.vipTabal = this.getConfigSync("vip_vip").json;
		cc.log("----VIP表格----", this.vipTabal)
		this.initVip();
	}
	initVip() {
		for (let i = 0; i < this.vipTabal.length; i++) {
			this.vip.push(this.vipTabal[i])
		}
	}

	// 单例处理
	private static _instance: VipMgr = null;
	public static getInstance(): VipMgr {
		if (VipMgr._instance == null) {
			VipMgr._instance = new VipMgr();
		}
		return VipMgr._instance;
	}
}

/*
请求vip界面信息协议：plaza.vip.reqVipInfo
服务端需要数据：
{
	
}
服务端返回数据：
[75, dictInfo]/ip界面信息
dictInfo = {
        vipLv : null,//当前vip等级
        vipScore : null,//当前vip积分
        vipGiftInfo : {vip等级1:1, vip等级2:0},//0是未购买，1是已经购买
        vipWeekPrizeInfo : {vip等级1：时间戳，vip等级2:时间戳}//是否领取了周礼包
    }

==========================
购买vip特权宝箱协议：plaza.vip.buyVipGift
服务端需要数据：
{
	buyVipLv ： 1购买什么等级的vip礼包
}
服务端返回数据：
[77, dictPrize]//  获取的物品信息
dictPrize = {
	type : []//可能是金币数值，或者列表物品，看具体情况
}

==========================
充值vip金额协议：plaza.vip.addVipScore
服务端需要数据：
{
	addScore : 1//增加的vip积分数额
}
服务端返回数据：
[75, dictInfo]/ip界面信息
dictInfo = {
        vipLv : null,//当前vip等级
        vipScore : null,//当前vip积分
        vipGiftInfo : {vip等级1:1, vip等级2:0},//0是未购买，1是已经购买
        vipWeekPrizeInfo : {vip等级1：时间戳，vip等级2:时间戳}//是否领取了周礼包
    }

==========================
领取vip周宝箱协议：plaza.vip.recVipWeekPrize
服务端需要数据：
{
	recVipLv：1领取哪个等级的vip周福利
}
服务端返回数据：
[78, dictPrize]//  获取的物品信息
dictPrize = {
	type : []//可能是金币数值，或者列表物品，看具体情况
}
 */