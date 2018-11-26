import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
let userMgr = UserMgr.getInstance();

export default class AchievementMgr extends BaseMgr {
	public achievementTabal: any = null
	public achievement: any = [];
	//public achievementId = [1001, 1009, 1018, 1024, 1030, 1036, 1043, 1048, 1053];
	public isInit: boolean = false;
	constructor() {
		super();
		this.routes = {
			"plaza.data.reqAchieveInfo": this.reqAchieveInfo,
		};

	}
	public selectAchievement(id: number): any {
		for (let i = 0; i < this.achievementTabal.length; i++) {
			let achievement = this.achievementTabal[i];
			if (achievement.id == id) {
				return achievement;
			}
		}
		return console.log("没有该成就id", id);
	}
	sendReqAchieveInfo() {
		let route = 'plaza.data.reqAchieveInfo';
		this.send_msg(route)
	}
	reqAchieveInfo(msg: Package): void {
		this.isInit = true;
		let achievementInfo = msg.getDataByType(dataids.ID_ACHIEVEINFO);
		console.log("-----成就信息-----", achievementInfo)
		this.initAchieveData(achievementInfo.arr)
	}
	initAchieveData(data) {
		//查表
		this.achievementTabal = this.getConfigSync("chengjiu_Achievement").json;
		for (let i = 0; i < data.length; i++) {
			data[i].tableInfo = this.selectAchievement(data[i].itemId);
		}
		this.achievement=data
		cc.log("---成就---", this.achievement)
	}
	// 单例处理
	private static _instance: AchievementMgr = null;
	public static getInstance(): AchievementMgr {
		if (AchievementMgr._instance == null) {
			AchievementMgr._instance = new AchievementMgr();
		}
		return AchievementMgr._instance;
	}
}

