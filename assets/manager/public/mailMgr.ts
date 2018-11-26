import BaseMgr from "../../framework/baseClass/BaseMgr";
import { mailsData, mail, mail_rewark } from "./interface/iMailInfo";
import GameNet from "../../framework/modules/GameNet";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";

/*
author: 陈斌杰
日期:2018-11-16 16:40:35
*/

export default class MailMgr extends BaseMgr {
	public isFrist: boolean = false;				//是否是第一次打开
	public mailsData: mailsData = <mailsData>{};	//全部邮件数据
	public mailCount: number = 0;					//邮件数量
	public isAllMailRecRewark: boolean = false;		//是否全部领取
	public boxesRewark: any = null;					//邮件宝箱数据
	constructor() {
		super();
		this.routes = {
			"plaza.mail.reqMailList": this.reqMailList,
			"plaza.mail.readMail": this.readMail,
			"plaza.mail.recMail": this.recMail,
			"plaza.mail.delMail": this.delMail,
			"onNewMail": this.onNewMail,
		};
	}

	// 单例处理
	private static _instance: MailMgr = null;
	public static getInstance(): MailMgr {
		if (MailMgr._instance == null) {
			MailMgr._instance = new MailMgr();
		}
		return MailMgr._instance;
	}

	//向服务器请求邮件数据
	public sendReqMailsData(): void {
		this.send_msg("plaza.mail.reqMailList");
	}

	//获取服务器下发的邮件数据
	public reqMailList(msg: Package): void {
		let mailsData = msg.getDataByType(dataids.ID_GET_MAILS);
		this.isFrist = true;
		this.initMailsData();
		this.setMailsData(mailsData);
	}

	//向服务器请求邮件详细数据
	public sendReqMailExplainData(idList: number[]): void {
		let msg = {
			listAutoId: idList,
		}
		this.send_msg("plaza.mail.readMail", msg);
	}

	//获取服务器下发的邮件详细数据
	public readMail(msg: Package): void {
		let mailData = msg.getDataByType(dataids.ID_READ_MAIL);
		this.setReadMailData(mailData);
		this.gemit("refreshMailExplain", mailData[0].id);
	}

	//向服务器发送领取邮件物品请求
	public sendReqMailRewark(idList: number[]): void {
		let msg = {
			listAutoId: idList,
		}
		this.send_msg("plaza.mail.recMail", msg);
	}

	//获取服务器下发的邮件奖励数据
	public recMail(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_GET_MAILITEMS);
		this.setMailBRecData(data.listAutoId);

