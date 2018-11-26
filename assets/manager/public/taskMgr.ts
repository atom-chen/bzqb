import BaseMgr from "../../framework/baseClass/BaseMgr";
import { dailyTaskList, activeBoxesList, activeBoxes, rewark, dailyTask } from "./interface/iDailyTaskInfo";
import Package from "../../framework/net/package";
import GameNet from "../../framework/modules/GameNet";
import { dataids } from "../../framework/net/dataids";

/*
author: 陈斌杰
日期:2018-11-23 13:47:34
*/

export default class TaskMgr extends BaseMgr {
	public isFirst: boolean = false;								//是否第一次打开
	public dailyTaskCfgTab: any = null;								//每日任务配置表
	public activeBoxesCfgTab: any = null;							//活跃度宝箱配置表
	public dailyTaskData: dailyTaskList = <dailyTaskList>{};		//每日任务数据
	public activeBoxesData: activeBoxesList = <activeBoxesList>{};	//活跃度宝箱数据
	public activity: number = 0;									//当前活跃度
	constructor() {
		super();
		this.routes = {
			"plaza.data.reqDailyMissionInfo": this.reqDailyMissionInfo,
		};
	}

	// 单例处理
	private static _instance: TaskMgr = null;
	public static getInstance(): TaskMgr {
		if (TaskMgr._instance == null) {
			TaskMgr._instance = new TaskMgr();
		}
		return TaskMgr._instance;
	}

	//向服务器发送每日任务数据请求
	public sendReqDailyTaskData(): void {
		this.send_msg("plaza.data.reqDailyMissionInfo");
	}

	//获取服务器下发的每日任务数据
	public reqDailyMissionInfo(msg: Package): void {
		this.isFirst = true;
		let data = msg.getDataByType(dataids.ID_DAILYMISSIONINFO);
		this.getDailyTaskCfgTab();
		this.initDailyTaskData();
		this.initActiveBoxesData();
		this.setVitality(data.vitality);
		this.setDailyTaskData(data.arr);
	}

	//获取每日任务配置表
	public getDailyTaskCfgTab(): void {
		this.dailyTaskCfgTab = this.getConfigSync("dailyTask_dailyTask").json;
		this.activeBoxesCfgTab = this.getConfigSync("dailyTask_activeValueReward").json;
	}

	//初始化任务数据
	public initDailyTaskData(): void {
		this.dailyTaskData.list = [];
		for (let i = 0; i < this.dailyTaskCfgTab.length; i++) {
			let taskData = this.dailyTaskCfgTab[i];
			let dailyTask = <dailyTask>{};
			dailyTask.id = taskData.id;
			dailyTask.name = taskData.name;
			dailyTask.des = taskData.des;
			dailyTask.received = false;
			dailyTask.type = taskData.type;
			dailyTask.progress = 0;
			dailyTask.parameter = taskData.parameter;
			dailyTask.activeValue = taskData.activeValue;
			dailyTask.exp = taskData.exp;
			dailyTask.rewarks = [];
			for (let j = 0; j < taskData.reward.length; j++) {
				let data = taskData.reward[j];
				let rewark = <rewark>{};
				rewark.type = data.type;
				rewark.itemId = data.itemId;
				rewark.amount = data.amount;
				dailyTask.rewarks.push(rewark);
			}
			this.dailyTaskData.list.push(dailyTask);
		}
	}

	//初始化活跃度宝箱数据
	public initActiveBoxesData(): void {
		this.activeBoxesData.list = [];
		for (let i = 0; i < this.activeBoxesCfgTab.length; i++) {
			let boxesData = this.activeBoxesCfgTab[i];
			let activeBoxes = <activeBoxes>{};
			activeBoxes.id = boxesData.id;
			activeBoxes.type = boxesData.type;
			activeBoxes.isOpen = false;
			activeBoxes.condition = boxesData.condition;
			activeBoxes.rewarks = [];
			for (let j = 0; j < boxesData.reward.length; j++) {
				let data = boxesData.reward[j];
				let rewark = <rewark>{};
				rewark.type = data.type;
				rewark.itemId = data.itemId;
				rewark.amount = data.amount;
				activeBoxes.rewarks.push(rewark);
			}
			this.activeBoxesData.list.push(activeBoxes);
		}
	}

	//设置每日任务数据
	public setDailyTaskData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			let taskData = data[i];
			for (let j = 0; j < this.dailyTaskData.list.length; j++) {
				let task = this.dailyTaskData.list[j];
				if (taskData.itemId == task.id) {
					if (taskData.received == 1) {
						task.received = true;
					}
					task.progress = taskData.src;
					break;
				}
			}
		}
	}

	//设置当前活跃度
	public setVitality(vitality: number): void {
		this.activity += vitality;
	}

	//判断是否可以打开
	public getIsCanOpenBoxes(boxesId: number): boolean {
		let isCanOpen = false;
		for (let i = 0; i < this.activeBoxesData.list.length; i++) {
			let boxData = this.activeBoxesData.list[i];
			if (boxesId == boxData.id && boxData.condition < this.activity) {
				boxData.isOpen = true;
			}
		}
		return isCanOpen;
	}
}