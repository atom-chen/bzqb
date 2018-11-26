(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/rank/ranks.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2fc56mnSdtDjbFU/csEqGzN', 'ranks', __filename);
// modules/plaza/script/rank/ranks.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var rankMgr_1 = require("../../../../manager/public/rankMgr");
/*
author: 陈斌杰
日期:2018-11-09 15:25:39
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.rankList = null;
        _this.nodeContentHeight = 416;
        _this.myRankInfo = null;
        return _this;
    }
    return Model;
}(BaseModel_1.default));
//视图, 界面显示或动画，在这里完成
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(model) {
        var _this = _super.call(this, model) || this;
        _this.ui = {
            btn_close: ctrl.btn_close,
            pref_rankInfo: ctrl.pref_rankInfo,
            scroll_bar: ctrl.scroll_bar,
            node_content: ctrl.node_content,
            node_myInfoContent: ctrl.node_myInfoContent,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.refreshRankList = function () {
        // this.ui.node_content.destroyAllChildren();
        if (this.model.rankList) {
            this.ui.node_content.setContentSize(this.ui.node_content.getContentSize().width, this.model.nodeContentHeight * (this.model.rankList.page + 1));
            for (var rankListIdx = 0; rankListIdx < this.model.rankList.rankList.length; rankListIdx++) {
                var rankData = this.model.rankList.rankList[rankListIdx];
                var rankInfo = cc.instantiate(this.ui.pref_rankInfo);
                this.ui.node_content.addChild(rankInfo);
                rankInfo.getComponent('rankInfo').updateAndRefreshMyRankInfo(rankData);
            }
        }
    };
    View.prototype.refreshMyRankInfo = function () {
        if (this.model.myRankInfo) {
            var rankData = this.model.myRankInfo.rankInfo;
            var rankInfo = cc.instantiate(this.ui.pref_rankInfo);
            this.ui.node_myInfoContent.addChild(rankInfo);
            rankInfo.getComponent('rankInfo').updateAndRefreshMyRankInfo(rankData);
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RanksCtrl = /** @class */ (function (_super) {
    __extends(RanksCtrl, _super);
    function RanksCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.btn_close = null;
        _this.pref_rankInfo = null;
        _this.scroll_bar = null;
        _this.node_content = null;
        _this.node_myInfoContent = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RanksCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
        rankMgr_1.default.getInstance().reqRank();
        rankMgr_1.default.getInstance().reqMyRankInfo();
    };
    //定义网络事件
    RanksCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.reqRank': this.search_entry_reqRank,
            'search.entry.reqMyRankInfo': this.search_entry_reqMyRankInfo,
        };
    };
    //定义全局事件
    RanksCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    RanksCtrl.prototype.connectUi = function () {
        var _this = this;
        this.connect("click", this.ui.btn_close, function () {
            rankMgr_1.default.getInstance().clearData();
            _this.closeModule("ranks");
        }, "关闭排行榜界面");
        this.connect("scroll-to-bottom", this.ui.scroll_bar.node, this.scrollToBottom.bind(this), "拉到末尾");
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    RanksCtrl.prototype.scrollToBottom = function () {
        rankMgr_1.default.getInstance().reqRank();
    };
    RanksCtrl.prototype.search_entry_reqRank = function () {
        this.model.rankList = rankMgr_1.default.getInstance().getRankList();
        if (this.model.rankList && this.model.rankList.rankList.length > 0) {
            this.view.refreshRankList();
        }
    };
    RanksCtrl.prototype.search_entry_reqMyRankInfo = function () {
        this.model.myRankInfo = rankMgr_1.default.getInstance().gerMyRankInfo();
        this.view.refreshMyRankInfo();
    };
    RanksCtrl.prototype.onDestroy = function () {
        rankMgr_1.default.getInstance().clearData();
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Button)
    ], RanksCtrl.prototype, "btn_close", void 0);
    __decorate([
        property(cc.Prefab)
    ], RanksCtrl.prototype, "pref_rankInfo", void 0);
    __decorate([
        property(cc.ScrollView)
    ], RanksCtrl.prototype, "scroll_bar", void 0);
    __decorate([
        property(cc.Node)
    ], RanksCtrl.prototype, "node_content", void 0);
    __decorate([
        property(cc.Node)
    ], RanksCtrl.prototype, "node_myInfoContent", void 0);
    RanksCtrl = __decorate([
        ccclass
    ], RanksCtrl);
    return RanksCtrl;
}(BaseCtrl_1.default));
exports.default = RanksCtrl;

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
        //# sourceMappingURL=ranks.js.map
        