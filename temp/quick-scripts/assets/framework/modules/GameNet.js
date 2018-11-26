(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/modules/GameNet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'facdb805mtHfJ6Kv9JQ8lYs', 'GameNet', __filename);
// framework/modules/GameNet.ts

Object.defineProperty(exports, "__esModule", { value: true });
var NetMgr_1 = require("../net/NetMgr");
var NetErrMgr_1 = require("../net/NetErrMgr");
var LogMgr_1 = require("./LogMgr");
var Emitter_1 = require("./Emitter");
var package_1 = require("../net/package");
var ServerMgr_1 = require("./ServerMgr");
var GameNet = /** @class */ (function () {
    function GameNet() {
    }
    GameNet.getInstance = function () {
        return GameNet._instance;
    };
    GameNet.prototype.setServerCfg = function () {
        this._serverCfg = ServerMgr_1.default.getInstance().getServerCfg();
        if (~this._serverCfg.platSvrHost.indexOf('.com')) {
            this._platSvrUrl = this._serverCfg.platSvrHost;
        }
        else {
            this._platSvrUrl = "http://" + this._serverCfg.platSvrHost + ":" + this._serverCfg.platSvrPort + "/index";
        }
        this._gateHost = this._serverCfg.gameSvrHost;
        this._gatePort = this._serverCfg.gameSvrPort;
        this._dataSvrUrl = "http://" + this._serverCfg.dataSvrHost + ":" + this._serverCfg.dataSvrPort;
    };
    GameNet.prototype.setUid = function (id) {
        this._uid = id;
    };
    GameNet.prototype.getPlatSvrUrl = function () {
        return this._platSvrUrl;
    };
    GameNet.prototype.getGateSvrData = function () {
        return { host: this._gateHost, port: this._gatePort };
    };
    GameNet.prototype.setConnectSvrData = function (data) {
        this._connectorHost = data.host;
        this._connectorPort = data.port;
    };
    GameNet.prototype.getConnectSvrData = function () {
        return { host: this._connectorHost, port: this._connectorPort };
    };
    GameNet.prototype.setServerDelay = function (dt) {
        this._serverDelay = dt;
    };
    GameNet.prototype.getServerDelay = function () {
        return this._serverDelay;
    };
    GameNet.prototype.send_msg = function (route, msg) {
        if (msg === void 0) { msg = {}; }
        // 拼装数据,绑定消息id
        if (route === "")
            return console.error("route不能为空!");
        var _a = NetMgr_1.default.getInstance().convertMsg(route, msg), serverType = _a.serverType, newmsg = _a.msg;
        switch (serverType) {
            case NetMgr_1.G_NETTYPE.http: // http
                this._httpReq(route, newmsg);
                break;
            case NetMgr_1.G_NETTYPE.pomelo: // pomelo
                this._pomeloReq(route, newmsg);
                break;
        }
    };
    // 重发消息
    GameNet.prototype.reSendMsgs = function (records) {
        for (var i = 0; i < records.length; ++i) {
            var _a = records[i], serverType = _a.serverType, route = _a.route, msg = _a.msg;
            switch (serverType) {
                case NetMgr_1.G_NETTYPE.http: // http
                    this._httpReq(route, msg);
                    break;
                case NetMgr_1.G_NETTYPE.pomelo: // pomelo
                    this._pomeloReq(route, msg);
                    break;
            }
        }
    };
    // http
    GameNet.prototype._httpReq = function (route, msg) {
        var _this = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var res = JSON.parse(xhr.responseText);
                _this._msgCb(res.route, res.code, res);
            }
        };
        xhr.timeout = 3000;
        xhr.onerror = function (err) {
            console.error("http请求出错!");
        };
        xhr.ontimeout = function () {
            console.error("http请求超时!");
        };
        // xhr.open("POST", this._platSvrUrl, true);
        xhr.open("POST", this._dataSvrUrl, true);
        xhr.send(msg);
        LogMgr_1.default.getInstance().addRequire(route);
        console.log("发送了http=", route, msg);
    };
    //tcp请求
    GameNet.prototype._pomeloReq = function (route, msg) {
        pomelo.request(route, msg);
        LogMgr_1.default.getInstance().addRequire(route);
        console.log("发送了pomelo=", route, msg);
    };
    // 推送网络消息
    GameNet.prototype._emit = function (route, msg) {
        Emitter_1.default.getInstance().dealNetRoute(route, msg);
        Emitter_1.default.getInstance().emit(route, msg);
    };
    GameNet.prototype._msgCb = function (route, code, data) {
        console.log("\u6536\u5230\u670D\u52A1\u5668\u56DE\u590D=" + route, JSON.stringify(data));
        NetMgr_1.default.getInstance().doneWithRoute(route);
        //记录到操作log中
        LogMgr_1.default.getInstance().addRespond(route);
        if (code != null && NetErrMgr_1.default.getInstance().dealWithError(code))
            return;
        var pack = new package_1.default(data);
        console.log("广播消息-", route);
        // 广播网络消息 
        this._emit(route, pack);
    };
    GameNet.prototype.connect = function (host, port, connectcb) {
        //广播连接事件 
        var cfg = {
            host: host,
            port: port,
            debug: true,
            msgcb: this._msgCb.bind(this),
            connectcb: connectcb,
        };
        console.log("\u8FDE\u63A5\u5730\u5740=" + host + ":" + port);
        pomelo.init(cfg);
        //告诉网络管理pomelo开始连接
        NetMgr_1.default.getInstance().pomeloConnecting();
    };
    GameNet.prototype.disconnect = function () {
        pomelo.disconnect();
    };
    GameNet.prototype.clear = function () {
        NetMgr_1.default.getInstance().clearTimer();
        pomelo.clearListener();
        pomelo.disconnect();
    };
    GameNet._instance = new GameNet();
    return GameNet;
}());
exports.default = GameNet;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameNet.js.map
        