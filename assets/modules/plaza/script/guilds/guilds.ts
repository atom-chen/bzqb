import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";

/*
author: 陈斌杰
日期:2018-11-09 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsCtrl;
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
		pref_guildsPanel: ctrl.pref_guildsPanel,
		pref_guildsFrame: ctrl.pref_guildsFrame,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	initGuildFrame()
	{
		let prefabNode=cc.instantiate(this.ui.pref_guildsFrame);
		this.node.addChild(prefabNode);
	}
	initGuildPanel()
	{
		let prefabNode=cc.instantiate(this.ui.pref_guildsPanel);
		this.node.addChild(prefabNode);
	}
}
//c, 控制
@ccclass
export default class GuildsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Prefab)
	pref_guildsPanel: cc.Prefab = null;
	@property(cc.Prefab)
	pref_guildsFrame: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		GuildsMgr.getInstance().reqRandomGuildList();
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
		this.view.initGuildFrame();
		this.view.initGuildPanel();
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
		this.connect("click",this.ui.btn_close,()=>{
			this.closeModule("guilds");
		},"关闭公会界面");
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