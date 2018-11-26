"use strict";
cc._RF.push(module, 'd38375wxrZBJYTcx09Z8VgF', 'BaseCtrl');
// framework/baseClass/BaseCtrl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("../modules/Emitter");
var ModuleMgr_1 = require("../modules/ModuleMgr");
var LogMgr_1 = require("../modules/LogMgr");
var Loader_1 = require("../modules/Loader");
var BaseCtrl = /** @class */ (function (_super) {
    __extends(BaseCtrl, _super);
    function BaseCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bindedNodes = [];
        _this._clickEnable = true;
        return _this;
    }
    // 发送全局事件
    BaseCtrl.prototype.gemit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = Emitter_1.default.getInstance()).emit.apply(_a, [event].concat(args));
    };
    // 定义网络事件
    BaseCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    // 定义全局事件
    BaseCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    // 注册所有事件
    BaseCtrl.prototype.regAllEvents = function () {
        //注册网络事件
        for (var event in this.n_events) {
            Emitter_1.default.getInstance().on(event, this.n_events[event], this);
        }
        //注册全局事件
        for (var event in this.g_events) {
            Emitter_1.default.getInstance().on(event, this.g_events[event], this);
        }
    };
    /**
     * 打开子模块
     * @param moduleName 模块名
     */
    BaseCtrl.prototype.openSubModule = function (moduleName, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        return ModuleMgr_1.default.getInstance().openSubModule(moduleName, isPublic);
    };
    BaseCtrl.prototype.getPrefabSync = function (moduleName, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        var url = ModuleMgr_1.default.getInstance().getResUrl("prefab", moduleName, isPublic);
        return Loader_1.default.getInstance().getRes(url, cc.Prefab);
    };
    /**
     * 关闭模块
     * @param moduleName 模块名
     */
    BaseCtrl.prototype.closeModule = function (moduleName) {
        ModuleMgr_1.default.getInstance().closeModule(moduleName);
    };
    /**
     * 切换场景
     * @param sceneName 场景名
     */
    BaseCtrl.prototype.switchScene = function (sceneName) {
        ModuleMgr_1.default.getInstance().switchScene(sceneName);
    };
    /**
     * 绑定UI操作
     * @param type 监听的UI操作事件,与引擎一致
     * @param node 响应操作的节点
     * @param callback UI操作事件回调
     * @param opname 操作描述
     */
    BaseCtrl.prototype.connect = function (type, target, callback, opname) {
        var node = target instanceof cc.Node ? target : target.node;
        switch (type) {
            case "click":
                this.bindButton(node, callback, opname);
                break;
            default: this.bindOtherHandle(type, node, callback, opname);
        }
        if (this.bindedNodes.indexOf(node) == -1) {
            this.bindedNodes.push(node);
        }
    };
    BaseCtrl.prototype.bindButton = function (node, callback, opname) {
        var _this = this;
        var btnCb = function (event) {
            if (!_this._clickEnable)
                return;
            _this._clickEnable = false;
            _this.scheduleOnce(function () {
                _this._clickEnable = true;
            }, 0.3);
            LogMgr_1.default.getInstance().addOpreation(opname);
            callback.call(_this, event);
        };
        node.on("click", btnCb, this);
    };
    BaseCtrl.prototype.bindOtherHandle = function (type, node, callback, opname) {
        var _this = this;
        var handleCb = function (event) {
            LogMgr_1.default.getInstance().addOpreation(opname);
            callback.call(_this, event);
        };
        node.on(type, handleCb, this);
    };
    ;
    BaseCtrl.prototype.connectUi = function () {
    };
    BaseCtrl.prototype.initMvc = function (Model, View) {
        // 数据模型
        this.model = new Model();
        // 视图
        this.view = new View(this.model);
        this.ui = this.view.ui;
        // 定义网络事件
        this.defineNetEvents();
        // 定义全局事件
        this.defineGlobalEvents();
        // 注册所有事件
        this.regAllEvents();
        // 绑定ui操作
        this.connectUi();
    };
    /** 移除自己 */
    BaseCtrl.prototype.remove = function () {
        if (this.node && cc.isValid(this.node)) {
            this.node.destroy();
        }
    };
    BaseCtrl.prototype.onDestroy = function () {
        // 移除操作回调
        for (var i = 0; i < this.bindedNodes.length; ++i) {
            var node = this.bindedNodes[i];
            node.targetOff(this);
        }
        delete this.bindedNodes;
        // 移除全局事件监听,网络事件监听
        Emitter_1.default.getInstance().targetOff(this);
        // 移除所有计时器
        this.unscheduleAllCallbacks();
        // 释放数据模型,视图
        delete this.model;
        delete this.view;
    };
    /** 是否是iPhoneX */
    BaseCtrl.prototype.isIPhoneX = function () {
        var size = cc.view.getFrameSize();
        if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE && ((size.width == 2436 && size.height == 1125) || (size.width == 1125 && size.height == 2436))) {
            return true;
        }
        return false;
    };
    /**
     * 重设Canvas设计分辨率
     * @param canvas 需要重设设计分辨率的canvas
     */
    BaseCtrl.prototype.resetDesignResolution = function (canvas) {
        var height = 720;
        var size = cc.view.getFrameSize();
        var proportion = size.width / size.height;
        var width = height * proportion;
        canvas.designResolution = new cc.Size(width, height);
        canvas.fitHeight = true;
        canvas.fitWidth = true;
    };
    return BaseCtrl;
}(cc.Component));
exports.default = BaseCtrl;

cc._RF.pop();