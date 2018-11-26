import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import RankMgr from "../../../../manager/public/rankMgr";
import TableMgr from "../../../../manager/public/tableMgr";

/*
author: 陈斌杰
日期:2018-11-09 15:25:39
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RankInfoCtrl;
//模型，数据处理
class Model extends BaseModel {
    myRankInfo = null;
	constructor() {
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		spr_rank: ctrl.spr_rank,
		spr_head: ctrl.spr_head,
		spr_kingIco: ctrl.spr_kingIco,
		spr_LevelIco: ctrl.spr_LevelIco,
		lbl_playerName: ctrl.lbl_playerName,
		lbl_guildName: ctrl.lbl_guildName,
		lbl_stageName: ctrl.lbl_stageName,
		lbl_startCount: ctrl.lbl_startCount,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	refreshMyRankInfo()
	{
		console.log('refreshMyRankInfo',this.model.myRankInfo)
		if(this.model.myRankInfo) {
			this.ui.lbl_playerName.string = this.model.myRankInfo.nickname;
			this.ui.lbl_guildName.string = this.model.myRankInfo.guildName;
	    	let card =TableMgr.getInstance().search('duanwei_duanwei',{stage:this.model.myRankInfo.stageIndex});
			this.ui.lbl_stageName.string = card.name;
			this.ui.lbl_startCount.string = this.model.myRankInfo.stageScore;
		}
		
	}
}
//c, 控制
@ccclass
export default class RankInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	spr_rank: cc.Sprite = null;
	@property(cc.Sprite)
	spr_head: cc.Sprite = null;
	@property(cc.Sprite)
	spr_kingIco: cc.Sprite = null;
	@property(cc.Sprite)
	spr_LevelIco: cc.Sprite = null;
	@property(cc.Label)
	lbl_playerName: cc.Label = null;
	@property(cc.Label)
	lbl_guildName: cc.Label = null;
	@property(cc.Label)
	lbl_stageName: cc.Label = null;
	@property(cc.Label)
	lbl_startCount: cc.Label = null;
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
	 	this.n_events = {
            'search.entry.reqMyRankInfo': this.search_entry_reqMyRankInfo,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
	}
	search_entry_reqMyRankInfo()
	{

	}
	updateAndRefreshMyRankInfo(data)
	{
		this.model.myRankInfo = data;
		this.view.refreshMyRankInfo();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	onDestroy() {
		super.onDestroy();
	}
}