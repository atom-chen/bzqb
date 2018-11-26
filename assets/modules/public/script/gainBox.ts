import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";

/*
author: 张志强
日期:2018-11-12 13:45:57
*/

interface Item {
	type: number,
	amount: number
}

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GainBoxCtrl;
//模型，数据处理
class Model extends BaseModel {
	public itemList: Item[];
	constructor() {
		super();
	}

	public initData(arr: Item[]): void {
		this.itemList = arr;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		content: ctrl.content,
		closeBtn: ctrl.closeBtn
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.addGrayLayer();
	}
	/**@todo 暂时显示文字，等资源到了替换为图标*/
	public refresh(): void {
		let list = this.model.itemList;
		let item = this.ui.content.children[0];
		let words = ["金币", "粉晶", "钻石", "特技", "宝箱", "碎片", "喇叭"];
		for (let i = 0; i < list.length; ++i) {
			let curItem = i == 0 ? item : this.addPrefabNode(item, this.ui.content);
			let data = list[i];
			curItem.getComponent(cc.Label).string = `${words[data.type - 1]}X${data.amount}`;
		}
	}
}
//c, 控制
@ccclass
export default class GainBoxCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	content: cc.Node = null;
	@property(cc.Node)
	closeBtn: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	private _callback: Function;
	protected onLoad(): void {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	public setGainData(arr: Item[], CB?: Function): void {
		this.model.initData(arr);
		this.view.refresh();
		this._callback = CB ? CB : () => { };
	}

	//绑定操作的回调
	protected connectUi(): void {
		this.connect("click", this.ui.closeBtn, this._closeBtnCB, "关闭获得物品界面");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private _closeBtnCB(): void {
		this.remove();
		this._callback();
	}
	//end

	// update(dt) {}

	protected onDestroy(): void {
		super.onDestroy();
	}
}