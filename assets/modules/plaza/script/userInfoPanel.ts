import BaseModel from "../../../framework/baseClass/BaseModel";
import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import UserMgr from "../../../manager/public/userMgr";
import { changeName, user, userRank, userBattle } from "../../../manager/public/interface/iUserInfo";
import RoleMgr from "../../../manager/public/roleMgr";

/*
author: 陈斌杰
日期:2018-11-02 18:42:02
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: UserInfoPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public dataChoiceState: number = 0;									//玩家数据选择显示状态  0 显示基础数据，1 显示对战数据
	public user: user = UserMgr.getInstance().user;						//玩家信息数据
	public userName: string = this.user.userName;
	public userUID: number = this.user.userUID;
	public userRank: userRank = UserMgr.getInstance().userRank;			//玩家段位数据
	public userBattle: userBattle = UserMgr.getInstance().userBattle;	//玩家战斗数据
	public isModifyName: boolean = true;

	//修改昵称数据
	public setUserName (name: string) {
		this.userName = name;
	}

	//设置昵称是否可修改
	public setModifyState (state: boolean) {
		this.isModifyName = state;
	}

	//修改选择显示数据按钮的状态
	public setDataChoiceState (btnId: number): void {
		this.dataChoiceState = btnId;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui={
		userUID: ctrl.userUID,
		userName: ctrl.userName,
		roleId: ctrl.frame_left.getChildByName("playerIco"),									//角色Id，显示角色图片
		vipLv: ctrl.frame_left.getChildByName("vipLv"),											//vip等级
		btn_modify: ctrl.frame_left.getChildByName("btn_modify"),								//修改昵称按钮，弹出修改昵称界面
		modifyName: ctrl.modifyName,															//修改昵称界面
		btn_closeModify: ctrl.modifyName.getChildByName("btn_closeModify"),						//关闭修改昵称界面按钮
		inputName: ctrl.modifyName.getChildByName("inputName").getComponent(cc.EditBox),		//修改昵称输入按钮
		btn_modifyName: ctrl.modifyName.getChildByName("btn_modifyName"),						//确定修改昵称，需要花费粉晶
		vipPic: ctrl.vipPic,																	//vip图片
		grade: ctrl.frame_left.getChildByName("level").getComponent(cc.Label),					//玩家等级
		userExp: ctrl.frame_left.getChildByName("exp").getComponent(cc.Label),					//玩家经验值
		btn_data: ctrl.btn_data,																//显示数据按钮
		btn_baseData: ctrl.btn_data.getChildByName("btn_baseData").getComponent(cc.Button),		//基础数据按钮
		btn_battleData: ctrl.btn_data.getChildByName("btn_battleData").getComponent(cc.Button),	//对战数据按钮
		baseData: ctrl.baseData,																//显示基础数据界面
		battleData: ctrl.battleData,															//显示对战界面
		propertyData: ctrl.propertyData,														//战斗数据
		statisticsData: ctrl.statisticsData,													//统计数据
		btn_close: ctrl.btn_close,
	}
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.initUser();
		this.initBaseData();
		this.initBattleData();
		this.ui.modifyName.active = false;
		this.ui.inputName.string = this.model.userName;
		this.ui.baseData.active = true;
		this.ui.battleData.active = false;
	}

	//初始化玩家信息数据
	public initUser(): void {
		this.ui.userUID.string = this.model.user.userUID.toString();
		this.refreshRole(this.model.user.roleId);
		this.ui.vipLv.getComponent(cc.Sprite).spriteFrame = this.ui.vipPic;
		this.ui.userName.string = this.model.userName;
		this.ui.grade.string = this.model.user.grade.toString();
		this.ui.userExp.string = this.model.user.userExp.toString() + "/" + this.model.user.experience.toString();
	}

	//初始化基础数据
	public initBaseData(): void {
		
	}

	//初始化对战数据
	public initBattleData(): void {
		this.ui.propertyData.getChildByName("hpData").getComponent(cc.Label).string = this.model.userBattle.hp.toString();					//血量
		this.ui.propertyData.getChildByName("ctrData").getComponent(cc.Label).string = this.model.userBattle.ctr.toString();				//暴击
		this.ui.propertyData.getChildByName("hurtData").getComponent(cc.Label).string = this.model.userBattle.atk.toString();				//伤害
		this.ui.propertyData.getChildByName("ctrHurtData").getComponent(cc.Label).string = this.model.userBattle.crtdamage.toString();		//暴击伤害

		this.ui.statisticsData.getChildByName("winData").getComponent(cc.Label).string = this.model.user.winNum.toString();					//胜利局数
		this.ui.statisticsData.getChildByName("winOddsData").getComponent(cc.Label).string = this.model.user.winProbability.toString()+"%";	//胜率
		this.ui.statisticsData.getChildByName("rankData").getComponent(cc.Label).string = this.model.user.mostRank.toString();				//最高段位
		this.ui.statisticsData.getChildByName("haveEffectsData").getComponent(cc.Label).string = this.model.user.effects.toString()+"/36";	//已解锁特技数量
		// this.ui.statisticsData.getChildByName("cmdUsingData").getComponent(cc.Label).string = this.model.user.effects.toString();		//最常用特技
	}

	//刷新昵称
	public refreshName (name: string): void {
		this.model.setUserName(name);
		this.ui.userName.string = this.model.userName;
	}

	//刷新数据显示界面
	public refreshShowData (btnId: number): void {
		if (btnId == this.model.dataChoiceState) { return }
		if (btnId == 0) {
			this.ui.baseData.active = true;
			this.ui.battleData.active = false;
		} else {
			this.ui.baseData.active = false;
			this.ui.battleData.active = true;
		}
		this.model.setDataChoiceState(btnId);
	}

	//刷新角色显示
	public refreshRole(roleId: number): void {
		let roleListData = RoleMgr.getInstance().rolesData;
		let id = null;
		for (let i = 0; i < roleListData.length; i++) {
			let roleData = roleListData[i];
			if (roleId == roleData.id) {
				id = roleData.roleId-1001;
				break;
			}
		}
		this.loadImage(`rolePic_${id}`).then((sprf) => {
			this.ui.roleId.getComponent(cc.Sprite).spriteFrame = sprf;
		});
	}
}
//c, 控制
@ccclass
export default class UserInfoPanelCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;

	@property(cc.Label)				//玩家UID
	userUID: cc.Label = null;
	@property(cc.Label)				//玩家名称
	userName: cc.Label = null;
	@property(cc.Node)				//左边玩家信息
	frame_left: cc.Node = null;
	@property(cc.Node)				//修改昵称界面
	modifyName: cc.Node = null;
	@property(cc.SpriteFrame)		//玩家vip等级图片  后期用图集
	vipPic: cc.SpriteFrame = null;
	@property(cc.Node)				//玩家显示数据按钮
	btn_data: cc.Node = null;
	@property(cc.Node)				//玩家基础数据
	baseData: cc.Node = null;
	@property(cc.Node)				//玩家战斗数据
	battleData: cc.Node = null;
	@property(cc.Node)				//玩家属性
	propertyData: cc.Node = null;
	@property(cc.Node)				//玩家数据统计
	statisticsData: cc.Node = null;
	@property(cc.Button)			//关闭玩家信息按钮
	btn_close: cc.Button = null;


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
		this.connect("click",this.ui.btn_modify,this.showModifyName,"显示修改昵称界面");
		this.connect("click",this.ui.btn_closeModify,this.closeModify,"关闭昵称界面");
		this.connect("editing-did-ended",this.ui.inputName,this.inputModifyName,"输入修改的名称");
		this.connect("click",this.ui.btn_modifyName,this.refreshName,"输入修改的名称");
		this.connect("click",this.ui.btn_close, this.closeUserInfoPanel, "关闭玩家信息界面");
		for (let i = 0; i < this.ui.btn_data.childrenCount; i++) {
			let refreshShowData = ()=>{
				this.view.refreshShowData(i);
			}
			this.connect("click",this.ui.btn_data.children[i],refreshShowData,"显示对战数据");
		}
		
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	// update(dt) {}

	//显示修改昵称界面
	public showModifyName (): void {
		this.ui.modifyName.active = true;
	}
	//关闭修改昵称界面
	closeModify () {
		this.ui.modifyName.active = false;
	}

	//输入修改的名称
	public inputModifyName (editbox: any): void {
		if (!editbox.string || editbox.string == "") {
			this.model.setModifyState(false);
		} else {
			this.model.setModifyState(true);
		}
	}

	//修改昵称数据并刷新UI
	public refreshName (): void {
		if (!this.model.isModifyName) { return }
		this.view.refreshName(this.ui.inputName.string);
		this.closeModify();
	}

	//关闭玩家信息界面
	public closeUserInfoPanel (): void {
		this.closeModule("userInfoPanel");
	}

	onDestroy() {
		super.onDestroy();
	}
}