"use strict";
cc._RF.push(module, '220b7cVHy1DHqSeZ0ckhXRN', 'rankMgr');
// manager/public/rankMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var RankMgr = /** @class */ (function (_super) {
    __extends(RankMgr, _super);
    function RankMgr() {
        var _this = _super.call(this) || this;
        _this.page = -1;
        _this.rankList = null;
        _this.myRankInfo = null;
        _this.routes = {
            'search.entry.reqRank': _this.search_entry_reqRank,
            'search.entry.reqMyRankInfo': _this.search_entry_reqMyRankInfo,
        };
        return _this;
    }
    RankMgr.prototype.clearData = function () {
        this.page = -1;
    };
    RankMgr.prototype.getRankList = function () {
        return this.rankList;
    };
    RankMgr.prototype.gerMyRankInfo = function () {
        return this.myRankInfo;
    };
    RankMgr.getInstance = function () {
        if (RankMgr._instance == null) {
            RankMgr._instance = new RankMgr();
        }
        return RankMgr._instance;
    };
    RankMgr.prototype.reqRank = function (rankType) {
        if (rankType === void 0) { rankType = 0; }
        this.page++;
        var route = 'search.entry.reqRank';
        this.send_msg(route, { 'page': this.page, 'rankType': rankType });
    };
    RankMgr.prototype.reqMyRankInfo = function (rankType) {
        if (rankType === void 0) { rankType = 0; }
        var route = 'search.entry.reqMyRankInfo';
        this.send_msg(route, { 'rankType': rankType });
    };
    RankMgr.prototype.search_entry_reqRank = function (msg) {
        this.rankList = msg.getDataByType(dataids_1.dataids.ID_RANKLIST);
        console.log("search_entry_reqRank", msg, this.rankList);
    };
    RankMgr.prototype.search_entry_reqMyRankInfo = function (msg) {
        this.myRankInfo = msg.getDataByType(dataids_1.dataids.ID_MYRANK_INFO);
        console.log("search_entry_reqMyRankInfo", msg, this.myRankInfo);
    };
    // 单例处理
    RankMgr._instance = null;
    return RankMgr;
}(BaseMgr_1.default));
exports.default = RankMgr;

cc._RF.pop();