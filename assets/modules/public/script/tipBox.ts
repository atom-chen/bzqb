import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";

/*
author: 张志强
日期:2018-11-21 11:12:12
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TipBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	public content: string;
	constructor() {
		super();
	}

	public setContent(s: string) {
		this.content = s;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		content: ctrl.content
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}

	public refresh() {
		this.ui.content.string = this.model.content;
		let delay = cc.delayTime(1.0);
		let move = cc.moveBy(0.5, cc.v2(0, 200));
		let fade = cc.fadeOut(0.5);
		let CB = cc.callFunc(() => { this.node.destroy(); });
		this.node.runAction(cc.sequence(delay, cc.spawn(move, fade), CB));
	}
}
//c, 控制
@ccclass
export default class TipBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Label)
	content: cc.Label = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
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

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	setContent(content: string): void {
		this.model.setContent(content);
		this.view.refresh();
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}