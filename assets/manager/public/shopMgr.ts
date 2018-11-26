import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import GameNet from "../../framework/modules/GameNet";
import EffectMgr from "./effectMgr";
import TableMgr from "./tableMgr";
import { enums } from "../enums";
let effectMgr = EffectMgr.getInstance();
let tableMgr = TableMgr.getInstance();
export default class ShopMgr extends BaseMgr {
    public shopState: string = null
    public isInitGuild: boolean = false;
    public isInitShop: boolean = false;

    public shopTabal: any = null
    public boxShop: any = []
    public goldShop: any = []
    public crystalShop: any = []
    public diamondShop: any = []
    public cardShop: any = []
    public cardShopRefreshTime: number = null;
    public refreshCount: number = null;
    public guildShopInfo = null;
    constructor() {
        super();
        this.routes = {
            'plaza.data.reqShopInfo': this.plaza_data_reqShopInfo,
            'plaza.shop.refreshShop': this.plaza_shop_refreshShop,
            'plaza.shop.buyGoods': this.plaza_shop_buyGoods,
        };
    }
    getGuildShopInfo() {
        return this.guildShopInfo;
    }
    plaza_data_reqShopInfo(msg: Package): void {
        console.log("--------商店数据-------");
        this.initData();
        let shopType = msg.getDataByType(37);
        let shopTimes = msg.getDataByType(38);
        let shopInfo = msg.getDataByType(36);
        console.log(shopType, shopTimes, enums.Shop_Card)
        switch (shopType) {
            case enums.Shop_Card:
                this.cardShopUpdate(shopInfo, shopTimes)
                this.isInitShop = true;
                console.log("--------神秘商店-------", shopInfo);
                break;
            case enums.GuildShop_Card:
                this.isInitGuild = true;
                this.guildShopInfo = shopInfo;
                console.log("--------公会商店-------", shopInfo);
                break;
            default:
                break;
        }
    }
    buyGoods(type, id) {
        let route = 'plaza.shop.buyGoods';
        this.send_msg(route, { 'type': type, 'id': id });
    }
    plaza_shop_buyGoods(msg: Package) {
        console.log("plaza_shop_buyGoods", msg)
    }
    initData() {
        if (!this.shopTabal) {
            this.shopTabal = this.getConfigSync("shangdian_shop").json;
            cc.log("----商店表格----", this.shopTabal)
            for (let i = 0; i < this.shopTabal.length; i++) {
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
    }
    cardShopUpdate(info, shopTimes) {
        console.log(info)
        this.cardShopRefreshTime = info.refreshTime;
        console.log(this.cardShopRefreshTime)
        this.refreshCount = info.refreshCount;
        for (let i = 0; i < this.cardShop.length; i++) {
            let obj = this.cardShop[i];
            obj.shopTimes = shopTimes[i + 1];
            obj.amount = info.items[i + 1].amount;
            obj.card = tableMgr.search('teji_teji', { id: info.items[i + 1].itemId })
            obj.name = obj.card.name;
            obj.price = info.items[i + 1].price;
            obj.discount = info.items[i + 1].discount;    //折扣
            obj.priceType = info.items[i + 1].priceType; // 0金币 1水晶
        }
        console.log(this.cardShop)
    }
    reqShopInfo(shopType = enums.Shop_Card) {
        let route = 'plaza.data.reqShopInfo';
        this.send_msg(route, { 'shopType': shopType });
    }
    //新增刷新商店的参数
    reqRefreshShop(shopType = enums.Shop_Card) {
        let route = 'plaza.shop.refreshShop';
        this.send_msg(route, { 'shopType': shopType });
    }
    plaza_shop_refreshShop(msg: Package): void {
        let shopType = msg.getDataByType(37);
        let shopTimes = msg.getDataByType(dataids.ID_USER_MONEYFEN);
        let shopInfo = msg.getDataByType(36);
        switch (shopType) {
            case enums.Shop_Card:
                console.log("--------神秘商店-------", shopInfo);
                this.cardShopUpdate(shopInfo, 0)
                break;
            case enums.GuildShop_Card:
                console.log("--------公会商店-------", shopInfo);
                this.guildShopInfo = shopInfo;
                break;
            default:
                break;
        }
    }
    setShopState(name: string) {
        this.shopState = name;
    }
    // 单例处理
    private static _instance: ShopMgr = null;
    public static getInstance(): ShopMgr {
        if (ShopMgr._instance == null) {
            ShopMgr._instance = new ShopMgr();
        }
        return ShopMgr._instance;
    }
}

