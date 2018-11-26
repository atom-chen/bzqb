import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";

/*
author: 汤凯
日期:2018-11-19 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsItemCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildItem = null;
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		spr_guildIcon: ctrl.spr_guildIcon,
		spr_guildRankIcon: ctrl.spr_guildRankIcon,
		lbl_guildName: ctrl.lbl_guildName,
		lbl_guildPlayerCount: ctrl.lbl_guildPlayerCount,
		lbl_guildEnterType: ctrl.lbl_guildEnterType,
		lbl_guildRankName: ctrl.lbl_guildRankName,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	showGuildItem()
	{
		if(this.model.guildItem) {
			this.ui.lbl_guildName.string = this.model.guildItem.name;
			this.ui.lbl_guildPlayerCount.string = this.model.guildItem.memberAmount+"/";
			this.ui.lbl_guildEnterType.string = this.model.guildItem.enterType;
			this.ui.lbl_guildRankName.string = this.model.guildItem.neededStage;
			// this.ui.spr_guildIcon
			// this.ui.spr_guildRankIcon 
		}
	}
}
//c, 控制
@ccclass
export default class GuildsItemCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	spr_guildIcon: cc.Sprite = null;
	@property(cc.Sprite)
	spr_guildRankIcon: cc.Sprite = null;
	@property(cc.Label)
	lbl_guildName: cc.Label = null;
	@property(cc.Label)
	lbl_guildPlayerCount: cc.Label = null;
	@property(cc.Label)
	lbl_guildEnterType: cc.Label = null;
	@property(cc.Label)
	lbl_guildRankName: cc.Label = null;
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
	 	this.n_events = {};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click",this.node.getChildByName('clippingNode'),this.guildItemClick.bind(this),"点击公会界面");
	}
	updateAndShowGuildItem(data)
	{
		console.log('updateAndShowGuildItem',data)
		this.model.guildItem = data;
		this.view.showGuildItem();
	}
	guildItemClick()
	{
		//请求明细数据
		GuildsMgr.getInstance().reqGuildDetail(this.model.guildItem.id);
		GuildsMgr.getInstance().reqGuildMembers(this.model.guildItem.id,0)
		console.log('guildItemClick')
		this.closeModule("guilds");
		this.openSubModule('guildsInfo');
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