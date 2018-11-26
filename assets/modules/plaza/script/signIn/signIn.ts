import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import SignInMgr from "../../../../manager/public/signInMgr";
import { signInList, totalSignInList } from "../../../../manager/public/interface/iSignInfo";
import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";
import UserMgr from "../../../../manager/public/userMgr";

/*
author: 陈斌杰
日期:2018-11-20 16:29:17
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SignInCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public signInListData: signInList = SignInMgr.getInstance().signInData;				//全部签到数据
	public totalBoxesData: totalSignInList = SignInMgr.getInstance().totalBoxesData;	//全部累积宝箱数据
	public nowCloseSignIn: number = null;												//当前放弃双倍签到的天数
	public nowRepairSignIn: number = null;												//当前补签天数

	//判断玩家身上的金钱是否足够补签
	public getIsCanSpend(): boolean {
		let money = UserMgr.getInstance().userMoney.diamond;
		if (SignInMgr.getInstance().signIn_ReissuesCost < money) {
			return true;
		}
		return false;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_close: ctrl.btn_close,
		content: ctrl.content,															//签到预制挂载节点
		boxes: ctrl.boxes,																//累积宝箱挂载节点
		day: ctrl.day,																	//签到预制
		signInBox: ctrl.signInBox,														//累积宝箱预制
		doubleSignIn: ctrl.doubleSignIn,												//双倍签到界面
		btn_doubleClose: ctrl.doubleSignIn.getChildByName("btn_doubleClose"),			//双倍签到关闭按钮
		close: ctrl.doubleSignIn.getChildByName("close"),								//遗憾放弃按钮
		repairSignin: ctrl.repairSignin,												//补签界面
		btn_yqrx: ctrl.repairSignin.getChildByName("btn_yqrx"),							//补签界面有钱任性按钮
		btn_shareGame: ctrl.repairSignin.getChildByName("btn_shareGame"),				//补签界面分享游戏按钮
		btn_repairClose: ctrl.repairSignin.getChildByName("btn_repairClose"),			//关闭补签界面按钮
		repairnum: ctrl.repairSignin.getChildByName("repairNum").getComponent(cc.Label),//补签次数
		totalDay: ctrl.totalDay,														//累积签到天数
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.initSignInUI();
		this.initTotalBoxesUI();
		this.ui.doubleSignIn.active = false;
	}

	//初始化签到界面
	public initSignInUI(): void {
		let row: number = 0;
		let column: number = 0;
		for (let i = 0; i < this.model.signInListData.list.length; i++) {
			let signInData = this.model.signInListData.list[i];
			let signInNode = this.addPrefabNode(this.ui.day, this.ui.content);
			//设置坐标
			column = i % 7;
			if (i != 0 && i % 7 == 0) {
				row++;
			}
			signInNode.x = -255 + 85 * column;
			signInNode.y = 140 - 85 * row;
			signInNode.getComponent("day").initSignIn(signInData);
		}
		this.ui.totalDay.string = SignInMgr.getInstance().multiDay.toString();
	}

	//初始化签到累积宝箱
	public initTotalBoxesUI(): void {
		for (let i = 0; i < this.model.totalBoxesData.list.length; i++) {
			let boxesData = this.model.totalBoxesData.list[i];
			let boxesNode = this.addPrefabNode(this.ui.signInBox, this.ui.boxes);
			//设置坐标
			boxesNode.x = -225 + i * 150;
			boxesNode.y = -210;
			boxesNode.getComponent("signInBox").initTotalBoxes(boxesData);
		}
	}

	//刷新签到UI
	public refreshSignInUI(index: number): void {
		this.ui.content.children[index - 1].getComponent("day").refreshUI();
	}

	//开启双倍签到界面
	public showDoubleSignIn(): void {
		this.ui.doubleSignIn.active = true;
	}

	//设置遗憾放弃签到数据
	public setCloseSignIn(): void {
		this.ui.content.children[this.model.nowCloseSignIn - 1].getComponent("day").model.isNoDoubleSignIn = true;
		this.ui.doubleSignIn.active = false;
		this.model.nowCloseSignIn = null;
	}

	//开启补签界面
	public showRepairSignIn(): void {
		this.ui.repairnum.string = `${SignInMgr.getInstance().signIn_Reissues}次`;
		this.ui.repairSignin.active = true;
	}

	//刷新累积签到天数
	public refreshTotalDayUI(): void {
		this.ui.totalDay.string = SignInMgr.getInstance().multiDay.toString();
	}

	//刷新累积宝箱显示UI
	public refreshBoxesUI(data: any): void {
		for (let i = 0; i < this.model.totalBoxesData.list.length; i++) {
			let boxesData = this.model.totalBoxesData.list[i];
			if (boxesData.totalSignInDay == data.multiDayIndex) {
				this.ui.boxes.children[i].getComponent("signInBox").refreshBoxes(data.dictRecItems);
			}
		}
	}
}
//c, 控制
@ccclass
export default class SignInCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Node)
	content: cc.Node = null;
	@property(cc.Node)
	boxes: cc.Node = null;
	@property(cc.Prefab)
	day: cc.Prefab = null;
	@property(cc.Prefab)
	signInBox: cc.Prefab = null;
	@property(cc.Node)
	doubleSignIn: cc.Node = null;
	@property(cc.Node)
	repairSignin: cc.Node = null;
	@property(cc.Label)
	totalDay: cc.Label = null;
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
			"plaza.signin.signin": this.signin,
			"plaza.signin.repairSignin": this.getRepairSignin,
			"plaza.signin.recMultiSignin": this.recMultiSignin,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			"openDoubleSignIn": this.openDoubleSignIn,
			"openRepairSignIn": this.openRepairSignIn,
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("signIn");
		}, "关闭签到界面");
		this.connect("click", this.ui.btn_doubleClose, () => {
			this.ui.doubleSignIn.active = false;
		}, "关闭双倍签到界面");
		this.connect("click", this.ui.close, () => {
			this.view.setCloseSignIn();
		}, "遗憾放弃");
		this.connect("click", this.ui.btn_yqrx, () => {
			if (SignInMgr.getInstance().signIn_Reissues == 0) {
				console.log("-------补签次数不足------");
				return;
			}
			if (!this.model.getIsCanSpend()) {
				console.log("-------钻石不够，请充值！------");
				return;
			}
			SignInMgr.getInstance().sendReqRepairSignIn(this.model.nowRepairSignIn);
		}, "点击有钱任性按钮发送补签");
		this.connect("click", this.ui.btn_shareGame, () => {
			console.log("-------分享游戏------");
		}, "点击分享游戏按钮发送补签");
		this.connect("click", this.ui.btn_repairClose, () => {
			this.ui.repairSignin.active = false;
		}, "关闭补签界面");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	//服务器下发的签到数据  刷新签到UI
	public signin(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_DOSIGNIN_RECINFO);
		this.view.refreshSignInUI(data.dayIndex);
		this.view.refreshTotalDayUI();
	}

	//服务器下发补签数据  刷新UI
	public getRepairSignin(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_DOSIGNIN_RECINFO);
		this.ui.repairSignin.active = false;
		this.view.refreshSignInUI(data.dayIndex);
		this.view.refreshTotalDayUI();
	}

	//服务器下发累积宝箱开启数据
	public recMultiSignin(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_MULTISIGNIN_RECINFO);
		this.view.refreshBoxesUI(data);
	}

	//打开双倍签到界面
	public openDoubleSignIn(dayIndex: number): void {
		this.model.nowCloseSignIn = dayIndex;
		this.view.showDoubleSignIn();
	}

	//打开补签界面
	public openRepairSignIn(dayIndex: number): void {
		this.model.nowRepairSignIn = dayIndex;
		this.view.showRepairSignIn();
	}

	onDestroy() {
		super.onDestroy();
	}
}