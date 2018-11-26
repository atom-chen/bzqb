import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import GameNet from "../../../framework/modules/GameNet";
import Cache from "../../../framework/modules/Cache";
import LoginMgr from "../../../manager/public/loginMgr";
import ModuleMgr from "../../../framework/modules/ModuleMgr";
import ServerMgr from "../../../framework/modules/ServerMgr";
import MgrInit from "../../../manager/MgrInit";

/*
author: 张志强
日期:2018-11-01 17:06:58
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: LoginCtrl;
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
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi(): void {

	}
}
//c, 控制
@ccclass
export default class LoginCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		ModuleMgr.getInstance().showLoading({
			resPaths: require("publicResPath"),
			complete: () => {
				MgrInit();
				ServerMgr.getInstance().loadLoacalSetting((code: number) => {
					this.loadDataCb(code);
				});
			}
		});
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			"goToCreateRole": this.goToCreateRole,
			"platTokenError": this.platTokenError,
		};
	}
	//绑定操作的回调
	connectUi() {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	public goToCreateRole(): void {
		LoginMgr.getInstance().getNicknameCfgTab();
		this.openSubModule("registerPanel");
	}

	public platTokenError(): void {
		ModuleMgr.getInstance().showMsgBox({
			content: "token错误!",
			okcb: () => {
				Cache.getInstance().removeItemByKey("loginCache");
				this.openSubModule("loginPanel");
			}
		});
	}
	//end
	//按钮或任何控件操作的回调begin
	//end
	public loadDataCb(code: number): void {
		if (code == 0) {
			platSdk.setPlatUrl(GameNet.getInstance().getPlatSvrUrl());
			let loginCache = Cache.getInstance().getItem("loginCache");
			if (loginCache && this._checkLoginCache(loginCache)) {
				LoginMgr.getInstance().login(loginCache);
			} else {
				this.openSubModule("loginPanel");
			}
		} else {
			ServerMgr.getInstance().loadSettingCb();
		}
	}

	private _checkLoginCache(data: any): boolean {
		let { uid, token } = data;
		return Boolean(uid && token);
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}