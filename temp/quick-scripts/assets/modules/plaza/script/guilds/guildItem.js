(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/plaza/script/guilds/guildItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '95e72BsLB1KtLSVYvOWW70e', 'guildItem', __filename);
// modules/plaza/script/guilds/guildItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel_1 = require("../../../../framework/baseClass/BaseModel");
var BaseView_1 = require("../../../../framework/baseClass/BaseView");
var BaseCtrl_1 = require("../../../../framework/baseClass/BaseCtrl");
var guildsMgr_1 = require("../../../../manager/public/guildsMgr");
/*
author: 汤凯
日期:2018-11-19 15:25:14
*/
//MVC模块,
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ctrl;
//模型，数据处理
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this.guildItem = null;
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
            spr_guildIcon: ctrl.spr_guildIcon,
            spr_guildRankIcon: ctrl.spr_guildRankIcon,
            lbl_guildName: ctrl.lbl_guildName,
            lbl_guildPlayerCount: ctrl.lbl_guildPlayerCount,
            lbl_guildEnterType: ctrl.lbl_guildEnterType,
            lbl_guildRankName: ctrl.lbl_guildRankName,
        };
        _this.node = ctrl.node;
        _this.initUi();
        return _this;
    }
    //初始化ui
    View.prototype.initUi = function () {
    };
    View.prototype.showGuildItem = function () {
        if (this.model.guildItem) {
            this.ui.lbl_guildName.string = this.model.guildItem.name;
            this.ui.lbl_guildPlayerCount.string = this.model.guildItem.memberAmount + "/";
            this.ui.lbl_guildEnterType.string = this.model.guildItem.enterType;
            this.ui.lbl_guildRankName.string = this.model.guildItem.neededStage;
            // this.ui.spr_guildIcon
            // this.ui.spr_guildRankIcon 
        }
    };
    return View;
}(BaseView_1.default));
//c, 控制
var GuildsItemCtrl = /** @class */ (function (_super) {
    __extends(GuildsItemCtrl, _super);
    function GuildsItemCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //这边去声明ui组件
        _this.spr_guildIcon = null;
        _this.spr_guildRankIcon = null;
        _this.lbl_guildName = null;
        _this.lbl_guildPlayerCount = null;
        _this.lbl_guildEnterType = null;
        _this.lbl_guildRankName = null;
        return _this;
    }
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    GuildsItemCtrl.prototype.onLoad = function () {
        // 控制器
        ctrl = this;
        // 创建mvc模式中模型和视图
        this.initMvc(Model, View);
    };
    //定义网络事件
    GuildsItemCtrl.prototype.defineNetEvents = function () {
        this.n_events = {};
    };
    //定义全局事件
    GuildsItemCtrl.prototype.defineGlobalEvents = function () {
        this.g_events = {};
    };
    //绑定操作的回调
    GuildsItemCtrl.prototype.connectUi = function () {
        this.connect("click", this.node.getChildByName('clippingNode'), this.guildItemClick.bind(this), "点击公会界面");
    };
    GuildsItemCtrl.prototype.updateAndShowGuildItem = function (data) {
        console.log('updateAndShowGuildItem', data);
        this.model.guildItem = data;
        this.view.showGuildItem();
    };
    GuildsItemCtrl.prototype.guildItemClick = function () {
        //请求明细数据
        guildsMgr_1.default.getInstance().reqGuildDetail(this.model.guildItem.id);
        guildsMgr_1.default.getInstance().reqGuildMembers(this.model.guildItem.id, 0);
        console.log('guildItemClick');
        this.closeModule("guilds");
        this.openSubModule('guildsInfo');
    };
    //网络事件回调begin
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
    //end
    // update(dt) {}
    GuildsItemCtrl.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    __decorate([
        property(cc.Sprite)
    ], GuildsItemCtrl.prototype, "spr_guildIcon", void 0);
    __decorate([
        property(cc.Sprite)
    ], GuildsItemCtrl.prototype, "spr_guildRankIcon", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsItemCtrl.prototype, "lbl_guildName", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsItemCtrl.prototype, "lbl_guildPlayerCount", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsItemCtrl.prototype, "lbl_guildEnterType", void 0);
    __decorate([
        property(cc.Label)
    ], GuildsItemCtrl.prototype, "lbl_guildRankName", void 0);
    GuildsItemCtrl = __decorate([
        ccclass
    ], GuildsItemCtrl);
    return GuildsItemCtrl;
}(BaseCtrl_1.default));
exports.default = GuildsItemCtrl;

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
        //# sourceMappingURL=guildItem.js.map
        