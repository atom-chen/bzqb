import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import { dataids } from "../../../../framework/net/dataids";

/*
author: 汤凯
日期:2018-11-19
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	searchName = null;
	guildList = GuildsMgr.getInstance().getRandomGuildList();
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_search: ctrl.btn_search,
		btn_invitationReceive: ctrl.btn_invitationReceive,
		btn_createGuild: ctrl.btn_createGuild,
		btn_refreshGuilds: ctrl.btn_refreshGuilds,
		edit_searchName: ctrl.edit_searchName,
		pref_guild: ctrl.pref_guild,
		node_guildListNode: ctrl.node_guildListNode,
		scroll_bar:ctrl.scroll_bar,
		pref_guildInvitedPanel: ctrl.pref_guildInvitedPanel,
		node_guildInvitedPanelContent: ctrl.node_guildInvitedPanelContent
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	freshGuildList()
	{
		this.ui.node_guildListNode.destroyAllChildren();
		for (let guildIdx = 0; guildIdx < this.model.guildList.length; guildIdx++) {
			let guildItemData = this.model.guildList[guildIdx];
			let guildItem = cc.instantiate(this.ui.pref_guild);
			this.ui.node_guildListNode.addChild(guildItem);
			guildItem.getComponent('guildItem').updateAndShowGuildItem(guildItemData);
		}
	}
	addGuildInvitedPanel()
	{
		this.ui.node_guildInvitedPanelContent.destroyAllChildren();
		let guildInvitedPanel = cc.instantiate(this.ui.pref_guildInvitedPanel);
		this.ui.node_guildInvitedPanelContent.addChild(guildInvitedPanel);
	}
}
//c, 控制
@ccclass
export default class GuildsPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_search: cc.Button = null;
	@property(cc.Button)
	btn_invitationReceive: cc.Button = null;
	@property(cc.Button)
	btn_createGuild: cc.Button = null;
	@property(cc.Button)
	btn_refreshGuilds: cc.Button = null;
	@property(cc.Prefab)
	pref_createGuild: cc.Prefab = null;
	@property(cc.EditBox)
	edit_searchName: cc.EditBox = null;
	@property(cc.Prefab)
	pref_guild: cc.Prefab = null;
	@property(cc.Node)
	node_guildListNode: cc.Node = null;
	@property(cc.ScrollView)
	scroll_bar: cc.ScrollView = null;
	@property(cc.Prefab)
	pref_guildInvitedPanel: cc.Prefab = null;
	@property(cc.Node)
	node_guildInvitedPanelContent: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
            'search.entry.randomGuildList':this.search_entry_randomGuildList,
            'search.entry.searchGuild':this.search_entry_searchGuild,
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
		this.connect("click",this.ui.btn_search,this.btnSearch.bind(this),"搜索公会");
		this.connect("click",this.ui.btn_invitationReceive,this.btnInvitationReceive.bind(this),"收到公会邀请");
		this.connect("click",this.ui.btn_createGuild,this.btnCreateGuild.bind(this),"创建公会");
		this.connect("click",this.ui.btn_refreshGuilds,this.btnRefreshGuilds.bind(this),"换一批");
		this.connect("editing-did-ended",this.ui.edit_searchName,this.editSearchNameChangedEnd.bind(this),"输入公会名称");
		this.connect("scroll-to-bottom",this.ui.scroll_bar.node,this.scrollToBottom.bind(this),"拉到末尾");
		this.connect("scroll-to-top",this.ui.scroll_bar.node,this.scrollToTop.bind(this),"拉到头");
	}
	search_entry_randomGuildList()
	{
		this.model.guildList = GuildsMgr.getInstance().getRandomGuildList();
		this.view.freshGuildList();
	}
	scrollToBottom(event)
	{
		console.log("scrollToBottom",event)
	}
	scrollToTop(event)
	{
		console.log("scrollToTop",event)
	}
	search_entry_searchGuild(msg)
	{
		console.log('search_entry_searchGuild',msg)
        this.model.guildList = msg.getDataByType(dataids.ID_GUILDLIST);
		this.view.freshGuildList();
	}
	btnSearch()
	{
		if(this.model.searchName) {
			GuildsMgr.getInstance().reqSearchGuild(this.model.searchName);
		}
	}
	btnInvitationReceive()
	{
		this.view.addGuildInvitedPanel();
	}
	btnCreateGuild()
	{
		let createGuildNode = cc.instantiate(this.pref_createGuild);
		this.node.addChild(createGuildNode);
		// GuildsMgr.getInstance().reqCreateGuild();
	}
	btnRefreshGuilds()
	{
		GuildsMgr.getInstance().reqRandomGuildList();
	}
	editSearchNameChangedEnd(event)
	{
		this.model.searchName = event.string;
	}
	btnGuildItemClick()
	{

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