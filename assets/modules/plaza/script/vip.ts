import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import VipMgr from "../../../manager/public/vipMgr";
import UserMgr from "../../../manager/public/userMgr";
import ShopMgr from "../../../manager/public/shopMgr";
import ModuleMgr from "../../../framework/modules/ModuleMgr";
/*
author: 蒙磊
日期:2018-11-09 15:55:04
*/
//MVC模块,
enum VIP {
	V1 = 0,
	V2,
	V3,
	V4,
	V5,
	V6,
	V7,
	V8,
	V9,
}

const { ccclass, property } = cc._decorator;
let ctrl: VipCtrl;
let vipMgr = VipMgr.getInstance();
let userMgr = UserMgr.getInstance();
//模型，数据处理
class Model extends BaseModel {
	//获取的信息
	public curVipLevel: number = null;
	public vip: any = [];
	public userVip: any = null;
	public vipLevel: number = null;
	public vipWeekPrizeInfo: any = null;
	public vipGiftInfo: any = null;
	//显示信息
	public vipShopText: string = null;
	public vipWelfareText: string = null;
	public vipExeText: string = null;
	public vipNeedText: string = null;
	public vipNextLevelText: string = null;
	public vipExePercent: number = 0;//进度条百分比
	constructor() {
		super();
	}
	initData() {
		this.vip = vipMgr.vip;
		this.vipLevel = vipMgr.vipLv
		this.userVip = this.vip[this.vipLevel]
		this.vipWeekPrizeInfo = vipMgr.vipWeekPrizeInfo;
		this.vipGiftInfo = vipMgr.vipGiftInfo;
	}
	setVipShopText(index) {
		this.vipShopText = 'VIP' + (index + 1) + "礼包"
	}
	setvipWelfareText(index) {
		this.vipWelfareText = 'VIP' + (index + 1) + "福利"
	}
	setExeData() {
		let curExe = vipMgr.vipScore;
		if (this.userVip) {
			let targetExe = this.userVip.recharge;
			this.vipExeText = curExe + "/" + targetExe;
			this.vipNeedText = '再充值' + (targetExe - curExe);
			this.vipNextLevelText = '可升级v' + (this.vipLevel + 1)
			this.vipExePercent = curExe / targetExe;
		}
		else {
			this.vipExeText = curExe + "/---" ;
			this.vipNeedText=""
			this.vipNextLevelText ="您已达到最高vip等级"
			this.vipExePercent = 1;
		}
	}
	setText(name, text) {
		this[name] = text;
	}
	setCurVipLevel(level) {
		this.curVipLevel = level;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_close: ctrl.btn_close,
		//note
		note_vip: ctrl.note_vip,
		//label
		lab_des: ctrl.lab_des,
		lab_vipShopText: ctrl.lab_vipShopText,
		lab_vipWelfareText: ctrl.lab_vipWelfareText,
		lab_exe: ctrl.lab_exe,
		lab_need: ctrl.lab_need,
		lab_nextLevel: ctrl.lab_nextLevel,
		lab_cost: ctrl.lab_cost,
		//sprite
		sp_vipExePercent: ctrl.sp_vipExePercent,
		sp_vipIcon: ctrl.sp_vipIcon,
		//button
		btn_treasureBox: ctrl.btn_treasureBox,
		btn_welfareBox: ctrl.btn_welfareBox,
		btn_buy: ctrl.btn_buy,
		btn_receive: ctrl.btn_receive,
		btn_recharge: ctrl.btn_recharge,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}

	showIcon(name) {
		var SPF = this.getImageSync(name)
		this.ui.sp_vipIcon.spriteFrame = SPF;
	}
	//初始化ui
	public initUi() {

	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	//显示进度条
	showProgress(obj: cc.Sprite, percent: number) {
		obj.fillRange = percent;
	}
}
//c, 控制
@ccclass
export default class VipCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	//note
	@property(cc.Node)
	note_vip: cc.Node = null;

