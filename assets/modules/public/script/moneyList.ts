import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import ShopMgr from "../../../manager/public/shopMgr";
import UserMgr from "../../../manager/public/userMgr";

/*
author: 蒙磊
日期:2018-11-21 21:38:08
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MoneyListCtrl;
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
		//button
		btn_moneyAdd: ctrl.btn_moneyAdd,
		btn_diamondAdd: ctrl.btn_diamondAdd,
		btn_crystalAdd: ctrl.btn_crystalAdd,
		//label
		lab_money: ctrl.lab_money,
		lab_crystal: ctrl.lab_crystal,
		lab_diamond: ctrl.lab_diamond,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.updateMoney();
	}
	updateMoney() {
		console.log("金钱变更！", UserMgr.getInstance().userMoney.gold)
		this.ui.lab_money.getComponent(cc.Label).string = this.numberEllipsis(UserMgr.getInstance().userMoney.gold)
		this.ui.lab_crystal.getComponent(cc.Label).string = this.numberEllipsis(UserMgr.getInstance().userMoney.crystal)
		this.ui.lab_diamond.getComponent(cc.Label).string = this.numberEllipsis(UserMgr.getInstance().userMoney.diamond)
	}
}
//c, 控制
@ccclass
export default class MoneyListCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_moneyAdd: cc.Node = null;
	@property(cc.Node)
	btn_crystalAdd: cc.Node = null;
	@property(cc.Node)
	btn_diamondAdd: cc.Node = null;
	@property(cc.Node)
	lab_money: cc.Node = null;
	@property(cc.Node)
	lab_crystal: cc.Node = null;
	@property(cc.Node)
	lab_diamond: cc.Node = null;
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
		this.g_events = {
			"refreshMoneyUI": this.refreshMoneyUI,
		};
	}
	refreshMoneyUI() {
		this.view.updateMoney();
	}
	//绑定操作的回调
	connectUi() {
		console.log(this.ui.btn_moneyAdd)
		this.connect("click", this.ui.btn_moneyAdd, () => {
			ShopMgr.getInstance().setShopState("money")
			if (ShopMgr.getInstance().isInitShop) {
				this.openSubModule("shop")
			}
			else {
				ShopMgr.getInstance().reqShopInfo();
			}
		}, "购买金币");
		this.connect("click", this.ui.btn_crystalAdd, () => {
			ShopMgr.getInstance().setShopState("crystal")
			if (ShopMgr.getInstance().isInitShop) {
				this.openSubModule("shop")
			}
			else {
				ShopMgr.getInstance().reqShopInfo();
			}
		}, "购买水晶");
		this.connect("click", this.ui.btn_diamondAdd, () => {
			ShopMgr.getInstance().setShopState("diamond")
			if (ShopMgr.getInstance().isInitShop) {
				this.openSubModule("shop")
			}
			else {
				ShopMgr.getInstance().reqShopInfo();
			}
		}, "购买砖石");
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