"use strict";
cc._RF.push(module, 'd44ca3ePXFCWLMwNFOi//Xy', 'rankInfo');
// modules/plaza/script/rank/rankInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var tableMgr_1 = require("../../../../manager/public/tableMgr");
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
            spr_rank: ctrl.spr_rank,
            spr_head: ctrl.spr_head,
            spr_kingIco: ctrl.spr_kingIco,
            spr_LevelIco: ctrl.spr_LevelIco,
            lbl_playerName: ctrl.lbl_playerName,
            lbl_guildName: ctrl.lbl_guildName,
            lbl_stageName: ctrl.lbl_stageName,
            lbl_startCount: ctrl.lbl_startCount,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.refreshMyRankInfo = function () {
        console.log('refreshMyRankInfo', this.model.myRankInfo);
        if (this.model.myRankInfo) {
            this.ui.lbl_playerName.string = this.model.myRankInfo.nickname;
            this.ui.lbl_guildName.string = this.model.myRankInfo.guildName;
            var card = tableMgr_1.default.getInstance().search('duanwei_duanwei', { stage: this.model.myRankInfo.stageIndex });
            this.ui.lbl_stageName.string = card.name;
            this.ui.lbl_startCount.string = this.model.myRankInfo.stageScore;
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var RankInfoCtrl = /** @class */ (function (_super) {
    __extends(RankInfoCtrl, _super);
    function RankInfoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.spr_rank = null;
        _this.spr_head = null;
        _this.spr_kingIco = null;
        _this.spr_LevelIco = null;
        _this.lbl_playerName = null;
        _this.lbl_guildName = null;
        _this.lbl_stageName = null;
        _this.lbl_startCount = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    RankInfoCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    RankInfoCtrl.prototype.defineNetEvents = function () {
        this.n_events = {
            'search.entry.reqMyRankInfo': this.search_entry_reqMyRankInfo,
        };
    };
    //定义全局事件
    RankInfoCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    RankInfoCtrl.prototype.connectUi = function () {
    };
    RankInfoCtrl.prototype.search_entry_reqMyRankInfo = function () {
    };
    RankInfoCtrl.prototype.updateAndRefreshMyRankInfo = function (data) {
        this.model.myRankInfo = data;
        this.view.refreshMyRankInfo();
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    RankInfoCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], RankInfoCtrl.prototype, "spr_rank", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankInfoCtrl.prototype, "spr_head", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankInfoCtrl.prototype, "spr_kingIco", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankInfoCtrl.prototype, "spr_LevelIco", void 0);
    __decorate([
        property(cc.Label)
    ], RankInfoCtrl.prototype, "lbl_playerName", void 0);
    __decorate([
        property(cc.Label)
    ], RankInfoCtrl.prototype, "lbl_guildName", void 0);
    __decorate([
        property(cc.Label)
    ], RankInfoCtrl.prototype, "lbl_stageName", void 0);
    __decorate([
        property(cc.Label)
    ], RankInfoCtrl.prototype, "lbl_startCount", void 0);
    RankInfoCtrl = __decorate([
        ccclass
    ], RankInfoCtrl);
    return RankInfoCtrl;
}(BaseCtrl_1.default));
exports.default = RankInfoCtrl;

cc._RF.pop();