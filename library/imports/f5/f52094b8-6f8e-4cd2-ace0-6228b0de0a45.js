"use strict";
cc._RF.push(module, 'f5209S4b45M0qzgYiiw3gpF', 'loginMgr');
// manager/public/loginMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var GameNet_1 = require("../../framework/modules/GameNet");
var NetMgr_1 = require("../../framework/net/NetMgr");
var dataids_1 = require("../../framework/net/dataids");
var ModuleMgr_1 = require("../../framework/modules/ModuleMgr");
var userMgr_1 = require("./userMgr");
var Cache_1 = require("../../framework/modules/Cache");
var ServerType;
(function (ServerType) {
    ServerType[ServerType["server_gate"] = 1] = "server_gate";
    ServerType[ServerType["server_connector"] = 2] = "server_connector";
})(ServerType || (ServerType = {}));
var LoginMgr = /** @class */ (function (_super) {
    __extends(LoginMgr, _super);
    function LoginMgr() {
        var _this = _super.call(this) || this;
        _this._serverType = ServerType.server_gate;
        _this._platId = null;
        _this._token = null;
        _this._isAutoLogin = true;
        _this.nicknameCfgTab = []; //昵称配表
        _this.routes = {
            'gate.entry.req': _this.gate_entry_req,
            'connector.entry.login': _this.connector_entry_login,
            'plaza.users.initUser': _this.plaza_users_initUser,
            'plaza.users.createRole': _this.plaza_users_createRole,
        };
        return _this;
    }
    LoginMgr.getInstance = function () {
        if (LoginMgr._instance == null) {
            LoginMgr._instance = new LoginMgr();
        }
        return LoginMgr._instance;
    };
    LoginMgr.prototype.gate_entry_req = function (msg) {
        var hostInfo = msg.getDataByType(dataids_1.dataids.ID_CONNECTOR_INFO);
        var uid = msg.getDataByType(dataids_1.dataids.ID_UID);
        var serverTime = msg.getDataByType(dataids_1.dataids.ID_SERVER_TIME);
        this._serverType = ServerType.server_connector;
        GameNet_1.default.getInstance().setUid(uid);
        GameNet_1.default.getInstance().setServerDelay(serverTime - Date.now());
        GameNet_1.default.getInstance().setConnectSvrData(hostInfo);
        GameNet_1.default.getInstance().disconnect();
        if (this._isAutoLogin)
            Cache_1.default.getInstance().setItem("loginCache", { uid: this._platId, token: this._token });
    };
    LoginMgr.prototype.connector_entry_login = function (msg) {
        this._sendPlazaInitUser();
    };
    LoginMgr.prototype.plaza_users_initUser = function (msg) {
        var roleId = msg.getDataByType(dataids_1.dataids.ID_USER_INFO).roleId;
        if (roleId == 0) {
            this.gemit("goToCreateRole");
        }
        else {
            this._goToPlaza();
        }
    };
    LoginMgr.prototype.plaza_users_createRole = function (msg) {
        this._goToPlaza();
    };
    LoginMgr.prototype.login = function (obj) {
        this._platId = obj.uid;
        this._token = obj.token;
        var _a = GameNet_1.default.getInstance().getGateSvrData(), host = _a.host, port = _a.port;
        GameNet_1.default.getInstance().connect(host, port, this.connectcb.bind(this));
    };
    LoginMgr.prototype.switchAccount = function () {
        GameNet_1.default.getInstance().clear();
        Cache_1.default.getInstance().removeItemByKey("loginCache");
        ModuleMgr_1.default.getInstance().switchScene("login");
    };
    LoginMgr.prototype._goToPlaza = function () {
        ModuleMgr_1.default.getInstance().switchScene("plaza", [
            'plaza.role.reqRoleList',
            'plaza.data.reqBoxes',
            'plaza.data.reqItemList',
            'plaza.data.reqFriendIds',
            'plaza.data.reqUnsettled',
        ]);
    };
    LoginMgr.prototype.restartGame = function () {
        cc.audioEngine.stopAll();
        cc.Game.restart();
    };
    LoginMgr.prototype.ok_cb = function (event) {
        this.restartGame();
    };
    LoginMgr.prototype.connectcb = function (event_type, event) {
        switch (this._serverType) {
            case ServerType.server_gate:
                this.gateConnectCb(event_type, event);
                break;
            case ServerType.server_connector:
                this.connectConnector(event_type, event);
                break;
        }
    };
    // gate服的连接回调
    LoginMgr.prototype.gateConnectCb = function (event_type, event) {
        switch (event_type) {
            case 'connect':
                console.log("连接上gate服");
                //清除pomelo的发送队列
                NetMgr_1.default.getInstance().pomeloConnected();
                NetMgr_1.default.getInstance().clearPomeloReqs();
                //去获取连接服
                this._sendGateReq();
                break;
            case 'disconnect':
                NetMgr_1.default.getInstance().pomeloDisconnected();
                var _a = GameNet_1.default.getInstance().getGateSvrData(), host = _a.host, port = _a.port;
                GameNet_1.default.getInstance().connect(host, port, this.connectcb.bind(this));
                break;
            case 'onKick':
                break;
        }
    };
    // connect服的连接回调
    LoginMgr.prototype.connectConnector = function (event_type, event) {
        switch (event_type) {
            case 'connect':
                console.log("连接上connect服");
                NetMgr_1.default.getInstance().pomeloConnected();
                NetMgr_1.default.getInstance().clearPomeloReqs();
                this._sendConnectLogin();
                break;
            case 'disconnect':
                NetMgr_1.default.getInstance().pomeloDisconnected();
                var _a = GameNet_1.default.getInstance().getConnectSvrData(), host = _a.host, port = _a.port;
                GameNet_1.default.getInstance().connect(host, port, this.connectcb.bind(this));
                break;
            case 'onKick':
                break;
        }
    };
    // 去获取连接服ip和端口
    LoginMgr.prototype._sendGateReq = function () {
        this.send_msg('gate.entry.req', {
            platId: this._platId,
            token: this._token
        });
    };
    LoginMgr.prototype._sendConnectLogin = function () {
        this.send_msg('connector.entry.login', {
            uid: userMgr_1.default.getInstance().user.userUID,
        });
    };
    LoginMgr.prototype._sendPlazaInitUser = function () {
        this.send_msg('plaza.users.initUser', {
            uid: userMgr_1.default.getInstance().user.userUID
        });
    };
    //创建角色发送请求
    LoginMgr.prototype.sendRegisterUser = function (nickname, roleID) {
        this.send_msg("plaza.users.createRole", {
            uid: userMgr_1.default.getInstance().user.userUID,
            nickname: nickname,
            itemId: roleID,
        });
    };
    LoginMgr.prototype.getToken = function () {
        return this._token;
    };
    //获取昵称配表
    LoginMgr.prototype.getNicknameCfgTab = function () {
        this.nicknameCfgTab = this.getConfigSync("nicheng_nicheng").json;
    };
    LoginMgr.prototype.destroy = function () {
        // console.log("LoginMgr清空了自己");
        _super.prototype.destroy.call(this);
        delete LoginMgr._instance;
        LoginMgr._instance = null;
    };
    //单例处理
    LoginMgr._instance = null;
    return LoginMgr;
}(BaseMgr_1.default));
exports.default = LoginMgr;

cc._RF.pop();