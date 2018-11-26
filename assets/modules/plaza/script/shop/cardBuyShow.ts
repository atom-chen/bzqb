import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

/*
author: 蒙磊
日期:2018-11-26 11:02:57
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: CardBuyShowCtrl;
//模型，数据处理
class Model extends BaseModel {
	spF_money:cc.SpriteFrame=null;
	lab_name:string=null;
	lab_money:string=null;
	lab_count:string=null;
	constructor() {
		super();
	}
	setData(spF_money:cc.SpriteFrame,lab_name:string,lab_money:string,lab_count:string){
		this.spF_money =spF_money;
		this.lab_name =lab_name;
		this.lab_money =lab_money;
		this.lab_count =lab_count;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		//在这里声明ui
		sp_money:ctrl.sp_money,
		lab_money:ctrl.lab_money,
		lab_name:ctrl.lab_name,
		lab_count:ctrl.lab_count,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	showData(){
		this.ui.sp_money.spriteFrame =this.model.spF_money;
		this.ui.lab_name.string =this.model.lab_name;
		this.ui.lab_money.string =this.model.lab_money;
		this.ui.lab_count.string =this.model.lab_count;
	}
}
//c, 控制
@ccclass
export default class CardBuyShowCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//sprite
	@property(cc.Sprite)
	sp_money: cc.Sprite = null;

	//label
	@property(cc.Label)
	lab_money: cc.Label = null;
	@property(cc.Label)
	lab_name: cc.Label = null;
	@property(cc.Label)
	lab_count: cc.Label = null;
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
	setData(spF_money:cc.SpriteFrame,lab_name:string,lab_money:string,lab_count:string){
		this.model.setData(spF_money,lab_name,lab_money,lab_count);
		this.view.showData();
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}