import BaseMgr from "../../framework/baseClass/BaseMgr";
import { signInList, signIn, signInRewark, totalSignIn, totalSignInList } from "./interface/iSignInfo";
import Package from "../../framework/net/package";
import GameNet from "../../framework/modules/GameNet";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";

/*
author: 陈斌杰
日期:2018-11-21 10:44:38
*/
export default class SignInMgr extends BaseMgr {
	public isFrist: boolean = false;								//是否第一次请求数据
	public signInCfgTab: any = null;								//签到配表
	public signIn_totalRewarkCfgTab: any = null;					//累积签到宝箱配表
	public signInData: signInList = <signInList>{};					//签到所有数据
	public totalBoxesData: totalSignInList = <totalSignInList>{};	//累积宝箱数据
	public multiDay: number = 0;									//累积签到天数
	public signIn_Reissues: number = enums.SignIn_Reissues;			//每月补签次数
	public signIn_ReissuesCost: number = enums.SignIn_ReissuesCost;	//每月补签费用
	constructor() {
		super();
		this.routes = {
			"plaza.signin.reqSigninInfo": this.reqSigninInfo,		//签到信息
			"plaza.signin.signin": this.signin,						//签到
			"plaza.signin.repairSignin": this.repairSignin,			//补签
			"plaza.signin.recMultiSignin": this.recMultiSignin,		//累积签到宝箱
		};
	}

	// 单例处理
	private static _instance: SignInMgr = null;
	public static getInstance(): SignInMgr {
		if (SignInMgr._instance == null) {
			SignInMgr._instance = new SignInMgr();
		}
		return SignInMgr._instance;
	}

	//向服务器请求签到信息数据
	public sendReqSignInInfo(): void {
		this.send_msg("plaza.signin.reqSigninInfo");
	}

	//获取服务器下发的签到信息
	public reqSigninInfo(msg: Package): void {
		this.isFrist = true;
		let data = msg.getDataByType(dataids.ID_GET_SIGNIN_INFO);
		this.getSignInCfgTab();
		this.initSignInData();
		this.initTotalBoxesData();
		this.setSignInData(data.listSignin);
		this.setTotalBoxesData(data.listMultiSignin);
		this.signIn_Reissues -= data.repairTimes;	//data.repairTimes 当前签到的次数
	}

	//向服务器请求签到数据
	public sendReqSignIn(): void {
		this.send_msg("plaza.signin.signin");
	}

	//获取服务器下发的签到数据
	public signin(msg: Package): void {
		this.isFrist = true;
		let data = msg.getDataByType(dataids.ID_DOSIGNIN_RECINFO);
		this.setNowSignInData(data.dayIndex);
		this.multiDay++;
	}

	//向服务器发送补签请求
	public sendReqRepairSignIn(dayIndex: any): void {
		let msg = {
			dayIndex: dayIndex,
		}
		this.send_msg("plaza.signin.repairSignin", msg);
	}

