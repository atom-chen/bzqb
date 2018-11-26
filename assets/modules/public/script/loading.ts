import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import Loader from "../../../framework/modules/Loader";
import GameNet from "../../../framework/modules/GameNet";

/*
author: 张志强
日期:2018-11-05 15:03:40
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: LoadingCtrl;
//模型，数据处理
class Model extends BaseModel {
	public routeArr: string[] = null;
	public totalRouteLen: number = 0;
	public curRouteLen: number = 0;
	public curResPaths: any = null;
	public curProgress: number = 0;
	constructor() {
		super();
	}

	public setRouteArr(arr: string[]): void {
		this.routeArr = arr;
		this.totalRouteLen = arr.length;
	}

	public setResPaths(obj: any): void {
		this.curResPaths = obj;
	}

	public routeReceived(): void {
		this.curRouteLen += 1;
	}

	public addProgress(p: number): void {
		this.curProgress += p;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		progressBar: ctrl.progressBar
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.addGrayLayer(false);
	}

	public refreshProgress() {
		this.ui.progressBar.progress = this.model.curProgress;
	}
}
//c, 控制
@ccclass
export default class LoadingCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.ProgressBar)
	progressBar: cc.ProgressBar = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	private _completeCB: Function = null;
	public needLoadData: boolean = false;

	protected onLoad(): void {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	//定义网络事件
	protected defineNetEvents(): void {
		this.n_events = {};
	}
	//定义全局事件
	protected defineGlobalEvents(): void {
		this.g_events = {};
	}
	//绑定操作的回调
	protected connectUi(): void {

	}
	// 网络事件回调begin
	public routeReceived(): void {
		this.model.routeReceived();
		let num = this.model.curRouteLen / this.model.totalRouteLen;
		this.addProgress(num);
		if (num >= 1) this._complete();
	}
	// end
	// 全局事件回调begin
	// end
	// 按钮或任何控件操作的回调begin
	// end
	public setPreLoad(obj: any): void {
		let { resPaths, routeArr, complete } = obj;
		this.model.setResPaths(resPaths);
		if (routeArr) {
			let len = routeArr.length;
			for (let i = 0; i < len; ++i) {
				this.n_events[routeArr[i]] = this.routeReceived;
			}
			this.regAllEvents();
			this.model.setRouteArr(routeArr);
			this.needLoadData = true;
		}
		this._completeCB = complete;
		this._preLoadRes();
	}

	private _preLoadData() {
		for (let i = 0; i < this.model.totalRouteLen; ++i) {
			GameNet.getInstance().send_msg(this.model.routeArr[i]);
		}
	}

	private _preLoadRes(): void {
		let paths = [];
		for (let k in this.model.curResPaths) {
			let type = null;
			switch (k) {
				case "prefab": type = cc.Prefab; break;
				case "image": type = cc.SpriteFrame; break;
				case "config": type = cc.JsonAsset; break;
			}
			for (let s in this.model.curResPaths[k]) {
				paths.push({ url: this.model.curResPaths[k][s], type: type });
			}
		}
		Loader.getInstance().loadQueue({
			paths: paths,
			progress: (num: Number) => {
				this.addProgress(num)
			},
			complete: () => {
				if (this.needLoadData) {
					this._preLoadData();
				} else {
					this._complete();
				}
			}
		});
	}

	public addProgress(num): void {
		if (this.needLoadData) num /= 2;
		this.model.addProgress(num)
		this.view.refreshProgress();
	}

	private _complete(): void {
		this.remove();
		this._completeCB();
	}

	// update(dt) {}

	protected onDestroy(): void {
		super.onDestroy();
	}
}