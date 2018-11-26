import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import ShopMgr from "../../../../manager/public/shopMgr";
import { enums } from "../../../../manager/enums";

/*
author: 汤凯
日期:2018-11-22
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsShopPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildShopInfo = ShopMgr.getInstance().getGuildShopInfo();
	constructor() {
		super();
		if(!this.guildShopInfo)
		{
			ShopMgr.getInstance().reqShopInfo(enums.GuildShop_Card);
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		pref_shopItem: ctrl.pref_shopItem,
		lbl_flushCost: ctrl.lbl_flushCost,
		lbl_honorValue: ctrl.lbl_honorValue,
		lbl_tickTime: ctrl.lbl_tickTime,
		btn_flush: ctrl.btn_flush,
		node_shopItemContent:ctrl.node_shopItemContent,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.addShopItems();
	}
	public addShopItems()
	{
		if(this.model.guildShopInfo&&this.model.guildShopInfo.items) {
			for (let guildShopItemIdx = 0; guildShopItemIdx < this.model.guildShopInfo.items.length; guildShopItemIdx++) {
				let shopItemData = this.model.guildShopInfo.items[guildShopItemIdx];
				let prefabNode = cc.instantiate(this.ui.pref_shopItem);
				this.ui.node_shopItemContent.addChild(prefabNode);
				prefabNode.getComponent('cardShop').updateDateAndShowCardShop(shopItemData);
			}
		}
	}
	showTickTime(tickTime)
	{
		let hoursCube = Math.floor(tickTime/3600);
		if(hoursCube>=10) {
			hoursCube = hoursCube.toString();
		}
		else{
			hoursCube = '0'+hoursCube.toString();
		}
		let minutesCube = Math.floor(tickTime%3600/60);
		if(minutesCube>=10) {
			minutesCube = minutesCube.toString();
		}
		else{
			minutesCube = '0'+minutesCube.toString();
		}
		let secondsCube = Math.floor(tickTime%60);
		if(secondsCube>=10) {
			secondsCube = secondsCube.toString();
		}
		else{
			secondsCube = '0'+secondsCube.toString();
		}
		this.ui.lbl_tickTime.string = hoursCube+":"+minutesCube+":"+secondsCube;
	}
}
//c, 控制
@ccclass
export default class GuildsShopPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Prefab)
	pref_shopItem: cc.Prefab = null;
	@property(cc.Label)
	lbl_flushCost: cc.Label = null;
	@property(cc.Label)
	lbl_honorValue: cc.Label = null;
	@property(cc.Label)
	lbl_tickTime: cc.Label = null;
	@property(cc.Button)
	btn_flush: cc.Button = null;
	@property(cc.Node)
	node_shopItemContent: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
		//切换前后台需要对定时器进行清理和初始化
        this.schedule(this.countDown.bind(this), 2);
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
            'plaza.data.reqShopInfo': this.plaza_data_reqShopInfo,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		// this.connect("click",this.ui.btn_close,()=>{
		// 	this.closeModule("guilds");
		// },"关闭公会界面");
		this.connect("click",this.ui.btn_flush,this.btnFlush.bind(this),"刷新列表");

	}
	countDown()
	{
		if(this.model.guildShopInfo){
	        let curTime = new Date().getTime();
	        let timeGap = Math.floor((curTime - this.model.guildShopInfo.refreshTime)/1000);
	        if((timeGap)>=enums.GuildShop_RefreshTime)
	        {
				ShopMgr.getInstance().reqShopInfo(enums.GuildShop_Card);
	        }
	        else{
	        	this.view.showTickTime(enums.GuildShop_RefreshTime-timeGap)
	        }
		}
	}
	btnFlush()
	{
		ShopMgr.getInstance().refreshShop(enums.GuildShop_Card);
	}
	plaza_data_reqShopInfo()
	{
		this.model.guildShopInfo = ShopMgr.getInstance().getGuildShopInfo();
		this.view.addShopItems();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	onDestroy() {
        this.unschedule(this.countDown);
		super.onDestroy();
	}
}