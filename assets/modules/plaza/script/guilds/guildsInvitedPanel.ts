import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";
import { enums } from "../../../../manager/enums";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import UnsettledMgr  from "../../../../manager/public/unsettledMgr";

/*
author: 汤凯
日期:2018-11-22
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsInvitedPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildInvitedIndexInfo = UnsettledMgr.getInstance().getGuildInvited();
	guildInvitedFullInfo = null;
	constructor() {
		super();
		if(this.guildInvitedIndexInfo) {
			GuildsMgr.getInstance().reqGuildInviteBrief();
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_refussAll: ctrl.btn_refussAll,
		btn_close: ctrl.btn_close,
		pref_guildInvitedInfo: ctrl.pref_guildInvitedInfo,
		node_guildInvitedInfoPanel: ctrl.node_guildInvitedInfoPanel,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.addGuildInvitedInfo();
	}
	addGuildInvitedInfo(){
		if(this.model.guildInvitedFullInfo) {
			this.ui.node_guildInvitedInfoPanel.destroyAllChildren();
			for (let guildInvitedFullInfoIdx = 0; guildInvitedFullInfoIdx < this.model.guildInvitedFullInfo.length; guildInvitedFullInfoIdx++) {
				let invitedData = this.model.guildInvitedFullInfo[guildInvitedFullInfoIdx];
				let prefabNode = cc.instantiate(this.ui.pref_guildInvitedInfo);
				this.ui.node_guildInvitedInfoPanel.addChild(prefabNode);
				prefabNode.getComponent('guildInviteInfo').updateInvitedInfoAndShow(invitedData);
			}
		}
	}
}
//c, 控制
@ccclass
export default class GuildsInvitedPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_refussAll: cc.Button = null;
	@property(cc.Prefab)
	pref_guildInvitedInfo: cc.Prefab = null;
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Node)
	node_guildInvitedInfoPanel: cc.Node = null;
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
            'search.entry.reqGuildInviteBrief': this.search_entry_reqGuildInviteBrief,
            'plaza.guild.agreeInvitation': this.plaza_guild_agreeInvitation,
            'plaza.guild.refuseInvitation': this.plaza_guild_refuseInvitation,
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
		this.connect("click",this.ui.btn_refussAll,this.btnRefussAll.bind(this),"全部拒绝");
		this.connect("click",this.ui.btn_close,this.btnClose.bind(this),"关闭")

	}
	btnRefussAll()
	{
		GuildsMgr.getInstance().refuseInvitation();
		console.log("全部拒绝")
	}
	btnClose()
	{
		this.remove();
	}
	search_entry_reqGuildInviteBrief()
	{
		this.model.guildInvitedFullInfo = GuildsMgr.getInstance().getGuildInvitedInfo();
		this.view.addGuildInvitedInfo();
	}
	plaza_guild_agreeInvitation(msg:Package)
	{
        let guildId = msg.getDataByType(dataids.ID_USREGUILDID_CHANGED);
        console.log("plaza_guild_agreeInvitation",guildId)
        if(guildId) {
			GuildsMgr.getInstance().reqMyGuildDetail();
			GuildsMgr.getInstance().reqGuildMembers(guildId,0);
			this.remove();
			this.closeModule("guilds");
			this.openSubModule('guildsInfo');
        }
	}
	plaza_guild_refuseInvitation()
	{
		this.remove();
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