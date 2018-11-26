import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import ShopMgr from "../../../../manager/public/shopMgr";
import { enums } from "../../../../manager/enums";
import GameNet from "../../../../framework/modules/GameNet";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";


/*
author: 蒙磊
日期:2018-11-05 20:15:41
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: ShopCtrl;
let shopMgr = ShopMgr.getInstance();
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public shopState: string =null;
	public boxShop: any = []
	public cardShop: any = []
	public goldShop: any = []
	public crystalShop: any = []
	public diamondShop: any = []
	//刷新时间
	serverDelay:number =null;
	refreshEndTime:number=null;
	refreshTimeText:string=null;
	refreshTimesText:string=null;
	initData() {
		this.shopState =shopMgr.shopState;
		this.initBoxData();
		this.initMoneyData();
		this.initCrystalData();
		this.initDiamondData();
		this.initCardData();
	}
	initBoxData() {
		this.boxShop = shopMgr.boxShop;
	}
	initCardData() {
		this.cardShop = shopMgr.cardShop;
	}
	initMoneyData() {
		this.goldShop = shopMgr.goldShop;
	}
	initCrystalData() {
		this.crystalShop = shopMgr.crystalShop;
	}
	initDiamondData() {
		this.diamondShop = shopMgr.diamondShop;
	}
	public initRefreshTime(){
		this.serverDelay = GameNet.getInstance().getServerDelay();
		this.refreshEndTime =shopMgr.cardShopRefreshTime+(enums.Shop_RefreshTime*1000);
		console.log(shopMgr.cardShopRefreshTime,enums.Shop_RefreshTime)
	}
	public initRefreshTimes(){
		this.refreshTimesText =(20-shopMgr.refreshCount)+"/20";
	}
	public setRefreshTime() {
		let serverTime = Date.now() + this.serverDelay;
		let refreshNeedTime = this.refreshEndTime-serverTime;
		refreshNeedTime = refreshNeedTime > 0 ? refreshNeedTime : 0;
		let hour = Math.floor((refreshNeedTime / 1000) / 3600)
		let minute = Math.floor(((refreshNeedTime / 1000) % 3600) / 60)
		let second = Math.floor((refreshNeedTime / 1000) % 60)  
		let hours = hour >= 10 ? hour : '0' + hour;
		let minutes = minute >= 10 ? minute : '0' + minute;
		let seconds = second >= 10 ? second : '0' + second;
		// this.onlineBoxPercent = unlockNeedTime / (this.onlineBox.boxInfo.Onlinetime[this.onlineBox.boxTimes].time * 1000);
		this.refreshTimeText = hours + ":" + minutes+":"+seconds;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;

	public ui = {
		//在这里声明ui
		btn_box: ctrl.btn_box,
		btn_card: ctrl.btn_card,
		btn_money: ctrl.btn_money,
		btn_crystal: ctrl.btn_crystal,
		btn_diamond: ctrl.btn_diamond,
		btn_back: ctrl.btn_back,
		boxContent: ctrl.boxContent,
		boxShop: ctrl.boxShop,
		moenyContent: ctrl.moenyContent,
		goldShop: ctrl.goldShop,
		crystalShop: ctrl.crystalShop,
		crystalContent: ctrl.crystalContent,
		diamondContent: ctrl.diamondContent,
		diamondShop: ctrl.diamondShop,
		note_card: ctrl.note_card,
		cardShop: ctrl.cardShop,
		lab_refreshCost: ctrl.lab_refreshCost,
		refreshTimes: ctrl.refreshTimes,
		refreshTime: ctrl.refreshTime,
		btn_refresh:ctrl.btn_refresh,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	public addPrefab(obj_node: cc.Node, obj_Prefab: cc.Prefab) {
		return this.addPrefabNode(obj_Prefab, obj_node);
	}
	//初始化ui
	public initUi() {
		this.ui.lab_refreshCost.getComponent(cc.Label).string =enums.Shop_RefreshFee.toString();
	}
	showRefreshTime(){
		this.ui.refreshTimes.getComponent(cc.Label).string =this.model.refreshTimesText;
		this.ui.refreshTime.getComponent(cc.Label).string =this.model.refreshTimeText;
	}

}
//c, 控制
@ccclass
export default class ShopCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//btn
	@property(cc.Node)
	btn_box: cc.Node = null;
	@property(cc.Node)
	btn_card: cc.Node = null;
	@property(cc.Node)
	btn_money: cc.Node = null;
	@property(cc.Node)
	btn_crystal: cc.Node = null;
	@property(cc.Node)
	btn_diamond: cc.Node = null;
	@property(cc.Node)
	btn_back: cc.Node = null;
	@property(cc.Node)
	btn_refresh: cc.Node = null;

	//note
	@property(cc.Node)
	boxContent: cc.Node = null;
	@property(cc.Node)
	moenyContent: cc.Node = null;
	@property(cc.Node)
	crystalContent: cc.Node = null;
	@property(cc.Node)
	diamondContent: cc.Node = null;
	@property(cc.Node)
	note_card: cc.Node = null;

	//Prefab
	@property(cc.Prefab)
	boxShop: cc.Prefab = null;
	@property(cc.Prefab)
	goldShop: cc.Prefab = null;
	@property(cc.Prefab)
	crystalShop: cc.Prefab = null;
	@property(cc.Prefab)
	diamondShop: cc.Prefab = null;
	@property(cc.Prefab)
	cardShop: cc.Prefab = null;

	//label
	@property(cc.Node)
	lab_refreshCost: cc.Node = null;
	@property(cc.Node)
	refreshTimes: cc.Node = null;
	@property(cc.Node)
	refreshTime: cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	boxList: any = [];
	goldList: any = [];
	crustalList: any = [];
	diamondList: any = [];
	cardList: any = [];


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initData();
	}
	//显示回调
	onEnable(){
		
	}
	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			'plaza.shop.refreshShop': this.refreshShop,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_back, this.back, "返回");
		this.connect("click", this.ui.btn_refresh, this.refresh, "刷新");
	}
	
	updataCardShop() {
		this.model.initCardData();
		for (let i = 0; i < this.cardList.length; i++) {
			let obj = this.cardList[i];
			let data = this.model.cardShop;
			console.log(data[i])
			obj.getComponent("cardShop").setData(data[i].price, data[i].amount, data[i].name, data[i].priceType)
		}
	}
	RefreshTiming(){
		this.schedule(timing=>{
			this.model.setRefreshTime();
			this.view.showRefreshTime();
		},1)
	}
	//进入哪个商店
	choseShop(name) {
		cc.log(name, this.ui["btn_" + name].getComponent(cc.Toggle).isChecked)
		//cc.log(this.ui["btn_"+name].getComponent(cc.Toggle).isChecked)
		this.ui["btn_" + name].getComponent(cc.Toggle).isChecked = true;
	}
	initData() {
		this.model.initData();
		this.btn_box.getComponent(cc.Toggle).isChecked =false;
		console.log("---宝箱商店---", this.model.boxShop)
		this.ui.boxContent.width = (this.model.boxShop.length) * 320
		for (let i = 0; i < this.model.boxShop.length; i++) {
			let boxShop = this.view.addPrefab(this.ui.boxContent, this.ui.boxShop)
			let cost = this.model.boxShop[i].price.amount;
			let gift = this.model.boxShop[i].gift[0].amount;
			boxShop.getComponent('boxShop').setData(cost, gift);
			boxShop.setPosition(cc.v2(160 + (i * 320), 0))
		}
		console.log("---卡片商店---", this.model.cardShop)
		for (let i = 0; i < this.model.cardShop.length; i++) {
			let cardShop = this.view.addPrefab(this.ui.note_card, this.ui.cardShop)
			let cost = this.model.cardShop[i].price;
			let count = this.model.cardShop[i].amount;
			let name = this.model.cardShop[i].name;
			let priceType = this.model.cardShop[i].priceType;
			let card = this.model.cardShop[i].card;
			cardShop.getComponent('cardShop').setData(cost, count, name, priceType);
			cardShop.setPosition(cc.v2(-250 + ((i % 2) * 350), 155 - (Math.floor(i / 2) * 140)))
			this.cardList.push(cardShop)
		}
		console.log("---金币商店---", this.model.goldShop)
		this.ui.moenyContent.width = (this.model.goldShop.length) * 320
		for (let i = 0; i < this.model.goldShop.length; i++) {
			let goldShop = this.view.addPrefab(this.ui.moenyContent, this.ui.goldShop)
			let cost = this.model.goldShop[i].price.amount;
			let gift = this.model.goldShop[i].gift[0].amount;
			let reward = this.model.goldShop[i].reward[0].amount;
			let name = this.model.goldShop[i].name;
			goldShop.getComponent('goldShop').setData(cost, gift, reward, name);
			goldShop.setPosition(cc.v2(160 + (i * 320), 0))
		}
		console.log("---粉晶商店---", this.model.crystalShop)
		this.ui.crystalContent.width = (this.model.crystalShop.length) * 320
		for (let i = 0; i < this.model.crystalShop.length; i++) {
			let crystalShop = this.view.addPrefab(this.ui.crystalContent, this.ui.crystalShop)
			let cost = this.model.crystalShop[i].price==null?0:this.model.crystalShop[i].price.amount;
			let gift = this.model.crystalShop[i].gift ? this.model.crystalShop[i].gift[0].amount : 0;
			let reward = this.model.crystalShop[i].reward[0].amount;
			let name = this.model.crystalShop[i].name;
			crystalShop.getComponent('crystalShop').setData(cost, gift, reward, name);
			crystalShop.setPosition(cc.v2(160 + (i * 320), 0))
		}
		console.log("---砖石商店---", this.model.diamondShop)
		this.ui.diamondContent.width = (this.model.diamondShop.length) * 320
		for (let i = 0; i < this.model.diamondShop.length; i++) {
			let diamondShop = this.view.addPrefab(this.ui.diamondContent, this.ui.diamondShop)
			let cost = this.model.diamondShop[i].Recharge;
			let gift = this.model.diamondShop[i].gift ? this.model.diamondShop[i].gift[0].amount : 0;
			let reward = this.model.diamondShop[i].reward[0].amount;
			let name = this.model.diamondShop[i].name;
			diamondShop.getComponent('diamondShop').setData(cost, gift, reward, name);
			diamondShop.setPosition(cc.v2(160 + (i * 320), 0))
		}
		this.choseShop(this.model.shopState)
		//计时
		this.model.initRefreshTime();
		this.model.setRefreshTime();
		this.model.initRefreshTimes();
		this.view.showRefreshTime();
		this.RefreshTiming();
	}

	//网络事件回调begin
	refreshShop(){
		this.updataCardShop();
		this.model.initRefreshTimes();
		this.view.showRefreshTime();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	back() {
		this.closeModule("shop")
	}
	openPrefabCB(name) {
		return this.openSubModule(name)
	}
	refresh(){
		ModuleMgr.getInstance().showMsgBox({content:"是否花费50进行商店刷新？",okcb:this.sendRefreshMsg})
	}
	sendRefreshMsg(){
		shopMgr.reqRefreshShop();
	}
	//end

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}