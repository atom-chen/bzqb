import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";

/*
author: 张志强
日期:2018-11-09 16:51:50
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MsgBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	public title: string;
	public content: string;
	constructor() {
		super();
	}

	public setWords(title: string, content: string): void {
		this.title = title || "温馨提示";
		this.content = content;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		titleLbl: ctrl.titleLbl,
		contentLbl: ctrl.contentLbl,
		cancelBtn: ctrl.cancelBtn,
		confirmBtn: ctrl.confirmBtn
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi(): void {
		this.addGrayLayer();
	}

	public refresh() {
		this.ui.titleLbl.string = this.model.title;
		this.ui.contentLbl.string = this.model.content;
		this.ui.cancelBtn.active = !ctrl.isSingle;
	}
}
//c, 控制
@ccclass
export default class MsgBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Label)
	titleLbl: cc.Label = null;
	@property(cc.Label)
	contentLbl: cc.Label = null;
	@property(cc.Node)
	cancelBtn: cc.Node = null;
	@property(cc.Node)
	confirmBtn: cc.Node = null;
	// 声明ui组件end
	// 这是ui组件的map,将ui和控制器或试图普通变量分离
	public isSingle: boolean = true;
	private _okcb: Function = null;
	private _cancelcb: Function = null;

	protected onLoad(): void {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	public init(title: string, content: string, okcb: Function, cancelcb: Function, isSingle: boolean = true): void {
		this.model.setWords(title, content);
		this._okcb = okcb || (() => { });
		this._cancelcb = cancelcb || (() => {});
		this.isSingle = isSingle;
		this.view.refresh();
	}

	//绑定操作的回调
	protected connectUi(): void {
		this.connect("click", this.ui.cancelBtn, this._cancelCB, "点击消息框取消按钮");
		this.connect("click", this.ui.confirmBtn, this._confirmCB, "点击消息框确定按钮");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private _cancelCB(): void {
		this._cancelcb();
		this.remove();
	}

	private _confirmCB(): void {
		this._okcb();
		this.remove();
	}
	//end

	// update(dt) {}

	protected onDestroy(): void {
		super.onDestroy();
	}
}