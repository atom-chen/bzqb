import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { effect, effectOther } from "../../../../manager/public/interface/iEffect";

/*
author: 陈斌杰
日期:2018-11-07 18:48:54
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: EffectCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public effect: effect = <effect>{};

	//初始化特技数据
	public initEffect (data: any): void {
		this.effect.name = data.name;
		this.effect.type = data.type;
		this.effect.explain = data.explain;
		this.effect.id = data.id;
		this.effect.itemId = data.itemId;
		this.effect.lv = data.lv;
		this.effect.star = data.star;
		this.effect.damage = data.damage;
		this.effect.energy = data.energy;
		this.effect.effectOther = data.effectOther;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		card: ctrl.card,
		cardCount: ctrl.cardCount,
		cardEnergy: ctrl.cardEnergy,
		cardLv: ctrl.cardLv,
		stars: ctrl.stars,
		btn_info: ctrl.btn_info,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		
	}

	//初始化特技UI
	public initEffectUi (): void {
		var effect = this.model.effect;
		this.ui.cardEnergy.string = effect.energy.toString();
		this.ui.cardLv.string = "等级"+effect.lv.toString();
		this.ui.cardCount.string = effect.effectOther.effectChipNum.toString() + "/" + effect.effectOther.upEffectChipNmu.toString();
		for (let i = 0; i < this.ui.stars.childrenCount; i++) {
			if (i+1 <= effect.star) {
				this.ui.stars.children[i].active = true;
			} else {
				this.ui.stars.children[i].active = false;
			}
		}
		if (!this.model.effect.effectOther.isUnlock) {
			let spArr = this.node.getComponentsInChildren(cc.Sprite);
			for (let i = 0; i < spArr.length; ++i) {
				spArr[i].setState(cc.Sprite.State.GRAY);
			}
		}

	}
}
//c, 控制
@ccclass
export default class EffectCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	card: cc.Node = null;
	@property(cc.Label)
	cardCount: cc.Label = null;
	@property(cc.Label)
	cardEnergy: cc.Label = null;
	@property(cc.Label)
	cardLv: cc.Label = null;
	@property(cc.Node)
	stars: cc.Node = null;
	@property(cc.Button)
	btn_info: cc.Button = null;
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
		this.connect("click",this.ui.btn_info,this.openEffectInfo,"显示特技信息");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化特技数据
	public initEffectData (data: any): void {
		this.model.initEffect(data);
		this.view.initEffectUi();
	}

	//打开特技信息预制
	public openEffectInfo (): void {
		this.openSubModule("effectInfo").then((obj)=>{
			obj.initEffectInfo(this.model.effect);
		});
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}