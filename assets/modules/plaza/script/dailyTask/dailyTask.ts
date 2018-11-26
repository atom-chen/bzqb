import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { activeBoxesList, dailyTaskList } from './../../../../manager/public/interface/iDailyTaskInfo';
import TaskMgr from "../../../../manager/public/taskMgr";


/*
author: 陈斌杰
日期:2018-11-22 18:51:51
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: DailyTaskCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public dailyTaskData: dailyTaskList = TaskMgr.getInstance().dailyTaskData;			//每日任务数据
	public activeBoxesData: activeBoxesList = TaskMgr.getInstance().activeBoxesData;	//活跃度宝箱数据
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		progressBar: ctrl.progressBar,										//活跃度
		progressBoxes: ctrl.progressBoxes,									//进度宝箱挂载节点
		activeBoxes: ctrl.boxesRewark,										//活跃度宝箱预制
		taskContent: ctrl.taskContent,										//任务预制挂载节点
		task: ctrl.task,													//任务预制
		bottomFrame: ctrl.bottomFrame,										//底部节点
		activeCount: ctrl.activeCount,										//本周活跃度
		btn_close: ctrl.btn_close,											//关闭每日任务按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.refreshActivityUI();
		this.refreshProgressBarUI();
		this.initDailyTaskUI();
		this.initActiveBoxesUI();
	}

	//初始化每日任务数据
	public initDailyTaskUI(): void {
		this.ui.taskContent.height = this.model.dailyTaskData.list.length * 80;
		for (let i = 0; i < this.model.dailyTaskData.list.length; i++) {
			let taskData = this.model.dailyTaskData.list[i];
			let taskNode = this.addPrefabNode(this.ui.task, this.ui.taskContent);
			taskNode.y = -40 - i * 80;
			taskNode.getComponent("task").initDailyTask(taskData);
		}
	}

	//初始化活跃度宝箱
	public initActiveBoxesUI(): void {
		for (let i = 0; i < this.model.activeBoxesData.list.length; i++) {
			let boxesData = this.model.activeBoxesData.list[i];
			if (boxesData.id < 2000) {
				let activeBoxesNode = this.addPrefabNode(this.ui.activeBoxes, this.ui.progressBoxes);
				activeBoxesNode.x = 180 * i - 195;
				activeBoxesNode.getComponent("taskBoxes").initActiveBoxe(boxesData);
			} else {
				let activeBoxesNode = this.addPrefabNode(this.ui.activeBoxes, this.ui.bottomFrame);
				activeBoxesNode.x = 75 + (i - 4) * 225;
				activeBoxesNode.y = 10;
				activeBoxesNode.getComponent("taskBoxes").initActiveBoxe(boxesData);
			}
		}
	}

	//刷新活跃度显示
	public refreshActivityUI(): void {
		this.ui.progressBar.string = TaskMgr.getInstance().activity.toString();
	}

	//刷新活跃度进度条显示
	public refreshProgressBarUI(): void {
		let progressBar = this.ui.progressBoxes.getComponent(cc.ProgressBar);
		let num = TaskMgr.getInstance().activity/100;
		progressBar.progress = num;
	}
}
//c, 控制
@ccclass
export default class DailyTaskCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Label)
	progressBar: cc.Label = null;
	@property(cc.Node)
	progressBoxes: cc.Node = null;
	@property(cc.Prefab)
	boxesRewark: cc.Prefab = null;
	@property(cc.Node)
	activeCount: cc.Node = null;
	@property(cc.Node)
	taskContent: cc.Node = null;
	@property(cc.Prefab)
	task: cc.Prefab = null;
	@property(cc.Node)
	bottomFrame: cc.Node = null;
	@property(cc.Node)
	btn_close: cc.Node = null;
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
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("dailyTask");
		}, "关闭每日任务界面");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}