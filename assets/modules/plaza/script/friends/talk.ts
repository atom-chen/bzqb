import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import {chat} from "../../../../manager/public/interface/iFriend"
import UserMgr from "../../../../manager/public/userMgr";
/*
author: 蔡世达
日期:2018-11-21 15:26:46
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: TalkCtrl;
//模型，数据处理
class Model extends BaseModel {
    public chatData:chat = <chat>{};
	public myInfo = UserMgr.getInstance().getMyInfo()
	public userInfo
    constructor() {
		super();
    }
}

//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
        head: ctrl.node.getChildByName("head"),
        name: ctrl.node.getChildByName("name"),
        word: ctrl.node.getChildByName("frame").getChildByName("word"),
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
    }
    
    public updateUI(): void {
		var name = ""
		
        if(this.model.myInfo.userUID == this.model.chatData.fromID){
            name = this.model.myInfo.userName
        }else{
			if(this.model.userInfo){
				let info = this.model.userInfo
				name = info.nickname
			}
        }
        this.ui.name.getComponent(cc.Label).string = name
        this.ui.word.getComponent(cc.Label).string = this.model.chatData.content
	}
	
	public UpdateUserInfo(): void{
		var name
        if(this.model.myInfo.userUID == this.model.chatData.fromID){
            name = this.model.myInfo.userName
        }else{
			let info = this.model.userInfo
            name = info.nickname
        }
        this.ui.name.getComponent(cc.Label).string = name
	}
}
//c, 控制
@ccclass
export default class TalkCtrl extends BaseCtrl {
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
	 	this.n_events = {};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {};
	}
	//绑定操作的回调
	connectUi() {
        
    }

    public setData(chatData, userInfo): void {
		this.model.chatData = chatData
		this.model.userInfo = userInfo
        this.view.updateUI()
	}
	
	public setUserInfo(userInfo): void {
		this.model.userInfo = userInfo
		this.view.UpdateUserInfo()
	}

	public getID():any{
		return this.model.chatData.fromID
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