import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import ShopMgr from "../../../../manager/public/shopMgr";
import UserMgr from "../../../../manager/public/userMgr";
/*
author: 陈斌杰
日期:2018-11-09 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsInfoCtrl;
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
	public ui={
		btn_close: ctrl.btn_close,
		pref_guildsInfoPanel: ctrl.pref_guildsInfoPanel,
		pref_guildsFrame: ctrl.pref_guildsFrame,
		node_funcBlocks: ctrl.node_funcBlocks,
		btn_guildMembers: ctrl.btn_guildMembers,
		btn_guildTreasureCase: ctrl.btn_guildTreasureCase,
		btn_guildShop: ctrl.btn_guildShop,
		btn_guildApplication: ctrl.btn_guildApplication,
		node_panel: ctrl.node_panel,
		pref_guildShop: ctrl.pref_guildShop,
		pref_guildTreasureCasesPanel: ctrl.pref_guildTreasureCasesPanel,
		pref_guildsApplicationPanel: ctrl.pref_guildsApplicationPanel,
		guildsInfoPanel : null,
		guildsShopPanel : null,
		guildsTreasureCasePanel : null,
		guildsApplicationPanel : null,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.guildsInfoPanel=cc.instantiate(this.ui.pref_guildsInfoPanel);
		this.ui.node_panel.addChild(this.ui.guildsInfoPanel);
		this.ui.guildsShopPanel=cc.instantiate(this.ui.pref_guildShop);		
		this.ui.guildsShopPanel.active = false;
		this.ui.node_panel.addChild(this.ui.guildsShopPanel);
		this.ui.guildsTreasureCasePanel=cc.instantiate(this.ui.pref_guildTreasureCasesPanel);		
		this.ui.guildsTreasureCasePanel.active = false;
		this.ui.node_panel.addChild(this.ui.guildsTreasureCasePanel);
		this.ui.guildsApplicationPanel=cc.instantiate(this.ui.pref_guildsApplicationPanel);		
		this.ui.guildsApplicationPanel.active = false;
		this.ui.node_panel.addChild(this.ui.guildsApplicationPanel);
	}
	initGuildFrame()
	{
		let prefabNode=cc.instantiate(this.ui.pref_guildsFrame);
		this.node.addChild(prefabNode);
		this.ui.node_funcBlocks.active = true;
	}
	addGuildMembersPanel()
	{
		//this.ui.node_panel.removeAllChildren();
		if(this.ui.guildsShopPanel) {
			this.ui.guildsShopPanel.active = false;
		}
		if(this.ui.guildsInfoPanel) {
			this.ui.guildsInfoPanel.active = true;
		}
		if(this.ui.guildsApplicationPanel) {
			this.ui.guildsApplicationPanel.active = false;
		}
		if(this.ui.guildsTreasureCasePanel) {
			this.ui.guildsTreasureCasePanel.active = false;
		}
	}
	addGuildShopPanel()
	{
		//this.ui.node_panel.removeAllChildren();
		if(this.ui.guildsInfoPanel) {
			this.ui.guildsInfoPanel.active = false;
		}
		if(this.ui.guildsShopPanel) {
			this.ui.guildsShopPanel.active = true;
		}
		if(this.ui.guildsApplicationPanel) {
			this.ui.guildsApplicationPanel.active = false;
		}
		if(this.ui.guildsTreasureCasePanel) {
			this.ui.guildsTreasureCasePanel.active = false;
		}
	}
	addGuildTreasureCasePanel()
	{
		if(this.ui.guildsInfoPanel) {
			this.ui.guildsInfoPanel.active = false;
		}
		if(this.ui.guildsShopPanel) {
			this.ui.guildsShopPanel.active = false;
		}
		if(this.ui.guildsApplicationPanel) {
			this.ui.guildsApplicationPanel.active = false;
		}
		if(this.ui.guildsTreasureCasePanel) {
			this.ui.guildsTreasureCasePanel.active = true;
		}
	}
	addGuildsApplicationPanel()
	{
		if(this.ui.guildsInfoPanel) {
			this.ui.guildsInfoPanel.active = false;
		}
		if(this.ui.guildsShopPanel) {
			this.ui.guildsShopPanel.active = false;
		}
		if(this.ui.guildsApplicationPanel) {
			this.ui.guildsApplicationPanel.active = true;
		}
		if(this.ui.guildsTreasureCasePanel) {
			this.ui.guildsTreasureCasePanel.active = false;
		}
	}
}
//c, 控制
@ccclass
export default class GuildsInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Prefab)
	pref_guildsInfoPanel: cc.Prefab = null;
	@property(cc.Prefab)
	pref_guildsFrame: cc.Prefab = null;
	@property(cc.Node)
	node_funcBlocks: cc.Node = null;
	@property(cc.Button)
	btn_guildMembers: cc.Button = null;
	@property(cc.Button)
	btn_guildTreasureCase: cc.Button = null;
	@property(cc.Button)
	btn_guildShop: cc.Button = null;
	@property(cc.Button)
	btn_guildApplication: cc.Button = null;
	@property(cc.Node)
	node_panel: cc.Node = null;
	@property(cc.Prefab)
	pref_guildShop: cc.Prefab = null;
	@property(cc.Prefab)
	pref_guildTreasureCasesPanel: cc.Prefab = null;
	@property(cc.Prefab)
	pref_guildsApplicationPanel: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
		this.view.initGuildFrame();
		this.view.addGuildMembersPanel();
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
            'guild.member.quitGuild': this.guild_member_quitGuild,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click",this.ui.btn_close,()=>{
			GuildsMgr.getInstance().clearDatas();
			this.closeModule("guildsInfo");
		},"关闭公会界面");
		this.connect("click",this.ui.btn_guildMembers,this.btnGuildMembers.bind(this),"公会成员");
		this.connect("click",this.ui.btn_guildTreasureCase,this.btnGuildTreasureCase.bind(this),"公会宝箱");
		this.connect("click",this.ui.btn_guildShop,this.btnGuildShop.bind(this),"公会商店");
		this.connect("click",this.ui.btn_guildApplication,this.btnGuildApplication.bind(this),"公会申请");
	}
	btnGuildApplication()
	{
		this.view.addGuildsApplicationPanel();
	}
	btnGuildShop()
	{
		this.view.addGuildShopPanel();
	}
	btnGuildTreasureCase()
	{
		this.view.addGuildTreasureCasePanel();
	}
	btnGuildMembers()
	{
		this.view.addGuildMembersPanel();
	}
	guild_member_quitGuild()
	{
		GuildsMgr.getInstance().clearDatas();
		this.closeModule("guildsInfo");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	onDestroy() {
		GuildsMgr.getInstance().clearDatas();
		super.onDestroy();
	}
}