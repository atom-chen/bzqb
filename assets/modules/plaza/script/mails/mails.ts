import BaseModel from "../../../../framework/baseClass/BaseModel";
import BaseView from "../../../../framework/baseClass/BaseView";
import BaseCtrl from "../../../../framework/baseClass/BaseCtrl";
import { mailsData, mail } from "../../../../manager/public/interface/iMailInfo";
import MailMgr from "../../../../manager/public/mailMgr";
import UserMgr from "../../../../manager/public/userMgr";
import { enums } from "../../../../manager/enums";

/*
author: 陈斌杰
日期:2018-11-09 15:52:05
*/

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: MailsCtrl;
//模型，数据处理
class Model extends BaseModel {
	constructor() {
		super();
	}
	public user: any = UserMgr.getInstance().user;
	public mailsData: mailsData = MailMgr.getInstance().mailsData;
	public mailExplain: mail = <mail>{};			//当前显示的邮件详情的邮件数据
	public boxesRewarkData: any = [];				//宝箱数据

	//设置邮件详情数据
	public setMailExplainData(id: number): void {
		for (let i = 0; i < this.mailsData.list.length; i++) {
			let mailData = this.mailsData.list[i];
			if (mailData.id == id) {
				this.mailExplain = mailData;
				break;
			}
		}
	}

