import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";

/*
author: 蒙磊
日期:2018-11-13 20:20:56
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: BoxShopCtrl;
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
		lab_cost: ctrl.lab_cost,
		lab_gift: ctrl.lab_gift,
		btn_box:ctrl.btn_box,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), ctrl.cost.toString())
		this.showLabelString(this.ui.lab_gift.getComponent(cc.Label), ctrl.gift.toString())
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class BoxShopCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label
	@property(cc.Node)
	lab_cost: cc.Node = null;
	@property(cc.Node)
	lab_gift: cc.Node = null;
	//button
	@property(cc.Node)
	btn_box: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	cost: number;
	gift: number;


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
		this.connect("click", this.ui.btn_box, this.buy, "购买宝箱");
	}
	buy(){
		ModuleMgr.getInstance().showMsgBox({content:`确定要花费${this.cost }购买宝箱：,和金币${this.gift  }?`})
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	setData(cost: number, gift: number) {
		this.cost = cost;
		this.gift = gift;
	}
	onDestroy() {
		super.onDestroy();
	}
}