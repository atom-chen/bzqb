import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { mail } from "../../../../manager/public/interface/iMailInfo";
import MailMgr from "../../../../manager/public/mailMgr";

/*
author: 陈斌杰
日期:2018-11-17 15:26:10
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MailCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public mailData: mail = <mail>{};

	//设置邮件数据
	public setMailData(data: any): void {
		this.mailData = data;
	}

	//刷新邮件读取状态数据
	public setBReadedState(): void {
		this.mailData.bReaded = true;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		mailIco: ctrl.mailIco,													//邮件图标
		mailIco_unopen: ctrl.mailIco.getChildByName("mail_unopen"),				//邮件未读取图标
		mailIco_open: ctrl.mailIco.getChildByName("mail_open"),					//邮件已读取图标
		tip_lab: ctrl.tip_lab,													//邮件标题
		time_lab: ctrl.time_lab,												//邮件创建时间
		countDown_lab: ctrl.countDown_lab,										//邮件剩余时间
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.mailIco.active = false;
		this.ui.mailIco_unopen.active = false;
		this.ui.mailIco_open.active = false;
	}

	//初始化邮件UI
	public initMailUI(): void {
		if (!this.model.mailData.id) {
			return;
		}
		this.ui.mailIco.active = true;
		this.ui.mailIco_unopen.active = !this.model.mailData.bReaded;
		this.ui.mailIco_open.active = this.model.mailData.bReaded;
		this.ui.tip_lab.string = this.model.mailData.title;
		this.ui.time_lab.string = this.model.mailData.sendTime;
		if (this.model.mailData.residueTime <= 0) {
			this.ui.countDown_lab.string = "即将删除";
		} else {
			this.ui.countDown_lab.string = `剩余时间${this.model.mailData.residueTime.toString()}天`;
		}
	}

	//刷新邮件Ico
	public refreshMailIco(): void {
		this.ui.mailIco_unopen.active = false;
		this.ui.mailIco_open.active = true;
	}
}
//c, 控制
@ccclass
export default class MailCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	mailIco: cc.Node = null;
	@property(cc.Label)
	tip_lab: cc.Label = null;
	@property(cc.Label)
	time_lab: cc.Label = null;
	@property(cc.Label)
	countDown_lab: cc.Label = null;
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
		this.connect("click", this.node.getComponent(cc.Button), () => {
			if (this.model.mailData.content) {
				//刷新邮件详细内容显示
				this.gemit("refreshMailExplain", this.model.mailData.id);
				return;
			}
			let listId = [];
			listId.push(this.model.mailData.id);
			MailMgr.getInstance().sendReqMailExplainData(listId);
		}, "点击邮件发送请求获取邮件数据");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化邮件数据
	public initMailData(data: any): void {
		this.model.setMailData(data);
		this.view.initMailUI();
	}

	//刷新邮件读取状态
	public refreshMailState(): void {
		if (this.ui.mailIco_open.active == true) {
			return;
		}
		this.model.setBReadedState();
		this.view.refreshMailIco();
	}

	onDestroy() {
		super.onDestroy();
	}
}