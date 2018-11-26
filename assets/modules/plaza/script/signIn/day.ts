import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { signIn } from "../../../../manager/public/interface/iSignInfo";
import { enums } from "../../../../manager/enums";
import SignInMgr from "../../../../manager/public/signInMgr";
import UserMgr from "../../../../manager/public/userMgr";

/*
author: 陈斌杰
日期:2018-11-21 10:38:16
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: DayCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public signInData: signIn = <signIn>{};
	public isNoDoubleSignIn: boolean = false;		//是否放弃双倍签到

	//设置第N天签到数据
	public setSignInData(data: any): void {
		this.signInData = data;
	}

	//设置数据已经签到
	public setDataIsSignIn(): void {
		this.signInData.isSignIn = true;
		this.signInData.again_signIn = false;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		bg: ctrl.bg,																//签到背景
		rewark_Ico: ctrl.rewark.getChildByName("ico").getComponent(cc.Sprite),		//签到奖励图片
		rewark_amount: ctrl.rewark.getChildByName("amount").getComponent(cc.Label),	//签到奖励图片
		hook: ctrl.hook,															//已签到标识
		again_signIn: ctrl.again_signIn,											//可补签标识
		vipIco: ctrl.vipIco,														//vip角标
		bnt_signIn: ctrl.bnt_signIn,												//签到按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.rewark_Ico.spriteFrame = null;
		this.ui.rewark_amount.string = "";
		this.ui.hook.active = false;
		this.ui.again_signIn.active = false;
		this.ui.vipIco.active = false;
	}

	//初始化第N天签到UI
	public initSignInUI(): void {
		let signInData = this.model.signInData;
		let icoName = null;
		switch (signInData.rewark.type) {
			case enums.Get_Gold:
				icoName = "gold";
				break;
			case enums.Get_Crystal:
				icoName = "crystal";
				break;
			case enums.Get_Price:
				icoName = "diamond";
				break;
			default:
				break;
		}
		if (icoName != null) {
			this.loadImage(icoName, true).then((sprf) => {
				this.ui.rewark_Ico.spriteFrame = sprf;
			});
		}
		this.ui.rewark_amount.string = signInData.rewark.amount.toString();
		this.ui.hook.active = signInData.isSignIn;
		this.ui.again_signIn.active = signInData.again_signIn;
		if (signInData.vipLv == 0) {
			this.ui.vipIco.active = false;
		} else if (signInData.vipLv > 1) {
			this.ui.vipIco.active = true;
			this.loadImage(`vipIco_${signInData.vipLv}`).then((sprf) => {
				this.ui.vipIco.getComponent(cc.Sprite).spriteFrame = sprf;
			});
		}
	}

	//刷新签到UI
	public refreshSignIn(): void {
		this.ui.hook.active = this.model.signInData.isSignIn;
		this.ui.again_signIn.active = this.model.signInData.again_signIn;
	}
}
//c, 控制
@ccclass
export default class DayCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	bg: cc.Node = null;
	@property(cc.Node)
	rewark: cc.Node = null;
	@property(cc.Node)
	hook: cc.Node = null;
	@property(cc.Node)
	again_signIn: cc.Node = null;
	@property(cc.Node)
	vipIco: cc.Node = null;
	@property(cc.Node)
	bnt_signIn: cc.Node = null;
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
		this.connect("click", this.ui.bnt_signIn, () => {
			this.signInBtn();
		}, "点击签到");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化第N天签到
	public initSignIn(data: any): void {
		this.model.setSignInData(data);
		this.view.initSignInUI();
	}

	//刷新签到UI显示
	public refreshUI(): void {
		this.model.setDataIsSignIn();
		this.view.refreshSignIn();
	}

	//签到按钮处理
	public signInBtn(): void {
		let isCanSignIn = SignInMgr.getInstance().getIsCanSignIn(this.model.signInData.signInDay);
		if (this.model.signInData.isSignIn) {
			return;
		}
		//签到
		if (isCanSignIn) {	//今天还没签到可签到
			//vip双倍签到处理
			if (this.model.signInData.vipLv && this.model.signInData.vipLv > UserMgr.getInstance().user.vipLv && !this.model.isNoDoubleSignIn) {
				this.gemit("openDoubleSignIn",this.model.signInData.signInDay);
				return;
			}
			SignInMgr.getInstance().sendReqSignIn();
			return;
		}
		//补签		补签次数不等于0  可补签  前面的天数已经补签完
		let canSignIn = SignInMgr.getInstance().getIsCanShowRepairSignIn(this.model.signInData.signInDay);
		if (!canSignIn) {
			console.log("----------------当前还有未补签天数，请先补签前面的天数------------------");
		}
		if (this.model.signInData.again_signIn && canSignIn) {
			//vip双倍签到处理
			if (this.model.signInData.vipLv && this.model.signInData.vipLv > UserMgr.getInstance().user.vipLv && !this.model.isNoDoubleSignIn) {
				this.gemit("openDoubleSignIn",this.model.signInData.signInDay);
				return;
			}
			this.gemit("openRepairSignIn",this.model.signInData.signInDay);
		}
	}

	onDestroy() {
		super.onDestroy();
	}
}