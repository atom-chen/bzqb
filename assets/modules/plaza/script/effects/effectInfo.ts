import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { effect } from "../../../../manager/public/interface/iEffect";
import EffectMgr from "../../../../manager/public/effectMgr";
import UserMgr from "../../../../manager/public/userMgr";

/*
author: 陈斌杰
日期:2018-11-08 10:28:28
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: EffectInfoCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public effect: effect = <effect>{};
	public interimCfg: any = EffectMgr.getInstance().interimCfg;
	public money: any = UserMgr.getInstance().userMoney;

	//初始化特技信息数据
	public initEffectInfo(data: any): void {
		this.effect = data;
	}

	//根据特技是否解锁设置是否可以加入配置或者升级
	public isCanAddEffectByUnlock(): boolean {
		return this.effect.effectOther.isUnlock;
	}

	//根据当前持有的碎片判断是否可以升级特技
	public isCanUpEffectByChipNum(): boolean {
		if (this.effect.effectOther.effectChipNum >= this.effect.effectOther.upEffectChipNmu) {
			return true;
		}
		return false;
	}

	//根据玩家身上的金钱判断是否可以升级特技
	public isCanUpEffectByMoney(): boolean {
		if (this.money.gold >= this.effect.effectOther.spendGold) {
			return true;
		}
		return false;
	}

	//根据配置的特技Id设置是否可以加入配置
	public isCanAddEffectById(): boolean {
		for (let i = 0; i < this.interimCfg.length; i++) {
			if (this.effect.itemId == this.interimCfg[i]) {
				return false;
			}
		}
		return true;
	}

	//根据配置的特技数量设置是否可以加入配置
	public isCanAddEffectByNum(): boolean {
		let effectNum = EffectMgr.getInstance().effectNum;
		let allEffectNum = EffectMgr.getInstance().allEffectNum;
		if (effectNum >= allEffectNum) {
			return false;
		}
		return true;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		level: ctrl.top.getChildByName("lv").getComponent(cc.Label),			//等级
		name: ctrl.top.getChildByName("name").getComponent(cc.Label),			//名称
		energy: ctrl.energy,													//能量
		stars: ctrl.stars,														//星级
		type: ctrl.type,														//能量
		explain: ctrl.explain,													//技能说明
		damage: ctrl.damage,													//伤害
		exp: ctrl.exp,															//可获得的经验
		btn_upLv: ctrl.btn_upLv,												//升级按钮
		btn_addCfg: ctrl.btn_addCfg,											//加入配置按钮
		btn_close: ctrl.btn_close,												//特技信息关闭按钮
		upLv_lab: ctrl.upLv_lab,												//特技信息升级文本
		cardPiece: ctrl.cardPiece,												//特技碎片数量
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}

	//初始化特技UI
	public initEffectInfoUi(): void {
		let effect = this.model.effect;
		this.ui.level.string = effect.lv.toString() + "级";
		this.ui.name.string = effect.name;
		this.ui.energy.string = effect.energy.toString();
		for (let i = 0; i < this.ui.stars.childrenCount; i++) {
			if (i + 1 <= effect.star) {
				this.ui.stars.children[i].active = true;
			} else {
				this.ui.stars.children[i].active = false;
			}
		}
		if (effect.type == 1) {
			this.ui.type.string = "法术";
		} else {
			this.ui.type.string = "物理";
		}
		this.ui.explain.string = effect.explain;
		this.ui.damage.string = "伤害增加" + effect.damage.toString();
		this.ui.exp.string = effect.effectOther.getExp.toString();
		this.ui.upLv_lab.string = effect.effectOther.spendGold.toString();
		this.ui.cardPiece.getChildByName("chipNum").getComponent(cc.Label).string = effect.effectOther.effectChipNum + "/" + effect.effectOther.upEffectChipNmu;

		this.isShowAddConfigBtn();
	}

	//特技升级按钮是否可点击显示
	public isShowUpEffectBtn(): void {
		//特技是否解锁
		this.ui.btn_upLv.interactable = this.model.isCanAddEffectByUnlock();
		if (!this.model.isCanAddEffectByUnlock()) {
			return;
		}

		//碎片是否满足升级
		this.ui.btn_upLv.interactable = this.model.isCanUpEffectByChipNum();
		if (!this.model.isCanAddEffectByUnlock()) {
			return;
		}

		//金钱是否满足升级
		this.ui.btn_upLv.interactable = this.model.isCanUpEffectByMoney();
	}

	//加入配置按钮是否可点击显示
	public isShowAddConfigBtn(): void {

		//特技是否解锁
		this.ui.btn_addCfg.interactable = this.model.isCanAddEffectByUnlock();
		if (!this.model.isCanAddEffectByUnlock()) {
			return;
		}

		//配置栏配置的特技是否已满
		this.ui.btn_addCfg.interactable = this.model.isCanAddEffectByNum();
		if (!this.model.isCanAddEffectByNum()) {
			return;
		}

		//配置栏中是否存在
		this.ui.btn_addCfg.interactable = this.model.isCanAddEffectById();
	}
}
//c, 控制
@ccclass
export default class EffectInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	top: cc.Node = null;
	@property(cc.Label)
	energy: cc.Label = null;
	@property(cc.Node)
	stars: cc.Node = null;
	@property(cc.Label)
	type: cc.Label = null;
	@property(cc.Label)
	explain: cc.Label = null;
	@property(cc.Label)
	damage: cc.Label = null;
	@property(cc.Label)
	exp: cc.Label = null;
	@property(cc.Button)
	btn_upLv: cc.Button = null;
	@property(cc.Button)
	btn_addCfg: cc.Button = null;
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Label)
	upLv_lab: cc.Label = null;
	@property(cc.Node)
	cardPiece: cc.Node = null;
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
			this.closeModule("effectInfo");
		}, "关闭特技信息界面");
		this.connect("click", this.ui.btn_upLv, () => {
			EffectMgr.getInstance().sendReqUpEffect(this.model.effect.id);
		}, "点击特技升级按钮" + this.model.effect.itemId);
		this.connect("click", this.ui.btn_addCfg, () => {
			this.closeModule("effectInfo");
			this.gemit("btn_addEffectConfig", this.model.effect.itemId);
		}, "点击特技加入配置按钮" + this.model.effect);
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化特技信息
	public initEffectInfo(data: any): void {
		this.model.initEffectInfo(data);
		this.view.initEffectInfoUi();
	}

	onDestroy() {
		super.onDestroy();
	}
}