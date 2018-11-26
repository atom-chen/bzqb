// import pomeloClass from "../lib/hkpomelo";
let pomeloClass = require("hkpomelo");

/*
author: 黄凯
日期:2018-11-19
*/
let pomelo = new pomeloClass();

// let host = "127.0.0.1";

// let wsType = "wss";
// // let host = "118.25.127.17";
// let host = "wxgame.088.com/jdqsnode";
// let port = "";

// let wsType = "wss";
// let host = "wxgame.088.com";
// let port = "2014";

let host = "192.168.30.41";
let wsType = "ws";
let port = "4100";

let route = {
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
let order = {
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
let oprMsg = {
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
let events = {
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
let matchProtocol = {
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
let fightProtocol = {
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
class pomeloMgr {
    init(obj) {
        console.log(obj);
        for(let eventName in obj){
            pomelo.on(eventName, obj[eventName]);
        }
        console.log(pomelo);
        // pomelo.on(events.onMatch, onMatch);
        // pomelo.on(events.onFightState, onFightState);
        // pomelo.on(events.onFightFrame, onFightFrame);
        // pomelo.on(events.matchState, matchState);
        // pomelo.on(events.matchSuccess, matchSuccess);
    }

    off() {
        pomelo.off(events.onMatch);
        pomelo.off(events.onFightState);
        pomelo.off(events.onFightFrame);
        pomelo.off(events.matchState);
        pomelo.off(events.matchSuccess);
    }

    connect(cb) {
        let self = this;
        pomelo.init({
            host: host,
            port: port,
            wsType: wsType
        }, function () {
            let token = Math.floor(Math.random()*10000)+"", 
            openid = Math.floor(Math.random()*10000)+"";
            pomelo.request(route.gate, {
                openid: openid
            }, (data) => {
                // console.log("223",data);
                pomelo.disconnect(() => {
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
            })
        })
    }
    match(role, cb) {
        pomelo.request(route.match, {
            role: role
        }, (data) => {
            cb && cb(data);
        });
    }
    stopMatch(cb) {
        pomelo.request(route.stopMatch, {}, (data) => {
            cb && cb(data);
        });
    }
    send(msg) {
        // pomelo.request(route.send, msg, (data) => {
        //     cb && cb(data);
        // });
        pomelo.notify(route.send, msg);
    }
    //------------房间操作-----
    // 创建房间
    creatRoom(role, cb) {
        pomelo.request(route.roomOrder, {
            state: order.createRoom,
            role: role
        }, (data) => {
            cb && cb(data);
        });
    }
    // 加入房间
    joinRoom(roomId, role, cb) {
        pomelo.request(route.roomOrder, {
            state: order.joinInRoom,
            roomId: roomId,
            role: role
        }, (data) => {
            cb && cb(data);
        });
    }
    // 准备
    prepare(cb) {
        pomelo.request(route.roomOrder, {
            state: order.readyInRoom
        }, (data) => {
            cb && cb(data);
        });
    }
    // 开始游戏
    startGame(cb) {
        pomelo.request(route.roomOrder, {
            state: order.startGame
        }, (data) => {
            cb && cb(data);
        });
    }
    // 踢出玩家
    kickPlayer(seatId, cb) {
        pomelo.request(route.roomOrder, {
            state: order.kickPlayer,
            seatId: seatId
        }, (data) => {
            cb && cb(data);
        });
    }
    // 退出房间
    leaveRoom(cb) {
        pomelo.request(route.roomOrder, {
            state: order.leaveRoom
        }, (data) => {
            cb && cb(data);
        });
    }
    //----------战斗过程中操作-------
    //发送准备开始
    gameParpare(cb) {
        pomelo.request(route.state, {
            state: oprMsg.ready
        }, (data) => {
            cb && cb(data);
        });
    }
    //发送游戏结束 提交成绩
    gameOver(winType, cb) {
        pomelo.request(route.state, {
            state: oprMsg.gameOver,
            winType: winType
        }, (data) => {
            cb && cb(data);
        });
    }
    //发送放弃游戏
    gameGiveUp(cb) {
        pomelo.request(route.state, {
            state: oprMsg.giveup
        }, (data) => {
            cb && cb(data);
        });
    }

    roomTest(cb) {
        // pomelo.request(route.roomOrder, {
        //     state: 8
        // }, (data) => {
        //     if (!this.errorCode(data)) return;
        //     cb && cb(data);
        // });
    }

    gameTest(cb) {
        pomelo.request(route.state, {
            state: 7
        }, (data) => {
            cb && cb(data);
        });
    }

}



export default pomeloMgr;