import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import BoxMgr from "../../../../manager/public/boxMgr";
import GameNet from "../../../../framework/modules/GameNet";
import ItemMgr from "../../../../manager/public/itemMgr";
import RoleMgr from "../../../../manager/public/roleMgr";
import ShopMgr from "../../../../manager/public/shopMgr";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";
import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";
import UserMgr from "../../../../manager/public/userMgr";
import SignInMgr from "../../../../manager/public/signInMgr";
import TaskMgr from "../../../../manager/public/taskMgr";
/*
author: 蒙磊
日期:2018-11-02 18:03:26
*/
//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MiddleMainCtrl;
let boxMgr = BoxMgr.getInstance();
let itemMgr = ItemMgr.getInstance();
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public user: any = UserMgr.getInstance().user;
	//-----在线宝箱-----
	onlineBox = null;
	onlineBoxPercent: number = null;//进度条百分比
	onlineBoxUnlockText = null;// 解锁进度显示文本 xx:xx  
	onlineBoxEndTime = null;
	serverDelay = null;

	//-----胜利宝箱-----
	winBox = null;
	winBoxUnlockText = null;//解锁进度显示文本 xx/xx  
	winBoxPercent: number = 0;//进度条百分比
	//在线宝箱
	public initOnlineBoxTime() {
		this.onlineBox = boxMgr.onlineBox;
		this.serverDelay = GameNet.getInstance().getServerDelay();
		if (this.onlineBox && this.onlineBox.boxTimes < 5) {
			let openTimes = this.onlineBox.boxTimes;
			console.log("在线宝箱打开次数", openTimes)
			//解锁的时间（毫秒）       解锁所需时间（秒）
			this.onlineBoxEndTime = this.onlineBox.unlockTime + this.onlineBox.boxInfo.Onlinetime[openTimes].time * 1000;
		}
	}
	public setUnlockOnlineBoxTime() {
		let serverTime = Date.now() + this.serverDelay;
		let unlockNeedTime = this.onlineBoxEndTime - serverTime;
		unlockNeedTime = unlockNeedTime > 0 ? unlockNeedTime : 0;
		let hour = Math.floor((unlockNeedTime / 1000) / 3600)
		let minute = Math.floor(((unlockNeedTime / 1000) % 3600) / 60)
		let hours = hour >= 10 ? hour : '0' + hour;
		let minutes = minute >= 10 ? minute : '0' + minute;
		this.onlineBoxPercent = unlockNeedTime / (this.onlineBox.boxInfo.Onlinetime[this.onlineBox.boxTimes].time * 1000);
		this.onlineBoxUnlockText = hours + ":" + minutes;
	}
	//胜利宝箱
	public initWinBoxTime() {
		this.winBox = boxMgr.winBox;
		if (this.winBox) {
			let winBoxMaxKey = this.winBox.boxInfo.unlock_prop.count;
			let winBoxCurKey = 0;//itemMgr.winKey.amount
			this.winBoxUnlockText = winBoxCurKey + "/" + winBoxMaxKey
			this.winBoxPercent = winBoxCurKey / winBoxMaxKey;
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_match: ctrl.btn_match,
		btn_friends: ctrl.btn_friends,
		btn_chats: ctrl.node.getChildByName("btn_chat"),
		btn_gm: ctrl.node.getChildByName("btn_gmMgr"),
		btn_changeRose: ctrl.btn_changeRose,
		btn_best: ctrl.btn_best,
		btn_activity: ctrl.btn_activity,
		btn_signIn: ctrl.btn_signIn,
		btn_dailyTask: ctrl.btn_dailyTask,
		btn_invitingFriends: ctrl.btn_invitingFriends,
		btn_shop: ctrl.btn_shop,
		btn_levelBox: ctrl.btn_levelBox,
		btn_winBox: ctrl.btn_winBox,
		btn_onlineBox: ctrl.btn_onlineBox,
		//label
		lab_onlineTimeText: ctrl.lab_onlineTimeText,
		lab_winTimeText: ctrl.lab_winTimeText,
		//sprite
		sp_onlineTimePercent: ctrl.sp_onlineTimePercent,
		sp_winBoxPercent: ctrl.sp_winBoxPercent,
		sp_role: ctrl.sp_role,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.refreshRole(RoleMgr.getInstance().choiceRole.id);
	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	//显示进度条
	showProgress(obj: cc.Sprite, percent: number) {
		obj.fillRange = percent;
	}

	//刷新角色显示
	public refreshRole(roleId: number): void {
		let roleListData = RoleMgr.getInstance().rolesData;
		let id = null;
		for (let i = 0; i < roleListData.length; i++) {
			let roleData = roleListData[i];
			if (roleId == roleData.id) {
				id = roleData.roleId - 1001;
				break;
			}
		}
		this.loadImage(`rolePic_${id}`).then((sprf) => {
			this.ui.sp_role.spriteFrame = sprf;
		});
	}
}
//c, 控制
@ccclass
export default class MiddleMainCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_match: cc.Node = null;
	@property(cc.Node)
	btn_levelBox: cc.Node = null;
	@property(cc.Node)
	btn_onlineBox: cc.Node = null;
	@property(cc.Node)
	btn_winBox: cc.Node = null;
	@property(cc.Node)
	btn_friends: cc.Node = null;
	@property(cc.Node)
	btn_changeRose: cc.Node = null;
	@property(cc.Node)
	btn_best: cc.Node = null;
	@property(cc.Node)
	btn_activity: cc.Node = null;
	@property(cc.Node)
	btn_signIn: cc.Node = null;
	@property(cc.Node)
	btn_dailyTask: cc.Node = null;
	@property(cc.Node)
	btn_invitingFriends: cc.Node = null;
	@property(cc.Node)
	btn_shop: cc.Node = null;
	@property(cc.Sprite)
	sp_role: cc.Sprite = null;

	//label
	@property(cc.Node)
	lab_onlineTimeText: cc.Node = null;
	@property(cc.Node)
	lab_winTimeText: cc.Node = null;

	//sprite
	@property(cc.Sprite)
	sp_onlineTimePercent: cc.Sprite = null;
	@property(cc.Sprite)
	sp_winBoxPercent: cc.Sprite = null;



	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initOnlineBox();
		this.initWinBox();
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			'plaza.box.openBox': this.plaza_box_openBox,
			"plaza.role.reqRoleList": this.reqRoleList,
			'plaza.data.reqShopInfo': this.plaza_data_reqShopInfo,
			"plaza.role.switchRole": this.switchRole,
			"plaza.signin.reqSigninInfo": this.reqSigninInfo,
			"plaza.data.reqDailyMissionInfo": this.reqDailyMissionInfo,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_match, () => { this.openPrefabCB("matching") }, "打开竞技模式");
		this.connect("click", this.ui.btn_levelBox, () => { this.openPrefabCB("levelBoxBG") }, "打开等级宝箱");
		this.connect("click", this.ui.btn_onlineBox, this.onlineBox, "打开在线宝箱");
		this.connect("click", this.ui.btn_winBox, this.winBox, "打开胜利宝箱");

		this.connect("click", this.ui.btn_friends, () => { this.openPrefabCB("friends") }, "打开邀请好友");
		this.connect("click", this.ui.btn_chats, () => { this.openPrefabCB("chats") }, "打开聊天窗口");
		//
		this.connect("click", this.ui.btn_gm, () => { this.openPrefabCB("gm") }, "打开GM模块")

		this.connect("click", this.ui.btn_changeRose, () => {
			if (RoleMgr.getInstance().isFirst || RoleMgr.getInstance().rolesData) {
				this.openPrefabCB("role");
				return;
			}
			// RoleMgr.getInstance().sendReqRoleListData();
		}, "发送角色列表数据");
		//this.connect("click", this.ui.btn_best, () => {this.openPrefabCB("best")}, "打开全场最佳");
		this.connect("click", this.ui.btn_activity, () => { this.openPrefabCB("activity") }, "打开活动");
		this.connect("click", this.ui.btn_signIn, () => {
			if (SignInMgr.getInstance().isFrist || SignInMgr.getInstance().signInData.list) {
				this.openPrefabCB("signIn");
				return;
			}
			SignInMgr.getInstance().sendReqSignInInfo();
		}, "打开签到");
		this.connect("click", this.ui.btn_dailyTask, () => {
			if (TaskMgr.getInstance().isFirst || TaskMgr.getInstance().dailyTaskData.list) {
				this.openPrefabCB("dailyTask");
				return;
			}
			TaskMgr.getInstance().sendReqDailyTaskData();
		}, "打开每日任务");
		this.connect("click", this.ui.btn_invitingFriends, () => { this.openPrefabCB("invitingFriends") }, "打开邀请好友");
		this.connect("click", this.ui.btn_shop, () => {
			ShopMgr.getInstance().setShopState("box")
			if (ShopMgr.getInstance().isInitShop) {
				this.openPrefabCB("shop")
			}
			else {
				ShopMgr.getInstance().reqShopInfo();
			}
		}, "打开商店");
	}
	//网络事件回调begin
	//打开宝箱

	plaza_box_openBox() {
		this.initOnlineBox();
		ModuleMgr.getInstance().showGainBox(boxMgr.boxReward)
	}
	//打开商店
	plaza_data_reqShopInfo() {
		this.openPrefabCB("shop")
	}
	//获取服务器发送的角色列表数据
	public reqRoleList(): void {
		this.openPrefabCB("role");
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	//在线宝箱
	initOnlineBox() {
		this.model.initOnlineBoxTime();
		console.log("初始化在线宝箱", this.model.onlineBox)
		if (this.model.onlineBox && this.model.onlineBox.boxTimes < 5) {
			this.model.setUnlockOnlineBoxTime();
			this.view.showProgress(this.ui.sp_onlineTimePercent, this.model.onlineBoxPercent)
			if (this.model.onlineBoxPercent == 0) {
				this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), "打开宝箱")
			}
			else {
				this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), this.model.onlineBoxUnlockText)
				this.onlineBoxTiming();
			}
		}
		else {
			this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), "已经没有宝箱")
		}
	}
	onlineBoxTiming() {
		this.schedule(timing => {
			this.model.setUnlockOnlineBoxTime()
			this.view.showProgress(this.ui.sp_onlineTimePercent, this.model.onlineBoxPercent)
			if (this.model.onlineBoxPercent == 0) {
				this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), "打开宝箱")
				this.unschedule(timing)
			}
			else {
				this.view.showLabelString(this.ui.lab_onlineTimeText.getComponent(cc.Label), this.model.onlineBoxUnlockText)
			}
		}, 1)
	}
	onlineBox() {
		if (this.model.onlineBox && this.model.onlineBoxPercent == 0) {
			cc.log("打开在线宝箱")
			cc.log(this.model.onlineBox.id_service)
			boxMgr.openBox(this.model.onlineBox.id_service)
		}
		else {
			cc.log("宝箱未解锁或没有宝箱")
		}
	}
	//胜利宝箱
	initWinBox() {
		this.model.initWinBoxTime();
		console.log("初始化胜利宝箱", this.model.winBox)
		if (this.model.winBox && this.model.winBox.boxTimes < this.model.winBox.boxInfo.todayMaxOpenTimes) {
			this.view.showProgress(this.ui.sp_winBoxPercent, this.model.winBoxPercent)
			if (this.model.winBoxPercent == 1) {
				this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), "打开宝箱")
			}
			else {
				this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), this.model.winBoxUnlockText)
			}
		}
		else {
			this.view.showLabelString(this.ui.lab_winTimeText.getComponent(cc.Label), "已经没有宝箱")
		}
	}
	winBox() {
		cc.log("打开胜利宝箱")
	}

	//获取服务器发送的角色使用数据
	public switchRole(msg: Package): void {
		let itemData = msg.getDataByType(dataids.ID_EQUIP_ROLE);
		this.view.refreshRole(itemData.autoId);
	}

	//打开签到界面
	public reqSigninInfo(): void {
		this.openPrefabCB("signIn");
	}

	//打开每日任务界面
	public reqDailyMissionInfo(): void {
		this.openPrefabCB("dailyTask");
	}

	// update(dt) {}
	openPrefabCB(name) {
		return this.openSubModule(name)
	}
	onDestroy() {
		super.onDestroy();
	}
}