import BaseView from "../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../framework/baseClass/BaseCtrl";
import BaseModel from "../../../framework/baseClass/BaseModel";
import { register } from "../../../manager/public/interface/iRegister";
import UserMgr from "../../../manager/public/userMgr";
import LoginMgr from "../../../manager/public/loginMgr";

/*
author: 陈斌杰
日期:2018-11-05 10:09:04
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: RegisterCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}

	public sendRegisterData: register = <register>{};		//创建角色数据
	public nicknameCfgTab: any = LoginMgr.getInstance().nicknameCfgTab;

	//记录设置选择的性别  roleID  1001 男  1002 女
	public setChoiceSexState(sex: number): void {
		this.sendRegisterData.roleID = sex + 1000;
	}

	//初始化玩家数据
	public setUserData(UID: number): void {
		this.sendRegisterData = { UID: UID, nickname: UID.toString(), roleID: 1001 };
	}

	//设置玩家昵称
	public setUserNickname(nickname: string): void {
		this.sendRegisterData.nickname = nickname;
	}

	//随机昵称数据
	public randomNickname(): void {
		let random: number = Math.floor(Math.random()*(this.nicknameCfgTab.length));
		if (this.sendRegisterData.roleID == 1001) {
			this.setUserNickname(this.nicknameCfgTab[random].boyname);
		} else if (this.sendRegisterData.roleID == 1002) {
			this.setUserNickname(this.nicknameCfgTab[random].girlname);
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_sex: ctrl.btn_sex,
		btn_register: ctrl.btn_register,
		nickname_input: ctrl.nickname_input,
		btn_random: ctrl.btn_random,
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		
	}

	//刷新选择的性别
	public refreshSexBtn(sex: number): void {
		if (this.model.sendRegisterData.roleID == sex) { return }
		this.model.setChoiceSexState(sex);
	}

	//选择性别的按钮处理
	public selectSexBtn(sex: number, picPath: string): void {
		this.loadImage(picPath).then((sprf: cc.SpriteFrame) => {
			this.ui.btn_sex.children[sex].getComponent(cc.Sprite).spriteFrame = sprf;
		});
	}

	//随机昵称显示
	public showRandomNickname(): void {
		this.model.randomNickname();
		this.ui.nickname_input.string = this.model.sendRegisterData.nickname;
	}
}
//c, 控制
@ccclass
export default class RegisterCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_sex: cc.Node = null;
	@property(cc.Button)
	btn_register: cc.Button = null;
	@property(cc.EditBox)
	nickname_input: cc.EditBox = null;
	@property(cc.Button)
	btn_random: cc.Button = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);

		// 直接设置玩家UID和昵称（临时）
		let UID = UserMgr.getInstance().user.userUID;
		this.model.setUserData(UID);
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
		for (let i = 0; i < 2; i++) {
			this.connect("toggle", this.ui.btn_sex.children[i], () => {
				this.view.refreshSexBtn(i + 1);
			}, `点击选择角色按钮${i}`);
		}
		this.connect("click", this.ui.btn_register, () => {
			this._sendRegisterUser();
		}, "创建角色");
		this.connect("editing-did-ended", this.ui.nickname_input, () => {
			this.model.setUserNickname(this.ui.nickname_input.string);
		}, "修改玩家昵称");
		this.connect("click",this.ui.btn_random,()=>{
			this.view.showRandomNickname();
		},"随机昵称");
	}
	// 网络事件回调begin
	// end
	// 全局事件回调begin
	// end
	// 按钮或任何控件操作的回调begin
	private _sendRegisterUser(): void {
		let { nickname, roleID } = this.model.sendRegisterData;
		LoginMgr.getInstance().sendRegisterUser(nickname, roleID);
	}
	// end

	onDestroy() {
		super.onDestroy();
	}
}