import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import BoxMgr from "../../../../manager/public/boxMgr";
import GameNet from "../../../../framework/modules/GameNet";

/*
author: 蒙磊
日期:2018-11-08 11:20:57
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: BattleBoxCtrl;
let boxMgr=BoxMgr.getInstance();

//模型，数据处理
class Model extends BaseModel {
	hour=null;minute=null ;second =null;
	constructor() {
		super();
		this.initTime();
	}
	
	//时间
	initTime(){
		let time =boxMgr.curBattleBox.boxInfo.unlock_time
		let hour =Math.floor(time /3600)
		let minute =Math.floor((time %3600)/60)
		let second=Math.floor(time%60)
		this.hour = hour>=10? hour:'0'+hour;
		this.minute = minute>=10? minute:'0'+minute;
		this.second = second>=10? second:'0'+second;
	}
	
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		//在这里声明ui
		//button
		btn_unlock:ctrl.btn_unlock,
		btn_close:ctrl.btn_close,

		//label
		lab_time:ctrl.lab_time,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.showBoxTime();
	}

	showBoxTime(){
		this.ui.lab_time.getComponent(cc.Label).string =this.model.hour+":"+this.model.minute+":"+this.model.second
	}
}

//c, 控制
@ccclass
export default class BattleBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//button
	@property(cc.Node)
	btn_unlock: cc.Node = null;
	@property(cc.Node)
	btn_close: cc.Node = null;

	//label
	@property(cc.Node)
	lab_time: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
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
		this.connect("click", this.ui.btn_close,this.closeBox,"关闭战斗宝箱");
		this.connect("click", this.ui.btn_unlock,this.unlockBox,"开启战斗宝箱");
	}
	closeBox(){
		this.closeModule("battleBox");
	}
	unlockBox(){
		boxMgr.unlockBox();
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