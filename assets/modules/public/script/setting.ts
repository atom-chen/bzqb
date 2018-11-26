import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import Audio from "../../../framework/modules/Audio";
import LoginMgr from "../../../manager/public/loginMgr";

/*
author: 张志强
日期:2018-11-09 18:35:49
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SettingCtrl;
//模型，数据处理
class Model extends BaseModel {
	public bgmEnable: boolean;
	public soundEnable: boolean;
	constructor() {
		super();
		this._initState();
	}

	private _initState(): void {
		let audioSe = Audio.getInstance().getAudioState();
		this.bgmEnable = audioSe.bgmEnable;
		this.soundEnable = audioSe.soundEnable;
	}

	public refreshState(key: string, state: boolean): void {
		switch (key) {
			case "music": this._changeMusic(state); break;
			case "effect": this._changeEffect(state); break;
		}
	}

	private _changeMusic(bool: boolean): void {
		this.bgmEnable = bool;
		if (this.bgmEnable) {
			Audio.getInstance().openBgm();
		} else {
			Audio.getInstance().closeBgm();
		}
	}

	private _changeEffect(bool: boolean): void {
		this.soundEnable = bool;
		if (this.soundEnable) {
			Audio.getInstance().openSoundEffect();
		} else {
			Audio.getInstance().closeSoundEffect();
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		musicTgl: ctrl.musicTgl,
		effectTgl: ctrl.effectTgl,
		friendTgl: ctrl.friendTgl,
		barrageTgl: ctrl.barrageTgl,
		switchBtn: ctrl.switchBtn,
		bindingBtn: ctrl.bindingBtn,
		closeBtn: ctrl.closeBtn
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.musicTgl.isChecked = this.model.bgmEnable;
		this.ui.musicTgl.node.getChildByName("background").active = !this.model.bgmEnable;
		this.ui.effectTgl.isChecked = this.model.soundEnable;
		this.ui.effectTgl.node.getChildByName("background").active = !this.model.soundEnable;
	}
}
//c, 控制
@ccclass
export default class SettingCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Toggle)
	musicTgl: cc.Toggle = null;
	@property(cc.Toggle)
	effectTgl: cc.Toggle = null;
	@property(cc.Toggle)
	friendTgl: cc.Toggle = null;
	@property(cc.Toggle)
	barrageTgl: cc.Toggle = null;
	@property(cc.Node)
	switchBtn: cc.Node = null;
	@property(cc.Node)
	bindingBtn: cc.Node = null;
	@property(cc.Node)
	closeBtn: cc.Node = null;
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
		this.connect("toggle", this.ui.musicTgl, this._toggleCB, "点击设置音乐开关");
		this.connect("toggle", this.ui.effectTgl, this._toggleCB, "点击设置音效开关");
		this.connect("toggle", this.ui.friendTgl, this._friendTglCB, "点击设置是否允许添加好友开关");
		this.connect("toggle", this.ui.barrageTgl, this._barrageTglCB, "点击设置弹幕开关");
		this.connect("click", this.ui.switchBtn, this._switchBtnCB, "点击设置切换账号按钮");
		this.connect("click", this.ui.bindingBtn, this._bindingBtnCB, "点击设置绑定账号按钮");
		this.connect("click", this.ui.closeBtn, this._closeBtnCB, "点击设置界面关闭按钮");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private _toggleCB(event: cc.Event): void {
		let bool = event.target.getComponent(cc.Toggle).isChecked;
		event.target.getChildByName("background").active = !bool;
		this.model.refreshState(event.target.name, bool);
	}

	private _friendTglCB(): void {

	}

	private _barrageTglCB(): void {

	}

	private _switchBtnCB(): void {
		LoginMgr.getInstance().switchAccount();
	}

	private _bindingBtnCB(): void {

	}

	private _closeBtnCB(): void {
		this.remove();
	}
	//end

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}