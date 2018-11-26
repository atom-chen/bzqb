import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import AchievementMgr from "../../../../manager/public/achievementMgr";
import { array } from "../../../../framework/lib/jszip/support";

/*
author: 蒙磊
日期:2018-11-09 15:46:41
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: AchievementCtrl;
let achievementMgrMgr = AchievementMgr.getInstance();
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	achievement: any = [];
	achievementProgress: any = [];
	initData() {
		this.achievement = achievementMgrMgr.achievement;
		this.setProgress();
	}
	setProgress() {
		for (let i = 0; i < this.achievement.length; i++) {
			let curProgress = this.achievement[i].src;
			let targetProgress = this.achievement[i].target;
			if(typeof targetProgress ==="object"){
				targetProgress = targetProgress.quantity
			}
			this.achievementProgress[i] = "进度" + curProgress + "/" + targetProgress
		}

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_close: ctrl.btn_close,
		achievementList: ctrl.achievementList,
		achievement: ctrl.achievement,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	public addPrefab(obj_node: cc.Node, obj_Prefab: cc.Prefab) {
		return this.addPrefabNode(obj_Prefab, obj_node);
	}
	//初始化ui
	public initUi() {

	}
}
//c, 控制
@ccclass
export default class AchievementCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;

	//note
	@property(cc.Node)
	achievementList: cc.Node = null;
	//Prefab
	@property(cc.Prefab)
	achievement: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initData();
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
		this.connect("click", this.ui.btn_close, this.close, "关闭");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	initData() {
		this.model.initData();
		this.ui.achievementList.height = (this.model.achievement.length) * 90;
		for (let i = 0; i < this.model.achievement.length; i++) {
			let achievement = this.view.addPrefab(this.ui.achievementList, this.ui.achievement)
			achievement.setPosition(cc.v2(0, -180 + (i * -90)))
			console.log(this.model.achievement[i])
			achievement.getComponent("achievement").setLabel(this.model.achievement[i].tableInfo.name, this.model.achievement[i].tableInfo.des, this.model.achievementProgress[i]);
			achievement.getComponent("achievement").setButton(this.model.achievement[i].recevied)
		}

	}
	close() {
		this.closeModule("achievementBG")
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}