"use strict";
cc._RF.push(module, '2a900JhK79Kz4J7pl7YxoWX', 'shopMgr');
// manager/public/shopMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseMgr_1 = require("../../framework/baseClass/BaseMgr");
var dataids_1 = require("../../framework/net/dataids");
var effectMgr_1 = require("./effectMgr");
var tableMgr_1 = require("./tableMgr");
var enums_1 = require("../enums");
var effectMgr = effectMgr_1.default.getInstance();
var tableMgr = tableMgr_1.default.getInstance();
var ShopMgr = /** @class */ (function (_super) {
    __extends(ShopMgr, _super);
    function ShopMgr() {
        var _this = _super.call(this) || this;
        _this.shopState = null;
        _this.isInitGuild = false;
        _this.isInitShop = false;
        _this.shopTabal = null;
        _this.boxShop = [];
        _this.goldShop = [];
        _this.crystalShop = [];
        _this.diamondShop = [];
        _this.cardShop = [];
        _this.cardShopRefreshTime = null;
        _this.refreshCount = null;
        _this.guildShopInfo = null;
        _this.routes = {
            'plaza.data.reqShopInfo': _this.plaza_data_reqShopInfo,
            'plaza.shop.refreshShop': _this.plaza_shop_refreshShop,
            'plaza.shop.buyGoods': _this.plaza_shop_buyGoods,
        };
        return _this;
    }
    ShopMgr.prototype.getGuildShopInfo = function () {
        return this.guildShopInfo;
    };
    ShopMgr.prototype.plaza_data_reqShopInfo = function (msg) {
        console.log("--------商店数据-------");
        this.initData();
        var shopType = msg.getDataByType(37);
        var shopTimes = msg.getDataByType(38);
        var shopInfo = msg.getDataByType(36);
        console.log(shopType, shopTimes, enums_1.enums.Shop_Card);
        switch (shopType) {
            case enums_1.enums.Shop_Card:
                this.cardShopUpdate(shopInfo, shopTimes);
                this.isInitShop = true;
                console.log("--------神秘商店-------", shopInfo);
                break;
            case enums_1.enums.GuildShop_Card:
                this.isInitGuild = true;
                this.guildShopInfo = shopInfo;
                console.log("--------公会商店-------", shopInfo);
                break;
            default:
                break;
        }
    };
    ShopMgr.prototype.buyGoods = function (type, id) {
        var route = 'plaza.shop.buyGoods';
        this.send_msg(route, { 'type': type, 'id': id });
    };
    ShopMgr.prototype.plaza_shop_buyGoods = function (msg) {
        console.log("plaza_shop_buyGoods", msg);
    };
    ShopMgr.prototype.initData = function () {
        if (!this.shopTabal) {
            this.shopTabal = this.getConfigSync("shangdian_shop").json;
            cc.log("----商店表格----", this.shopTabal);
            for (var i = 0; i < this.shopTabal.length; i++) {
                switch (this.shopTabal[i].type) {
                    case 1:
                        this.boxShop.push(this.shopTabal[i]);
                        break;
                    case 2:
                        this.goldShop.push(this.shopTabal[i]);
                        break;
                    case 3:
                        this.crystalShop.push(this.shopTabal[i]);
                        break;
                    case 4:
                        this.cardShop.push(this.shopTabal[i]);
                        break;
                    case 5:
                        this.diamondShop.push(this.shopTabal[i]);
                        break;
                    default:
                        break;
                }
            }
        }
    };
    ShopMgr.prototype.cardShopUpdate = function (info, shopTimes) {
        console.log(info);
        this.cardShopRefreshTime = info.refreshTime;
        console.log(this.cardShopRefreshTime);
        this.refreshCount = info.refreshCount;
        for (var i = 0; i < this.cardShop.length; i++) {
            var obj = this.cardShop[i];
            obj.shopTimes = shopTimes[i + 1];
            obj.amount = info.items[i + 1].amount;
            obj.card = tableMgr.search('teji_teji', { id: info.items[i + 1].itemId });
            obj.name = obj.card.name;
            obj.price = info.items[i + 1].price;
            obj.discount = info.items[i + 1].discount; //折扣
            obj.priceType = info.items[i + 1].priceType; // 0金币 1水晶
        }
        console.log(this.cardShop);
    };
    ShopMgr.prototype.reqShopInfo = function (shopType) {
        if (shopType === void 0) { shopType = enums_1.enums.Shop_Card; }
        var route = 'plaza.data.reqShopInfo';
        this.send_msg(route, { 'shopType': shopType });
    };
    //新增刷新商店的参数
    ShopMgr.prototype.reqRefreshShop = function (shopType) {
        if (shopType === void 0) { shopType = enums_1.enums.Shop_Card; }
        var route = 'plaza.shop.refreshShop';
        this.send_msg(route, { 'shopType': shopType });
    };
    ShopMgr.prototype.plaza_shop_refreshShop = function (msg) {
        var shopType = msg.getDataByType(37);
        var shopTimes = msg.getDataByType(dataids_1.dataids.ID_USER_MONEYFEN);
        var shopInfo = msg.getDataByType(36);
        switch (shopType) {
            case enums_1.enums.Shop_Card:
                console.log("--------神秘商店-------", shopInfo);
                this.cardShopUpdate(shopInfo, 0);
                break;
            case enums_1.enums.GuildShop_Card:
                console.log("--------公会商店-------", shopInfo);
                this.guildShopInfo = shopInfo;
                break;
            default:
                break;
        }
    };
    ShopMgr.prototype.setShopState = function (name) {
        this.shopState = name;
    };
    ShopMgr.getInstance = function () {
        if (ShopMgr._instance == null) {
            ShopMgr._instance = new ShopMgr();
        }
        return ShopMgr._instance;
    };
    // 单例处理
    ShopMgr._instance = null;
    return ShopMgr;
}(BaseMgr_1.default));
exports.default = ShopMgr;

cc._RF.pop();