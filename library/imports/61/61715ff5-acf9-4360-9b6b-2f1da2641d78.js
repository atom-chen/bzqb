"use strict";
cc._RF.push(module, '61715/1rPlDYJtrLx2iZB14', 'Emitter');
// framework/modules/Emitter.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件管理模块
 */
var Emitter = /** @class */ (function () {
    function Emitter() {
        this._routeList = [];
        this._callbacks = {};
    }
    Emitter.getInstance = function () {
        return Emitter._instance;
    };
    Emitter.prototype.registerRoute = function (route) {
        this._routeList.push(route);
    };
    Emitter.prototype.unregisterRoute = function (listener) {
        var index = this._routeList.indexOf(listener);
        if (~index)
            this._routeList.splice(index, 1);
    };
    Emitter.prototype.dealNetRoute = function (event, msg) {
        for (var i = 0; i < this._routeList.length; ++i) {
            this._routeList[i].dealResp(event, msg);
        }
    };
    // 注册一个事件
    Emitter.prototype.on = function (event, callback, listener) {
        (this._callbacks[event] = this._callbacks[event] || [])
            .push({ callback: callback, listener: listener });
        return this._callbacks[event].length;
    };
    Emitter.prototype.once = function (event, callback, listener) {
        var _this = this;
        var onceCb = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(event, onceCb);
            callback.apply(listener, args);
        };
        return this.on(event, onceCb, listener);
    };
    // 发送一个事件
    Emitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callbacks = this._callbacks[event];
        if (callbacks) {
            for (var i = 0; i < callbacks.length; ++i) {
                var item = callbacks[i];
                item.callback.apply(item.listener, args);
            }
            return true;
        }
        // 没有该事件的监听
        return false;
    };
    Emitter.prototype.off = function (event, listener) {
        var callbacks = this._callbacks[event];
        if (callbacks) {
            var index = this._indexOf(callbacks, listener);
            while (~index) {
                callbacks.splice(index, 1);
                index = this._indexOf(callbacks, listener);
            }
        }
    };
    Emitter.prototype.targetOff = function (listener) {
        for (var event in this._callbacks) {
            this.off(event, listener);
        }
    };
    Emitter.prototype.removeListener = function (event) {
        if (typeof event !== "undefined") {
            if (this._callbacks[event])
                delete this._callbacks[event];
        }
        else {
            this._callbacks = {};
        }
    };
    Emitter.prototype._indexOf = function (arr, obj) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].listener === obj)
                return i;
        }
        return -1;
    };
    Emitter._instance = new Emitter();
    return Emitter;
}());
exports.default = Emitter;

cc._RF.pop();