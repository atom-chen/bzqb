import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { userMoney } from "../../../../manager/public/interface/iUserInfo";
import UserMgr from "../../../../manager/public/userMgr";
import { effectList, effectCfgList } from "../../../../manager/public/interface/iEffect";
import EffectMgr from "../../../../manager/public/effectMgr";

/*
author: 陈斌杰
日期:2018-11-07 15:28:25
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: CardsCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public userMoney: userMoney = UserMgr.getInstance().userMoney;
	public effectList: effectList = EffectMgr.getInstance().effectList;
	public effectCfgList: effectCfgList = EffectMgr.getInstance().effectCfgList;
	public interimCfg: number[] = EffectMgr.getInstance().interimCfg;		//临时特技配置id数组
	public sortState: number = 0;	// -1 小到大、1 大到小

	//设置添加的特技配置数据
	public addEffectConfigData(effectId: any): void {
		for (let i = 0; i < this.interimCfg.length; i++) {
			if (this.interimCfg[i] == 0) {
				this.interimCfg[i] = effectId;
				return;
			} else {
				continue;
			}
		}
	}

	//删除配置特技数据
	public delEffectConfigData(effectId: any): void {
		for (let i = 0; i < this.interimCfg.length; i++) {
			if (this.interimCfg[i] == 0) { break }
			if (this.interimCfg[i] == effectId) {
				this.interimCfg[i] = 0;
				continue;
			}
			if (this.interimCfg[i - 1] == 0) {
				this.interimCfg[i - 1] = this.interimCfg[i];
				this.interimCfg[i] = 0;
			}
		}
	}

	//设置按照星级排序按钮状态
	public setSortState(): void {
		if (this.sortState == 0) {
			this.sortState = -1;
		}
		if (this.sortState == -1) {
			this.sortState = 1;
		}
		if (this.sortState == 1) {
			this.sortState = -1;
		}
	}

	//设置特技数据按照星级排序
	public sortEffectData(): void {
		this.setSortState();
		EffectMgr.getInstance().sortEffectData(this.sortState);
	}

	//获取保存的特技配置数据并发送
	public getEffectCfgData_sendReq(): void {
		let data: any = [];
		for (let i = 0; i < this.effectList.list.length; i++) {
			let effect = this.effectList.list[i];
			for (let j = 0; j < this.interimCfg.length; j++) {
				if (this.interimCfg[j] == 0) {
					break;
				}
				if (effect.itemId == this.interimCfg[j]) {
					data.push(effect.id);
				}
			}
		}
		if (data.length == EffectMgr.getInstance().effectNum) {
			EffectMgr.getInstance().sendReqEffectCfgData(data);
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_close: ctrl.btn_close,													//关闭特技界面按钮
		gold: ctrl.moneyFrame.getChildByName("gold").getComponent(cc.Label),		//金币
		crystal: ctrl.moneyFrame.getChildByName("crystal").getComponent(cc.Label),	//粉晶
		diamond: ctrl.moneyFrame.getChildByName("diamond").getComponent(cc.Label),	//钻石
		effectList_content: ctrl.effectList_content,								//特技列表content
		effectCfgList_content: ctrl.effectCfgList_content,							//特技配置列表content
		effect: ctrl.effect,														//特技预制
		effectConfig: ctrl.effectConfig,											//特技配置预制
		effectCount: ctrl.effectCount,												//特技数量
		btn_sort: ctrl.btn_sort,													//特技排序
		btn_hold: ctrl.btn_hold,													//特技配置保存按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.refreshMoneyUI();

		this.initEffectList();
		this.initEffectCfgList();
	}

	//初始化特技列表
	public initEffectList(): void {
		var list = this.model.effectList.list;
		let row: number = 0;
		let column: number = 0;
		for (let i = 0; i < list.length; i++) {
			let effectData: any = list[i];
			let effect = this.addPrefabNode(this.ui.effect, this.ui.effectList_content);
			//设置坐标
			column = i % 4;
			if (i != 0 && i % 4 == 0) {
				row++;
				this.ui.effectList_content.height = 250 * (row + 1);
			}
			effect.x = -250 + 170 * column;
			effect.y = -125 - 250 * row;
			//设置特技属性
			effect.getComponent("effect").initEffectData(effectData);
		}
	}

	//刷新特技界面金钱数据
	public refreshMoneyUI(): void {
		this.ui.gold.string = this.numberEllipsis(this.model.userMoney.gold);
		this.ui.crystal.string = this.numberEllipsis(this.model.userMoney.crystal);
		this.ui.diamond.string = this.numberEllipsis(this.model.userMoney.diamond);
	}

	//刷新特技界面
	public refreshEffectList(): void {
		var list = this.model.effectList.list;
		for (let i = 0; i < this.ui.effectList_content.childrenCount; i++) {
			let effectNode = this.ui.effectList_content.children[i];
			effectNode.getComponent("effect").initEffectData(list[i]);
		}
	}

	//初始化特技配置列表
	public initEffectCfgList(): void {
		let list = this.model.effectCfgList.list;
		this.ui.effectCfgList_content.height = list.length * 160;
		for (let i = 0; i < list.length; i++) {
			let effectCfgData: any = list[i];
			this.model.interimCfg.push(effectCfgData.effectId);
			let effectCfg = this.addPrefabNode(this.ui.effectConfig, this.ui.effectCfgList_content);
			//设置坐标
			effectCfg.y = -75 - i * 160;
			//设置配置的特技属性
			effectCfg.getComponent("effectConfig").initEffectCfg(effectCfgData);
		}
		this.refreshEffectCount();
	}

	//刷新特技数量显示
	public refreshEffectCount(): void {
		let effectNum = 0;		//当前装备特技数量
		let user = UserMgr.getInstance().user;
		let list = this.model.interimCfg;
		for (let i = 0; i < list.length; i++) {
			if (list[i] != 0) {
				effectNum++;
			}
		}
		EffectMgr.getInstance().setEffectNum(effectNum);
		this.ui.effectCount.string = EffectMgr.getInstance().effectNum.toString() + "/" + EffectMgr.getInstance().allEffectNum.toString();
	}

	//刷新特技配置
	public refreshEffectCfg(): void {
		this.refreshEffectCount();
		if (this.model.interimCfg.length == 0) {
			return;
		}
		for (let i = 0; i < this.model.interimCfg.length; i++) {
			let effectId = this.model.interimCfg[i];
			this.ui.effectCfgList_content.children[i].getComponent("effectConfig").refreshEffectCfg(effectId);
		}
	}
}
//c, 控制
@ccclass
export default class CardsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Node)
	moneyFrame: cc.Node = null;
	@property(cc.Node)
	effectList_content: cc.Node = null;
	@property(cc.Node)
	effectCfgList_content: cc.Node = null;
	@property(cc.Label)
	effectCount: cc.Label = null;
	@property(cc.Prefab)
	effect: cc.Prefab = null;
	@property(cc.Prefab)
	effectConfig: cc.Prefab = null;
	@property(cc.Button)
	btn_sort: cc.Button = null;
	@property(cc.Button)
	btn_hold: cc.Button = null;
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
			"btn_addEffectConfig": this.addEffectConfig,
			"btn_delEffectCfg": this.delEffectCfg,
			"upEffect": this.upEffect,
			"effectCfg": this.effectCfg,
			"refreshMoneyUI": this.refreshMoneyUI,
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("effects");
		}, "关闭特技界面");
		this.connect("click", this.ui.btn_sort, () => {
			this.model.sortEffectData();
			this.view.refreshEffectList();
		}, "特技按照星级排序");
		this.connect("click", this.ui.btn_hold, () => {
			this.model.getEffectCfgData_sendReq();
		}, "发送保存特技配置");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//加入配置的特技到特技栏
	public addEffectConfig(effectId: number): void {
		this.model.addEffectConfigData(effectId);
		this.view.refreshEffectCfg();
	}

	//删除配置中的特技
	public delEffectCfg(effectId: number): void {
		this.model.delEffectConfigData(effectId);
		this.view.refreshEffectCfg();
	}

	//升级特技
	public upEffect(): void {
		//刷新界面UI
		this.view.refreshEffectList();
		this.view.refreshEffectCfg();
		this.closeModule("effectInfo");
	}

	//保存的特技配置
	public effectCfg(): void {
		//刷新特技配置UI
	}

	//刷新金钱显示
	public refreshMoneyUI(): void {
		this.view.refreshMoneyUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}