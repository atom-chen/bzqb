import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { activeBoxes } from "../../../../manager/public/interface/iDailyTaskInfo";
import TaskMgr from "../../../../manager/public/taskMgr";

/*
author: 陈斌杰
日期:2018-11-23 13:55:44
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TaskBoxesCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public boxesData: activeBoxes = <activeBoxes>{};

	//设置活动宝箱数据
	public setActiveBoxesData(data: any): void {
		this.boxesData = data;
	}

	//设置宝箱开启数据
	public setBoxesOpenState(data: any): void {
		this.boxesData.isOpen = true;
		this.boxesData.rewarks = [];
		
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		boxesIco: ctrl.boxesIco,			//活跃度宝箱图片
		activeNum: ctrl.activeNum,			//活跃度
		circle_bg: ctrl.circle_bg,			//圆圈背景
		rewarkInfo: ctrl.rewarkInfo,		//挂载奖励预制的节点
		rewark: ctrl.rewark,				//奖励预制
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}

	//初始化活跃度宝箱UI
	public initActiveBoxesUI(): void {
		if (this.model.boxesData.id < 2000) {
			let namePic = [3, 7, 14, 21];
			let index = this.model.boxesData.id - 1001;
			let name = null;
			if (this.model.boxesData.isOpen) {
				name = `openBox_${namePic[index]}`;
			} else {
				name = `box_${namePic[index]}`
			}
			this.loadImage(name).then((sprf) => {
				this.ui.boxesIco.spriteFrame = sprf;
			});
		} else {
			this.ui.circle_bg.active = false;
			this.ui.activeNum.node.parent.width = 120;
		}

		this.ui.activeNum.string = this.model.boxesData.condition.toString();
	}

	//显示宝箱奖励
	public showBoxesRewarks(): void {
		this.ui.rewarkInfo.getChildByName("bg").width = 80 * this.model.boxesData.rewarks.length;
		if (this.model.boxesData.id > 2000) {
			this.ui.rewarkInfo.y = 90;
			this.ui.rewarkInfo.getChildByName("arrow").scaleY= -1;
			this.ui.rewarkInfo.getChildByName("arrow").y = -50;
		}
		if (this.ui.rewarkInfo.active == true) {
			this.ui.rewarkInfo.active = false;
		} else {
			this.ui.rewarkInfo.active = true;
		}
		if (this.ui.rewarkInfo.childrenCount > 2) {
			return;
		}
		for (let i = 0; i < this.model.boxesData.rewarks.length; i++) {
			let boxData = this.model.boxesData.rewarks[i];
			let boxNode = this.addPrefabNode(this.ui.rewark, this.ui.rewarkInfo);
			boxNode.x = -40 * (this.model.boxesData.rewarks.length - 1) + i * 80;
			boxNode.getComponent("boxRewark").initTotalRewark(boxData);
		}
	}

	//刷新宝箱图片显示
	public refreshBoxesUI(): void {
		this.initActiveBoxesUI();
	}
}
//c, 控制
@ccclass
export default class TaskBoxesCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	boxesIco: cc.Sprite = null;
	@property(cc.Label)
	activeNum: cc.Label = null;
	@property(cc.Node)
	circle_bg: cc.Node = null;
	@property(cc.Node)
	rewarkInfo: cc.Node = null;
	@property(cc.Prefab)
	rewark: cc.Prefab = null;
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
		this.connect("click", this.node, () => {
			if (this.model.boxesData.isOpen) {
				return;
			}
			if (TaskMgr.getInstance().getIsCanOpenBoxes(this.model.boxesData.id)) {
				console.log("---------发送开启活跃度宝箱请求----------");
				return;
			}
			this.view.showBoxesRewarks();
		}, "点击活跃度宝箱显示奖励");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化活跃度宝箱
	public initActiveBoxe(data: any): void {
		this.model.setActiveBoxesData(data);
		this.view.initActiveBoxesUI();
	}

	//刷新宝箱显示
	public refreshBoxes(data: any): void {
		this.model.setBoxesOpenState(data);
		this.view.refreshBoxesUI();
		this.openSubModule("gainBox", true).then(script => {
			script.setGainData(this.model.boxesData.rewarks);
		});
	}

	onDestroy() {
		super.onDestroy();
	}
}