import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { enums } from "../../../../manager/enums";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import TableMgr from "../../../../manager/public/tableMgr";
import UserMgr from "../../../../manager/public/userMgr";

/*
author: 汤凯
日期:2018-11-22
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsTreasureCasesPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	inGamePlayerContentHeight = 300;
	playerInfoLeap = 110;
	playersInfoList = GuildsMgr.getInstance().getGuildPlayersInfoList();
	guildInfo= GuildsMgr.getInstance().getGuildInfo();
	myGuildInfo = GuildsMgr.getInstance().getMyGuildInfo();
	guildBoxInfo = null;
	constructor() {
		super();
		// if(!this.guildShopInfo)
		// {
		// 	ShopMgr.getInstance().reqShopInfo(true);
		// }
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		pref_playerInfo: ctrl.pref_playerInfo,
		lbl_coinsAmt: ctrl.lbl_coinsAmt,
		lbl_cardsAmt: ctrl.lbl_cardsAmt,
		lbl_tickTime: ctrl.lbl_tickTime,
		spr_guildTreasureIcon: ctrl.spr_guildTreasureIcon,
		node_inGamePlayersInfoContent: ctrl.node_inGamePlayersInfoContent,
		node_outGamePlayersInfoContent: ctrl.node_outGamePlayersInfoContent,
		bar_guildBoxProgress: ctrl.bar_guildBoxProgress,
		inGameScroll_bar: ctrl.inGameScroll_bar
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.addPlayersInfoList();
		this.refreshBoxInfo();
	}
	findLevelBox()
	{
		let nextLevel = this.model.guildInfo.boxLv+1;
		let nextLevelBox =TableMgr.getInstance().search('Guild_Box',{boxLevel:nextLevel});
		while(this.model.myGuildInfo.keyCount>nextLevelBox.cumulativeKey)
		{
			nextLevel++;
			nextLevelBox =TableMgr.getInstance().search('Guild_Box',{boxLevel:nextLevel});
			if(!nextLevelBox) {
				nextLevel--;
				return TableMgr.getInstance().search('Guild_Box',{boxLevel:nextLevel});;
			}
		}
		return nextLevelBox;
	}
	refreshBoxInfo()
	{
		if(this.model.guildInfo&&this.model.myGuildInfo) {
			let nextLevelBox = this.findLevelBox();
			let boxInfo =TableMgr.getInstance().search('baoxiang_baoxiang',{id:nextLevelBox.boxId});
			if(boxInfo) {
				this.model.guildBoxInfo = boxInfo;
				this.model.guildBoxInfo.requiredKey = nextLevelBox.requiredKey;
				this.ui.lbl_coinsAmt.string = Math.floor(this.model.guildBoxInfo.lowmoney + Math.random() * (this.model.guildBoxInfo.higmoney - this.model.guildBoxInfo.lowmoney));
				this.ui.lbl_cardsAmt.string = Math.floor(this.model.guildBoxInfo.lowcard + Math.random() * (this.model.guildBoxInfo.higcard - this.model.guildBoxInfo.lowcard));
				this.ui.bar_guildBoxProgress.progress = this.model.myGuildInfo.keyCount/nextLevelBox.requiredKey;
			}
		}
	}
	public addPlayersInfoList()
	{
		let inGamePlayersCount = 0;
		let outGamePlayersCount = 0;
		if(this.model.playersInfoList&&this.model.playersInfoList.members.length>0&&this.node.active) {
			this.ui.node_inGamePlayersInfoContent.destroyAllChildren();
			this.ui.node_outGamePlayersInfoContent.destroyAllChildren();
			for (let guildIdx = 0; guildIdx < this.model.playersInfoList.members.length; guildIdx++) {
				let guildPlayerInfoData = this.model.playersInfoList.members[guildIdx];
				let playerInfo = cc.instantiate(this.ui.pref_playerInfo);
				if(guildPlayerInfoData.keyCount>0) {
					inGamePlayersCount++;
					this.ui.node_inGamePlayersInfoContent.addChild(playerInfo);
				}
				else{
					outGamePlayersCount++;
					this.ui.node_outGamePlayersInfoContent.addChild(playerInfo);
				}
				playerInfo.getComponent('guildPlayerInfo').updateAndShowGuildPlayerInfo(guildPlayerInfoData);
			}
			this.ui.node_inGamePlayersInfoContent.setContentSize(this.ui.node_inGamePlayersInfoContent.getContentSize().width,(this.model.playersInfoList.page+1)*this.model.inGamePlayerContentHeight);
			this.ui.node_outGamePlayersInfoContent.setContentSize(this.ui.node_inGamePlayersInfoContent.getContentSize().width,outGamePlayersCount*this.model.playerInfoLeap);
		}
	}
	showTickTime(tickTime)
	{
		let daysCube = Math.floor(tickTime/86400);
		if(daysCube>=10) {
			daysCube = daysCube.toString();
		}
		else{
			daysCube = '0'+daysCube.toString();
		}
		let hoursCube = Math.floor(tickTime/3600);
		if(hoursCube>=10) {
			hoursCube = hoursCube.toString();
		}
		else{
			hoursCube = '0'+hoursCube.toString();
		}
		this.ui.lbl_tickTime.string = daysCube+"天"+hoursCube+"时";
	}
}
//c, 控制
@ccclass
export default class GuildsTreasureCasesPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Prefab)
	pref_playerInfo: cc.Prefab = null;
	@property(cc.Label)
	lbl_coinsAmt: cc.Label = null;
	@property(cc.Label)
	lbl_cardsAmt: cc.Label = null;
	@property(cc.Label)
	lbl_tickTime: cc.Label = null;
	@property(cc.Sprite)
	spr_guildTreasureIcon: cc.Sprite = null;
	@property(cc.Node)
	node_inGamePlayersInfoContent: cc.Node = null;
	@property(cc.Node)
	node_outGamePlayersInfoContent: cc.Node = null;
	@property(cc.ProgressBar)
	bar_guildBoxProgress: cc.ProgressBar = null;
	@property(cc.ScrollView)
	inGameScroll_bar: cc.ScrollView = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);
		//切换前后台需要对定时器进行清理和初始化
        this.schedule(this.countDown.bind(this), 2);
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
            'search.entry.reqGuildMembers':this.search_entry_reqGuildMembers,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("scroll-to-bottom",this.ui.inGameScroll_bar.node,this.scrollToBottom.bind(this),"拉到末尾");
		// this.connect("click",this.ui.btn_close,()=>{
		// 	this.closeModule("guilds");
		// },"关闭公会界面");

	}
	scrollToBottom()
	{
		GuildsMgr.getInstance().reqGuildMembers(UserMgr.getInstance().getMyInfo().guildId,GuildsMgr.getInstance().membersPage+1);
	}
	countDown()
	{
		if(this.model.guildInfo&&this.model.guildInfo.boxTime>0){
	        let curTime = new Date().getTime();
	        let timeGap = Math.floor((curTime - this.model.guildInfo.boxTime)/1000);
	        if((timeGap)>=enums.GuildBox_Intervals)
	        {
	        	//活动开始
				// ShopMgr.getInstance().reqShopInfo(true);
	        }
	        else{
	        	this.view.showTickTime(enums.GuildBox_Intervals-timeGap)
	        }
		}
	}
	search_entry_reqGuildMembers()
	{
		console.log("guild treasureCasePanel search_entry_reqGuildMembers")
		this.model.playersInfoList = GuildsMgr.getInstance().getGuildPlayersInfoList ();
		this.model.guildInfo= GuildsMgr.getInstance().getGuildInfo();
		this.view.addPlayersInfoList();
		this.view.refreshBoxInfo();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	onDestroy() {
        this.unschedule(this.countDown);
		super.onDestroy();
	}
}