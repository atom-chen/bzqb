"use strict";
cc._RF.push(module, 'ce659bG0XpPY6cyRj84KMAg', 'BaseGameFight');
// modules/game/script/baseClass/BaseGameFight.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var timeType = {
    timeout: 1,
    interval: 2,
};
/*
author: 黄凯
日期:2018-11-19
*/
// 帧等待
var BaseGameFight = /** @class */ (function (_super) {
    __extends(BaseGameFight, _super);
    function BaseGameFight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._frameList = {};
        _this._frameId = 1;
        return _this;
    }
    // 获取自增长id
    BaseGameFight.prototype.getAndAdd = function () {
        return (this._frameId++).toString();
    };
    // 获取定时任务长度
    BaseGameFight.prototype.getNowMissionCount = function () {
        return Object.keys(this._frameList).length;
    };
    // 启动定时器
    BaseGameFight.prototype.frameRun = function () {
        for (var _frameId in this._frameList) {
            try {
                var obj = this._frameList[_frameId];
                switch (obj["type"]) {
                    case timeType.timeout:
                        if (obj.time <= 0) {
                            obj.func();
                            this.remove(_frameId);
                        }
                        else {
                            obj.time -= 1;
                        }
                        break;
                }
            }
            catch (e) {
                console.log("帧延迟系统错误", e);
            }
        }
    };
    // 绑定timeout事件 
    BaseGameFight.prototype.frameTimeout = function (callbackFun, frameNum) {
        var id = this.getAndAdd();
        var obj = {
            func: callbackFun,
            time: frameNum,
            type: timeType.timeout,
        };
        this._frameList[id] = obj;
        return id;
    };
    // 删除事件
    BaseGameFight.prototype.remove = function (id) {
        if (this._frameList[id]) {
            try {
                this._frameList[id].func = null;
                delete this._frameList[id];
            }
            catch (e) {
                console.log("帧延迟系统错误", e);
            }
        }
    };
    BaseGameFight = __decorate([
        ccclass
    ], BaseGameFight);
    return BaseGameFight;
}(cc.Component));
exports.default = BaseGameFight;

cc._RF.pop();