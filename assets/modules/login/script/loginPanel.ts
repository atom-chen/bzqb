import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import LoginMgr from "../../../manager/public/loginMgr";

/*
author: 张志强
日期:2018-11-05 10:37:04
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: LoginPanelCtrl;
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
		testBtnPanel: ctrl.testBtnPanel,
		touristBtn: ctrl.touristBtn,
		accountBtn: ctrl.accountBtn,
		registerBtn: ctrl.registerBtn,
		wechatBtn: ctrl.wechatBtn,
		QQBtn: ctrl.QQBtn,
		account: ctrl.account,
		password: ctrl.password,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
}
//c, 控制
@ccclass
export default class LoginPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	testBtnPanel: cc.Node = null;
	@property(cc.Node)
	touristBtn: cc.Node = null;
	@property(cc.Node)
	accountBtn: cc.Node = null;
	@property(cc.Node)
	registerBtn: cc.Node = null;
	@property(cc.Node)
	wechatBtn: cc.Node = null;
	@property(cc.Node)
	QQBtn: cc.Node = null;
	@property(cc.EditBox)
	account: cc.EditBox = null;
	@property(cc.EditBox)
	password: cc.EditBox = null;
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
		this.g_events = {
			"goToCreateRole": this.goToCreateRole,
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.touristBtn, this.touristLogin, "点击游客登录");
		this.connect("click", this.ui.accountBtn, this.accountBtnCB, "点击账号登录");
		this.connect("click", this.ui.registerBtn, this.registerBtnCB, "点击注册账号");
		this.connect("click", this.ui.wechatBtn, this.wechatBtnCB, "点击微信登录")
		for (let i = 0; i < this.ui.testBtnPanel.childrenCount; ++i) {
			this.connect("click", this.ui.testBtnPanel.children[i], () => {
				let str = `${1000 + i}`;
				this.login(str, str);
				// this.register(str, str);
			}, `点击测试账号按钮${i + 1}`);
		}
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//创建角色处理
	public goToCreateRole(num): void {
		this.remove();
	}
	//end
	//按钮或任何控件操作的回调begin
	public touristLogin() {
		platSdk.touristLogin({
			success: data => {
				LoginMgr.getInstance().login(data.head);
			}
		});
	}

	public accountBtnCB() {
		this.login(this.ui.account.string, this.ui.password.string);
	}

	public registerBtnCB() {
		this.register(this.ui.account.string, this.ui.password.string);
	}

	public wechatBtnCB() {

	}
	//end
	public login(username: string, password: string) {
		platSdk.login({
			data: {
				username: username,
				password: password
			},
			success: data => {
				LoginMgr.getInstance().login(data.head);
			}
		});
	}

	public register(username: string, password: string) {
		platSdk.register({
			data: {
				username: username,
				password: password
			},
			success: data => {
				LoginMgr.getInstance().login(data.head);
			}
		});
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}