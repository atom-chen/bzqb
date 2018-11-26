import GameNet from "../modules/GameNet";
import ModuleMgr from "../modules/ModuleMgr";

export enum G_NETTYPE {
	http = 1,
	pomelo
}

let netdef_reqmaxtime = 20000;

export default class NetMgr {
	private static _instance: NetMgr = new NetMgr();
	public static getInstance(): NetMgr {
		return NetMgr._instance;
	}
	private _msgIndex: number = 0;//消息索引
	private _msgrecords: any = {};
	private _checkTimer: number = null;// 请求的事件检测定时器 
	private _pomeloIsReconnect: boolean = false;
	constructor() {

	}

	//获取发送记录
	public getMsgRecords(): any {
		return this._msgrecords;
	}

	// 告诉网络管理pomelo断开了
	public pomeloDisconnected(): void {
		console.log("pomelo断开!");
		this._pomeloIsReconnect = true;
	}
	//告诉网络管理pomelo正在连接中
	public pomeloConnecting(): void {
		console.log("pomelo正在连接!");
		this._pomeloIsReconnect = true;
	}

	public pomeloConnected(): void {
		if (this._pomeloIsReconnect) this._pomeloIsReconnect = false;
		// if (this._checkTimer == null) {
		// this._checkTimer = setInterval(() => {
		// 	this._checkReq();
		// }, 3000);
		// }
		// ModuleMgr.getInstance().closeModule("juhua");
	}
	// 在LoginMgr重连后清空pomelo的请求
	public clearPomeloReqs(): void {
		// console.log("清空pomelo记录");
		for (let route in this._msgrecords) {
			let record = this._msgrecords[route];
			if (record.serverType == G_NETTYPE.pomelo) {
				delete this._msgrecords[route];
			}
		}
	}

	//检测发送队列
	private _checkReq(): void {
		if (Object.keys(this._msgrecords).length > 0) {
			let httpReSendMsgs = [];
			let pomeloReSendMsgs = [];
			for (let route in this._msgrecords) {
				let record = this._msgrecords[route];
				if (Date.now() - record.time > netdef_reqmaxtime) {
					// 超过最大等待时间，断开并重新连接
					if (!this._pomeloIsReconnect) GameNet.getInstance().disconnect();
					return;
				} else {
					record.time = Date.now(); // 重置发送时间
					switch (record.serverType) {
						case G_NETTYPE.http:
							httpReSendMsgs.push(record);
							break;
						case G_NETTYPE.pomelo:
							pomeloReSendMsgs.push(record);
							break;
					}
				}
			}
			ModuleMgr.getInstance().showJuhua();
			// 重发消息
			if (httpReSendMsgs.length > 0) GameNet.getInstance().reSendMsgs(httpReSendMsgs);
			if (pomeloReSendMsgs.length > 0 && !this._pomeloIsReconnect) GameNet.getInstance().reSendMsgs(pomeloReSendMsgs);
		}
	}
	//清除定时器
	public clearTimer(): void {
		if (this._checkTimer != null) {
			clearTimeout(this._checkTimer);
			this._checkTimer = null;
		}
	}

	//转换消息成带msgindex的格式
	public convertMsg(route: string, data: any): any {
		let words = route.split('.');
		let newRecord: any = {
			time: Date.now(),
			route: route
		}
		if (words[0] === "http") {
			newRecord.serverType = G_NETTYPE.http;
			newRecord.msg = {
				head: {
					// some property
				},
				body: data
			}
		} else {
			newRecord.serverType = G_NETTYPE.pomelo;
			data.msgindex = this._msgIndex;
			newRecord.msg = data;
		}
		this._msgrecords[route] = newRecord;
		this._msgIndex++;
		return newRecord;
	}
	// 消息回复后的处理
	public doneWithRoute(route): void {
		if (this._msgrecords[route]) delete this._msgrecords[route];
		ModuleMgr.getInstance().closeModule("juhua");
	}
}


