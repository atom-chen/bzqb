import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import RankMgr from "../../../../manager/public/rankMgr";

/*
author: 陈斌杰
日期:2018-11-09 15:25:39
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RanksCtrl;
//模型，数据处理
class Model extends BaseModel {
	rankList = null;
	nodeContentHeight = 416;
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
		btn_close: ctrl.btn_close,
		pref_rankInfo: ctrl.pref_rankInfo,
		scroll_bar: ctrl.scroll_bar,
		node_content: ctrl.node_content,
		node_myInfoContent: ctrl.node_myInfoContent,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {

	}
	refreshRankList()
	{
		// this.ui.node_content.destroyAllChildren();
		if(this.model.rankList) {
			this.ui.node_content.setContentSize(this.ui.node_content.getContentSize().width,this.model.nodeContentHeight*(this.model.rankList.page+1));
			for (let rankListIdx = 0; rankListIdx < this.model.rankList.rankList.length; rankListIdx++) {
				let rankData = this.model.rankList.rankList[rankListIdx];
				let rankInfo =cc.instantiate(this.ui.pref_rankInfo);
				this.ui.node_content.addChild(rankInfo);
				rankInfo.getComponent('rankInfo').updateAndRefreshMyRankInfo(rankData);
			}
		}
	}
	refreshMyRankInfo()
	{
		if(this.model.myRankInfo) {
			let rankData = this.model.myRankInfo.rankInfo;
			let rankInfo =cc.instantiate(this.ui.pref_rankInfo);
			this.ui.node_myInfoContent.addChild(rankInfo);
			rankInfo.getComponent('rankInfo').updateAndRefreshMyRankInfo(rankData);
		}
	}
}
//c, 控制
@ccclass
export default class RanksCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Prefab)
	pref_rankInfo: cc.Prefab = null;
	@property(cc.ScrollView)
	scroll_bar: cc.ScrollView = null;
	@property(cc.Node)
	node_content: cc.Node = null;
	@property(cc.Node)
	node_myInfoContent: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
		RankMgr.getInstance().reqRank();
		RankMgr.getInstance().reqMyRankInfo();
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
            'search.entry.reqRank': this.search_entry_reqRank,
            'search.entry.reqMyRankInfo': this.search_entry_reqMyRankInfo,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click",this.ui.btn_close,()=>{
			RankMgr.getInstance().clearData();
			this.closeModule("ranks");
		},"关闭排行榜界面");
		this.connect("scroll-to-bottom",this.ui.scroll_bar.node,this.scrollToBottom.bind(this),"拉到末尾");
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	scrollToBottom()
	{
		RankMgr.getInstance().reqRank();
	}
	search_entry_reqRank()
	{
		this.model.rankList = RankMgr.getInstance().getRankList();
		if(this.model.rankList&&this.model.rankList.rankList.length>0) {
			this.view.refreshRankList();
		}
	}
	search_entry_reqMyRankInfo()
	{
		this.model.myRankInfo = RankMgr.getInstance().gerMyRankInfo();
		this.view.refreshMyRankInfo();
	}
	onDestroy() {
		RankMgr.getInstance().clearData();
		super.onDestroy();
	}
}