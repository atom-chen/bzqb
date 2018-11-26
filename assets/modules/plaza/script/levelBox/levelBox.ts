import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import BoxMgr from "../../../../manager/public/boxMgr";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";
/*
author: 蒙磊
日期:2018-11-23 17:11:42
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: LevelBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	public buyState: boolean = false;
	public des: string;
	public levelBox: any;
	public curPrice: string;
	public have: null;
	public originalPrice: string;
	constructor() {
		super();
	}
	setData(data, have) {
		this.levelBox = data;
		this.have = have;
		this.des = data.des;
		this.originalPrice = data.original_price.toString();
		this.curPrice = "现价" + data.price_diamond;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		lab_des: ctrl.lab_des,
		lab_originalPrice: ctrl.lab_originalPrice,
		lab_curPrice: ctrl.lab_curPrice,
		btn_buy: ctrl.btn_buy,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	initData() {
		this.showLabelString(this.ui.lab_des, this.model.des)
		this.showLabelString(this.ui.lab_originalPrice, this.model.originalPrice)
		this.showLabelString(this.ui.lab_curPrice, this.model.curPrice)
		if (this.model.have == null) {
			this.ui.btn_buy.children[1].active = false;
		}
		else {
			this.ui.btn_buy.children[0].active = false;
			this.ui.btn_buy.getComponent(cc.Button).interactable = false;
		}
	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class LevelBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label
	@property(cc.Label)
	lab_des: cc.Label = null;
	@property(cc.Label)
	lab_originalPrice: cc.Label = null;
	@property(cc.Label)
	lab_curPrice: cc.Label = null;

	@property(cc.Node)
	btn_buy: cc.Node = null;


	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);

	}

	//定义网络事件${route}
	protected defineNetEvents() {
		this.n_events = {
			'plaza.box.buyLevelBox': this.buyLevelBox,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_buy, this.buy, "购买");
	}
	//网络事件回调begin
	buyLevelBox() {
		if (this.model.buyState) {
			this.btn_buy.children[0].active = false;
			this.btn_buy.children[1].active = true;
			this.ui.btn_buy.getComponent(cc.Button).interactable = false;
		}
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	buy() {
		let diamond = this.model.levelBox.original_price;
		let level =
		ModuleMgr.getInstance().showMsgBox({
			content: `确定要花费${diamond}砖石购买级特惠礼包?`,
			okcb: () => { BoxMgr.getInstance().sendBuyLevelBox(this.model.levelBox.condition_level), this.model.buyState = true }
		})

	}
	setData(data, have) {
		this.model.setData(data, have);
		this.view.initData();
	}
	initData() {

	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}