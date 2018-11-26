"use strict";
cc._RF.push(module, '4ca4fkt561Ojpvg6/UGNCze', 'fightNetMgr');
// modules/game/script/net/fightNetMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
// import pomeloClass from "../lib/hkpomelo";
var pomeloClass = require("hkpomelo");
/*
author: 黄凯
日期:2018-11-19
*/
var pomelo = new pomeloClass();
// let host = "127.0.0.1";
// let wsType = "wss";
// // let host = "118.25.127.17";
// let host = "wxgame.088.com/jdqsnode";
// let port = "";
// let wsType = "wss";
// let host = "wxgame.088.com";
// let port = "2014";
var host = "192.168.30.41";
var wsType = "ws";
var port = "4100";
var route = {
    gate: 'gate.entry.testReq',
    // 进入大厅
    enter: 'connector.entry.testLogin',
    // 房间
    roomOrder: "match.match.roomOrder",
    // 开始匹配
    match: "match.match.match",
    // 停止匹配
    stopMatch: "match.match.stopMatch",
    // 发送帧数据
    send: "fight.fight.send",
    // 玩家更新自身状态
    state: "fight.fight.state",
};
// 发送房间操作
var order = {
    // 创建房间
    createRoom: 1,
    // 加入房间
    joinInRoom: 2,
    // 准备
    readyInRoom: 3,
    // 开始游戏
    startGame: 4,
    // 踢出玩家
    kickPlayer: 5,
    // 主动退出房间
    leaveRoom: 6,
};
// 发送战斗状态
var oprMsg = {
    // 准备
    ready: 1,
    // 重连
    reConnect: 2,
    // 游戏结束
    gameOver: 3,
    // 玩家放弃游戏
    giveup: 4,
};
// 接收服务器事件
var events = {
    // 服务器推送帧给玩家
    onFightFrame: "onFightFrame",
    // 游戏过程中的玩家状态
    onFightState: "onFightState",
    // 开始匹配
    onMatch: "onMatch",
    // 匹配状态 客户端监听组队状态
    matchState: "matchState",
    // 匹配成功 客户端监听匹配成功
    matchSuccess: "matchSuccess",
};
// 接收组队状态
var matchProtocol = {
    // 玩家准备
    ready: 1,
    // 有玩家加入
    joinIn: 2,
    // 有玩家掉线
    down: 3,
    // 有玩家退出
    giveup: 4,
    // 房间已经解散
    destroy: 5,
    // 自己被踢了
    beKick: 6,
    // 游戏开始
    gameStart: 7,
};
// 接收战斗状态 
var fightProtocol = {
    // 有玩家准备（可以忽略不做）
    ready: 1,
    // 有玩家断线重连
    reConnect: 2,
    // 有玩家重新上线
    online: 3,
    // 有玩家掉线
    down: 4,
    // 玩家放弃比赛
    giveup: 5,
    // 游戏结束 结算数据
    gameOver: 6,
};
var pomeloMgr = /** @class */ (function () {
    function pomeloMgr() {
    }
    pomeloMgr.prototype.init = function (obj) {
        console.log(obj);
        for (var eventName in obj) {
            pomelo.on(eventName, obj[eventName]);
        }
        console.log(pomelo);
        // pomelo.on(events.onMatch, onMatch);
        // pomelo.on(events.onFightState, onFightState);
        // pomelo.on(events.onFightFrame, onFightFrame);
        // pomelo.on(events.matchState, matchState);
        // pomelo.on(events.matchSuccess, matchSuccess);
    };
    pomeloMgr.prototype.off = function () {
        pomelo.off(events.onMatch);
        pomelo.off(events.onFightState);
        pomelo.off(events.onFightFrame);
        pomelo.off(events.matchState);
        pomelo.off(events.matchSuccess);
    };
    pomeloMgr.prototype.connect = function (cb) {
        var self = this;
        pomelo.init({
            host: host,
            port: port,
            wsType: wsType
        }, function () {
            var token = Math.floor(Math.random() * 10000) + "", openid = Math.floor(Math.random() * 10000) + "";
            pomelo.request(route.gate, {
                openid: openid
            }, function (data) {
                // console.log("223",data);
                pomelo.disconnect(function () {
                    pomelo.init({
                        wsType: wsType,
                        host: data.host,
                        port: data.port
                    }, function (data2) {
                        pomelo.request(route.enter, {
                            token: token,
                            openid: openid
                        }, function (data3) {
                            console.log(data3);
                            cb && cb(data3);
                        });
                    });
                });
            });
        });
    };
    pomeloMgr.prototype.match = function (role, cb) {
        pomelo.request(route.match, {
            role: role
        }, function (data) {
            cb && cb(data);
        });
    };
    pomeloMgr.prototype.stopMatch = function (cb) {
        pomelo.request(route.stopMatch, {}, function (data) {
            cb && cb(data);
        });
    };
    pomeloMgr.prototype.send = function (msg) {
        // pomelo.request(route.send, msg, (data) => {
        //     cb && cb(data);
        // });
        pomelo.notify(route.send, msg);
    };
    //------------房间操作-----
    // 创建房间
    pomeloMgr.prototype.creatRoom = function (role, cb) {
        pomelo.request(route.roomOrder, {
            state: order.createRoom,
            role: role
        }, function (data) {
            cb && cb(data);
        });
    };
    // 加入房间
    pomeloMgr.prototype.joinRoom = function (roomId, role, cb) {
        pomelo.request(route.roomOrder, {
            state: order.joinInRoom,
            roomId: roomId,
            role: role
        }, function (data) {
            cb && cb(data);
        });
    };
    // 准备
    pomeloMgr.prototype.prepare = function (cb) {
        pomelo.request(route.roomOrder, {
            state: order.readyInRoom
        }, function (data) {
            cb && cb(data);
        });
    };
    // 开始游戏
    pomeloMgr.prototype.startGame = function (cb) {
        pomelo.request(route.roomOrder, {
            state: order.startGame
        }, function (data) {
            cb && cb(data);
        });
    };
    // 踢出玩家
    pomeloMgr.prototype.kickPlayer = function (seatId, cb) {
        pomelo.request(route.roomOrder, {
            state: order.kickPlayer,
            seatId: seatId
        }, function (data) {
            cb && cb(data);
        });
    };
    // 退出房间
    pomeloMgr.prototype.leaveRoom = function (cb) {
        pomelo.request(route.roomOrder, {
            state: order.leaveRoom
        }, function (data) {
            cb && cb(data);
        });
    };
    //----------战斗过程中操作-------
    //发送准备开始
    pomeloMgr.prototype.gameParpare = function (cb) {
        pomelo.request(route.state, {
            state: oprMsg.ready
        }, function (data) {
            cb && cb(data);
        });
    };
    //发送游戏结束 提交成绩
    pomeloMgr.prototype.gameOver = function (winType, cb) {
        pomelo.request(route.state, {
            state: oprMsg.gameOver,
            winType: winType
        }, function (data) {
            cb && cb(data);
        });
    };
    //发送放弃游戏
    pomeloMgr.prototype.gameGiveUp = function (cb) {
        pomelo.request(route.state, {
            state: oprMsg.giveup
        }, function (data) {
            cb && cb(data);
        });
    };
    pomeloMgr.prototype.roomTest = function (cb) {
        // pomelo.request(route.roomOrder, {
        //     state: 8
        // }, (data) => {
        //     if (!this.errorCode(data)) return;
        //     cb && cb(data);
        // });
    };
    pomeloMgr.prototype.gameTest = function (cb) {
        pomelo.request(route.state, {
            state: 7
        }, function (data) {
            cb && cb(data);
        });
    };
    return pomeloMgr;
}());
exports.default = pomeloMgr;

cc._RF.pop();