import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import GuildsMgr from "../../../../manager/public/guildsMgr";
import UserMgr from "../../../../manager/public/userMgr";
import FriendsMgr from "../../../../manager/public/friendsMgr";
import GuildMembersMgr from "../../../../manager/public/guildMembersMgr";
import { dataids } from "../../../../framework/net/dataids";
import { enums } from "../../../../manager/enums";
import TableMgr from "../../../../manager/public/tableMgr";

/*
author: 汤凯
日期:2018-11-19
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GuildsInfoPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	playerContentHeight = 360;
	myInfo = UserMgr.getInstance().getMyInfo();
	myGuildInfo = GuildsMgr.getInstance().getMyGuildInfo();
	guildInfo = GuildsMgr.getInstance().getGuildInfo();
	guildPlayerInfoList = GuildsMgr.getInstance().getGuildPlayersInfoList();
	operationPlayerInfo = null;
	playerInfoLeap = 110;
	constructor() {
		super();
	}
	isGuildMember()
	{
		return this.myInfo.guildId;
	}
	isFriend()
	{
		if(this.operationPlayerInfo) {
			return FriendsMgr.getInstance().isFriend(this.operationPlayerInfo.id);
		}
		return false;
	}
	kickMember(value)
	{
		this.guildPlayerInfoList.members.removeByValue(value);
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_joinGuild: ctrl.btn_joinGuild,
		btn_leaveGuild: ctrl.btn_leaveGuild,
		btn_donate: ctrl.btn_donate,
		pref_playerInfo: ctrl.pref_playerInfo,
		node_playerInfoList: ctrl.node_playerInfoList,
		spr_guildIcon: ctrl.spr_guildIcon,
		lbl_guildLevel: ctrl.lbl_guildLevel,
		lbl_guildLevelValue: ctrl.lbl_guildLevelValue,
		lbl_guildName: ctrl.lbl_guildName,
		lbl_guildEnterTypeValue: ctrl.lbl_guildEnterTypeValue,
		lbl_guildContributionPointsValue: ctrl.lbl_guildContributionPointsValue,
		lbl_guildIDValue: ctrl.lbl_guildIDValue,
		lbl_guildMembersValue: ctrl.lbl_guildMembersValue,
		lbl_guildNeededStageValue: ctrl.lbl_guildNeededStageValue,
		lbl_guildAnnouncementValue: ctrl.lbl_guildAnnouncementValue,
		node_guildPlayerOperations: ctrl.node_guildPlayerOperations,
		lbl_operatorName: ctrl.lbl_operatorName,
		btn_playerInfo: ctrl.btn_playerInfo,
		btn_demote: ctrl.btn_demote,
		btn_promote: ctrl.btn_promote,
		btn_addFriend: ctrl.btn_addFriend,
		btn_transferGuild: ctrl.btn_transferGuild,
		btn_kick: ctrl.btn_kick,
		btn_clippingNode: ctrl.btn_clippingNode,
		btn_guildSetting: ctrl.btn_guildSetting,
		pref_guildSetting: ctrl.pref_guildSetting,
		scroll_bar: ctrl.scroll_bar,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.refreshGuildInfo();
		this.refreshPlayerInfoList();
	}
	public showMemberBtns()
	{
		if(this.model.isGuildMember()==0) {
			this.ui.btn_joinGuild.node.active=true;
			this.ui.btn_leaveGuild.node.active=false;
			this.ui.btn_donate.node.active=false;
		}
		else{
			this.ui.btn_joinGuild.node.active=false;
			this.ui.btn_leaveGuild.node.active=true;
			this.ui.btn_donate.node.active=true;
			if(this.model.myGuildInfo&&this.model.myGuildInfo.position>=enums.Guild_President) {
				this.ui.btn_guildSetting.node.active=true;
			}
		}
	}
	public refreshPlayerInfoList()
	{
		if(this.model.guildPlayerInfoList&&this.model.guildPlayerInfoList.members.length>0&&this.node.active) {
			this.ui.node_playerInfoList.destroyAllChildren();
			this.ui.node_playerInfoList.setContentSize(this.ui.node_playerInfoList.getContentSize().width,(this.model.guildPlayerInfoList.page+1)*this.model.playerContentHeight);
			for (let guildIdx = 0; guildIdx < this.model.guildPlayerInfoList.members.length; guildIdx++) {
				let guildPlayerInfoData = this.model.guildPlayerInfoList.members[guildIdx];
				let playerInfo = cc.instantiate(this.ui.pref_playerInfo);
				this.ui.node_playerInfoList.addChild(playerInfo);
				playerInfo.getComponent('guildPlayerInfo').updateAndShowGuildPlayerInfo(guildPlayerInfoData);
			}
		}
	}
	updateEnterType()
	{

		switch(this.model.guildInfo.enterType)
		{
			case enums.GuildJoinType_CannotJoin:
				this.ui.lbl_guildEnterTypeValue.string = '不可加入';
			break;
			case enums.GuildJoinType_NeedApproval:
				this.ui.lbl_guildEnterTypeValue.string = '需要批准';
			break;
			default:
				this.ui.lbl_guildEnterTypeValue.string = '允许任何人';
			break
		}
	}
	public refreshGuildInfo()
	{
		this.showMemberBtns();
		if(this.model.guildInfo) {
			this.ui.lbl_guildAnnouncementValue.string = this.model.guildInfo.announcement;
			// this.ui.spr_guildIcon = this.model.guildInfo.badgeId;
			this.ui.lbl_guildLevel.string = 'LV.'+this.model.guildInfo.lv;
			this.ui.lbl_guildLevelValue.string = this.model.guildInfo.exp;
			this.ui.lbl_guildName.string = this.model.guildInfo.name;
        	let card =TableMgr.getInstance().search('duanwei_duanwei',{stage:this.model.guildInfo.neededStage});
        	this.updateEnterType();
			this.ui.lbl_guildContributionPointsValue.string = this.model.guildInfo.donate;
			this.ui.lbl_guildIDValue.string = this.model.guildInfo.id;
			this.ui.lbl_guildMembersValue.string = this.model.guildInfo.memberAmount;
			this.ui.lbl_guildNeededStageValue.string = card.name;
		}
	}
	public showGuildPlayerOperations()
	{
		this.ui.node_guildPlayerOperations.active = true;
		this.ui.lbl_operatorName.string = this.model.operationPlayerInfo.nickname;
		if(this.model.isGuildMember()==0) {
			this.showNotGuildMemberBtns();
		}
		else if(this.model.operationPlayerInfo.id == this.model.myInfo.userUID) {
			this.showSelfBtns();
		}
		else if(this.model.myGuildInfo){
			switch(this.model.myGuildInfo.position)
			{
				case enums.Guild_Member:
				this.showGuildMemberBtns();
				break;
				case enums.Guild_President:
				this.showGuildPresidentBtns();
				break;
				case enums.Guild_VicePresident:
				this.showGuildVicePresidentBtns();
				break;
			}
		}
	}
	public hideGuildPlayerOperations()
	{
		this.ui.node_guildPlayerOperations.active = false;
	}
	showNotGuildMemberBtns()
	{
		this.ui.btn_playerInfo.node.active = true;
		this.ui.btn_demote.node.active = false;
		this.ui.btn_promote.node.active = false;
		this.ui.btn_addFriend.node.active = !this.model.isFriend();
		this.ui.btn_transferGuild.node.active = false;
		this.ui.btn_kick.node.active = false;
	}
	showSelfBtns()
	{
		this.ui.btn_playerInfo.node.active = true;
		this.ui.btn_demote.node.active = false;
		this.ui.btn_promote.node.active = false;
		this.ui.btn_addFriend.node.active = false;
		this.ui.btn_transferGuild.node.active = false;
		this.ui.btn_kick.node.active = false;
	}
	showGuildMemberBtns()
	{
		this.ui.btn_playerInfo.node.active = true;
		this.ui.btn_demote.node.active = false;
		this.ui.btn_promote.node.active = false;
		this.ui.btn_addFriend.node.active = !this.model.isFriend();
		this.ui.btn_transferGuild.node.active = false;
		this.ui.btn_kick.node.active = false;
	}
	showGuildPresidentBtns()
	{
		this.ui.btn_playerInfo.node.active = true;
		this.ui.btn_demote.node.active = true;
		this.ui.btn_promote.node.active = true;
		this.ui.btn_addFriend.node.active = !this.model.isFriend();
		this.ui.btn_transferGuild.node.active = true;
		this.ui.btn_kick.node.active = true;
	}
	showGuildVicePresidentBtns()
	{
		this.ui.btn_playerInfo.node.active = true;
		this.ui.btn_demote.node.active = true;
		this.ui.btn_promote.node.active = false;
		this.ui.btn_addFriend.node.active = !this.model.isFriend();
		this.ui.btn_transferGuild.node.active = false;
		this.ui.btn_kick.node.active = true;
	}
	addGuildSetting()
	{
		let guildSetting = this.node.getChildByName('guildSetting');
		if(guildSetting) {
			guildSetting.destroy();
		}
		let guildSetting = cc.instantiate(this.ui.pref_guildSetting);
		this.node.addChild(guildSetting);
	}
}
//c, 控制
@ccclass
export default class GuildsInfoPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_joinGuild: cc.Button = null;
	@property(cc.Button)
	btn_leaveGuild: cc.Button = null;
	@property(cc.Button)
	btn_donate: cc.Button = null;
	@property(cc.Prefab)
	pref_playerInfo: cc.Prefab = null;
	@property(cc.Node)
	node_playerInfoList: cc.Node = null;
	@property(cc.Sprite)
	spr_guildIcon: cc.Sprite = null;
	@property(cc.Label)
	lbl_guildLevel: cc.Label = null;
	@property(cc.Label)
	lbl_guildLevelValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildName: cc.Label = null;
	@property(cc.Label)
	lbl_guildEnterTypeValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildContributionPointsValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildIDValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildMembersValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildNeededStageValue: cc.Label = null;
	@property(cc.Label)
	lbl_guildAnnouncementValue: cc.Label = null;
	@property(cc.Node)
	node_guildPlayerOperations: cc.Label = null;
	@property(cc.Label)
	lbl_operatorName: cc.Label = null;
	@property(cc.Button)
	btn_playerInfo: cc.Button = null;
	@property(cc.Button)
	btn_demote: cc.Button = null;
	@property(cc.Button)
	btn_promote: cc.Button = null;
	@property(cc.Button)
	btn_addFriend: cc.Button = null;
	@property(cc.Button)
	btn_transferGuild: cc.Button = null;
	@property(cc.Button)
	btn_kick: cc.Button = null;
	@property(cc.Button)
	btn_clippingNode: cc.Button = null;
	@property(cc.Button)
	btn_guildSetting: cc.Button = null;
	@property(cc.Prefab)
	pref_guildSetting: cc.Prefab = null;
	@property(cc.ScrollView)
	scroll_bar: cc.ScrollView = null;
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
            'search.entry.randomGuildList':this.search_entry_randomGuildList,
            'guild.guild.updateAnnouncement':this.guild_guild_updateAnnouncement,
            'search.entry.reqGuildMembers':this.search_entry_reqGuildMembers,
            'guild.guild.reqMyGuildDetail':this.guild_guild_reqMyGuildDetail,
            'plaza.guild.reqGuildDetail': this.plaza_guild_reqGuildDetail,
            'plaza.guild.joinGuild':this.plaza_guild_joinGuild,
            'guild.member.kickMember':this.guild_member_kickMember,
            'guild.member.transPresident':this.guild_member_transPresident,
            'guild.member.appointVicePresident':this.guild_member_appointVicePresident,
            'guild.member.fireVicePresident':this.guild_member_fireVicePresident,
            'plaza.friends.addFriend': this.plaza_friends_addFriend,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {'guild.playerOperation':this.guildPlayerOperation};
	}
	//绑定操作的回调
	connectUi() {
		// this.connect("click",this.ui.btn_close,()=>{
		// 	this.closeModule("guilds");
		// },"关闭公会界面");
		this.connect("click",this.ui.btn_joinGuild,this.btnJoinGuild.bind(this),"加入公会");
		this.connect("click",this.ui.btn_leaveGuild,this.btnLeaveGuild.bind(this),"退出公会");
		this.connect("click",this.ui.btn_donate,this.btnDonate.bind(this),"捐献");
		this.connect("click",this.ui.btn_playerInfo,this.btnPlayerInfo.bind(this),"玩家信息");
		this.connect("click",this.ui.btn_demote,this.btnDemote.bind(this),"降职");
		this.connect("click",this.ui.btn_promote,this.btnPromote.bind(this),"升值");
		this.connect("click",this.ui.btn_addFriend,this.btnAddFriend.bind(this),"添加好友");
		this.connect("click",this.ui.btn_transferGuild,this.btnTransferGuild.bind(this),"转让公会");
		this.connect("click",this.ui.btn_kick,this.btnKick.bind(this),"踢出");
		this.connect("click",this.ui.btn_clippingNode,this.btnClippingNode.bind(this),"踢出");
		this.connect("click",this.ui.btn_guildSetting,this.btnGuildSetting.bind(this),"公会设置");
		this.connect("scroll-to-bottom",this.ui.scroll_bar.node,this.scrollToBottom.bind(this),"拉到末尾");

	}
	scrollToBottom()
	{
		GuildsMgr.getInstance().reqGuildMembers(UserMgr.getInstance().getMyInfo().guildId,GuildsMgr.getInstance().membersPage+1);
	}
	search_entry_randomGuildList()
	{
		// this.model.guildList = GuildsMgr.getInstance().getRandomGuildList();
		// this.view.freshGuildList();
	}
	btnGuildSetting()
	{
		this.view.addGuildSetting();
	}
	btnClippingNode()
	{
		this.view.hideGuildPlayerOperations();
	}
	btnLeaveGuild()
	{
		GuildMembersMgr.getInstance().quitGuild();
	}
	btnDonate()
	{

	}
	btnPlayerInfo()
	{
		if(this.model.operationPlayerInfo) {
			// guildMembersMgr.getInstance().
		}
	}
	btnDemote()
	{
		if(this.model.operationPlayerInfo) {
			GuildMembersMgr.getInstance().fireVicePresident(this.model.operationPlayerInfo.id);
		}
	}
	btnPromote()
	{
		if(this.model.operationPlayerInfo) {
			GuildMembersMgr.getInstance().appointVicePresident(this.model.operationPlayerInfo.id);
		}
	}
	btnAddFriend()
	{
		if(this.model.operationPlayerInfo) {
			FriendsMgr.getInstance().addFriend(this.model.operationPlayerInfo.id);
		}
	}
	btnTransferGuild()
	{
		if(this.model.operationPlayerInfo) {
			GuildMembersMgr.getInstance().transPresident(this.model.operationPlayerInfo.id);
		}
	}
	btnKick()
	{
		if(this.model.operationPlayerInfo) {
			GuildMembersMgr.getInstance().kickMember(this.model.operationPlayerInfo.id);
		}
	}
	btnJoinGuild()
	{
		console.log("btnJoinGuild")
		if(this.model.guildInfo) {
			switch(this.model.guildInfo.enterType)
			{
				case enums.GuildJoinType_CannotJoin:
				break;
				case enums.GuildJoinType_NeedApproval:
					GuildsMgr.getInstance().applyJoinGuild(this.model.guildInfo.id);
				break;
				default:
					GuildsMgr.getInstance().reqJoinGuild(this.model.guildInfo.id);
				break
			}
		}

	}
	plaza_friends_addFriend()
	{
		this.view.hideGuildPlayerOperations();
	}
	guild_member_kickMember(msg:Package)
	{
		this.view.hideGuildPlayerOperations();
	}
	guild_member_transPresident(msg: Package)
	{
		this.view.hideGuildPlayerOperations();
	}
	guild_member_appointVicePresident(msg: Package)
	{
		this.view.hideGuildPlayerOperations();
	}
	guild_member_fireVicePresident(msg: Package)
	{
		this.view.hideGuildPlayerOperations();
	}
	guildPlayerOperation(data)
	{
		console.log("guildPlayerOperation",data);
		this.model.operationPlayerInfo = data;
		if(this.model.operationPlayerInfo) {
			this.view.showGuildPlayerOperations();
		}
	}
	plaza_guild_joinGuild()
	{
		GuildsMgr.getInstance().reqMyGuildDetail();
		GuildsMgr.getInstance().reqGuildMembers(GuildsMgr.getInstance().getGuildId(),0);
	}
	guild_guild_updateAnnouncement()
	{
		
	}
	guild_guild_reqMyGuildDetail()
	{
		this.model.myGuildInfo = GuildsMgr.getInstance().getMyGuildInfo();
		this.model.guildInfo = GuildsMgr.getInstance().getGuildInfo();
		this.view.refreshGuildInfo();
	}
	plaza_guild_reqGuildDetail()
	{
		this.model.guildInfo = GuildsMgr.getInstance().getGuildInfo();
		this.view.refreshGuildInfo();
	}
	search_entry_reqGuildMembers()
	{
		this.model.guildPlayerInfoList = GuildsMgr.getInstance().getGuildPlayersInfoList();
		this.view.refreshPlayerInfoList();
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