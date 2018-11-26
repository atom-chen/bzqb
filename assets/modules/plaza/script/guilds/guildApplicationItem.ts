import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import { enums } from "../../../../manager/enums";
import { dataids } from "../../../../framework/net/dataids";
import Package from "../../../..framework/net/package";

/*
author: 汤凯
日期:2018-11-20 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildApplicationItemCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildInfo = GuildsMgr.getInstance().getGuildInfo();
	guildApplicationInfo = null;
	guildApplicationInfoIdx = 0;
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		spr_guildPlayerIcon: ctrl.spr_guildPlayerIcon,
		spr_guildPlayerStageIcon: ctrl.spr_guildPlayerStageIcon,
		lbl_guildPlayerName: ctrl.lbl_guildPlayerName,
		lbl_guildPlayerPosition: ctrl.lbl_guildPlayerPosition,
		btn_agress: ctrl.btn_agress,
		btn_refuss: ctrl.btn_refuss,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		// this.showGuildApplicationInfo();
	}
	public showGuildApplicationInfo()
	{
		if(this.model.guildApplicationInfo ) {
			this.ui.lbl_guildPlayerName.string = "test";
			// this.ui.lbl_guildPlayerStage.string = this.model.guildPlayerInfo.stageIndex;
			// this.ui.lbl_guildPlayerDonate.string = this.model.guildPlayerInfo.donate;
			// this.ui.spr_guildPlayerIcon
			// this.ui.spr_guildPlayerStageIcon 
		}
	}
}
//c, 控制
@ccclass
export default class GuildApplicationItemCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	spr_guildPlayerIcon: cc.Sprite = null;
	@property(cc.Sprite)
	spr_guildPlayerStageIcon: cc.Sprite = null;
	@property(cc.Label)
	lbl_guildPlayerName: cc.Label = null;
	@property(cc.Label)
	lbl_guildPlayerPosition: cc.Label = null;
	@property(cc.Button)
	btn_agress: cc.Button = null;
	@property(cc.Button)
	btn_refuss: cc.Button = null;

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
            'guild.guild.agreeApply': this.guild_guild_agreeApply,
            'guild.guild.refuseApply': this.guild_guild_refuseApply,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		// this.connect("click",this.node,this.guildPlayerNodeClick.bind(this),"点击公会成员");
		this.connect("click",this.ui.btn_agress,this.btnAgress.bind(this),"允许加入");
		this.connect("click",this.ui.btn_refuss,this.btnRefuss.bind(this),"拒绝");
	}
	btnAgress()
	{
		GuildsMgr.getInstance().agreeApply(this.model.guildApplicationInfoIdx);
		console.log("btnAgress")
	}
	btnRefuss()
	{
		console.log("btnRefuss")
		GuildsMgr.getInstance().refuseApply(this.model.guildApplicationInfoIdx);
	}
	UpdateAndShowGuildApplicationInfo(data,index)
	{
		console.log("UpdateAndShowGuildApplicationInfo",data)
		this.model.guildApplicationInfo = data;
		this.model.guildApplicationInfoIdx = index;
		this.view.showGuildApplicationInfo();
	}
	guild_guild_agreeApply(msg: Package)
	{
		let applicationIdx = msg.getDataByType(dataids.ID_AGREE_GUILD_APPLY);
		if( applicationIdx == this.model.guildApplicationInfoIdx) {
			this.remove();
		}
	}
	guild_guild_refuseApply(msg: Package)
	{
		let applicationIdx = msg.getDataByType(dataids.ID_REFUSE_GUILD_APPLY);
		if( applicationIdx == this.model.guildApplicationInfoIdx) {
			this.remove();
		}
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