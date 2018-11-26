import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import {friendShow, addFriend, friend, chat, chatList} from "../../../../manager/public/interface/iFriend"
import FriendsMgr from "../../../../manager/public/friendsMgr"
import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";

/*
author: 蔡世达
日期:2018-11-18 15:24:08
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: FriendsCtrl;
//模型，数据处理
class Model extends BaseModel {
	public friendsData: friendShow = <friendShow>{}

	public curSearchData: null

	constructor() {
		super();

		this.friendsData.friendList = FriendsMgr.getInstance().friendsInfoList
		this.friendsData.mostFriendsNum = 0
		if(this.friendsData.friendList){
			this.friendsData.friendsNum = this.friendsData.friendList.length
		}else{
			this.friendsData.friendsNum = 0
		}
	}

	public updateData(): void {
		this.friendsData.friendList = FriendsMgr.getInstance().friendsInfoList
		this.friendsData.mostFriendsNum = 0
		this.friendsData.friendsNum = this.friendsData.friendList.length
	}

	public curChatUid: number = 0
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		btn_close: ctrl.btn_close,
		lblFriend: ctrl.lbl_friendCount,																//在线好友数量/好友数量
		friendList: ctrl.friendContent,																	//好友列表
		friend: ctrl.friend,																			//好友预制
		friendTips: ctrl.friendTips,																	//好友聊天提示
		rightFrame: ctrl.rightFrame,																	//好友聊天界面
		talkLeft: ctrl.talkLeft,																		//好友聊天左侧预制
		talkRight: ctrl.talkRight,																		//好友聊天右侧预制
		
		btn_addFriend: ctrl.btn_addFriend,																//添加好友按钮
		btn_inviteFriend: ctrl.btn_inviteFriend,														//邀请好友按钮
		
		btn_close_challenge:ctrl.nodeChallenge.getChildByName("btn_close"),								//关闭友谊战界面
		nodeChallenge: ctrl.nodeChallenge,																//友谊战界面

		nodeChatContent:ctrl.rightFrame.getChildByName("input").getChildByName("content"),				//聊天输入框
		nodeChat:ctrl.chatContent,																		//聊天节点
		btn_send:ctrl.rightFrame.getChildByName("btn_send"),											//消息发送

		//好友界面
		nodeAddFriend: ctrl.nodeAddFriend,																//添加好友界面
		btn_close_addFriend:ctrl.nodeAddFriend.getChildByName("btn_close"),								//关闭添加好友界面
		btn_search:ctrl.nodeAddFriend.getChildByName("btn_search"),										//查询按钮
		nodeUserID:ctrl.nodeAddFriend.getChildByName("inputUID").getChildByName("applyFriend"),			//添加好友的输入框
		lblType:ctrl.nodeAddFriend.getChildByName("label"),												//底部玩家显示的类型
		nodeAddFriendList:ctrl.nodeAddFriendList,														//添加好友界面的列表节点
		AddFriend:ctrl.prefabAddFriend,																	//添加好友界面的预制文件
		btnRefresh:ctrl.nodeAddFriend.getChildByName("btn_refresh"),									//添加好友界面的刷新按钮
	}

	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}

	//初始化ui
	public initUi() {
		this.updateFriendListNode()
		this.ui.friendTips.active = true
		this.ui.rightFrame.active = false
		this.ui.nodeAddFriend.active = false
		this.ui.nodeChallenge.active = false
	}

	public updateFriendListNode(): void {
		//更新好友数量
		this.ui.lblFriend.string = `我的好友  ${this.model.friendsData.friendsNum}/${this.model.friendsData.mostFriendsNum}` 
		//更新好友列表
		this.updateFriendList()
	}

	//好友列表整理
	public updateFriendList(): void {
		this.ui.friendList.destroyAllChildren()
		for (let key in this.model.friendsData.friendList) {
			if(typeof this.model.friendsData.friendList[key] == "object"){
				let friendNode = this.addPrefabNode(this.ui.friend, this.ui.friendList);
				friendNode.getComponent("friend").initFriendData(this.model.friendsData.friendList[key])
			}
		}
	}

	//是否显示添加好友界面
	public showNodeAddFriend(bshow): void {
		this.ui.nodeAddFriend.active = bshow
	}

	//是否显示邀请好友界面
	public showNodeInviteFriend(bshow): void {

	}

	//是否显示友谊战界面
	public showNodeChallenge(bshow): void {
		this.ui.nodeChallenge.active = bshow
	}
	
	//显示聊天界面
	public showNodeTalk(uid): void {
		this.ui.friendTips.active = false
		this.ui.nodeChat.destroyAllChildren()
		//this.ui.
	}

	//添加好友界面的搜索ID
	public getSearchUserID(): any {
		return  this.ui.nodeUserID.getComponent(cc.EditBox).string
	}

	public getChatContent(): any {
		return this.ui.nodeChatContent.getComponent(cc.EditBox).string
	}

	public clearChatContent(): void {
		this.ui.nodeChatContent.getComponent(cc.EditBox).string = ""
	}

	public clearNodeAddFriend(): void {
		this.ui.nodeAddFriendList.destroyAllChildren()
	}

	public addNodeAddFriend(userInfo): void {
		let addfriend = this.addPrefabNode(this.ui.AddFriend, this.ui.nodeAddFriendList);
		addfriend.getComponent("addFriend").initData(userInfo)
	}

	public setAddFriendType(type:any): void{
		this.ui.lblType.getComponent(cc.Label).string = type
	}


	public refreshFriendList(uid): void {
		for(var i = 0; i < this.ui.friendList.childrenCount; i++){
			var l_node = this.ui.friendList.children[i]
			l_node.getComponent("friend").isSelect(l_node.getComponent("friend").getFriendId() == uid)
		}
	}

	public refreshFriendChat(uid): void {
		this.ui.friendTips.active = false
		this.ui.rightFrame.active = true

		this.ui.nodeChat.destroyAllChildren()
		let l_chatContent = FriendsMgr.getInstance().chatContent

		if(l_chatContent.list && l_chatContent.list[uid]){
			let chatCount = l_chatContent.list[uid].chatContent.length
			let chatContent = l_chatContent.list[uid].chatContent
	
			for(var i = 0; i < chatCount; i++){
				let chatItem = chatContent[i]
				this.addNodeTalk(chatItem)
			}
		}
	}

	public recCurUserChatContent(chatContent): void {
		this.addNodeTalk(chatContent)
	}

	private addNodeTalk(chat): void {
		let chatNode
		if(chat.fromID == FriendsMgr.getInstance().myId){
			chatNode = this.addPrefabNode(this.ui.talkRight, this.ui.nodeChat);
		}else{
			chatNode = this.addPrefabNode(this.ui.talkLeft, this.ui.nodeChat);
		}
		
		chatNode.getComponent("talk").setData(chat, FriendsMgr.getInstance().getFriendInfos(chat.fromID))
	}

	public showUnreadUser(uid): void {

	}
}
//c, 控制
@ccclass
export default class FriendsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Button)
	btn_close: cc.Button = null;
	@property(cc.Label)
	lbl_friendCount: cc.Label = null;
	@property(cc.Prefab)
	friend: cc.Prefab = null;
	@property(cc.Node)
	friendContent: cc.Node = null;
	@property(cc.Button)
	btn_inviteFriend: cc.Button = null;
	@property(cc.Button)
	btn_addFriend: cc.Button = null;
	@property(cc.Node)
	friendTips: cc.Node = null;
	@property(cc.Node)
	rightFrame: cc.Node = null;
	@property(cc.Node)
	chatContent: cc.Node = null;

	@property(cc.Prefab)
	talkLeft: cc.Prefab = null;
	@property(cc.Prefab)
	talkRight: cc.Prefab = null;

	@property(cc.Node)
	nodeAddFriend: cc.Node = null;
	@property(cc.Node)
	nodeAddFriendList: cc.Node = null;
	@property(cc.Prefab)
	prefabAddFriend: cc.Node = null;

	@property(cc.Node)
	nodeChallenge: cc.Node = null;
	

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model,View);

		FriendsMgr.getInstance().reqFriendInfos(FriendsMgr.getInstance().friendsIds.friends)
	}

	//定义网络事件
	protected defineNetEvents() {
	 	this.n_events = {
			//"plaza.friend.applyFriend": this.applyFriend,
		 };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			"refreshFriendList" : this.refreshFriendList,
			"chat.recNewChat": this.chat_recNewChat,										//接收到聊天消息

			"showChallenge": this.showChallenge,

			'search.entry.reqFriendInfos': this.search_entry_reqFriendInfos,
			"search.entry.randomUsers": this.search_entry_randomUsers,
			"search.entry.searchUsers": this.search_entry_searchUsers,
			
		};
	}
	
	public showChallenge(id): void{
		this.view.showNodeChallenge(true)
	}

	//返回推荐好友
    public search_entry_randomUsers(msg: Package){
        let userInfos = msg.getDataByType(dataids.ID_USERLIST);
		
		this.view.showNodeAddFriend(true)
		this.view.setAddFriendType("推荐：")
		this.view.clearChatContent()
		this.view.clearNodeAddFriend()

		for(var i = 0; i < userInfos.length; i++){
			this.view.addNodeAddFriend(userInfos[i])
		}
	}
	
	public search_entry_searchUsers(): void {
		this.view.setAddFriendType("查询结果：")
		this.view.clearNodeAddFriend()
			
		var l_userInfo = FriendsMgr.getInstance().isAlwaysSearch(this.model.curSearchData)
		this.view.addNodeAddFriend(l_userInfo)
	}

	public chat_recNewChat(friendUid, chatContent): void {
		//如果当前聊天对象不是现在接收的
		if(friendUid != this.model.curChatUid){

		}else{
			this.view.recCurUserChatContent(chatContent)
		}
	}

	public search_entry_reqFriendInfos(): void {
		this.model.updateData()
		this.view.updateFriendListNode()
	}

	//绑定操作的回调
	connectUi() {
		this.connect("click",this.ui.btn_close,()=>{
			this.closeModule("friends");
		},"关闭好友界面");

		this.connect("click", this.ui.btn_addFriend, ()=>{
			FriendsMgr.getInstance().searchRandomUsers()
			
		}, "显示添加好友界面")

		this.connect("click", this.ui.btn_inviteFriend, ()=>{
			this.view.showNodeInviteFriend(true)
		}, "邀请好友")

		this.connect("click", this.ui.btn_close_addFriend, ()=>{
			this.view.showNodeAddFriend(false)
		}, "关闭添加好友界面")

		this.connect("click", this.ui.btn_close_challenge, ()=>{
			this.view.showNodeChallenge(false)
		}, "关闭友谊战界面")

		this.connect("click", this.ui.btn_send, ()=>{
			let myInfo = FriendsMgr.getInstance().myId
			FriendsMgr.getInstance().sendChat(myInfo, this.model.curChatUid, this.view.getChatContent())
			this.view.clearChatContent()
		}, "发送消息")

		this.connect("click", this.ui.btn_search, ()=>{
			this.model.curSearchData = this.view.getSearchUserID()

			var l_userInfo = FriendsMgr.getInstance().isAlwaysSearch(this.view.getSearchUserID())
			if(!l_userInfo){
				let searchUId = this.view.getSearchUserID()
				FriendsMgr.getInstance().searchFriend(searchUId)
			}else{
				this.view.setAddFriendType("查询结果：")
				this.view.clearNodeAddFriend()
				this.view.addNodeAddFriend(l_userInfo)
			}
		}, `查询用户${this.view.getSearchUserID()}`)

		this.connect("click", this.ui.btnRefresh, ()=>{
			FriendsMgr.getInstance().searchRandomUsers()
		}, "刷新")

	}

	private refreshFriendList(uid): void {
		if(uid == this.model.curChatUid){
			return
		}
		this.view.refreshFriendList(uid)
		this.view.refreshFriendChat(uid)
		this.model.curChatUid = uid
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