	//获取服务器下发的补签数据
	public repairSignin(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_DOSIGNIN_RECINFO);
		this.setNowSignInData(data.dayIndex);
		this.signIn_Reissues--;
		this.multiDay++;
	}

	//向服务器发送累积签到宝箱请求
	public sendReqMultiSignIn(dayIndex: any): void {
		let msg = {
			multiDayIndex: dayIndex,
		}
		this.send_msg("plaza.signin.recMultiSignin", msg);
	}

	//获取服务器下发的累积签到宝箱数据
	public recMultiSignin(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_MULTISIGNIN_RECINFO);
		this.setNowBoxesData(data.multiDayIndex);
	}

	//获取签到配表
	public getSignInCfgTab(): void {
		this.signInCfgTab = this.getConfigSync("signIn").json;
		this.signIn_totalRewarkCfgTab = this.getConfigSync("signIn_totalRewark").json;
	}

	//初始化全部签到数据
	public initSignInData(): void {
		this.signInData.list = [];
		for (let i = 0; i < this.signInCfgTab.length; i++) {
			let cfgData = this.signInCfgTab[i];
			let signIn: signIn = <signIn>{};
			signIn.rewark = <signInRewark>{}
			signIn.rewark.type = cfgData.reward.type;
			signIn.rewark.itemId = cfgData.reward.itemId;
			signIn.rewark.amount = cfgData.reward.amount;
			signIn.isSignIn = false;
			signIn.signInDay = cfgData.day;
			signIn.again_signIn = false;
			signIn.vipLv = cfgData.vip_Level;
			this.signInData.list.push(signIn);
		}
	}

	//初始化累积签到宝箱数据
	public initTotalBoxesData(): void {
		this.totalBoxesData.list = [];
		for (let i = 0; i < this.signIn_totalRewarkCfgTab.length; i++) {
			let totalBoxesData = this.signIn_totalRewarkCfgTab[i];
			let boxes: totalSignIn = <totalSignIn>{};
			boxes.isOpen = false;
			boxes.totalSignInDay = totalBoxesData.total_Days;
			boxes.rewarkList = [];
			for (let j = 0; j < totalBoxesData.total_reward.length; j++) {
				let rewarkData = totalBoxesData.total_reward[j];
				let rewark = <signInRewark>{};
				rewark.type = rewarkData.type;
				rewark.itemId = rewarkData.itemId;
				rewark.amount = rewarkData.amount;
				boxes.rewarkList.push(rewark);
			}
			this.totalBoxesData.list.push(boxes);
		}
	}

	//设置全部签到数据
	public setSignInData(data: any): void {
		let nowDay = new Date().getDate();
		if (data == null || data.length == 0) {			//第一次进入签到一次都没签到过
			for (let i = 0; i < this.signInData.list.length; i++) {
				let signIn = this.signInData.list[i];
				if (signIn.signInDay < nowDay) {
					signIn.again_signIn = true;
				}
			}
			return;
		}
		for (let i = 0; i < this.signInData.list.length; i++) {
			let signIn = this.signInData.list[i];
			for (let j = 0; j < data.length; j++) {
				if (signIn.signInDay == data[j]) {
					signIn.isSignIn = true;
					signIn.again_signIn = false;
					this.multiDay++;
					break;
				}
			}
			if (!signIn.isSignIn && signIn.signInDay < nowDay) {
				signIn.again_signIn = true;
			}
		}
	}

	//设置累积宝箱领取数据
	public setTotalBoxesData(data: any): void {
		if (data == null || data.length == 0) {
			return;
		}
		for (let i = 0; i < this.totalBoxesData.list.length; i++) {
			let boxData = this.totalBoxesData.list[i];
			for (let j = 0; j < data.length; j++) {
				if (boxData.totalSignInDay == data[j]) {
					boxData.isOpen = true;
					break;
				}
			}
		}
	}

	//设置当前签到的数据
	public setNowSignInData(day: number): void {
		this.signInData.list[day - 1].isSignIn = true;
	}

	//设置当前累积宝箱的数据
	public setNowBoxesData(day: number): void {
		for (let i = 0; i < this.totalBoxesData.list.length; i++) {
			let boxesData = this.totalBoxesData.list[i];
			if (boxesData.totalSignInDay == day) {
				boxesData.isOpen = true;
				break;
			}
		}
	}

	//是否可以签到判断
	public getIsCanSignIn(day: number): boolean {
		let nowTime = new Date();
		let nowDay = nowTime.getDate();
		if (day == nowDay) {
			return true;
		}
		return false;
	}

	//判断是否可以补签
	public getIsCanShowRepairSignIn(dayIndex: number): boolean {
		let isCanRepair = true;
		for (let i = 0; i < this.signInData.list.length; i++) {
			let signInData = this.signInData.list[i];
			if (signInData.signInDay < dayIndex) {
				if (signInData.again_signIn) {
					isCanRepair = false;
					break;
				} else {
					continue;
				}
			} else {
				break;
			}
		}
		return isCanRepair;
	}

	//判断是否可以打开
	public getIsCanOpenBoxes(dayIndex: number): boolean {
		let isCanOpen = false;
		for (let i = 0; i < this.totalBoxesData.list.length; i++) {
			let boxData = this.totalBoxesData.list[i];
			if (boxData.totalSignInDay == dayIndex && boxData.totalSignInDay <= this.multiDay) {
				isCanOpen = true;
				break;
			}
		}
		return isCanOpen;
	}
}