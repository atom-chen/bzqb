import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import { enums } from "../../../../manager/enums";
import TableMgr from "../../../../manager/public/tableMgr";

/*
author: 汤凯
日期:2018-11-19
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: CreateGuildCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildName = null;
	badgeId = 0;
	enterType = enums.GuildJoinType_AllJoin;
	neededStage = 1;
	constructor() {
		super();
	}
	updateEnterType(increment)
	{
		this.enterType += increment;
		if(this.enterType>enums.GuildJoinType_CannotJoin) {
			this.enterType=enums.GuildJoinType_AllJoin;
		}
		if(this.enterType<enums.GuildJoinType_AllJoin) {
			this.enterType=enums.GuildJoinType_CannotJoin;
		}
	}
	updateNeededStage(increment)
	{
		this.neededStage += increment;
		if(this.neededStage>10) {
			this.neededStage=1;
		}
		if(this.neededStage<1) {
			this.neededStage=10;
		}
	}
	updateBadge(badgeId)
	{
		this.badgeId = badgeId;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_create: ctrl.btn_create,
		btn_close: ctrl.btn_close,
		edit_guildName:ctrl.edit_guildName,
		lbl_guildType:ctrl.lbl_guildType,
		lbl_guildRank:ctrl.lbl_guildRank,
		btn_enterTypeUp: ctrl.btn_enterTypeUp,
		btn_enterTypeDown: ctrl.btn_enterTypeDown,
		btn_divisionUp: ctrl.btn_divisionUp,
		btn_divisionDown: ctrl.btn_divisionDown,
		node_iconsPanel: ctrl.node_iconsPanel,
		btn_selectIcons: ctrl.btn_selectIcons,
		btn_clippingNode: ctrl.btn_clippingNode
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	updateEnterType()
	{

		switch(this.model.enterType)
		{
			case enums.GuildJoinType_CannotJoin:
				this.ui.lbl_guildType.string = '不可加入';
			break;
			case enums.GuildJoinType_NeedApproval:
				this.ui.lbl_guildType.string = '需要批准';
			break;
			default:
				this.ui.lbl_guildType.string = '允许任何人';
			break
		}
	}
	updateNeededStage()
	{
        let card =TableMgr.getInstance().search('duanwei_duanwei',{stage:this.model.neededStage});
		this.ui.lbl_guildRank.string = card.name;
	}
	updateBadge()
	{

		switch(this.model.badgeId)
		{
			case enums.Get_Gold:
				// this.ui.lbl_guildRank.string = '不可加入';
			break;
			case enums.Get_Gold:
				// this.ui.lbl_guildRank.string = '需要批准';
			break;
			default:
				// this.ui.lbl_guildRank.string = '允许任何人';
			break
		}
	}
	showIconsPanel(flag)
	{
		this.ui.node_iconsPanel.active = flag;
	}
}
//c, 控制
@ccclass
export default class CreateGuildCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_create: cc.Button = null;
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.EditBox)
	edit_guildName: cc.EditBox = null;
	@property(cc.Label)
	lbl_guildType: cc.Label = null;
	@property(cc.Label)
	lbl_guildRank: cc.Label = null;
	@property(cc.Sprite)
	spr_guildBadge: cc.Sprite = null;
	@property(cc.Button)
	btn_enterTypeUp: cc.Button = null;
	@property(cc.Button)
	btn_enterTypeDown: cc.Button = null;
	@property(cc.Button)
	btn_divisionUp: cc.Button = null;
	@property(cc.Button)
	btn_divisionDown: cc.Button = null;
	@property(cc.Node)
	node_iconsPanel: cc.Node = null;
	@property(cc.Button)
	btn_clippingNode: cc.Button = null;
	@property(cc.Button)
	btn_selectIcons: cc.Button = null;
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
            'plaza.guild.createGuild': this.plaza_guild_createGuild
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click",this.ui.btn_create,this.btnCreate.bind(this),"创建公会");
		this.connect("click",this.ui.btn_close,this.btnClose.bind(this),"关闭");
		// this.connect("text-changed",this.ui.edit_guildName,this.editGuildNameChanged.bind(this),"公会名称编辑中");
		this.connect("editing-did-ended",this.ui.edit_guildName,this.editGuildNameChangedEnd.bind(this),"公会名称编辑完");
		this.connect("click",this.ui.btn_enterTypeUp,this.btnEnterTypeUp.bind(this),"关闭");
		this.connect("click",this.ui.btn_enterTypeDown,this.btnEnterTypeDown.bind(this),"关闭");
		this.connect("click",this.ui.btn_divisionUp,this.btnDivisionUp.bind(this),"关闭");
		this.connect("click",this.ui.btn_divisionDown,this.btnDivisionDown.bind(this),"关闭");
		this.connect("click",this.ui.btn_selectIcons,this.btnSelectIcons.bind(this),"点击切换公会徽章");
		this.connect("click",this.ui.btn_clippingNode,this.btnClippingNode.bind(this),"点击隐藏底板");
		this.connectIcons();
	}
	connectIcons()
	{
		let iconsList = this.node_iconsPanel.children;
		for (let i = 0; i < iconsList.length; i++) {
			this.connect("click",iconsList[i],()=>{
				console.log("click icon",i);
				this.view.showIconsPanel(false);
			}),"点击徽章");
		}
	}
	btnSelectIcons()
	{
		this.view.showIconsPanel(true);
	}
	btnClippingNode()
	{
		this.view.showIconsPanel(false);
	}
	btnEnterTypeUp()
	{
		this.model.updateEnterType(1);
		this.view.updateEnterType();
	}
	btnEnterTypeDown()
	{
		this.model.updateEnterType(-1);
		this.view.updateEnterType();
	}
	btnDivisionUp()
	{
		this.model.updateNeededStage(1);
		this.view.updateNeededStage();
	}
	btnDivisionDown()
	{
		this.model.updateNeededStage(-1);
		this.view.updateNeededStage();
	}
	btnCreate()
	{
		if(this.model.guildName) {
			GuildsMgr.getInstance().reqCreateGuild(this.model.guildName,this.model.badgeId,this.model.enterType,this.model.neededStage);
		}
	}
	btnClose()
	{
		this.remove();
	}
	editGuildNameChanged(event)
	{
	}
	editGuildNameChangedEnd(event)
	{
		this.model.guildName = event.string;
	}
	plaza_guild_createGuild()
	{
		GuildsMgr.getInstance().reqMyGuildDetail();
		GuildsMgr.getInstance().reqGuildMembers(GuildsMgr.getInstance().getGuildId(),0);
		this.remove();
		this.closeModule("guilds");
		this.openSubModule('guildsInfo');
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}