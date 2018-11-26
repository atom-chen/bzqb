import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import TableMgr from "../../../../manager/public/tableMgr";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";
import ShopMgr from "../../../../manager/public/shopMgr";

/*
author: 蒙磊
日期:2018-11-15 10:31:05
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: CardShopCtrl;
//模型，数据处理
class Model extends BaseModel {
	cost: number;
	count: number;
	priceType: number;
	name: string;
	constructor() {
		super();
		this.initData();
	}
	initData() {
		this.cost = ctrl.cost;
		this.count = ctrl.count;
		this.priceType = ctrl.priceType;
		this.name = ctrl.name;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		lab_name: ctrl.lab_name,
		lab_cost: ctrl.lab_cost,
		lab_count: ctrl.lab_count,
		sp_price:ctrl.sp_price,
		sp_SpriteFrame:ctrl.sp_SpriteFrame,
		cardBuyShow:ctrl.cardBuyShow,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		if (this.model.cost) {
			this.showLabelString(this.ui.lab_cost.getComponent(cc.Label), this.model.cost.toString())
		}
		if (this.model.count) {
			this.showLabelString(this.ui.lab_count.getComponent(cc.Label), 'X' + this.model.count)
		}
		if (this.model.name) {
			this.showLabelString(this.ui.lab_name.getComponent(cc.Label), this.model.name)
		}
		if (this.model.priceType != null) {
			this.ui.sp_price.spriteFrame = this.ui.sp_SpriteFrame[this.model.priceType-1];
		}
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	public addPrefab(obj_node: cc.Node, obj_Prefab: cc.Prefab) {
		return this.addPrefabNode(obj_Prefab, obj_node);
	}
}
//c, 控制
@ccclass
export default class CardShopCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label
	@property(cc.Node)
	lab_cost: cc.Node = null;
	@property(cc.Node)
	lab_name: cc.Node = null;
	@property(cc.Node)
	lab_count: cc.Node = null;
	//sprite
	@property(cc.Sprite)
	sp_price: cc.Sprite = null;
	//SpriteFrame
	@property([cc.SpriteFrame])
	sp_SpriteFrame: any = [cc.SpriteFrame];
	//Prefab
	@property(cc.Prefab)
	cardBuyShow: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	cost: number;
	count: number;
	priceType: number;
	name: string;


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}
	setData(cost: number, count: number, name: string, priceType: number) {
		if (this.view) {
			this.model.cost = cost
			this.model.count = count;
			this.model.name = name;
			this.model.priceType = priceType;
			this.view.initUi();
		}
		else{
			this.cost = cost;
			this.count = count;
			this.name = name;
			this.priceType = priceType;
		}
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
		this.connect("click", this.node.getComponent(cc.Button), this.buyCard, "购买特技");
	}
	updateDateAndShowCardShop(data) {
		let card = TableMgr.getInstance().search('teji_teji', { id: data.itemId })
		this.model.cost = data.price;
		this.model.count = data.amount;
		this.model.name = card.name;
		this.model.priceType = 2;
		this.view.initUi();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	buyCard() {
		//this.addPrefab()
		//ModuleMgr.getInstance().showMsgBox({ content: `确定要花费${this.model.cost}购买特技：${this.model.name},X${this.model.count}?` })
	}
	//end

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}