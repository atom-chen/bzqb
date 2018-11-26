import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import UserMgr from "../../../../manager/public/userMgr";
import ChatsMgr from "../../../../manager/public/chatsMgr";

import Package from "../../../../framework/net/package";
import { dataids } from "../../../../framework/net/dataids";

import { chatList, chatItem, chat } from "../../../../manager/public/interface/iFriend";
/*
author: 蔡世达
日期:2018-11-23 14:08:08
*/

let ChannelType = {
    Channel_World:1,
    Channel_Guild:2,
}

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: ChatsCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
        super();
    }

    private curChannelType:number = ChannelType.Channel_World

    public setCurChannelType(type): void{
        this.curChannelType = type
    }

    public getCurChannelType(): any{
        return this.curChannelType
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
        btn_world: ctrl.nodeChannelList.getChildByName("toggle1"),
        btn_guild: ctrl.nodeChannelList.getChildByName("toggle2"),
        btn_troops: ctrl.nodeChannelList.getChildByName("toggle3"),
        btn_close: ctrl.node.getChildByName("bg1"),

        nodeChats: ctrl.nodeChat,
        nodeContent: ctrl.nodeInput.getChildByName("input"),
        nodeBarrage: ctrl.nodeInput.getChildByName("tog_barrage"),
        btn_send: ctrl.nodeInput.getChildByName("btn_send"),

        talkLeft: ctrl.talkLeft,																		//好友聊天左侧预制
		talkRight: ctrl.talkRight,																		//好友聊天右侧预制
	}

	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}

	//初始化ui
	public initUi() {

    }
    
    public addNodeTalk(chat): any {
        let chatNode
        let myInfo = UserMgr.getInstance().getMyInfo()
		if(chat.fromID == myInfo.userUID){
			chatNode = this.addPrefabNode(this.ui.talkRight, this.ui.nodeChats);
		}else{
			chatNode = this.addPrefabNode(this.ui.talkLeft, this.ui.nodeChats);
		}
        chatNode.getComponent("talk").setData(chat)
        
        return chatNode
    }
    
    public updateGuildChatList(): void{
        this.ui.nodeChats.destroyAllChildren()

        this.updateChatList(ChannelType.Channel_Guild)
    }

    public updateWorldChatList(): void{
        this.ui.nodeChats.destroyAllChildren()

        this.updateChatList(ChannelType.Channel_World)
    }

    public getChatContent(): any{
        return this.ui.nodeContent.getComponent(cc.EditBox).string
    }

    private updateChatList(channelType): void{
        let l_chatContent = ChatsMgr.getInstance().chatContent

        if(l_chatContent.list && l_chatContent.list[channelType]){
			let chatCount = l_chatContent.list[channelType].chatContent.length
			let chatContent = l_chatContent.list[channelType].chatContent
	
			for(var i = 0; i < chatCount; i++){
				let chatItem = chatContent[i]
				this.addNodeTalk(chatItem)
			}
		}
    }

    public updateUserInfo(userInfo): void{
        for(var i = 0; i < this.ui.nodeChats.childrenCount; i++){
            let id = this.ui.nodeChats.children[i].getComponent("talk").getID()
            if(userInfo.id == id){
                this.ui.nodeChats.children[i].getComponent("talk").setUserInfo(userInfo)
            }
        }
    }

}
//c, 控制
@ccclass
export default class ChatsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
    @property(cc.Node)
    nodeChannelList:cc.Node = null;
    
    @property(cc.Node)
    nodeChat:cc.Node = null;

    @property(cc.Node)
    nodeInput:cc.Node = null;

    @property(cc.Prefab)
	talkLeft: cc.Prefab = null;
	@property(cc.Prefab)
	talkRight: cc.Prefab = null;


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
			//"plaza.friend.applyFriend": this.applyFriend,
		 };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
            "worldChat.recNewChat":this.worldChat_recNewChat,
            "guildChat.recNewChat":this.guildChat_recNewChat,

            "search.entry.reqUserBrief": this.search_ertry_reqUserBrief,
            "chats.updateUserInfo":this.chats_updateUserInfo,
            
            "onWorldChat": this.onWorldChat,
		};
    }

    public onWorldChat(msg: Package):void{
        let data = msg.getDataByType(dataids.ID_CHAT_TO_WORLD)
        let l_chat:chat = <chat>{}
        l_chat.fromID = data.from
        l_chat.content = data.content
        
        this.worldChat_recNewChat(l_chat, ChatsMgr.getInstance().usersInfo[l_chat.fromID])
        
    }

    public search_ertry_reqUserBrief(msg: Package): void{
        let data = msg.getDataByType(dataids.ID_USER_BRIEF);
        this.view.updateUserInfo(data)
    }

    public chats_updateUserInfo(userInfo): void {
        this.view.updateUserInfo(userInfo)
    }
    
    public worldChat_recNewChat(chat, userInfo): void{
        if(this.model.getCurChannelType() != ChannelType.Channel_World){
            return
        }
        let chatNode = this.view.addNodeTalk(chat)
        if(userInfo){
            chatNode.getComponent("talk").setUserInfo(userInfo)
        }
    }

    public guildChat_recNewChat(chat): void{
        if(this.model.getCurChannelType() != ChannelType.Channel_Guild){
            return
        }
        this.view.addNodeTalk(chat)
    }
	
	//绑定操作的回调
	connectUi() {
        this.connect("click", this.ui.btn_close, ()=>{
            this.closeModule("chats");
        }, "")

        this.connect("click", this.ui.btn_send, ()=>{
            let l_curChannelType = this.model.getCurChannelType()
            if(ChannelType.Channel_World == l_curChannelType){
                ChatsMgr.getInstance().sendWorldChat(this.view.getChatContent())
            }else if(ChannelType.Channel_Guild == l_curChannelType){
                ChatsMgr.getInstance().sendGuildChat(this.view.getChatContent())
            }
        }, `发送信息`)

        this.connect("click", this.ui.btn_world, ()=>{
            console.log("世界频道")
            if(this.model.getCurChannelType() == ChannelType.Channel_World){
                return
            }
            this.view.updateWorldChatList()
            this.model.setCurChannelType(ChannelType.Channel_World)
        }, `世界频道`)

        this.connect("click", this.ui.btn_guild, ()=>{
            console.log("公会频道")
            if(this.model.getCurChannelType() == ChannelType.Channel_Guild){
                return
            }

            this.view.updateGuildChatList()
            this.model.setCurChannelType(ChannelType.Channel_Guild)
        }, `公会频道`)
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