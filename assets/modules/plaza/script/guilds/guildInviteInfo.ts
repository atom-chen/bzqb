import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import { enums } from "../../../../manager/enums";
import { dataids } from "../../../../framework/net/dataids";

/*
author: 汤凯
日期:2018-11-20 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildInviteInfoCtrl;
//模型，数据处理
class Model extends BaseModel {
	invitedInfo = null;
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		lbl_guildPlayerName: ctrl.lbl_guildPlayerName,
		lbl_guildName: ctrl.lbl_guildName,
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
		// this.showGuildPlayerInfo();
	}
	showInvitedInfo()
	{
		if(this.model.invitedInfo) {
			this.ui.lbl_guildPlayerName.string = this.model.invitedInfo.nickname;
			this.ui.lbl_guildName.string = this.model.invitedInfo.guildName;
		}
	}
}
//c, 控制
@ccclass
export default class GuildInviteInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Label)
	lbl_guildPlayerName: cc.Label = null;
	@property(cc.Label)
	lbl_guildName: cc.Label = null;
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
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		// this.connect("click",this.node,this.guildPlayerNodeClick.bind(this),"点击公会成员");
		this.connect("click",this.ui.btn_agress,this.btnAgress.bind(this),"接受");
		this.connect("click",this.ui.btn_refuss,this.btnRefuss.bind(this),"拒绝");
	}
	btnAgress()
	{
		if(this.model.invitedInfo) {
			GuildsMgr.getInstance().agreeInvitation(this.model.invitedInfo.index);
		}
		console.log("btnAgress")
	}
	btnRefuss()
	{
		if(this.model.invitedInfo) {
			GuildsMgr.getInstance().refuseInvitation(this.model.invitedInfo.index);
		}
		console.log("btnRefuss")
	}
	updateInvitedInfoAndShow(data)
	{
		this.model.invitedInfo = data;
		this.view.showInvitedInfo();
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