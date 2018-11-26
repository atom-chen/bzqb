import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import { friend } from "../../../../manager/public/interface/iFriend";
import FriendsMgr from "../../../../manager/public/friendsMgr";
import GuildMembersMgr from "../../../../manager/public/guildMembersMgr";

import UserMgs from "../../../../manager/public/userMgr";

/*
author: 蔡世达
日期:2018-11-20 13:57:46
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: FriendCtrl;
//模型，数据处理
class Model extends BaseModel {
    constructor() {
		super();
    }
    
    public friendData: friend = <friend>{};     //好友信息

    //设置好友数据
    public setFriendData(data: any): void {
        this.friendData = data
    }

    //有没有工会
    public HaveGuild(): boolean {
        return (this.friendData.guildId > 0)
    }
}

/*
    head: any;					//如果是角色头像用角色id获，其他待定
	name: string;				//好友名称
	sex: number;				//好友性别
	tank: string;				//好友段位
	vipLv: number;				//好友vip等级
	guildName: string;			//好友公会名称
    isOnline: boolean;			//是否在线
*/
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
        head: ctrl.btnHead,                                                     //玩家头像
        btnFrame: ctrl.btnFrame,                                                //背景按钮
        btnChallenge: ctrl.btnChallenge,                                        //友谊战按钮
        playerInfo: ctrl.playerInfo,                                            //用户信息按钮
        delFriend: ctrl.delFriend,                                              //删除好友按钮
        guildInvite: ctrl.guildInvite,                                          //工会邀请按钮

        isSelect: ctrl.btnHead.node.getChildByName("isSelect"),                 //是否选择
        guild: ctrl.node.getChildByName("guild"),                               //工会
        vip: ctrl.node.getChildByName("vip"),                                   //vip等级
        level: ctrl.node.getChildByName("level"),                               //段位等级
        sex: ctrl.node.getChildByName("sex"),                                   //性别
        name: ctrl.node.getChildByName("name"),                                 //名字
        online: ctrl.node.getChildByName("bg").getChildByName("onlineStatus"),  //在线状态

        action:ctrl.node.getChildByName("action"),                              //操作界面

	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
        //this.updateUI()
	}

    //更新好友信息
	public updateUI(): void {
        //this.ui.guild.getComponent(cc.Label).string = this.model.friendData.guildName
        this.updateFriendOnlineStatus()
        this.ui.name.getComponent(cc.Label).string = this.model.friendData.nickname
    }

    //选中
    public isSelect(bIsSelect): void {
        this.ui.isSelect.active = bIsSelect
        this.ui.action.active = false
    }
    
    //更新在线状态
    public updateFriendOnlineStatus(): void {
        if(this.model.friendData.online){
            this.ui.online.getComponent(cc.Label).string = "在线"
            this.ui.online.color = cc.color(0, 255, 0)

            this.ui.btnChallenge.node.active = true
        }else{
            this.ui.online.getComponent(cc.Label).string = "离线"
            this.ui.online.color = cc.color(0, 255, 0)

            this.ui.btnChallenge.node.active = false
        }
    }

    public showAction(bShow): void {
        this.ui.action.active = bShow

        this.ui.action.getChildByName("name").getComponent(cc.Label).string = this.model.friendData.nickname
    }
}
//c, 控制
@ccclass
export default class FriendCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
    //这边去声明ui组件
    @property(cc.Button)
    btnFrame:cc.Button = null
	@property(cc.Button)
    btnHead:cc.Button = null
    @property(cc.Button)
    btnChallenge:cc.Button = null
    @property(cc.Button)
    playerInfo:cc.Button = null
    @property(cc.Button)
    delFriend:cc.Button = null
    @property(cc.Button)
    guildInvite:cc.Button = null
	
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
            'guild.member.inviteJoinGuild':this.guild_member_inviteJoinGuild,
        };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
        this.connect("click", this.ui.head, ()=>{
            this.gemit("refreshFriendList", this.model.friendData.id);
            this.view.showAction(true)
        }, "点击头像")

        this.connect("click", this.ui.btnFrame, ()=>{
            this.gemit("refreshFriendList", this.model.friendData.id);
            this.view.showAction(false)
        }, "点击聊天")

        this.connect("click", this.ui.btnChallenge, ()=>{
            this.gemit("showChallenge", this.model.friendData.id);
        }, "点击友谊战")

        this.connect("click", this.ui.playerInfo, ()=>{
            this.gemit("ShowUserInfo", this.model.friendData.id);
        }, "用户信息")

        this.connect("click", this.ui.delFriend, ()=>{
            FriendsMgr.getInstance().kickFriend(this.model.friendData.id)
        }, "删除好友")

        this.connect("click", this.ui.guildInvite, ()=>{
            if(this.model.HaveGuild()){
                console.log("弹窗------" + "该玩家已经有工会了！")
            }else{
                if(UserMgs.getInstance().getMyInfo().guildId > 0){
                    GuildMembersMgr.getInstance().inviteJoinGuild(this.model.friendData.id)
                    // this.gemit("guildInvite", this.model.friendData.id);
                }else{
                    console.log("弹窗------" + "自己还没有工会！")
                }
            }
        }, "工会邀请")
    }
    
    public isSelect(bIsSelect): void {
        this.view.isSelect(bIsSelect)
    }

    public initFriendData(data: any): void {
        this.model.setFriendData(data)
        this.view.updateUI()
    }
    //添加好友后关闭好友
    guild_member_inviteJoinGuild()
    {
        this.view.isSelect(false)
    }

    public getFriendId(): number {
        return this.model.friendData.id
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