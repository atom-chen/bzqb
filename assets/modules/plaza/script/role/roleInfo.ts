import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { role } from "../../../../manager/public/interface/iRole";

/*
author: 陈斌杰
日期:2018-11-14 19:57:33
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RoleInfoCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public roleData: role = <role>{};

	public setRoleData(data: any): void {
		this.roleData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		rolePic: ctrl.rolePic,
		lock: ctrl.lock,
		btn_showRole: ctrl.btn_showRole,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.lock.active = true;
	}

	//初始化角色UI
	public initRoleUI(): void {
		this.ui.lock.active = !this.model.roleData.isUnlock;
		this.setRoleIco();
	}

	//修改角色Ico
	public setRoleIco(): void {
		let id = (this.model.roleData.roleId-1001).toString();
		this.loadImage(`roleIco_${id}`).then((sprf)=>{
			this.ui.rolePic.getComponent(cc.Sprite).spriteFrame = sprf;
		});
	}
}
//c, 控制
@ccclass
export default class RoleInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	rolePic: cc.Node = null;
	@property(cc.Node)
	lock: cc.Node = null;
	@property(cc.Button)
	btn_showRole: cc.Button = null;
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
		this.connect("click",this.ui.btn_showRole,()=>{
			this.gemit("refreshRolePic",this.model.roleData);
		},"点击显示角色");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化角色
	public initRole(data: any): void {
		this.model.setRoleData(data);
		this.view.initRoleUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}