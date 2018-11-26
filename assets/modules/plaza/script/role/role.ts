import BaseModel from "../../../../framework/baseClass/BaseModel";
import { userMoney } from "../../../../manager/public/interface/iUserInfo";
import UserMgr from "../../../../manager/public/userMgr";
import BaseView from "../../../../framework/baseClass/BaseView";
import RoleMgr from "../../../../manager/public/roleMgr";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { role } from "../../../../manager/public/interface/iRole";
import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";


/*
author: 陈斌杰
日期:2018-11-09 15:44:09
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RoleCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public userMoney: userMoney = UserMgr.getInstance().userMoney;
	public rolesData: role[] = RoleMgr.getInstance().rolesData;		//角色列表数据
	public choiceRole: any = RoleMgr.getInstance().choiceRole;		//当前选择使用的角色的数据
	public nowShowRoleData: any = this.choiceRole;					//当前显示的角色的数据

	//设置当前显示的角色的数据
	public setNowShowRoleData(data: any): void {
		this.nowShowRoleData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_close: ctrl.btn_close,
		gold: ctrl.moneyFrame.getChildByName("gold").getComponent(cc.Label),		//金币
		crystal: ctrl.moneyFrame.getChildByName("crystal").getComponent(cc.Label),	//粉晶
		diamond: ctrl.moneyFrame.getChildByName("diamond").getComponent(cc.Label),	//钻石
		roleInfo: ctrl.roleInfo,													//角色预制
		roleFrame: ctrl.roleFrame,													//角色预制容器
		rolePic: ctrl.rolePic,														//显示的角色图片
		isChoice: ctrl.isChoice,													//当前选择图片
		btn_use: ctrl.btn_use,														//使用按钮
		btn_unlock: ctrl.btn_unlock,												//解锁按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}

	//初始化ui
	public initUi() {
		this.refreshMoneyUI();
		this.initRoleList();
		this.refreshShowRole(this.model.choiceRole);
	}

	//刷新特技界面金钱数据
	public refreshMoneyUI(): void {
		this.ui.gold.string = this.numberEllipsis(this.model.userMoney.gold);
		this.ui.crystal.string = this.numberEllipsis(this.model.userMoney.crystal);
		this.ui.diamond.string = this.numberEllipsis(this.model.userMoney.diamond);
	}

	//初始化角色列表
	public initRoleList(): void {
		let rolesData = this.model.rolesData;
		let row: number = 0;
		let column: number = 0;
		for (let i = 0; i < rolesData.length; i++) {
			let role = rolesData[i];
			let roleNode = this.addPrefabNode(this.ui.roleInfo, this.ui.roleFrame);
			column = i % 3;
			if (i != 0 && i % 3 == 0) {
				row++;
				this.ui.roleFrame.height = 190 * (row + 1);
			}
			roleNode.x = -170 + 170 * column;
			roleNode.y = -95 - 190 * row;
			roleNode.getComponent("roleInfo").initRole(role);
		}
	}

	//刷新显示的角色图片
	public refreshShowRole(data: any): void {
		let id = data.roleId - 1001;
		this.loadImage(`rolePic_${id}`).then((sprf) => {
			this.ui.rolePic.spriteFrame = sprf;
		});
		this.ui.isChoice.active = false;
		this.ui.btn_use.active = false;
		this.ui.btn_unlock.active = false;
		if (data.isUsing) {
			this.ui.isChoice.active = true;
		} else {
			this.ui.btn_use.active = data.isUnlock;
			this.ui.btn_unlock.active = !data.isUnlock;
		}
	}

	//刷新角色列表解锁的角色UI
	public refreshRoleList(): void {
		for (let i = 0; i < this.ui.roleFrame.childrenCount; i++) {
			let roleNode = this.ui.roleFrame.children[i];
			let roleData = roleNode.getComponent("roleInfo").model.roleData;
			if (this.model.nowShowRoleData.roleId == roleData.roleId) {
				roleNode.getComponent("roleInfo").ui.lock.active = false;
			}
		}
		this.ui.btn_unlock.active = false;
		this.ui.btn_use.active = true;
	}

	//刷新使用按钮
	public refreshUsingBtn(): void{
		this.ui.isChoice.active = true;
		this.ui.btn_unlock.active = false;
		this.ui.btn_use.active = false;
	}
}
//c, 控制
@ccclass
export default class RoleCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Node)
	moneyFrame: cc.Node = null;
	@property(cc.Prefab)
	roleInfo: cc.Prefab = null;
	@property(cc.Node)
	roleFrame: cc.Node = null;
	@property(cc.Sprite)
	rolePic: cc.Sprite = null;
	@property(cc.Node)
	isChoice: cc.Node = null;
	@property(cc.Node)
	btn_use: cc.Node = null;
	@property(cc.Node)
	btn_unlock: cc.Node = null;
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
		this.n_events = {
			"plaza.role.unlockRole": this.unlockRole,
			"plaza.role.switchRole": this.switchRole,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			"refreshMoneyUI": this.refreshMoneyUI,
			"refreshRolePic": this.refreshRolePic,
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("role");
		}, "关闭角色界面");
		this.connect("click", this.ui.btn_unlock, () => {
			this.openSubModule("roleUnlock").then((obj) => {
				obj.initUnlock(this.model.nowShowRoleData);
			});
		}, "打开角色解锁界面");
		this.connect("click", this.ui.btn_use, () => {
			RoleMgr.getInstance().sendReqUsingRole(this.model.nowShowRoleData.id);
		}, "使用当前角色");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//刷新金钱显示
	public refreshMoneyUI(): void {
		this.view.refreshMoneyUI();
	}

	//刷新显示的角色
	public refreshRolePic(data: any): void {
		this.model.setNowShowRoleData(data);
		this.view.refreshShowRole(data);
	}

	//刷新解锁的角色UI
	public unlockRole(msg: Package): void {
		let unlockRoleData = msg.getDataByType(dataids.ID_UNLOCK_ROLE);
		let data = RoleMgr.getInstance().getRoleDataByItem(unlockRoleData[0].itemId);
		this.refreshRolePic(data);
		this.view.refreshRoleList();
	}

	//刷新使用的角色
	public switchRole(): void {
		this.view.refreshUsingBtn();
	}

	onDestroy() {
		super.onDestroy();
	}
}