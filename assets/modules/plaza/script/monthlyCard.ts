import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import cardMgr from "../../../manager/public/cardMgr";
import ModuleMgr from "../../../framework/modules/ModuleMgr";
/*
author: 蒙磊
日期:2018-11-09 15:52:44
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MonthlyCardCtrl;
//模型，数据处理
class Model extends BaseModel {
	isHave: any = null;
	isOpenBox: any = null;
	createTime: any = null;
	closingDate: string = null;
	constructor() {
		super();
	}
	initData() {
		this.isHave = cardMgr.getInstance().monthlyCardInfo.isHave;
		this.isOpenBox = cardMgr.getInstance().monthlyCardInfo.isOpenBox;
		this.createTime = cardMgr.getInstance().monthlyCardInfo.createTime;
	}
	setClosingDate() {
		var endTime = this.createTime + cardMgr.getInstance().monthlyCardTime;
		var time = new Date(endTime);
		let year = time.getFullYear();
		let month = time.getMonth() + 1;
		let date = time.getDate();
		this.closingDate = year + "年" + month + "月" + date + "日结束";
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
		btn_receiveReward: ctrl.btn_receiveReward,
		btn_beReceived: ctrl.btn_beReceived,
		note_closingDate: ctrl.note_closingDate,
		lab_closingDate: ctrl.lab_closingDate,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class MonthlyCardCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Node)
	btn_buy: cc.Node = null;
	@property(cc.Node)
	btn_receiveReward: cc.Node = null;
	@property(cc.Node)
	btn_beReceived: cc.Node = null;
	//note
	@property(cc.Node)
	note_closingDate: cc.Node = null;
	//label
	@property(cc.Label)
	lab_closingDate: cc.Label = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initData();
	}
	initData() {
		this.model.initData();
		if (this.model.isHave == 0) {
			this.btn_buy.active = true;
		}
		else {
			this.model.setClosingDate();
			this.view.showLabelString(this.ui.lab_closingDate,this.model.closingDate)
			this.note_closingDate.active = true;
			if (this.model.isOpenBox == 0) {
				this.btn_receiveReward.active = true;
			}
			else {
				this.btn_beReceived.active = true;
			}
		}
	}
	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			"plaza.privilege.buyMonthlyCard": this.buyMonthlyCard,
			"plaza.privilege.recMonthlyDailyBox":this.recMonthlyDailyBox,
			
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, this.close, "关闭");
		this.connect("click", this.ui.btn_buy, this.buy, "购买月卡");
		this.connect("click", this.ui.btn_receiveReward, this.openBox, "开启宝箱");
	}
	//网络事件回调begin
	buyMonthlyCard() {
		this.model.initData()
		this.model.setClosingDate();
		this.btn_buy.active = false;
		this.btn_receiveReward.active = true;
		this.note_closingDate.active = true;
		this.view.showLabelString(this.ui.lab_closingDate,this.model.closingDate)
	}
	recMonthlyDailyBox(){
		ModuleMgr.getInstance().showGainBox(cardMgr.getInstance().monthlyCardBox)
		this.btn_receiveReward.active = false;
		this.btn_beReceived.active = true;
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	buy() {
		cardMgr.getInstance().sendBuyMonthlyCard();
	}
	openBox(){
		cardMgr.getInstance().sendRecMonthlyDailyBox();
	}
	// update(dt) {}
	close() {
		this.closeModule("monthlyCard")
	}
	onDestroy() {
		super.onDestroy();
	}
}