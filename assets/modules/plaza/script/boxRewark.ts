import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import BaseView from "../../../framework/baseClass/BaseView";
import { signInRewark } from "../../../manager/public/interface/iSignInfo";
import { enums } from "../../../manager/enums";


/*
author: 陈斌杰
日期:2018-11-21 17:58:37
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: BoxRewarkCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public boxesRewarkData: signInRewark = <signInRewark>{};

	//设置累积宝箱奖励数据
	public setBoxesRewarkData(data: any): void {
		this.boxesRewarkData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		ico: ctrl.ico,
		amount: ctrl.amount,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.ico.spriteFrame = null;
		this.ui.amount.string = "";
	}

	//初始化累积宝箱奖励UI
	public initBoxesRewarkUI(): void {
		let boxesRewarkData = this.model.boxesRewarkData;
		let icoName = null;
		switch (boxesRewarkData.type) {
			case enums.Get_Gold:
				icoName = "gold";
				break;
			case enums.Get_Crystal:
				icoName = "crystal";
				break;
			case enums.Get_Price:
				icoName = "diamond";
				break;
			case enums.Get_Exp:
				icoName = "exp";
				break;
			default:
				break;
		}
		if (icoName != null) {
			this.loadImage(icoName, true).then((sprf) => {
				this.ui.ico.spriteFrame = sprf;
			});
		}
		this.ui.amount.string = boxesRewarkData.amount.toString();
	}
}
//c, 控制
@ccclass
export default class BoxRewarkCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	ico: cc.Sprite = null;
	@property(cc.Label)
	amount: cc.Label = null;
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

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//初始化累积宝箱奖励
	public initTotalRewark(data: any): void {
		this.model.setBoxesRewarkData(data);
		this.view.initBoxesRewarkUI();
	}

	onDestroy() {
		super.onDestroy();
	}
}