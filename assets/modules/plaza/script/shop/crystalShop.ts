import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";
/*
author: 蒙磊
日期:2018-11-13 20:41:57
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: CrystalShopCtrl;
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
	public ui = {
		//在这里声明ui
		lab_cost:ctrl.lab_cost,
		lab_gift:ctrl.lab_gift,
		lab_reward:ctrl.lab_reward,
		lab_name:ctrl.lab_name,
		btn_crystal:ctrl.btn_crystal,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.showLabelString(this.ui.lab_cost.getComponent(cc.Label),ctrl.cost.toString())
		this.showLabelString(this.ui.lab_gift.getComponent(cc.Label),ctrl.gift.toString())
		this.showLabelString(this.ui.lab_reward.getComponent(cc.Label),ctrl.reward.toString())
		this.showLabelString(this.ui.lab_name.getComponent(cc.Label),ctrl.name)
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class CrystalShopCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label
	@property(cc.Node)
	lab_cost: cc.Node = null;
	@property(cc.Node)
	lab_gift: cc.Node = null;
	@property(cc.Node)
	lab_reward: cc.Node = null;
	@property(cc.Node)
	lab_name: cc.Node = null;
	@property(cc.Node)
	btn_crystal: cc.Node = null;
	//button
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	cost:number;
	gift:number;
	reward:number;
	name:string;

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
		this.connect("click", this.ui.btn_crystal, this.buy, "购买粉晶");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	buy() {
		ModuleMgr.getInstance().showMsgBox({ content: `确定要花费${this.cost}购买：${this.name},获得${this.reward+this.gift}?` })
	}
	setData(cost:number,gift:number,reward:number,name:string){
		this.cost =cost?cost:0;
		this.gift =gift?gift:0;
		this.reward =reward?reward:0;
		this.name =name;
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}