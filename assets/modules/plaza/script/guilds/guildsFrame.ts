import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

/*
author: 陈斌杰
日期:2018-11-09 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsFrameCtrl;
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
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
}
//c, 控制
@ccclass
export default class GuildsFrameCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
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