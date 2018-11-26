import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

/*
author: 蒙磊
日期:2018-11-16 15:32:08
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: AchievementCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		//在这里声明ui
		lab_title:ctrl.lab_title,
		lab_describe:ctrl.lab_describe,
		lab_progress:ctrl.lab_progress,
		btn_goTo:ctrl.btn_goTo,
		btn_receive:ctrl.btn_receive,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class AchievementCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label
	@property(cc.Label)
	lab_title: cc.Label = null;
	@property(cc.Label)
	lab_describe: cc.Label = null;
	@property(cc.Label)
	lab_progress: cc.Label = null;
	//btn 
	@property(cc.Node)
	btn_goTo: cc.Node = null;
	@property(cc.Node)
	btn_receive: cc.Node = null;
	
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
	setLabel(title:string,describe:string,progress:string){
		this.view.showLabelString(this.ui.lab_title,title)
		this.view.showLabelString(this.ui.lab_describe,describe)
		this.view.showLabelString(this.ui.lab_progress,progress)
	}
	setButton(recevied:number){
		if(recevied==0){
			this.ui.btn_goTo.active =true;
		}
		else{
			this.ui.btn_receive.active =true;
		}
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

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}