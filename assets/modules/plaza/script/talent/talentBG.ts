import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import TalentMgr from "../../../../manager/public/talentMgr";
import ModuleMgr from "../../../../framework/modules/ModuleMgr";
import GameNet from "../../../../framework/modules/GameNet";
import { enums } from "../../../../manager/enums";


/*
author: 蒙磊
日期:2018-11-09 15:54:28
*/
//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TalentCtrl;
//模型，数据处理
class Model extends BaseModel {
	talentMgr = TalentMgr.getInstance();
	talentPoint: number = this.talentMgr.talentPoint;
	talentList = this.talentMgr.talentList;
	refreshNeedTime = null;
	talentInfo = TalentMgr.getInstance().talentInfo;
	resetTime: string = null;
	serverDelay: number = null;
	refreshEndTime: number = null;
	constructor() {
		super();
	}
	initResetTime() {
		this.serverDelay = GameNet.getInstance().getServerDelay();
		this.refreshEndTime = this.talentMgr.lastResetTime + (enums.Talent_ResetTime * 1000);
	}
	refreshData() {
		this.talentList = this.talentMgr.talentList;
		this.talentPoint = this.talentMgr.talentPoint;
	}
	setResetTime() {
		let serverTime = Date.now() + this.serverDelay;
		this.refreshNeedTime = this.refreshEndTime - serverTime;
		this.refreshNeedTime = this.refreshNeedTime > 0 ? this.refreshNeedTime : -1;
		if (this.refreshNeedTime < 0) {
			this.resetTime = "可分享重置"
		}
		else {
			let hour = Math.floor((this.refreshNeedTime / 1000) / 3600) + 1
			this.resetTime = hour + "小时后重置"
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_close: ctrl.btn_close,
		btn_reset: ctrl.btn_reset,
		note_resetTalent: ctrl.note_resetTalent,
		btn_closeReset: ctrl.btn_closeReset,
		note_talentList: ctrl.note_talentList,
		suspensionFrame: ctrl.suspensionFrame,
		lab_talentPoint: ctrl.lab_talentPoint,
		btn_buyReset: ctrl.btn_buyReset,
		btn_share: ctrl.btn_share,
		lab_resetTime: ctrl.lab_resetTime,

	}

	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	show(name) {
		this.ui[name].active = true;
	}
	hide(name) {
		this.ui[name].active = false;
	}
}
//c, 控制
@ccclass
export default class TalentCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//btn
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Node)
	btn_reset: cc.Node = null;
	@property(cc.Node)
	btn_closeReset: cc.Node = null;
	@property(cc.Node)
	btn_buyReset: cc.Node = null;
	@property(cc.Node)
	btn_share: cc.Node = null;
	//note
	@property(cc.Node)
	note_resetTalent: cc.Node = null;
	@property(cc.Node)
	note_talentList: cc.Node = null;
	//label
	@property(cc.Label)
	lab_talentPoint: cc.Label = null;
	@property(cc.Label)
	lab_resetTime: cc.Label = null;
	//Prefab
	@property(cc.Prefab)
	suspensionFrame: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	ts_talentList: any = [];
	onLoad() {
		// 控制器
		ctrl = this;
		this.note_resetTalent.childrenCount
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initData();
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			'plaza.talent.resetTalent': this.resetTalent,
			'plaza.talent.learnTalent': this.learnTalent,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, this.close, "关闭");
		this.connect("click", this.ui.btn_reset, this.reset, "打开重置天赋界面");
		this.connect("click", this.ui.btn_buyReset, this.butReset, "花钱重置重置天赋");
		this.connect("click", this.ui.btn_share, this.share, "分享重置重置天赋");
		this.connect("click", this.ui.btn_closeReset, this.closeReset, "关闭重置天赋");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	//初始化
	initData() {
		this.model.initResetTime();
		this.resetTiming();
		this.schedule(this.resetTiming, 60)
		this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime)
		this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString())
		for (let i = 0; i < this.note_talentList.childrenCount; i++) {
			let talent = this.note_talentList.children[i].addComponent("talent")
			talent.setSuspensionFrame(this.ui.suspensionFrame)
			talent.setTalentData(this.model.talentList[i], i)
			talent.addIcon(this.model.talentList[i].icon)
			talent.refreshLevel()
			this.ts_talentList.push(talent)
		}
	}
	//学习天赋回调
	learnTalent() {
		this.model.refreshData();
		console.log(this.model.talentPoint)
		this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString())
		let curTalent = TalentMgr.getInstance().curTalent;

		if (curTalent) {
			curTalent.updataTalentData(this.model.talentList[curTalent.model.index])
			curTalent.refreshLevel();
		}


	}
	//重置天赋计时
	resetTiming() {
		this.model.setResetTime();
		this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime.toString())
	}
	//购买重置天赋提示
	butReset() {
		ModuleMgr.getInstance().showMsgBox({ content: "是否花费200进行天赋重置？", okcb: this.buyResetTalent })
	}
	//分享重置天赋按钮回调
	share() {
		if (this.model.refreshNeedTime <= 0) {
			TalentMgr.getInstance().sendReqresetTalent(1);
		}
		else {
			console.log("重置时间未到")
		}
	}
	//购买重置天赋
	buyResetTalent() {
		TalentMgr.getInstance().sendReqresetTalent(2);
	}
	//重置天赋回调
	resetTalent() {
		this.closeReset();
		this.model.refreshData();
		this.model.initResetTime();
		this.model.setResetTime();
		this.view.showLabelString(this.ui.lab_resetTime, this.model.resetTime.toString())
		this.view.showLabelString(this.ui.lab_talentPoint, this.model.talentPoint.toString())
		for (let i = 0; i < this.ts_talentList.length; i++) {
			this.ts_talentList[i].refreshLevel();
		}
	}
	//打开重置天赋界面
	reset() {
		this.view.show('note_resetTalent')
	}
	closeReset() {
		this.view.hide('note_resetTalent')
	}
	// update(dt) {}
	//退出天赋
	close() {
		this.closeModule("talentBG")
	}
	onDestroy() {
		super.onDestroy();
	}
}