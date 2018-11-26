import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import {friendShow, addFriend, friend, chat} from "../../../../manager/public/interface/iFriend"
import FriendsMgr from "../../../../manager/public/friendsMgr"

/*
author: 蔡世达
日期:2018-11-22 10:36:08
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: FriendsCtrl;
//模型，数据处理
class Model extends BaseModel {
	private uid:number = 0

	constructor() {
		super();
    }
    
    public setUId(uid){
        this.uid = uid
    }

    public getUId():any{
        return this.uid
    }

	//public chatsData: chatList = FriendsMgr.getInstance().chatList

	public curChatUid: number = 0
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
        btn_addFriend:ctrl.node.getChildByName("btn_add"),                              //添加按钮
        btn_info:ctrl.node.getChildByName("btn_xxx"),                                   //信息按钮
		lbl_name:ctrl.node.getChildByName("name"),                                      //玩家名字
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		
    }

    public updateData(userInfo): void {
        this.ui.lbl_name.getComponent(cc.Label).string = userInfo.nickname
    }
    
}
//c, 控制
@ccclass
export default class FriendsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件

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

		 };
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_addFriend, ()=>{
            FriendsMgr.getInstance().addFriend(this.model.getUId())
        }, `添加用户ID`)
    }
    
    public initData(userInfo){
        this.model.setUId(userInfo.id)
        this.view.updateData(userInfo)
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