	//label
	@property(cc.Node)
	lab_des: cc.Node = null;
	@property(cc.Node)
	lab_vipShopText: cc.Node = null;
	@property(cc.Node)
	lab_vipWelfareText: cc.Node = null;
	@property(cc.Node)
	lab_exe: cc.Node = null;
	@property(cc.Node)
	lab_need: cc.Node = null;
	@property(cc.Node)
	lab_nextLevel: cc.Node = null;
	@property(cc.Node)
	lab_cost: cc.Node = null;
	//button
	@property(cc.Node)
	btn_treasureBox: cc.Node = null;
	@property(cc.Node)
	btn_welfareBox: cc.Node = null;
	@property(cc.Node)
	btn_buy: cc.Node = null;
	@property(cc.Node)
	btn_receive: cc.Node = null;
	@property(cc.Node)
	btn_recharge: cc.Node = null;
	//sprite
	@property(cc.Sprite)
	sp_vipIcon: cc.Sprite = null;
	@property(cc.Node)
	sp_vipExePercent: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		vipMgr.initData();
		this.initData();
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			'plaza.vip.recVipWeekPrize': this.recVipWeekPrize,
			'plaza.vip.buyVipGift': this.buyVipGift,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, this.close, "关闭");
		for (let i = 0; i < this.ui.note_vip.childrenCount; i++) {
			this.connect("click", this.ui.note_vip.children[i], () => {
				this.choseVip(i)
			}, "选中vip");
		}
		this.connect("click", this.ui.btn_recharge, () => {
			ShopMgr.getInstance().setShopState("diamond")
			if (ShopMgr.getInstance().isInitShop) {
				this.openSubModule("shop").then((obj) => {
					obj.choseShop("diamond")
				})
			}
			else {
				ShopMgr.getInstance().reqShopInfo();
			}
		}, "打开砖石商店");
		this.connect("click", this.ui.btn_receive, this.receive, "领取周宝箱");
		this.connect("click", this.ui.btn_buy, this.buy, "购买宝箱");
	}
	//网络事件回调begin
	recVipWeekPrize() {
		this.model.initData();
		this.btn_receive.getComponent(cc.Button).interactable = false;
		ModuleMgr.getInstance().showGainBox(vipMgr.dictItemInfo)
	}
	buyVipGift() {
		this.model.initData();
		this.btn_buy.getComponent(cc.Button).interactable = false;
		ModuleMgr.getInstance().showGainBox(vipMgr.vipGift)
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	initData() {
		this.model.initData();
		this.note_vip.children[0].getComponent(cc.Toggle).isChecked =false;
		let level = this.model.vipLevel == 0 ? 0 : this.model.vipLevel - 1;
		this.note_vip.children[level].getComponent(cc.Toggle).isChecked = true;
		this.choseVip(level)
		this.model.setExeData();
		this.view.showIcon("vip_" + this.model.vipLevel)
		this.view.showLabelString(this.ui.lab_exe.getComponent(cc.Label), this.model.vipExeText)
		this.view.showLabelString(this.ui.lab_need.getComponent(cc.Label), this.model.vipNeedText)
		this.view.showLabelString(this.ui.lab_nextLevel.getComponent(cc.Label), this.model.vipNextLevelText)
		this.view.showProgress(this.ui.sp_vipExePercent.getComponent(cc.Sprite), this.model.vipExePercent)
	}
	choseVip(index: number) {
		this.model.setCurVipLevel(index + 1)
		this.model.setVipShopText(index);
		this.model.setvipWelfareText(index);
		this.setShopBox(index)
		this.setWelfareBox(index)
		this.view.showLabelString(this.ui.lab_cost.getComponent(cc.Label), this.model.vip[index].price.toString())
		this.view.showLabelString(this.ui.lab_des.getComponent(cc.Label), this.model.vip[index].des)
		this.view.showLabelString(this.ui.lab_vipShopText.getComponent(cc.Label), this.model.vipShopText)
		this.view.showLabelString(this.ui.lab_vipWelfareText.getComponent(cc.Label), this.model.vipWelfareText)
	}
	setShopBox(index: number) {
		if (index + 1 > this.model.vipLevel) {
			this.btn_buy.getComponent(cc.Button).interactable = false;
		}
		else if (this.model.vipGiftInfo[index + 1]) {
			this.btn_buy.getComponent(cc.Button).interactable = false;
		}
		else {
			this.btn_buy.getComponent(cc.Button).interactable = true;
		}
	}
	setWelfareBox(index: number) {
		if (index + 1 > this.model.vipLevel) {
			this.btn_receive.getComponent(cc.Button).interactable = false;
		}
		else if (this.model.vipWeekPrizeInfo[index + 1]) {
			this.btn_receive.getComponent(cc.Button).interactable = false;
		}
		else {
			this.btn_receive.getComponent(cc.Button).interactable = true;
		}
	}
	//领取周宝箱
	receive() {
		vipMgr.sendRecVipWeekPrize(this.model.curVipLevel)
	}
	buy() {
		vipMgr.sendBuyVipGift(this.model.curVipLevel)
	}
	// update(dt) {}
	close() {
		this.closeModule("vip")
	}
	onDestroy() {
		super.onDestroy();
	}
}