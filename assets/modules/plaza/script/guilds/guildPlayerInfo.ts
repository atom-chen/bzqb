import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import { enums } from "../../../../manager/enums";
import { dataids } from "../../../../framework/net/dataids";

/*
author: 汤凯
日期:2018-11-20 15:25:14
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildPlayerInfoCtrl;
//模型，数据处理
class Model extends BaseModel {
	guildPlayerInfo = null;
	positionChangeArr = null;
	positionChangeData = null;
	constructor() {
		super();
	}
	changePosition()
	{
		if(this.positionChangeData&&this.positionChangeData.uid == this.guildPlayerInfo.id) {
			this.guildPlayerInfo.position = this.positionChangeData.position;
		}
	}
	changePositionWithDataArr(positionChangeData)
	{
		if(positionChangeData)
		{
			if(positionChangeData.uid == this.guildPlayerInfo.id) {
				this.guildPlayerInfo.position = positionChangeData.position;
			}
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		spr_guildPlayerIcon: ctrl.spr_guildPlayerIcon,
		spr_guildPlayerStageIcon: ctrl.spr_guildPlayerStageIcon,
		lbl_guildPlayerName: ctrl.lbl_guildPlayerName,
		lbl_guildPlayerPosition: ctrl.lbl_guildPlayerPosition,
		lbl_guildPlayerStage: ctrl.lbl_guildPlayerStage,
		lbl_guildPlayerDonate: ctrl.lbl_guildPlayerDonate,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.showGuildPlayerInfo();
	}
	public showGuildPlayerInfo()
	{
		if(this.model.guildPlayerInfo) {
			this.ui.lbl_guildPlayerName.string = this.model.guildPlayerInfo.nickname;
			let guildPlayerPosition = '';
			switch(this.model.guildPlayerInfo.position)
			{
				case enums.Guild_Member:
				guildPlayerPosition='普通成员';
				break;
				case enums.Guild_President:
				guildPlayerPosition='会长';
				break;
				case enums.Guild_VicePresident:
				guildPlayerPosition='副会长';
				break;
			}
			this.ui.lbl_guildPlayerPosition.string = guildPlayerPosition;
			let stageName = '';
			switch(this.model.guildPlayerInfo.stageIndex)
			{
				case enums.Guild_Member:
				stageName='普通成员';
				break;
				case enums.Guild_President:
				stageName='会长';
				break;
				case enums.Guild_VicePresident:
				stageName='副会长';
				break;
			}
			this.ui.lbl_guildPlayerStage.string = this.model.guildPlayerInfo.stageIndex;
			this.ui.lbl_guildPlayerDonate.string = this.model.guildPlayerInfo.donate;
			// this.ui.spr_guildPlayerIcon
			// this.ui.spr_guildPlayerStageIcon 
		}
	}
}
//c, 控制
@ccclass
export default class GuildPlayerInfoCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Sprite)
	spr_guildPlayerIcon: cc.Sprite = null;
	@property(cc.Sprite)
	spr_guildPlayerStageIcon: cc.Sprite = null;
	@property(cc.Label)
	lbl_guildPlayerName: cc.Label = null;
	@property(cc.Label)
	lbl_guildPlayerPosition: cc.Label = null;
	@property(cc.Label)
	lbl_guildPlayerStage: cc.Label = null;
	@property(cc.Label)
	lbl_guildPlayerDonate: cc.Label = null;
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
            'guild.member.kickMember':this.guild_member_kickMember,
            'guild.member.transPresident':this.guild_member_transPresident,
            'guild.member.appointVicePresident':this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident':this.guild_member_fireVicePresident,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click",this.node,this.guildPlayerNodeClick.bind(this),"点击公会成员");
	}
	updateAndShowGuildPlayerInfo(data)
	{
		console.log('updateAndShowGuildPlayerInfo',data)
		this.model.guildPlayerInfo = data;
		this.view.showGuildPlayerInfo();
	}
	guildPlayerNodeClick()
	{
		this.gemit('guild.playerOperation',this.model.guildPlayerInfo);
	}
	guild_member_kickMember(msg: Package)
	{
        let kickMebmerId = msg.getDataByType(dataids.ID_KIKGUILDMEMBER);
        if(kickMebmerId==this.model.guildPlayerInfo.id) {
	        this.remove();
	    }
	}
	guild_member_transPresident(msg: Package)
	{
        this.model.positionChangeArr = msg.getDatasByType(dataids.ID_GUILDPOSITION_CHANGED);

		for (let i = 0; i < this.model.positionChangeArr.length; i++) {
			let positionChangeData = this.model.positionChangeArr[i];
			if(positionChangeData.uid == this.model.guildPlayerInfo.id) {
		        this.model.changePositionWithDataArr(positionChangeData);
		        this.view.showGuildPlayerInfo();
			}
		}
        //if(this.model.positionChangeArr==this.model.guildPlayerInfo.id) {
        //}
	}
	guild_member_appointVicePresident(msg: Package)
	{
        this.model.positionChangeData = msg.getDataByType(dataids.ID_GUILDPOSITION_CHANGED);
        if(this.model.positionChangeData.uid==this.model.guildPlayerInfo.id) {
	        this.model.changePosition();
	        this.view.showGuildPlayerInfo();
	    }
	}
	guild_member_fireVicePresident(msg: Package)
	{
        this.model.positionChangeData = msg.getDataByType(dataids.ID_GUILDPOSITION_CHANGED);
        if(this.model.positionChangeData.uid==this.model.guildPlayerInfo.id) {
	        this.model.changePosition();
	        this.view.showGuildPlayerInfo();
	    }
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	onDestroy() {
		super.onDestroy();
	}
}