import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import UserMgr from "../../../../manager/public/userMgr";
import MailMgr from "../../../../manager/public/mailMgr";
import GameNet from "../../../../framework/modules/GameNet";
import cardMgr from "../../../../manager/public/cardMgr";
import VipMgr from "../../../../manager/public/vipMgr";
import ShopMgr from "../../../../manager/public/shopMgr";


/*
author: 蒙磊
日期:2018-11-02 16:47:30
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TopMainCtrl;
let userMgr = UserMgr.getInstance();

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
	public ui = {
		//在这里声明ui
		//button
		btn_userInfoPanel: ctrl.btn_userInfoPanel,
		btn_vip: ctrl.btn_vip,
		btn_monthlyCard: ctrl.btn_monthlyCard,
		btn_foreverCard: ctrl.btn_foreverCard,

		btn_mail: ctrl.btn_mail,
		btn_set: ctrl.btn_set,
		//label
	
		lab_level: ctrl.lab_level,
		lab_name: ctrl.lab_name,
		lab_exe: ctrl.lab_exe,
		sp_exePercent: ctrl.sp_exePercent,

	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	
	updateLevel() {
		this.ui.lab_level.getComponent(cc.Label).string = (userMgr.user.grade).toString();
	}
	updateName() {
		this.ui.lab_name.getComponent(cc.Label).string = userMgr.user.userName
	}
	updateExe() {
		this.ui.lab_exe.getComponent(cc.Label).string = this.numberEllipsis(userMgr.user.userExp) + '/' + userMgr.user.experience;
		this.showProgress(this.ui.sp_exePercent, userMgr.user.userExp / userMgr.user.experience)
	}
	//显示进度条
	showProgress(obj: cc.Sprite, percent: number) {
		obj.fillRange = percent;
	}
	//初始化ui
	public initUi() {
		this.updateLevel();
		this.updateName();
		this.updateExe();
	}
}
//c, 控制
@ccclass
export default class TopMainCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//button
	@property(cc.Node)
	btn_userInfoPanel: cc.Node = null;
	@property(cc.Node)
	btn_vip: cc.Node = null;
	@property(cc.Node)
	btn_monthlyCard: cc.Node = null;
	@property(cc.Node)
	btn_foreverCard: cc.Node = null;
	@property(cc.Node)
	btn_mail: cc.Node = null;
	@property(cc.Node)
	btn_set: cc.Node = null;
	//label
	@property(cc.Node)
	lab_name: cc.Node = null;
	@property(cc.Node)
	lab_exe: cc.Node = null;
	@property(cc.Node)
	lab_level: cc.Node = null;
	//sprite
	@property(cc.Sprite)
	sp_exePercent: cc.Sprite = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离




	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			"plaza.mail.reqMailList": this.reqMailList,
			"plaza.privilege.reqMonthlyCardInfo": this.reqMonthlyCardInfo,
			"plaza.privilege.reqLifetimeCardInfo": this.reqLifetimeCardInfo,
			'plaza.vip.reqVipInfo': this.reqVipInfo,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
		};
	}
	
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_userInfoPanel, () => { this.openPrefabCB("userInfoPanel") }, "打开角色信息");
		this.connect("click", this.ui.btn_vip, () => {
			if (VipMgr.getInstance().isInit) {
				this.openPrefabCB("vip")
			}
			else {
				VipMgr.getInstance().sendReqVipInfo();
			}
		}, "打开vip");
		this.connect("click", this.ui.btn_monthlyCard, () => {
			if (cardMgr.getInstance().monthlyIsInit) {
				this.openPrefabCB("monthlyCard")
			}
			else {
				cardMgr.getInstance().sendReqMonthlyCardInfo();
			}
		}, "打开月卡");
		this.connect("click", this.ui.btn_foreverCard, () => {
			if (cardMgr.getInstance().LifeIsInit) {
				this.openPrefabCB("foreverCard")
			}
			else {
				cardMgr.getInstance().sendReqLifetimeCardInfo();
			}
		}, "打开永久卡");
		
		this.connect("click", this.ui.btn_mail, () => {
			if (MailMgr.getInstance().isFrist || MailMgr.getInstance().mailsData.list) {
				this.openPrefabCB("mails");
				return;
			}
			MailMgr.getInstance().sendReqMailsData();
		}, "打开邮箱");
		this.connect("click", this.ui.btn_set, () => { this.openPrefabCB("setting", true) }, "打开设置");

	}
	//网络事件回调begin
	reqMonthlyCardInfo() {
		this.openPrefabCB("monthlyCard")
	}
	reqLifetimeCardInfo() {
		this.openPrefabCB("foreverCard")
	}
	reqVipInfo() {
		this.openPrefabCB("vip")
	}
	
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}
	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	//打开邮箱预制
	public reqMailList(): void {
		this.openPrefabCB("mails");
	}

	openPrefabCB(name, isPublic: boolean = false) {
		return this.openSubModule(name, isPublic)
	}
	onDestroy() {
		super.onDestroy();
	}
}