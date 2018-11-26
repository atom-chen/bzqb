import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { mail_rewark } from "../../../../manager/public/interface/iMailInfo";
import { enums } from "../../../../manager/enums";

/*
author: 陈斌杰
日期:2018-11-19 14:12:24
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MailRewarkCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public mailRewarkData: mail_rewark = <mail_rewark>{};

	//设置邮件奖励数据
	public setMailRewarkData(data: any): void {
		this.mailRewarkData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		ico: ctrl.ico,
		count: ctrl.count,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}

	//初始化邮件奖励UI
	public initMailRewarkUI(): void {
		let picName = null;
		switch (this.model.mailRewarkData.type) {
			case enums.Get_Gold:
				picName = "gold";
				break;
			case enums.Get_Crystal:
				picName = "crystal";
				break;
			case enums.Get_Price:
				picName = "diamond";
				break;
			default:
				break;
		}
		this.loadImage(picName,true).then((sprf) => {
			this.ui.ico.spriteFrame = sprf;
		});
		this.ui.count.string = this.numberEllipsis(this.model.mailRewarkData.amount);
	}
}
//c, 控制
@ccclass
export default class MailRewarkCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	ico: cc.Sprite = null;
	@property(cc.Label)
	count: cc.Label = null;
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

	//初始化邮件奖励
	public initMailRewark(data: any): void {
		this.model.setMailRewarkData(data);
		this.view.initMailRewarkUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}