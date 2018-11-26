import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import talentMgr from "../../../../manager/public/talentMgr";

/*
author: 蒙磊
日期:2018-11-19 11:15:19
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SuspensionframeCtrl;
//模型，数据处理
class Model extends BaseModel {
	talent: any = null;
	id: number;
	name: string;
	level: string;
	nextDes: string;
	curDes: string;

	constructor() {
		super();
	}
	setData(data) {
		this.talent = data;
		this.id = data.id;
		this.name = data.name;
		this.level = "等级:" + data.curLevel + "/" + data.maxLevel
		let curLevel = data.curLevel - 1;
		let nextLevel = curLevel >= (data.maxLevel - 1) ? curLevel : curLevel + 1;
		if (!data.value) {
			if (curLevel == -1) {
				this.curDes = "未习得"
			}
			else {
				this.curDes = data.des
			}
			this.nextDes = data.des
		}
		else {
			if (curLevel == -1) {
				this.curDes = "未习得"
			}
			else {
				this.curDes = this.stringReplace(data.des, "X", data.value[curLevel].value);
			}
			this.nextDes = this.stringReplace(data.des, "X", data.value[nextLevel].value);
		}
		if(curLevel==nextLevel){
			this.nextDes ="当前已满级"
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		//在这里声明ui
		lab_name: ctrl.lab_name,
		lab_level: ctrl.lab_level,
		lab_curDes: ctrl.lab_curDes,
		lab_nexDes: ctrl.lab_nexDes,
		btn_close: ctrl.btn_close,
		btn_levelUp: ctrl.btn_levelUp,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	//显示label内容
	showLabelString(obj: cc.Label, content: string) {
		obj.string = content;
	}
}
//c, 控制
@ccclass
export default class SuspensionframeCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	//label 
	@property(cc.Label)
	lab_name: cc.Label = null;
	@property(cc.Label)
	lab_level: cc.Label = null;
	@property(cc.Label)
	lab_curDes: cc.Label = null;
	@property(cc.Label)
	lab_nexDes: cc.Label = null;
	//button
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Node)
	btn_levelUp: cc.Node = null;
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
			'plaza.talent.learnTalent': this.learnTalent,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_levelUp, this.levelUp, "升级天赋");
		this.connect("click", this.ui.btn_close, this.close, "关闭学习天赋");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	//关闭升级界面
	close() {
		this.node.destroy();
		talentMgr.getInstance().curTalent =null;
	}
	//升级天赋按钮回调
	levelUp() {
		if(talentMgr.getInstance().talentPoint<=0){
			console.log("没有天赋点了！")
		}
		else if (!talentMgr.getInstance().boolStudyState(this.model.talent)) {
			console.log("学习天赋条件未达成")
		}
		else {
			talentMgr.getInstance().sendReqLearnTalent(this.model.id);
		}
	}
	learnTalent() {
		this.showData();
	}
	// update(dt) {}
	//设置天赋数据
	setData(data) {
		this.model.setData(data);
	}
	//显示天赋数据
	showData() {
		this.view.showLabelString(this.ui.lab_name, this.model.name)
		this.view.showLabelString(this.ui.lab_level, this.model.level)
		this.view.showLabelString(this.ui.lab_curDes, this.model.curDes)
		this.view.showLabelString(this.ui.lab_nexDes, this.model.nextDes)
	}
	onDestroy() {
		super.onDestroy();
	}
}