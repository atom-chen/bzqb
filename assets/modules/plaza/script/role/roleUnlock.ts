import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { role } from "../../../../manager/public/interface/iRole";
import UserMgr from "../../../../manager/public/userMgr";
import RoleMgr from "../../../../manager/public/roleMgr";

/*
author: 陈斌杰
日期:2018-11-15 13:53:27
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RoleUnlockCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public roleData: role = <role>{};
	public ChipUnlockState: boolean = false;		//碎片是否可以解锁
	public unlockState: boolean = false;			//金钱是否可以解锁

	//初始化角色数据
	public initRoleData(data: any): void {
		this.roleData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_close: ctrl.btn_close,				//关闭按钮
		btn_chip: ctrl.btn_chip,				//碎片解锁按钮
		spendChip: ctrl.spendChip,				//花费的碎片数量
		btn_lock: ctrl.btn_lock,				//解锁按钮
		spendMoney: ctrl.spendMoney,				//花费的金钱数量
		chipCount: ctrl.chipCount,				//碎片数量显示
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}

	//初始化解锁界面UI显示
	public initUnlock(): void {
		this.ui.spendChip.string = "X " + this.model.roleData.roleChipNum.toString();
		if (this.model.roleData.roleChipNum != 0 && this.model.roleData.userRoleChipNum >= this.model.roleData.roleChipNum) {
			this.loadImage("btn_unlock").then((sprf) => {
				this.ui.btn_chip.getComponent(cc.Sprite).spriteFrame = sprf;
			});
			this.model.ChipUnlockState = true;
		}
		this.ui.chipCount.string = this.model.roleData.userRoleChipNum.toString() + "个";
		this.moneyUnlock();
	}

	//金钱解锁界面显示
	public moneyUnlock(): void {
		let uiName = null;
		let spend = 0;
		let money = UserMgr.getInstance().userMoney;
		if (this.model.roleData.spendGold) {
			uiName = "gold";
			spend = this.model.roleData.spendGold;
			this.refreshUnlockBtn(money.gold,spend);
		} else if (this.model.roleData.spendCrystal) {
			uiName = "crystal";
			spend = this.model.roleData.spendCrystal;
			this.refreshUnlockBtn(money.crystal,spend);
		} else if (this.model.roleData.spendDiamond && !this.model.roleData.vipLimite) {
			uiName = "diamond";
			spend = this.model.roleData.spendDiamond;
			this.refreshUnlockBtn(money.diamond,spend);
		} else if (this.model.roleData.vipLimite) {
			this.ui.spendMoney.node.parent.getComponent(cc.Sprite).spriteFrame = null;
			this.ui.spendMoney.string = "VIP" + this.model.roleData.vipLimite.toString();
			this.ui.spendMoney.node.parent.x = 30;
			this.refreshUnlockBtn(money.diamond,spend);
			return;
		}
		this.model.ChipUnlockState = true;
		this.ui.spendMoney.string = "X " + spend.toString();
		this.ui.spendMoney.node.parent.x -= spend.toString().length * 10;
		this.loadImage(uiName, true).then((sprf) => {
			this.ui.spendMoney.node.parent.getComponent(cc.Sprite).spriteFrame = sprf;
		});
	}

	//解锁按钮显示
	public refreshUnlockBtn(data: any, spendMoney: number): void {
		if (data < spendMoney) {
			this.ui.btn_lock.getComponent(cc.Button).interactable = false;
		} else {
			this.ui.btn_lock.getComponent(cc.Button).interactable = true;
		}
	}
}
//c, 控制
@ccclass
export default class RoleUnlockCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Node)
	btn_chip: cc.Node = null;
	@property(cc.Label)
	spendChip: cc.Label = null;
	@property(cc.Node)
	btn_lock: cc.Node = null;
	@property(cc.Label)
	spendMoney: cc.Label = null;
	@property(cc.Label)
	chipCount: cc.Label = null;
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
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("roleUnlock");
		}, "关闭解锁角色界面");
		this.connect("click",this.ui.btn_lock,()=>{
			RoleMgr.getInstance().sendReqUnlockRole(this.model.roleData.roleId);
			this.closeModule("roleUnlock");
		},"发送金钱解锁角色服务请求");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	//初始化解锁界面数据和UI显示
	public initUnlock(data: any): void {
		this.model.initRoleData(data);
		this.view.initUnlock();
	}

	onDestroy() {
		super.onDestroy();
	}
}