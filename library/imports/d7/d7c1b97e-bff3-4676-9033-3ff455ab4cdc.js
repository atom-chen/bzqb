"use strict";
cc._RF.push(module, 'd7c1bl+v/NGdpAzP/RVq0zc', 'itemMgr');
// manager/public/itemMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var userMgr_1 = require("./userMgr");
var userMgr = userMgr_1.default.getInstance();
var ITEM;
(function (ITEM) {
    ITEM[ITEM["WINKEY"] = 10006] = "WINKEY";
    ITEM[ITEM["CHIP"] = 10005] = "CHIP";
})(ITEM || (ITEM = {}));
var ItemMgr = /** @class */ (function (_super) {
    __extends(ItemMgr, _super);
    function ItemMgr() {
        var _this = _super.call(this) || this;
        _this.itemTable = null; //道具
        _this.winKey = null; //胜利钥匙
        _this.chip = null; //碎片 
        _this.routes = {
            'plaza.data.reqItemList': _this.plaza_data_reqItemList,
        };
        return _this;
    }
    ItemMgr.prototype.plaza_data_reqItemList = function (msg) {
        var ItemInfo = msg.getDataByType(dataids_1.dataids.ID_ALLITEMS);
        console.log("--------道具数据-------", ItemInfo);
        this.itemTable = this.getConfigSync("daoju_daoju").json;
        this.initData(ItemInfo);
    };
    ItemMgr.prototype.selectItem = function (id) {
        for (var i = 0; i < this.itemTable.length; i++) {
            var item = this.itemTable[i];
            if (item.id == id) {
                return item;
            }
        }
        return console.log("没有该道具id");
    };
    ItemMgr.prototype.initData = function (data) {
        for (var i = 0; i < data.length; i++) {
            var obj_data = this.selectItem(data[i].itemId);
            var obj = {
                id_service: data[i].id,
                amount: data[i].amount,
                itemInfo: obj_data,
            };
            switch (data[i].itemId) {
                case ITEM.WINKEY:
                    this.winKey = obj;
                    break;
                case ITEM.CHIP:
                    this.chip = obj;
                    break;
            }
        }
    };
    ItemMgr.getInstance = function () {
        if (ItemMgr._instance == null) {
            ItemMgr._instance = new ItemMgr();
        }
        return ItemMgr._instance;
    };
    // 单例处理
    ItemMgr._instance = null;
    return ItemMgr;
}(BaseMgr_1.default));
exports.default = ItemMgr;

cc._RF.pop();