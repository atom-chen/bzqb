import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import cardMgr from "../../../manager/public/cardMgr";

/*
author: 蒙磊
日期:2018-11-09 15:49:16
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: ForeverCardCtrl;
//模型，数据处理
class Model extends BaseModel {
	isHave: any = null;
	constructor() {
		super();
	}
	initData() {
		this.isHave = cardMgr.getInstance().lifetimeCardInfo.isHave;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_close: ctrl.btn_close,
		btn_buy: ctrl.btn_buy,
		btn_beBuy: ctrl.btn_beBuy,
	}
	constructor(model) {
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
export default class ForeverCardCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Node)
	btn_buy: cc.Node = null;
	@property(cc.Node)
	btn_beBuy: cc.Node = null;

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
		this.n_events = {
			"plaza.privilege.buyLifetimeCard": this.buyLifetimeCard,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, this.close, "关闭");
		this.connect("click", this.ui.btn_buy, this.buy, "购买终身卡");
	}
	initData() {
		this.model.initData();
		if (this.model.isHave == 0) {
			this.btn_buy.active = true;
		}
		else {
			this.btn_beBuy.active = true;
		}
	}
	buy() {
		cardMgr.getInstance().sendBuyLifetimeCard();
	}
	//网络事件回调begin
	buyLifetimeCard() {
		this.model.initData();
		this.btn_buy.active = false;
		this.btn_beBuy.active = true;
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	close() {
		this.closeModule("foreverCard")
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}