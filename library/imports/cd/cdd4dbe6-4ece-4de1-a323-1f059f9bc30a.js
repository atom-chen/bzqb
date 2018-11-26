"use strict";
cc._RF.push(module, 'cdd4dvmTs5N4aMjHwWfm8MK', 'NetMgr');
// framework/net/NetMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameNet_1 = require("../modules/GameNet");
var ModuleMgr_1 = require("../modules/ModuleMgr");
var G_NETTYPE;
(function (G_NETTYPE) {
    G_NETTYPE[G_NETTYPE["http"] = 1] = "http";
    G_NETTYPE[G_NETTYPE["pomelo"] = 2] = "pomelo";
})(G_NETTYPE = exports.G_NETTYPE || (exports.G_NETTYPE = {}));
var netdef_reqmaxtime = 20000;
var NetMgr = /** @class */ (function () {
    function NetMgr() {
        this._msgIndex = 0; //消息索引
        this._msgrecords = {};
        this._checkTimer = null; // 请求的事件检测定时器 
        this._pomeloIsReconnect = false;
    }
    NetMgr.getInstance = function () {
        return NetMgr._instance;
    };
    //获取发送记录
    NetMgr.prototype.getMsgRecords = function () {
        return this._msgrecords;
    };
    // 告诉网络管理pomelo断开了
    NetMgr.prototype.pomeloDisconnected = function () {
        console.log("pomelo断开!");
        this._pomeloIsReconnect = true;
    };
    //告诉网络管理pomelo正在连接中
    NetMgr.prototype.pomeloConnecting = function () {
        console.log("pomelo正在连接!");
        this._pomeloIsReconnect = true;
    };
    NetMgr.prototype.pomeloConnected = function () {
        if (this._pomeloIsReconnect)
            this._pomeloIsReconnect = false;
        // if (this._checkTimer == null) {
        // this._checkTimer = setInterval(() => {
        // 	this._checkReq();
        // }, 3000);
        // }
        // ModuleMgr.getInstance().closeModule("juhua");
    };
    // 在LoginMgr重连后清空pomelo的请求
    NetMgr.prototype.clearPomeloReqs = function () {
        // console.log("清空pomelo记录");
        for (var route in this._msgrecords) {
            var record = this._msgrecords[route];
            if (record.serverType == G_NETTYPE.pomelo) {
                delete this._msgrecords[route];
            }
        }
    };
    //检测发送队列
    NetMgr.prototype._checkReq = function () {
        if (Object.keys(this._msgrecords).length > 0) {
            var httpReSendMsgs = [];
            var pomeloReSendMsgs = [];
            for (var route in this._msgrecords) {
                var record = this._msgrecords[route];
                if (Date.now() - record.time > netdef_reqmaxtime) {
                    // 超过最大等待时间，断开并重新连接
                    if (!this._pomeloIsReconnect)
                        GameNet_1.default.getInstance().disconnect();
                    return;
                }
                else {
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
            ModuleMgr_1.default.getInstance().showJuhua();
            // 重发消息
            if (httpReSendMsgs.length > 0)
                GameNet_1.default.getInstance().reSendMsgs(httpReSendMsgs);
            if (pomeloReSendMsgs.length > 0 && !this._pomeloIsReconnect)
                GameNet_1.default.getInstance().reSendMsgs(pomeloReSendMsgs);
        }
    };
    //清除定时器
    NetMgr.prototype.clearTimer = function () {
        if (this._checkTimer != null) {
            clearTimeout(this._checkTimer);
            this._checkTimer = null;
        }
    };
    //转换消息成带msgindex的格式
    NetMgr.prototype.convertMsg = function (route, data) {
        var words = route.split('.');
        var newRecord = {
            time: Date.now(),
            route: route
        };
        if (words[0] === "http") {
            newRecord.serverType = G_NETTYPE.http;
            newRecord.msg = {
                head: {
                // some property
                },
                body: data
            };
        }
        else {
            newRecord.serverType = G_NETTYPE.pomelo;
            data.msgindex = this._msgIndex;
            newRecord.msg = data;
        }
        this._msgrecords[route] = newRecord;
        this._msgIndex++;
        return newRecord;
    };
    // 消息回复后的处理
    NetMgr.prototype.doneWithRoute = function (route) {
        if (this._msgrecords[route])
            delete this._msgrecords[route];
        ModuleMgr_1.default.getInstance().closeModule("juhua");
    };
    NetMgr._instance = new NetMgr();
    return NetMgr;
}());
exports.default = NetMgr;

cc._RF.pop();