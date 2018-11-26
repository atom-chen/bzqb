import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { dailyTask } from "../../../../manager/public/interface/iDailyTaskInfo";

/*
author: 陈斌杰
日期:2018-11-23 11:40:29
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TaskCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public dailyTaskData: dailyTask = <dailyTask>{};

	//设置每日任务数据
	public setDailuTaskData(data: any): void {
		this.dailyTaskData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		ico: ctrl.ico,												//奖励图标
		title: ctrl.title,											//任务标题
		content: ctrl.content,										//任务内容
		rewarks: ctrl.rewarks,										//奖励挂载节点
		rewark: ctrl.rewark,										//奖励预制
		progress_lab: ctrl.progress_lab,							//任务进度
		progressBtnLab: ctrl.progressBtnLab,								//任务显示完成前往按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.progressBtnLab.string = "前往";
	}

	//初始化每日任务UI
	public initDailyTaskUI(): void {
		this.ui.title.string = this.model.dailyTaskData.name;
		this.ui.content.string = this.model.dailyTaskData.des;
		for (let i = 0; i < this.model.dailyTaskData.rewarks.length; i++) {
			let rewarkData = this.model.dailyTaskData.rewarks[i];
			let rewarkNode = this.addPrefabNode(this.ui.rewark, this.ui.rewarks);
			rewarkNode.setContentSize(65,65);
			rewarkNode.x = 325 - i*80;
			rewarkNode.getComponent("boxRewark").initTotalRewark(rewarkData);
		}
		this.ui.progress_lab.string = `进度${this.model.dailyTaskData.progress}/${this.model.dailyTaskData.parameter}`;
		if (this.model.dailyTaskData.received) {
			this.ui.progressBtnLab.string = "已领取";
			return;
		}
		if (this.model.dailyTaskData.progress == this.model.dailyTaskData.parameter) {
			this.ui.progressBtnLab.string = "完成";
		}
	}
}
//c, 控制
@ccclass
export default class TaskCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	ico: cc.Sprite = null;
	@property(cc.Label)
	title: cc.Label = null;
	@property(cc.Label)
	content: cc.Label = null;
	@property(cc.Prefab)
	rewark: cc.Prefab = null;
	@property(cc.Label)
	progress_lab: cc.Label = null;
	@property(cc.Node)
	rewarks: cc.Node = null;
	@property(cc.Label)
	progressBtnLab: cc.Label = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化任务
	public initDailyTask(data: any): void {
		this.model.setDailuTaskData(data);
		this.view.initDailyTaskUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}