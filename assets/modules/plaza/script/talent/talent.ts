import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import talentMgr from "../../../../manager/public/talentMgr";

/*
author: 蒙磊
日期:2018-11-16 21:27:15
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TalentCtrl;
//模型，数据处理
class Model extends BaseModel {
	index:number =null;
	curSuspensionFrame=null;
	talentData: any = null;
	level: string = null;
	constructor() {
		super();
	}
	setLevel() {
		if(!this.talentData.curLevel){
			this.talentData.curLevel =0;
		}
		let curLevel =this.talentData.curLevel;
		this.level = curLevel + "/" + this.talentData.maxLevel
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		suspensionFrame: ctrl.suspensionFrame,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	showIcon(icon) {
		var iconNode = new cc.Node();
		var sp_icon = iconNode.addComponent(cc.Sprite)
		sp_icon.spriteFrame = this.getImageSync(icon)
		this.node.addChild(iconNode)
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	public initUi() {

	}
	public addPrefab(obj_node: cc.Node, obj_Prefab: cc.Prefab) {
		return this.addPrefabNode(obj_Prefab, obj_node);
	}
}
//c, 控制
@ccclass
export default class TalentCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//Prefab
	@property(cc.Prefab)
	suspensionFrame: cc.Prefab = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		
	}
	//绑定天赋信息
	setTalentData(data: any,index:number) {
		this.model.index =index;
		this.model.talentData = data;
	}
	//绑定升级预制体
	setSuspensionFrame(obj) {
		this.ui.suspensionFrame = obj;
	}
	//显示升级界面
	showSuspensionFrame() {
		this.model.curSuspensionFrame = this.view.addPrefab(this.node.parent, this.ui.suspensionFrame)
		this.model.curSuspensionFrame.getComponent("suspensionframe").setData(this.model.talentData);
		this.model.curSuspensionFrame.getComponent("suspensionframe").showData();
		talentMgr.getInstance().curTalent =this;
	}
	//刷新等级level
	refreshLevel() {
		this.model.setLevel();
		//console.log(this.node.children[0])
		if(this.node.children[0].getComponent(cc.Label)){
			this.view.showLabelString(this.node.children[0].getComponent(cc.Label),this.model.level)
		 }
	}
	//增加图标
	addIcon(icon: string) {
		this.view.showIcon(icon)
	}
	// closeSuspensionFrame() {
	// 	this.model.curSuspensionFrame.destroy();
	// 	this.model.curSuspensionFrame = null;
	// }
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
		this.connect("click", this.node, this.showSuspensionFrame, "学习天赋");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	updataTalentData(data){
		this.model.talentData = data;
		this.model.curSuspensionFrame.getComponent("suspensionframe").setData(data);
		this.model.curSuspensionFrame.getComponent("suspensionframe").showData();
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}