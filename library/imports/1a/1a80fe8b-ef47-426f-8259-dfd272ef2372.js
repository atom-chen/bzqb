"use strict";
cc._RF.push(module, '1a80f6L70dCb4JZ39Jy7yNy', 'Cache');
// framework/modules/Cache.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 本地缓存数据管理模块
 */
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.getInstance = function () {
        return Cache._instance;
    };
    Cache.prototype.getItem = function (key) {
        var data = cc.sys.localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };
    Cache.prototype.setItem = function (key, value) {
        var data = JSON.stringify(value);
        cc.sys.localStorage.setItem(key, data);
    };
    Cache.prototype.removeItemByKey = function (key) {
        cc.sys.localStorage.removeItem(key);
    };
    Cache.prototype.clear = function () {
        cc.sys.localStorage.clear();
    };
    //单例处理
    Cache._instance = new Cache();
    return Cache;
}());
exports.default = Cache;

cc._RF.pop();