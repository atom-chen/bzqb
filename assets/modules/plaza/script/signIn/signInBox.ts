import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { totalSignIn, signInRewark } from "../../../../manager/public/interface/iSignInfo";
import SignInMgr from "../../../../manager/public/signInMgr";

/*
author: 陈斌杰
日期:2018-11-21 16:20:00
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SignInBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public boxesData: totalSignIn = <totalSignIn>{};

	//设置宝箱数据
	public setBoxesData(data: any): void {
		this.boxesData = data;
	}

	//设置宝箱开启数据
	public setBoxesOpenState(data: any): void {
		this.boxesData.isOpen = true;
		this.boxesData.rewarkList = [];
		for (let key in data) {
			let signInRewark = <signInRewark>{};
			signInRewark.type = Number(key);
			signInRewark.amount = data[key];
			signInRewark.itemId = null;
			this.boxesData.rewarkList.push(signInRewark);
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		box: ctrl.box,				//宝箱图片
		total_lab: ctrl.total_lab,	//累积天数显示
		rewarkInfo: ctrl.rewarkInfo,//宝箱奖励挂载节点
		boxRewark: ctrl.boxRewark,	//宝箱奖励预制
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.rewarkInfo.active = false;
	}

	//初始化宝箱UI
	public initBoxesUI(): void {
		let picName = null;
		if (this.model.boxesData.isOpen) {
			picName = `openBox_${this.model.boxesData.totalSignInDay}`;
		} else {
			picName = `box_${this.model.boxesData.totalSignInDay}`;
		}
		this.loadImage(picName).then((sprf) => {
			this.ui.box.spriteFrame = sprf;
		});
		this.ui.total_lab.string = `签到${this.model.boxesData.totalSignInDay}`;
	}

	//显示宝箱奖励
	public showBoxesRewarks(): void {
		this.ui.rewarkInfo.getChildByName("bg").width = 80 * this.model.boxesData.rewarkList.length;
		if (this.ui.rewarkInfo.active == true) {
			this.ui.rewarkInfo.active = false;
		} else {
			this.ui.rewarkInfo.active = true;
		}
		if (this.ui.rewarkInfo.childrenCount > 2) {
			return;
		}
		for (let i = 0; i < this.model.boxesData.rewarkList.length; i++) {
			let boxData = this.model.boxesData.rewarkList[i];
			let boxNode = this.addPrefabNode(this.ui.boxRewark, this.ui.rewarkInfo);
			boxNode.x = -40 * (this.model.boxesData.rewarkList.length - 1) + i * 80;
			boxNode.getComponent("boxRewark").initTotalRewark(boxData);
		}
	}

	//刷新宝箱图片显示
	public refreshBoxesUI(): void {
		this.initBoxesUI();
	}
}
//c, 控制
@ccclass
export default class SignInBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	box: cc.Sprite = null;
	@property(cc.Label)
	total_lab: cc.Label = null;
	@property(cc.Node)
	rewarkInfo: cc.Node = null;
	@property(cc.Prefab)
	boxRewark: cc.Prefab = null;
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
		this.connect("click", this.node, () => {
			if (this.model.boxesData.isOpen) {
				return;
			}
			if (SignInMgr.getInstance().getIsCanOpenBoxes(this.model.boxesData.totalSignInDay)) {
				SignInMgr.getInstance().sendReqMultiSignIn(this.model.boxesData.totalSignInDay);
				return;
			}
			this.view.showBoxesRewarks();
		}, "点击宝箱显示宝箱奖励");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化累积宝箱
	public initTotalBoxes(data: any): void {
		this.model.setBoxesData(data);
		this.view.initBoxesUI();
	}

	//刷新宝箱显示
	public refreshBoxes(data: any): void {
		this.model.setBoxesOpenState(data);
		this.view.refreshBoxesUI();
		this.openSubModule("gainBox", true).then(script => {
			script.setGainData(this.model.boxesData.rewarkList);
		});
	}

	onDestroy() {
		super.onDestroy();
	}
}