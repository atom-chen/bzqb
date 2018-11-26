import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { enums } from "../../../../manager/enums";
import GuildsMgr from "../../../../manager/public/guildsMgr";

/*
author: 汤凯
日期:2018-11-22
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsApplicationsPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildsApplicationsList = null;
	guildInfo = GuildsMgr.getInstance().getGuildInfo();
	constructor() {
		super();
		if(!this.guildInfo)
		{
			GuildsMgr.getInstance().reqMyGuildDetail();
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_refussAll: ctrl.btn_refussAll,
		lbl_currentMembers: ctrl.lbl_currentMembers,
		pref_guildApplicationItem: ctrl.pref_guildApplicationItem,
		node_guildInfoContent: ctrl.node_guildInfoContent
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.showGuildMembers();
		this.addApplications();
	}
	public addApplications()
	{
		if(this.model.guildInfo&&this.model.guildInfo.apply) {
			for (let guildInfoIdx = 0; guildInfoIdx < this.model.guildInfo.apply.length; guildInfoIdx++) {
				let guildInfoData = this.model.guildInfo.apply[guildInfoIdx];
				let prefabNode = cc.instantiate(this.ui.pref_guildApplicationItem);
				this.ui.node_guildInfoContent.addChild(prefabNode);
				prefabNode.getComponent('guildApplicationItem').UpdateAndShowGuildApplicationInfo(guildInfoData,guildInfoIdx);
			}
		}
	}
	showGuildMembers()
	{
		this.ui.lbl_currentMembers.string = this.model.guildInfo.memberAmount+"/";
	}
}
//c, 控制
@ccclass
export default class GuildsApplicationsPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_refussAll: cc.Button = null;
	@property(cc.Prefab)
	pref_guildApplicationItem: cc.Prefab = null;
	@property(cc.Label)
	lbl_currentMembers: cc.Label = null;
	@property(cc.Node)
	node_guildInfoContent: cc.Node = null;

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
            'guild.guild.reqMyGuildDetail':this.guild_guild_reqMyGuildDetail,
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

	}
	btnRefussAll()
	{
		console.log("全部拒绝");
		GuildsMgr.getInstance().refuseApply();
	}
	guild_guild_reqMyGuildDetail()
	{
		this.model.guildInfo = GuildsMgr.getInstance().getGuildInfo();
		this.view.showGuildMembers();
		this.view.addApplications();
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