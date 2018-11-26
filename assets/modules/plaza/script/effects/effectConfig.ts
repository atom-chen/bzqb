import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { effectCfg, effect } from "../../../../manager/public/interface/iEffect";
import EffectMgr from "../../../../manager/public/effectMgr";

/*
author: 陈斌杰
日期:2018-11-08 14:25:40
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: EffectConfigCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public effect: effect = <effect>{};
	public effectCfg: effectCfg = <effectCfg>{};

	//初始化特技配置数据
	public initEffectCfgData (data: any): void {
		this.effectCfg.isConfig = data.isConfig;
		this.effectCfg.effectId = data.effectId;
		this.initEffectData();
	}

	public initEffectData (): void {
		this.effect = EffectMgr.getInstance().getEffectDataById(this.effectCfg.effectId);
	}

	//设置特技配置数据
	public setEffectCfgData (id: number): void {
		if (id == 0) {
			this.effectCfg.isConfig = false;
			this.effectCfg.effectId = id;
			return;
		}
		this.effect = EffectMgr.getInstance().getEffectDataById(id);
		this.effectCfg.isConfig = true;
		this.effectCfg.effectId = id;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		effect: ctrl.effect,			//特技
		isConfig: ctrl.isConfig,		//是否配置
		energy: ctrl.energy,			//能量
		stars: ctrl.stars,				//星级
		effectName: ctrl.effectName,	//特技名称
		level: ctrl.level,				//等级
		btn_del: ctrl.btn_del,			//删除
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.effect.active = false;
		this.ui.isConfig.active = false;
	}

	//初始化配置特技UI
	public initEffectCfgUi (): void {
		let effectCfg = this.model.effectCfg;
		if (effectCfg.effectId != 0) {
			this.ui.effect.active = true;
			this.initEffectUi();
		} else {
			this.ui.isConfig.active = true;
		}
	}

	//初始化特技UI
	public initEffectUi (): void {
		this.ui.energy.string = this.model.effect.energy.toString();
		this.ui.effectName.string = this.model.effect.name.toString();
		this.ui.level.string = "等级"+this.model.effect.lv.toString();
		for (let i = 0; i < this.ui.stars.childrenCount; i++) {
			if (i+1 <= this.model.effect.star) {
				this.ui.stars.children[i].active = true;
			} else {
				this.ui.stars.children[i].active = false;
			}
		}
	}

	//刷新特技配置UI
	public refreshEffectUI (): void {
		if (this.model.effectCfg.effectId == 0) {
			this.ui.effect.active = false;
		} else {
			this.ui.effect.active = true;
		}
		this.ui.isConfig.active = false;
		this.initEffectCfgUi();
	}
}
//c, 控制
@ccclass
export default class EffectConfigCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	effect: cc.Node = null;
	@property(cc.Node)
	isConfig: cc.Node = null;
	@property(cc.Label)
	energy: cc.Label = null;
	@property(cc.Node)
	stars: cc.Node = null;
	@property(cc.Label)
	effectName: cc.Label = null;
	@property(cc.Label)
	level: cc.Label = null;
	@property(cc.Button)
	btn_del: cc.Button = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
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
		this.connect("click",this.ui.btn_del,()=>{
			this.gemit("btn_delEffectCfg",this.model.effect.itemId);
		},"删除配置的特技");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化特技配置数据和UI
	public initEffectCfg (data: any): void {
		this.model.initEffectCfgData(data);
		this.view.initEffectCfgUi();
	}

	//刷新特技配置数据和UI
	public refreshEffectCfg (id: number): void {
		this.model.setEffectCfgData(id);
		this.view.refreshEffectUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}