		//有宝箱要特殊处理
		let boxesData = msg.getDataByType(dataids.ID_GET_BOXPRIZE);
		this.setBoxesData(boxesData);
	}

	//向服务器发送删除邮件请求
	public sendReqMailDel(idList: number[]): void {
		let msg = {
			listAutoId: idList,
		}
		this.send_msg("plaza.mail.delMail", msg);
	}

	//获取服务器下发的删除邮件数据
	public delMail(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_DEL_MAIL);
		this.delMailData(data);
	}

	//新邮件数据
	public onNewMail(msg: Package): void {
		let mailsData = msg.getDataByType(dataids.ID_NEW_MAIL);
		if (!this.isFrist) {
			this.initMailsData();
		}
		this.setMailsData(mailsData);
	}

	//初始化邮箱数据
	public initMailsData(): void {
		this.mailsData.list = [];
		for (let i = 0; i < 100; i++) {
			let mail: mail = <mail>{};
			mail.id = null;
			mail.bReaded = false;
			mail.bRec = false;
			mail.title = null;
			mail.sendTime = null;
			mail.residueTime = null;
			mail.content = null;
			mail.reward = [];
			this.mailsData.list.push(mail);
		}
	}

	//设置邮箱数据
	public setMailsData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.mailsData.list.length; j++) {
				let mailData = this.mailsData.list[j];
				if (mailData.id) {
					let mail: mail = <mail>{};
					mail.id = data[i].id;
					if (data[i].bReaded == 1) {
						mail.bReaded = true;
					} else {
						mail.bReaded = false;
					}
					if (data[i].bRec == 1) {
						mail.bRec = true;
					} else {
						mail.bRec = false;
					}
					mail.title = data[i].title;
					mail.sendTime = this.changeTimeStamp(data[i].createTime);
					mail.residueTime = this.getRemainingTiem(data[i].createTime);;
					this.mailsData.list.splice(-1, 1);		//删除最后一个空数据  在第一个位置添加新数据
					this.mailsData.list.splice(0, 0, mail);
				} else {
					mailData.id = data[i].id;
					if (data[i].bReaded == 1) {
						mailData.bReaded = true;
					}
					if (data[i].bRec == 1) {
						mailData.bRec = true;
					}
					mailData.title = data[i].title;
					mailData.sendTime = this.changeTimeStamp(data[i].createTime);
					mailData.residueTime = this.getRemainingTiem(data[i].createTime);
				}
				break;
			}
		}
		this.mailCount += data.length;
	}

	//设置邮件的读取数据
	public setReadMailData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.mailsData.list.length; j++) {
				let mailData = this.mailsData.list[j];
				if (data[i].id == mailData.id) {
					mailData.bReaded = true;
					mailData.content = data[i].content;
					mailData.reward = [];
					for (let k = 0; k < data[i].recItems.length; k++) {
						if (!data[i].recItems[k].type || !data[i].recItems[k].amount || !data[i].recItems[k].itemId) {
							break;
						}
						let mail_rewark: mail_rewark = <mail_rewark>{};
						mail_rewark.type = data[i].recItems[k].type;
						mail_rewark.amount = data[i].recItems[k].amount;
						mail_rewark.itemId = data[i].recItems[k].itemId;
						mailData.reward.push(mail_rewark);
					}
					break;
				}
			}
		}
	}

	//设置邮件的领取数据
	public setMailBRecData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.mailsData.list.length; j++) {
				let mailData = this.mailsData.list[j];
				if (data[i] == mailData.id) {
					mailData.bReaded = true;
					mailData.bRec = true;
					mailData.reward = [];
				}
			}
		}
		if (data.length > 1) {
			this.isAllMailRecRewark = true;
		} else {
			this.isAllMailRecRewark = false;
		}
	}

	//设置宝箱数据
	public setBoxesData(data: any): void {
		if (data == null) {
			return;
		}
		this.boxesRewark = data;
	}

	//删除邮件数据
	public delMailData(data: any): void {
		for (let i = 0; i < data.length; i++) {
			let delId = data[i];
			for (let j = 0; j < this.mailsData.list.length; j++) {
				let mailData = this.mailsData.list[j];
				if (delId == mailData.id) {
					this.mailsData.list.splice(j, 1);
					let mail: mail = <mail>{};
					mail.id = null;
					mail.bReaded = false;
					mail.bRec = false;
					mail.title = null;
					mail.sendTime = null;
					mail.residueTime = null;
					mail.content = null;
					mail.reward = [];
					this.mailsData.list.push(mail);
					break;
				}
			}
		}
		this.mailCount -= data.length;
	}

	//新增邮件时刷新邮件数据
	public refreshMailsData(data: any): void {

	}

	//获取全部邮件id
	public getAllMailId(): number[] {
		let list = [];
		for (let i = 0; i < this.mailsData.list.length; i++) {
			let mailData = this.mailsData.list[i];
			if (mailData.id) {
				list.push(mailData.id);
			} else {
				break;
			}
		}
		return list;
	}

	//时间戳转换
	public changeTimeStamp(time: number): string {
		let date = new Date(time);
		let y = date.getFullYear().toString();
		let m = (date.getMonth() + 1).toString();
		let d = date.getDate().toString();
		return y + '-' + m + '-' + d;
	}

	//获取剩余天数
	public getRemainingTiem(time: number): number {
		let nowTime = new Date().getTime();									//当前时间戳
		let spendTiem = (nowTime - time) / 1000;							//花费的秒数
		let allTime = 30 * 24 * 3600;										//总的30天秒数		
		let remainingTime = (allTime - spendTiem) / 24 / 3600;
		return Math.floor(remainingTime) + 1;
	}
}