	//处理宝箱数据
	public setBoxesRewarkData(): void {
		let boxesData = MailMgr.getInstance().boxesRewark;
		for (let i = 0; i < boxesData.length; i++) {
			let data = boxesData[i];	//宝箱数据
			let arr = [];
			let item: any = {};
			item.type = enums.Get_Gold;
			item.amount = data.addMoneyGold;
			arr.push(item);
			for (let j = 0; j < data.listTejis.length; j++) {
				let effectData = data.listTejis[j];
				let effectItem: any = {};
				effectItem.type = enums.Get_Skill;
				effectItem.amount = effectData.amount;
				arr.push(effectItem);
			}
			this.boxesRewarkData.push(arr);
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	protected model: Model;
	protected node: cc.Node;
	public ui = {
		btn_close: ctrl.btn_close,
		mailsList: ctrl.mailsList,												//邮件列表 
		mail: ctrl.mail,														//邮件预制
		mailsExplain_title: ctrl.mailsExplain_title,							//邮件详情标题
		mailsExplain_name: ctrl.mailsExplain_name,								//邮件详情姓名
		mailsExplain_content: ctrl.mailsExplain_content,						//邮件详情内容
		mailsCount: ctrl.mailsCount,											//邮件数量
		mailRewark: ctrl.mailRewark,											//邮件奖励
		btn_receive: ctrl.rewarkFrame.getChildByName("btn_receive"),			//领取按钮
		btn_del: ctrl.rewarkFrame.getChildByName("btn_del"),					//删除按钮
		rewarks: ctrl.rewarkFrame.getChildByName("rewarks"),					//奖励挂载节点
		btn_allReceive: ctrl.btn_allReceive,									//全部领取按钮
	}
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	public initUi() {
		this.ui.mailsList.height = 7500;
		this.initMailsList();
		this.ui.mailsExplain_title.string = "";
		this.ui.mailsExplain_name.string = "";
		this.ui.mailsExplain_content.string = "";
		this.ui.mailsCount.string = `${MailMgr.getInstance().mailCount}/100`;
		this.ui.btn_receive.active = false;
		this.ui.btn_del.active = false;
	}

	//初始化邮件列表
	public initMailsList(): void {
		if (this.ui.mailsList.childrenCount > 0) {
			this.ui.mailsList.destroyAllChildren();
		}
		for (let i = 0; i < this.model.mailsData.list.length; i++) {
			let mailData = this.model.mailsData.list[i];
			let mailNode = this.addPrefabNode(this.ui.mail, this.ui.mailsList);
			mailNode.y = -75 * i - 35;
			mailNode.getComponent("mail").initMailData(mailData);
		}
	}

	//刷新邮件详情显示
	public refreshMailExplainUI(): void {
		this.delMailRewark();
		this.ui.mailsExplain_title.string = "邮件详情";
		this.ui.mailsExplain_name.string = `亲爱的${this.model.user.userName}:`;
		this.ui.mailsExplain_content.string = this.model.mailExplain.content;
		this.refreshMailIco();
		this.refreshMailBgColor();
		this.refreshMailRewarksUI();
	}

	//当前邮件ico刷新  未读取变成已读取
	public refreshMailIco(): void {
		for (let i = 0; i < this.ui.mailsList.childrenCount; i++) {
			let mailNode = this.ui.mailsList.children[i];
			let id = mailNode.getComponent("mail").model.mailData.id;
			if (id == this.model.mailExplain.id) {
				mailNode.getComponent("mail").refreshMailState();
				break;
			}
		}
	}

	//刷新全部邮件Ico  未读取变成已读取
	public refreshAllMailIco(): void {
		for (let i = 0; i < this.ui.mailsList.childrenCount; i++) {
			let mailNode = this.ui.mailsList.children[i];
			mailNode.getComponent("mail").refreshMailState();
		}
	}

	//刷新邮件奖励显示
	public refreshMailRewarksUI(): void {
		this.ui.btn_receive.active = false;
		this.ui.btn_del.active = false;
		let row = 0;
		let column = 0;
		if (this.model.mailExplain.bRec || this.model.mailExplain.reward.length == 0) {
			this.ui.btn_del.active = true;
			return;
		}
		for (let i = 0; i < this.model.mailExplain.reward.length; i++) {
			let rewarkData = this.model.mailExplain.reward[i];
			let rewarkNode = this.addPrefabNode(this.ui.mailRewark, this.ui.rewarks);
			row = i % 5;
			if (i != 0 && i % 5 == 0) {
				column++;
			}
			rewarkNode.x = -165 + 85 * row;
			rewarkNode.y = -85 * column;
			rewarkNode.getComponent("mailRewark").initMailRewark(rewarkData);
		}
		this.ui.btn_receive.active = !this.model.mailExplain.bRec;
		this.ui.btn_del.active = this.model.mailExplain.bRec;
	}

	//刷新点击邮件背景颜色   选择的邮件背景变黄色
	public refreshMailBgColor(): void {
		for (let i = 0; i < this.model.mailsData.list.length; i++) {
			let mailData = this.model.mailsData.list[i];
			if (!mailData.id) {
				return;
			}
			if (mailData.id == this.model.mailExplain.id) {
				this.ui.mailsList.children[i].getChildByName("frameBg").color = cc.color(243, 255, 183);
			} else {
				this.ui.mailsList.children[i].getChildByName("frameBg").color = cc.color(255, 255, 255);
			}
		}
	}

	//领取邮件奖励
	public bRecMailRewark(): void {
		this.delMailRewark();
		this.ui.btn_receive.active = !this.model.mailExplain.bRec;
		this.ui.btn_del.active = this.model.mailExplain.bRec;
	}

	//删除邮件奖励
	public delMailRewark(): void {
		if (this.ui.rewarks.childrenCount == 0) {
			return;
		}
		for (let i = 0; i < this.ui.rewarks.childrenCount; i++) {
			let rewarkNode = this.ui.rewarks.children[i];
			if (rewarkNode) {
				rewarkNode.destroy();
			}
		}
	}

	//领取有奖宝箱处理
	public showBoxes(): void {
		let index = 0;

		let fun = () => {
			let data = this.model.boxesRewarkData[++index];
			if (data) ctrl.showBoxesRewark(data, fun);
		}
		ctrl.showBoxesRewark(this.model.boxesRewarkData[index], fun);
	}
}
//c, 控制
@ccclass
export default class MailsCtrl extends BaseCtrl {
	protected view: View;
	protected model: Model;
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Node)
	mailsList: cc.Node = null;
	@property(cc.Prefab)
	mail: cc.Prefab = null;
	@property(cc.Label)
	mailsExplain_title: cc.Label = null;
	@property(cc.Label)
	mailsExplain_name: cc.Label = null;
	@property(cc.Label)
	mailsExplain_content: cc.Label = null;
	@property(cc.Label)
	mailsCount: cc.Label = null;
	@property(cc.Prefab)
	mailRewark: cc.Prefab = null;
	@property(cc.Node)
	rewarkFrame: cc.Node = null;
	@property(cc.Button)
	btn_allReceive: cc.Button = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad() {
		// 控制器
		ctrl = this;
		// 创建mvc模式中模型和视图
		this.initMvc(Model, View);
	}

	//定义网络事件
	protected defineNetEvents() {
		this.n_events = {
			"plaza.mail.recMail": this.recMail,
			"plaza.mail.delMail": this.delMail,
		};
	}
	//定义全局事件
	protected defineGlobalEvents() {
		this.g_events = {
			"refreshMailExplain": this.refreshMailExplain,
		};
	}
	//绑定操作的回调
	connectUi() {
		this.connect("click", this.ui.btn_close, () => {
			this.closeModule("mails");
		}, "关闭邮箱界面");
		this.connect("click", this.ui.btn_receive, () => {
			let idList = [];
			idList.push(this.model.mailExplain.id);
			MailMgr.getInstance().sendReqMailRewark(idList);
		}, `领取邮件奖励${this.model.mailExplain.id}`);
		this.connect("click", this.ui.btn_allReceive, () => {
			let list = MailMgr.getInstance().getAllMailId();
			MailMgr.getInstance().sendReqMailRewark(list);
		}, `领取全部邮件奖励${this.model.mailExplain.id}`);
		this.connect("click", this.ui.btn_del, () => {
			let idList = [];
			idList.push(this.model.mailExplain.id);
			MailMgr.getInstance().sendReqMailDel(idList);
		}, `删除邮件${this.model.mailExplain.id}`);
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	//刷新邮件详细内容显示
	public refreshMailExplain(mailId: number): void {
		this.model.setMailExplainData(mailId);
		this.view.refreshMailExplainUI();
	}

	//领取邮件  
	public recMail(): void {
		if (MailMgr.getInstance().isAllMailRecRewark) {					//全部领取
			//刷新全部邮件的ico  显示已读取状态
			this.view.refreshAllMailIco();
			if (this.model.mailExplain.id != null) {	//有显示当前邮件详情
				//清除奖励数据，领取按钮变为删除按钮
				this.model.setMailExplainData(this.model.mailExplain.id);
				this.view.bRecMailRewark();
			}
		} else {
			this.model.setMailExplainData(this.model.mailExplain.id);	//单个邮件领取
			this.view.bRecMailRewark();
		}
		//宝箱处理
		if (MailMgr.getInstance().boxesRewark != null) {
			this.model.setBoxesRewarkData();
			this.view.showBoxes();
		}
	}

	//删除邮件
	public delMail(): void {
		this.model.mailExplain = <mail>{};
		this.view.initUi();
	}

	//显示宝箱奖励界面
	public showBoxesRewark(arr: any, CB: Function): void {
		this.openSubModule("gainBox", true).then(script => {
			script.setGainData(arr, CB);
		});
	}

	onDestroy() {
		super.onDestroy();
	}
}