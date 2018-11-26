(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/public/script/loading.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c88fa1CvgxMLo6YOeRqhHuA', 'loading', __filename);
// modules/public/script/loading.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../framework/baseClass/BaseCtrl");
var Loader_1 = require("../../../framework/modules/Loader");
var GameNet_1 = require("../../../framework/modules/GameNet");
/*
author: 张志强
日期:2018-11-05 15:03:40
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.routeArr = null;
        _this.totalRouteLen = 0;
        _this.curRouteLen = 0;
        _this.curResPaths = null;
        _this.curProgress = 0;
        return _this;
    }
    Model.prototype.setRouteArr = function (arr) {
        this.routeArr = arr;
        this.totalRouteLen = arr.length;
    };
    Model.prototype.setResPaths = function (obj) {
        this.curResPaths = obj;
    };
    Model.prototype.routeReceived = function () {
        this.curRouteLen += 1;
    };
    Model.prototype.addProgress = function (p) {
        this.curProgress += p;
    };
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            //在这里声明ui
            progressBar: ctrl.progressBar
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
        this.addGrayLayer(false);
    };
    View.prototype.refreshProgress = function () {
        this.ui.progressBar.progress = this.model.curProgress;
    };
    return View;
}(BaseView_1.default));
//c, 控制
var LoadingCtrl = /** @class */ (function (_super) {
    __extends(LoadingCtrl, _super);
    function LoadingCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.progressBar = null;
        //声明ui组件end
        //这是ui组件的map,将ui和控制器或试图普通变量分离
        _this._completeCB = null;
        _this.needLoadData = false;
        return _this;
    }
    LoadingCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    LoadingCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    LoadingCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    LoadingCtrl.prototype.connectUi = function () {
    };
    // 网络事件回调begin
    LoadingCtrl.prototype.routeReceived = function () {
        this.model.routeReceived();
        var num = this.model.curRouteLen / this.model.totalRouteLen;
        this.addProgress(num);
        if (num >= 1)
            this._complete();
    };
    // end
    // 全局事件回调begin
    // end
    // 按钮或任何控件操作的回调begin
    // end
    LoadingCtrl.prototype.setPreLoad = function (obj) {
        var resPaths = obj.resPaths, routeArr = obj.routeArr, complete = obj.complete;
        this.model.setResPaths(resPaths);
        if (routeArr) {
            var len = routeArr.length;
            for (var i = 0; i < len; ++i) {
                this.n_events[routeArr[i]] = this.routeReceived;
            }
            this.regAllEvents();
            this.model.setRouteArr(routeArr);
            this.needLoadData = true;
        }
        this._completeCB = complete;
        this._preLoadRes();
    };
    LoadingCtrl.prototype._preLoadData = function () {
        for (var i = 0; i < this.model.totalRouteLen; ++i) {
            GameNet_1.default.getInstance().send_msg(this.model.routeArr[i]);
        }
    };
    LoadingCtrl.prototype._preLoadRes = function () {
        var _this = this;
        var paths = [];
        for (var k in this.model.curResPaths) {
            var type = null;
            switch (k) {
                case "prefab":
                    type = cc.Prefab;
                    break;
                case "image":
                    type = cc.SpriteFrame;
                    break;
                case "config":
                    type = cc.JsonAsset;
                    break;
            }
            for (var s in this.model.curResPaths[k]) {
                paths.push({ url: this.model.curResPaths[k][s], type: type });
            }
        }
        Loader_1.default.getInstance().loadQueue({
            paths: paths,
            progress: function (num) {
                _this.addProgress(num);
            },
            complete: function () {
                if (_this.needLoadData) {
                    _this._preLoadData();
                }
                else {
                    _this._complete();
                }
            }
        });
    };
    LoadingCtrl.prototype.addProgress = function (num) {
        if (this.needLoadData)
            num /= 2;
        this.model.addProgress(num);
        this.view.refreshProgress();
    };
    LoadingCtrl.prototype._complete = function () {
        this.remove();
        this._completeCB();
    };
    // update(dt) {}
    LoadingCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.ProgressBar)
    ], LoadingCtrl.prototype, "progressBar", void 0);
    LoadingCtrl = __decorate([
        ccclass
    ], LoadingCtrl);
    return LoadingCtrl;
}(BaseCtrl_1.default));
exports.default = LoadingCtrl;

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
        //# sourceMappingURL=loading.js.map
        