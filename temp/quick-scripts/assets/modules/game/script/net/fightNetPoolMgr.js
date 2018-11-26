(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/net/fightNetPoolMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a829c/PUgZGBKJGQ79YoShv', 'fightNetPoolMgr', __filename);
// modules/game/script/net/fightNetPoolMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
/*
author: 黄凯
日期:2018-11-19
*/
// 帧数管理器
var netFrameMgr = /** @class */ (function () {
    function netFrameMgr() {
        this.poolNum = 1;
        this.frameFps = 20;
        this.frameTime = Math.round(1000 / (this.frameFps - 4));
        // console.log("this.frameTime",this.frameTime)
        this.frameList = [];
        this.startTime = 0;
        this.isShowLag = false;
        this.hisTroyFrameCount = 0;
    }
    netFrameMgr.prototype.addCount = function () {
        this.hisTroyFrameCount++;
    };
    netFrameMgr.prototype.addFrame = function (frame) {
        this.frameList.push(frame);
    };
    // 获取帧数据
    netFrameMgr.prototype.getLastFrame = function () {
        return this.frameList.shift();
    };
    // 获取帧长度
    netFrameMgr.prototype.getFrameCount = function () {
        return this.frameList.length;
    };
    netFrameMgr.prototype.getIsShowLag = function () {
        return this.isShowLag;
    };
    // 返回是否可以循环操作
    netFrameMgr.prototype.checkCanWhile = function () {
        return this.getFrameCount() > this.poolNum;
    };
    // 检测是否可以更新逻辑 
    netFrameMgr.prototype.getCanDoNetFrame = function (dt) {
        this.startTime += dt * 1000;
        var frameCount = this.getFrameCount();
        var candoFrame = false;
        // 显示菊花
        // if (this.lagTime > 10 || frameCount > 10) {
        //     if (!this.nowIsShow) {
        //         // 这里网络延迟需要显示菊花
        //         this.isShowLag = true;
        //         // this.isShowFlower = true;
        //     }
        // }
        // 优化缓冲
        if (this.startTime >= this.frameTime) {
            this.startTime -= this.frameTime;
            if (!this.gameStart && frameCount >= this.poolNum) {
                this.gameStart = true;
            }
            // if (this.isShowFlower) {
            //     this.isShowFlower = false;
            //     return;
            // }
            // 数据发送
            if (this.gameStart && frameCount > 0) {
                this.lagTime = 0;
                candoFrame = true;
                this.addCount();
                // this.doFrame();
                // while (this.frameList.length > this.poolNum) {
                //     this.doFrame();
                // }
                // 隐藏菊花
                this.isShowLag = false;
                // this.hideFlower();
            }
            else if (this.gameStart && frameCount === 0) {
                this.lagTime++;
            }
        }
        return candoFrame;
    };
    return netFrameMgr;
}());
exports.default = netFrameMgr;

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
        //# sourceMappingURL=fightNetPoolMgr.js.map
        