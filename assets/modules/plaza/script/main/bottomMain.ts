import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import BoxMgr from "../../../../manager/public/boxMgr";
import GameNet from "../../../../framework/modules/GameNet";
import EffectMgr from "../../../../manager/public/effectMgr";
import AchievementMgr from "../../../../manager/public/achievementMgr";
import talentMgr from "../../../../manager/public/talentMgr";
import UserMgr from "../../../../manager/public/userMgr";
import GuildsMgr from "../../../../manager/public/guildsMgr";
/*
author: 蒙磊
日期:2018-11-02 18:03:47
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: BottomMainCtrl;
let boxMgr = BoxMgr.getInstance();
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	unlockingBattleBox = null;//解锁中的宝箱节点
	battleBoxEndTime = null;//箱子结束时间
	battleBoxUnlockTime = null;//箱子显示时间
	//解锁的时间（毫秒）       解锁所需时间（秒）
	public initbattleBoxEndTime(unlockTime: number, unlock_time: number) {
		this.battleBoxEndTime = unlockTime + unlock_time * 1000;
	}
	public setUnlockBattleBoxTime() {
		let serverDelay = GameNet.getInstance().getServerDelay();
		let serverTime = Date.now() + serverDelay;
		let unlockNeedTime = this.battleBoxEndTime - serverTime;
		unlockNeedTime = unlockNeedTime > 0 ? unlockNeedTime : 0;
		let hour = Math.floor((unlockNeedTime / 1000) / 3600)
		let minute = Math.floor(((unlockNeedTime / 1000) % 3600) / 60)
		let hours = hour >= 10 ? hour : '0' + hour;
		let minutes = minute >= 10 ? minute : '0' + minute;
		this.battleBoxUnlockTime = hours + ":" + minutes;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		btn_talent: ctrl.btn_talent,
		btn_skill: ctrl.btn_skill,
		btn_achievement: ctrl.btn_achievement,
		btn_guild: ctrl.btn_guild,
		btn_ranking: ctrl.btn_ranking,
		boxList: ctrl.boxList,


	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {


	}
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
	hide(obj: any) {
		obj.active = false;
	}

	show(obj: any) {
		obj.active = true;
	}

}
//c, 控制
@ccclass
export default class BottomMainCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_talent: cc.Node = null;
	@property(cc.Node)
	btn_skill: cc.Node = null;
	@property(cc.Node)
	btn_achievement: cc.Node = null;
	@property(cc.Node)
	btn_guild: cc.Node = null;
	@property(cc.Node)
	btn_ranking: cc.Node = null;
	@property(cc.Node)
	boxList: cc.Node = null;


	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
		this.initBox();
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			"plaza.teji.reqTejiInfo": this.reqTejiInfo,
			"plaza.data.reqAchieveInfo": this.reqAchieveInfo,
			"plaza.talent.reqTalentInfo":this.reqTalentInfo,
			"plaza.box.unlockBox":this.unlockBox,
			"plaza.vip.buyVipGift":this.buyVipGift,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_talent, () => {
			if (talentMgr.getInstance().isInit) {
				this.reqTalentInfo();
			}
			else {
				talentMgr.getInstance().sendReqTalentInfo();
			}
		}, "打开天赋");
		this.connect("click", this.ui.btn_skill, () => {
			if (EffectMgr.getInstance().isInit) {
				this.openPrefabCB("effects");
				return;
			}
			EffectMgr.getInstance().sendReqEffectData();
		}, "发送特技数据请求");
		this.connect("click", this.ui.btn_achievement, () => {
			if (AchievementMgr.getInstance().isInit) {
				this.reqAchieveInfo();
			}
			else {
				AchievementMgr.getInstance().sendReqAchieveInfo();
			}
		}, "打开成就");
		this.connect("click", this.ui.btn_guild, () => { 
			let guildId= UserMgr.getInstance().getMyInfo().guildId;
			if(guildId) {
				GuildsMgr.getInstance().reqMyGuildDetail();
				GuildsMgr.getInstance().reqGuildMembers(guildId,0);
				this.openPrefabCB("guildsInfo")
			}
			else this.openPrefabCB("guilds") 
		}, "打开公会");
		this.connect("click", this.ui.btn_ranking, () => { this.openPrefabCB("ranks") }, "打开排行榜");
		this.connectBattleBox();

	}
	connectBattleBox(){
		for (let i = 0; i <this.ui.boxList.childrenCount; i++) {
			this.connect("click", this.ui.boxList.children[i], () => {
				boxMgr.setCurBattleBox(i)
				if (boxMgr.battleBox[i].unlockTime == 0) {
					this.openPrefabCB("battleBox");
				}
				else {
					//boxMgr.testOpenBox(boxMgr.battleBox[i].id_service)
				}
			}, "打开战斗宝箱");
		}
	}
	public initBox() {
		console.log(boxMgr.battleBox)
		for (let i = 0; i < this.ui.boxList.childrenCount; i++) {
			if (boxMgr.battleBox[i]) {
				if (boxMgr.battleBox[i].unlockTime == 0) {
					let obj_string = boxMgr.battleBox[i].boxInfo.unlock_time / 3600 + "小时";
					let obj_label = this.ui.boxList.children[i].children[0].children[0].children[0].getComponent(cc.Label)
					this.view.show(this.ui.boxList.children[i].children[0])
					this.view.hide(this.ui.boxList.children[i].children[1])
					this.view.showLabelString(obj_label, obj_string)
				}
				else {
					//初始化解锁中宝箱时间
					this.model.initbattleBoxEndTime(boxMgr.battleBox[i].unlockTime, boxMgr.battleBox[i].boxInfo.unlock_time)
					this.model.setUnlockBattleBoxTime()
					this.model.unlockingBattleBox = this.ui.boxList.children[i].children[0].children[1].children[0]
					let obj_label = this.model.unlockingBattleBox.getComponent(cc.Label)
					this.view.showLabelString(obj_label, this.model.battleBoxUnlockTime)
					this.view.hide(this.ui.boxList.children[i].children[0].children[0])
					this.view.show(this.ui.boxList.children[i].children[0].children[1])
					this.unlockBattleBoxTiming(obj_label);
				}
			}
			else {
				this.view.hide(this.ui.boxList.children[i].children[0])
				this.view.show(this.ui.boxList.children[i].children[1])
			}
		
		}
	}
	//解锁中宝箱计时
	unlockBattleBoxTiming(obj_string) {
		this.schedule(() => {
			this.model.setUnlockBattleBoxTime();
			this.view.showLabelString(obj_string, this.model.battleBoxUnlockTime)
		}, 1)
	}

	//网络事件回调begin
	public reqTejiInfo(): void {
		this.openPrefabCB("effects");
	}
	public reqAchieveInfo(): void {
		this.openPrefabCB("achievementBG");
	}
	public reqTalentInfo(): void {
		this.openPrefabCB("talentBG");
	}
	buyVipGift(){
		console.log("加人新战斗宝箱！！")
		this.initBox();
	}
	unlockBox(){
		this.initBox();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	openPrefabCB(name) {
		this.openSubModule(name)
	}
	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}