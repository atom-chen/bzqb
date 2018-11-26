import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import MatchMgr from "../../../../manager/public/matchMgr";
/*
author: 蒙磊
日期:2018-11-02 18:51:46
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MatchingCtrl;
enum ROOMSTATE {
	CHOSE = 0,
	ROOM,
	LOADING,
}
//模型，数据处理
class Model extends BaseModel {
	public roomState: number = ROOMSTATE.CHOSE;
	public second: number;//时间数据
	constructor() {
		super();
	}

	public initTime(): void {
		this.second = 0;
	}

	public addTime(): void {
		++this.second;
	}

	setRoomState(roomState: number) {
		this.roomState = roomState;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		note_room: ctrl.note_room,
		note_running: ctrl.note_running,
		note_chose: ctrl.note_chose,
		note_loading: ctrl.note_loading,
		btn_room: ctrl.btn_room,
		btn_back: ctrl.btn_back,
		btn_tumble: ctrl.btn_tumble,
		btn_begin: ctrl.btn_begin,
		btn_cancel: ctrl.btn_cancel,
		lab_time: ctrl.lab_time,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	public hide(name): void {
		this.ui[name].active = false;
	}

	public show(name): void {
		this.ui[name].active = true;
	}

	public showTime(): void {
		let minute = Math.floor(this.model.second / 60);
		let mString = minute >= 10 ? minute.toString() : `0${minute}`;
		let second = this.model.second % 60;
		let sString = second >= 10 ? second.toString() : `0${second}`;
		this.ui.lab_time.getComponent(cc.Label).string = `${mString}:${sString}`;
	}
}
//c, 控制
@ccclass
export default class MatchingCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	note_chose: cc.Node = null;
	@property(cc.Node)
	note_room: cc.Node = null;
	@property(cc.Node)
	note_running: cc.Node = null;
	@property(cc.Node)
	note_loading: cc.Node = null;
	@property(cc.Node)
	btn_room: cc.Node = null;
	@property(cc.Node)
	btn_back: cc.Node = null;
	@property(cc.Node)
	btn_tumble: cc.Node = null;
	@property(cc.Node)
	btn_begin: cc.Node = null;
	@property(cc.Node)
	btn_cancel: cc.Node = null;
	@property(cc.Node)
	lab_time: cc.Node = null;
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
		this.n_events = {
			'match.match.match': this._match,
			'match.match.stopMatch': this._stopMatch
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_room, this.roomCB, "进入房间");
		this.connect("click", this.ui.btn_back, this.backCB, "返回");
		this.connect("click", this.ui.btn_cancel, this._cancelCB, "取消匹配");
		this.connect("click", this.ui.btn_tumble, this.tumbleCB, "进入乱斗");
		this.connect("click", this.ui.btn_begin, this._beginCB, "房间开始");
	}
	//网络事件回调begin
	private _match(): void {

	}

	private _stopMatch(): void {
		this.unschedule(this._timer);
		this.view.hide("note_running");
		this.view.show("note_room");
		this.model.setRoomState(ROOMSTATE.ROOM);
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	roomCB() {
		this.view.show("note_room");
		this.view.hide("note_chose")
		this.model.setRoomState(ROOMSTATE.ROOM)
	}
	backCB() {
		cc.log(this.model.roomState)
		switch (this.model.roomState) {
			case ROOMSTATE.CHOSE:
				this.closeModule("matching")
				break;
			case ROOMSTATE.ROOM:
				this.closeModule("matching")
				break;
		}

	}

	private _cancelCB(): void {
		MatchMgr.getInstance().sendStopMatch();
	}

	tumbleCB() {
		this.view.show("note_running");
		this._startTimer();
	}

	private _beginCB() {
		this.view.show("note_running");
		this._startTimer();
		MatchMgr.getInstance().sendMatch();
		this.model.setRoomState(ROOMSTATE.LOADING);
	}
	//计时
	private _startTimer(): void {
		this.model.initTime();
		this.view.showTime()
		this.schedule(this._timer, 1)
	}

	private _timer(): void {
		this.model.addTime();
		this.view.showTime();
	}
	//加载loading
	loading() {
		this.closeModule("matching")
		this.openSubModule("loading");
	}

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}