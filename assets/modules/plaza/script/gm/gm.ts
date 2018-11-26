import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";

import gmMgr from "../../../../manager/public/gmMgr";
/*
author: 蔡世达
日期:2018-11-24 14:18:08
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: GMCtrl;
//模型，数据处理
class Model extends BaseModel {
    private json: any = gmMgr.getInstance().data;
    private curType: any;

	constructor() {
		super();

    }
    
    public getData(): any { return this.json }

    public setCurType(curType) { this.curType = curType }
    public getCurType(): any { return this.curType }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
        
        lblMgrType: ctrl.nodeData.getChildByName("lbltype"),
        editParam1: ctrl.nodeData.getChildByName("nodeParam1").getChildByName("edit"),
        editParam2: ctrl.nodeData.getChildByName("nodeParam2").getChildByName("edit"),

        lblParam1: ctrl.nodeData.getChildByName("nodeParam1").getChildByName("lbl"),
        lblParam2: ctrl.nodeData.getChildByName("nodeParam2").getChildByName("lbl"),

        btn_OK: ctrl.nodeData.getChildByName("btn"),

        nodeGMMgrType: ctrl.nodeGMMgrType,
        prefab_btn : ctrl.btn,

        btn_close: ctrl.node.getChildByName("bg1"),
	}

	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
    }

    public setlblParam1(param){
        if(!param){
            this.ui.lblParam1.parent.active = false
            return
        }else{
            this.ui.lblParam1.parent.active = true
        }
        this.ui.lblParam1.getComponent(cc.Label).string = param
    }
    
    public setlblParam2(param){
        if(!param){
            this.ui.lblParam2.parent.active = false
            return
        }else{
            this.ui.lblParam2.parent.active = true
        }
        this.ui.lblParam2.getComponent(cc.Label).string = param
    }

    public getParam1(): any {
        return this.ui.editParam1.getComponent(cc.EditBox).string
    }

    public getParam2(): any {
        return this.ui.editParam2.getComponent(cc.EditBox).string
    }

	//初始化ui
	public initUi() {

    }
    
    public UpdateGmUI(){
        let data = this.model.getData()
        this.ui.nodeGMMgrType.destroyAllChildren()
        for(var i = 0; i < data.length; i++){
            let btn_type = this.addPrefabNode(this.ui.prefab_btn, this.ui.nodeGMMgrType);
            btn_type.getChildByName("lbl").getComponent(cc.Label).string = data[i].des

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = ctrl.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "gm";//这个是代码文件名
            clickEventHandler.handler = "callback";
            clickEventHandler.customEventData = data[i];

            var button = btn_type.getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);
        }
    }

    public UpdateTypeUI(){
        let curType = this.model.getCurType()
        this.setlblMgrType(curType.des)
        this.setlblParam1(curType.param1)
        this.setlblParam2(curType.param2)

        this.ui.editParam1.getComponent(cc.EditBox).string = ""
        this.ui.editParam2.getComponent(cc.EditBox).string = ""
    }

    public setlblMgrType(type):void {
        this.ui.lblMgrType.getComponent(cc.Label).string = type
    }
}
//c, 控制
@ccclass
export default class GMCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
    //这边去声明ui组件
    @property(cc.Node)
    nodeGMMgrType:cc.Node = null;
    @property(cc.Node)
    nodeData:cc.Node = null;

    @property(cc.Prefab)
    btn: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
        this.initMvc(Model,View);
        this.view.UpdateGmUI()
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

		};
	}
	
	//绑定操作的回调
	connectUi() {
        this.connect("click", this.ui.btn_OK, ()=>{
            let curType = this.model.getCurType()
            if(!curType){
                return
            }

            gmMgr.getInstance().sendData(curType.name, this.view.getParam1(), this.view.getParam2())

        }, "发送GM修改" + this.model.getCurType())

        this.connect("click", this.ui.btn_close, ()=>{
            this.closeModule("gm")
        }, "")
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

    // update(dt) {}
    
    public callback(event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "foobar"

        this.model.setCurType(customEventData)
        this.view.UpdateTypeUI()
    }

	onDestroy() {
		super.onDestroy();
	}
}