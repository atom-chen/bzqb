import BaseMgr from "../../framework/baseClass/BaseMgr";
import GameNet from "../../framework/modules/GameNet";
import NetMgr from "../../framework/net/NetMgr";
import { dataids } from "../../framework/net/dataids";
import Package from "../../framework/net/package";
import ModuleMgr from "../../framework/modules/ModuleMgr";
import UserMgr from "./userMgr";
import Cache from "../../framework/modules/Cache";

enum ServerType {
    server_gate = 1,
    server_connector
}

export default class LoginMgr extends BaseMgr {
    //单例处理
    private static _instance: LoginMgr = null;
    public static getInstance(): LoginMgr {
        if (LoginMgr._instance == null) {
            LoginMgr._instance = new LoginMgr();
        }
        return LoginMgr._instance;
    }
    private _serverType: ServerType = ServerType.server_gate;
    private _platId: string = null;
    private _token: string = null;
    private _isAutoLogin: boolean = true;
    public nicknameCfgTab: any = [];    //昵称配表

    constructor() {
        super();
        this.routes = {
            'gate.entry.req': this.gate_entry_req,
            'connector.entry.login': this.connector_entry_login,
            'plaza.users.initUser': this.plaza_users_initUser,
            'plaza.users.createRole': this.plaza_users_createRole,
        }
    }

    private gate_entry_req(msg: Package): void {
        let hostInfo = msg.getDataByType(dataids.ID_CONNECTOR_INFO);
        let uid = msg.getDataByType(dataids.ID_UID);
        let serverTime = msg.getDataByType(dataids.ID_SERVER_TIME);
        this._serverType = ServerType.server_connector;
        GameNet.getInstance().setUid(uid);
        GameNet.getInstance().setServerDelay(serverTime - Date.now());
        GameNet.getInstance().setConnectSvrData(hostInfo);
        GameNet.getInstance().disconnect();
        if (this._isAutoLogin) Cache.getInstance().setItem("loginCache", { uid: this._platId, token: this._token });
    }

    private connector_entry_login(msg: Package): void {
        this._sendPlazaInitUser();
    }

    private plaza_users_initUser(msg: Package): void {
        let roleId = msg.getDataByType(dataids.ID_USER_INFO).roleId;
        if (roleId == 0) {
            this.gemit("goToCreateRole");
        } else {
            this._goToPlaza();
        }
    }

    private plaza_users_createRole(msg: Package): void {
        this._goToPlaza();
    }

    public login(obj): void {
        this._platId = obj.uid;
        this._token = obj.token;
        let { host, port } = GameNet.getInstance().getGateSvrData();
        GameNet.getInstance().connect(host, port, this.connectcb.bind(this));
    }

    public switchAccount(): void {
        GameNet.getInstance().clear();
        Cache.getInstance().removeItemByKey("loginCache");
        ModuleMgr.getInstance().switchScene("login");
    }

    private _goToPlaza(): void {
        ModuleMgr.getInstance().switchScene("plaza", [
            'plaza.role.reqRoleList',
            'plaza.data.reqBoxes',
            'plaza.data.reqItemList',
            'plaza.data.reqFriendIds',
            'plaza.data.reqUnsettled',
        ]);
    }

    restartGame() {
        cc.audioEngine.stopAll();
        cc.Game.restart();
    }

    private ok_cb(event) {
        this.restartGame();
    }

    connectcb(event_type, event) {
        switch (this._serverType) {
            case ServerType.server_gate:
                this.gateConnectCb(event_type, event)
                break;
            case ServerType.server_connector:
                this.connectConnector(event_type, event);
                break;
        }
    }

    // gate服的连接回调
    gateConnectCb(event_type, event) {
        switch (event_type) {
            case 'connect':
                console.log("连接上gate服");
                //清除pomelo的发送队列
                NetMgr.getInstance().pomeloConnected();
                NetMgr.getInstance().clearPomeloReqs();
                //去获取连接服
                this._sendGateReq();
                break;
            case 'disconnect':
                NetMgr.getInstance().pomeloDisconnected();
                let { host, port } = GameNet.getInstance().getGateSvrData();
                GameNet.getInstance().connect(host, port, this.connectcb.bind(this));
                break;
            case 'onKick':
                break;
        }
    }

    // connect服的连接回调
    connectConnector(event_type, event) {
        switch (event_type) {
            case 'connect':
                console.log("连接上connect服");
                NetMgr.getInstance().pomeloConnected();
                NetMgr.getInstance().clearPomeloReqs();
                this._sendConnectLogin();
                break;
            case 'disconnect':
                NetMgr.getInstance().pomeloDisconnected();
                let { host, port } = GameNet.getInstance().getConnectSvrData();
                GameNet.getInstance().connect(host, port, this.connectcb.bind(this));
                break;
            case 'onKick':
                break;
        }
    }

    // 去获取连接服ip和端口
    private _sendGateReq(): void {
        this.send_msg('gate.entry.req', {
            platId: this._platId,
            token: this._token
        });
    }

    private _sendConnectLogin(): void {
        this.send_msg('connector.entry.login', {
            uid: UserMgr.getInstance().user.userUID,
        });
    }

    private _sendPlazaInitUser(): void {
        this.send_msg('plaza.users.initUser', {
            uid: UserMgr.getInstance().user.userUID
        });
    }

    //创建角色发送请求
    public sendRegisterUser(nickname: string, roleID: number): void {
        this.send_msg("plaza.users.createRole", {
            uid: UserMgr.getInstance().user.userUID,
            nickname: nickname,
            itemId: roleID,
        });
    }

    getToken() {
        return this._token;
    }

    //获取昵称配表
    public getNicknameCfgTab(): void {
        this.nicknameCfgTab = this.getConfigSync("nicheng_nicheng").json;
    }

    destroy() {
        // console.log("LoginMgr清空了自己");
        super.destroy();
        delete LoginMgr._instance;
        LoginMgr._instance = null;
    }
}