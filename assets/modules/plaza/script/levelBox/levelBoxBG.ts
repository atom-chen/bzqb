import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import BoxMgr from "../../../../manager/public/boxMgr";
/*
author: 蒙磊
日期:2018-11-09 15:51:13
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: LevelBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	levelBoxTable: [];
	levelBoxInfo:[];
	constructor() {
		super();
	}
	initData() {
		this.levelBoxInfo = BoxMgr.getInstance().levelBoxInfo;
		this.levelBoxTable = BoxMgr.getInstance().levelBoxTable;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_close: ctrl.btn_close,
		content: ctrl.content,
		levelBox:ctrl.levelBox,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	public addPrefab(obj_node: cc.Node, obj_Prefab: cc.Prefab) {
		return this.addPrefabNode(obj_Prefab, obj_node);
	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class LevelBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	//note
	@property(cc.Node)
	content: cc.Node = null;
	//Prefab
	@property(cc.Prefab)
	levelBox: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		BoxMgr.getInstance().sendReqLevelBox();
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			'plaza.box.reqLevelBox': this.reqLevelBox,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, this.close, "关闭");
	}
	//网络事件回调begin
	reqLevelBox() {
		this.initData();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	initData() {
		this.model.initData();
		console.log(this.model.levelBoxTable)
		this.ui.content.width =40+ (this.model.levelBoxTable.length) * 345
		for (let i = 0; i < this.model.levelBoxTable.length; i++) {
			let levelBox = this.view.addPrefab(this.ui.content, this.ui.levelBox)
			levelBox.setPosition(cc.v2(194 + (i * 345), -20))
			let level :any=this.model.levelBoxTable[i].condition_level;
			let have =this.model.levelBoxInfo[level]
			levelBox.getComponent("levelBox").setData(this.model.levelBoxTable[i],have);
		}
	}

	close() {
		this.closeModule("levelBoxBG")
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}