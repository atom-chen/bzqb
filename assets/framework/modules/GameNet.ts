import NetMgr, { G_NETTYPE } from "../net/NetMgr";
import NetErrMgr from "../net/NetErrMgr";
import LogMgr from "./LogMgr";
import Emitter from "./Emitter";
import Package from "../net/package";
import ServerMgr from "./ServerMgr";

interface SvrData {
	host: string,
	port: string,
}

export default class GameNet {
	private static _instance: GameNet = new GameNet();
	public static getInstance(): GameNet {
		return GameNet._instance;
	}
	private _serverCfg: any;
	private _connectorHost: string;
	private _connectorPort: string;
	private _gateHost: string;
	private _gatePort: string;
	private _dataSvrUrl: string;
	private _platSvrUrl: string;
	private _uid: number;
	private _serverDelay: number;

	public setServerCfg(): void {
		this._serverCfg = ServerMgr.getInstance().getServerCfg();
		if (~this._serverCfg.platSvrHost.indexOf('.com')) {
			this._platSvrUrl = this._serverCfg.platSvrHost;
		} else {
			this._platSvrUrl = `http://${this._serverCfg.platSvrHost}:${this._serverCfg.platSvrPort}/index`;
		}
		this._gateHost = this._serverCfg.gameSvrHost;
		this._gatePort = this._serverCfg.gameSvrPort;
		this._dataSvrUrl = `http://${this._serverCfg.dataSvrHost}:${this._serverCfg.dataSvrPort}`;
	}

	public setUid(id: number) {
		this._uid = id;
	}

	public getPlatSvrUrl(): string {
		return this._platSvrUrl;
	}

	public getGateSvrData(): SvrData {
		return { host: this._gateHost, port: this._gatePort };
	}

	public setConnectSvrData(data: SvrData): void {
		this._connectorHost = data.host;
		this._connectorPort = data.port;
	}

	public getConnectSvrData(): SvrData {
		return { host: this._connectorHost, port: this._connectorPort };
	}

	public setServerDelay(dt: number): void {
		this._serverDelay = dt;
	}

	public getServerDelay(): number {
		return this._serverDelay;
	}

	public send_msg(route: string, msg: any = {}): void {
		// 拼装数据,绑定消息id
		if (route === "") return console.error("route不能为空!");
		let { serverType, msg: newmsg } = NetMgr.getInstance().convertMsg(route, msg);
		switch (serverType) {
			case G_NETTYPE.http: // http
				this._httpReq(route, newmsg);
				break;
			case G_NETTYPE.pomelo: // pomelo
				this._pomeloReq(route, newmsg);
				break;
		}
	}
	// 重发消息
	public reSendMsgs(records): void {
		for (let i = 0; i < records.length; ++i) {
			let { serverType, route, msg } = records[i];
			switch (serverType) {
				case G_NETTYPE.http: // http
					this._httpReq(route, msg);
					break;
				case G_NETTYPE.pomelo: // pomelo
					this._pomeloReq(route, msg);
					break;
			}
		}
	}
	// http
	private _httpReq(route: string, msg: any): void {
		let xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				let res = JSON.parse(xhr.responseText);
				this._msgCb(res.route, res.code, res);
			}
		}
		xhr.timeout = 3000;
		xhr.onerror = (err) => {
			console.error("http请求出错!");
		}
		xhr.ontimeout = () => {
			console.error("http请求超时!");
		}
		// xhr.open("POST", this._platSvrUrl, true);
		xhr.open("POST", this._dataSvrUrl, true);
		xhr.send(msg);
		LogMgr.getInstance().addRequire(route);
		console.log("发送了http=", route, msg);
	}
	//tcp请求
	private _pomeloReq(route: string, msg: any): void {
		pomelo.request(route, msg);
		LogMgr.getInstance().addRequire(route);
		console.log("发送了pomelo=", route, msg);
	}
	// 推送网络消息
	private _emit(route: string, msg: Package): void {
		Emitter.getInstance().dealNetRoute(route, msg);
		Emitter.getInstance().emit(route, msg);
	}

	private _msgCb(route: string, code: number, data: any): void {
		console.log(`收到服务器回复=${route}`, JSON.stringify(data));
		NetMgr.getInstance().doneWithRoute(route);
		//记录到操作log中
		LogMgr.getInstance().addRespond(route);

		if (code != null && NetErrMgr.getInstance().dealWithError(code)) return;

		let pack = new Package(data);
		console.log("广播消息-", route);
		// 广播网络消息 
		this._emit(route, pack);
	}

	public connect(host, port, connectcb): void {
		//广播连接事件 
		let cfg = {
			host: host,
			port: port,
			debug: true,
			msgcb: this._msgCb.bind(this),
			connectcb: connectcb,
		}
		console.log(`连接地址=${host}:${port}`);
		pomelo.init(cfg)
		//告诉网络管理pomelo开始连接
		NetMgr.getInstance().pomeloConnecting();
	}

	public disconnect(): void {
		pomelo.disconnect()
	}

	public clear(): void {
		NetMgr.getInstance().clearTimer();
		pomelo.clearListener();
		pomelo.disconnect();
	}
}


