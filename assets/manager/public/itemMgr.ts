import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
let userMgr = UserMgr.getInstance();
enum ITEM{
    WINKEY=10006,
    CHIP = 10005,
}
export default class ItemMgr extends BaseMgr {
    public itemTable: any = null                     //道具
    public winKey: any = null                     //胜利钥匙
    public chip: any = null;                     //碎片 

    constructor() {
        super();
        this.routes = {
            'plaza.data.reqItemList': this.plaza_data_reqItemList,
        };
    }
    private plaza_data_reqItemList(msg: Package): void {
        let ItemInfo = msg.getDataByType(dataids.ID_ALLITEMS);
        console.log("--------道具数据-------", ItemInfo);
        this.itemTable = this.getConfigSync("daoju_daoju").json;
        this.initData(ItemInfo)
    }

    public selectItem(id: number): any {
        for (let i = 0; i < this.itemTable.length; i++) {
            let item = this.itemTable[i];
            if (item.id == id) {
                return item;
            }
        }
        return console.log("没有该道具id");
    }
    public initData(data: any): void {
        for (let i = 0; i < data.length; i++) {
            let obj_data = this.selectItem(data[i].itemId);
            let obj: any = {
                id_service: data[i].id,
                amount: data[i].amount,
                itemInfo: obj_data,
            }
            switch (data[i].itemId) {
                case ITEM.WINKEY:
                    this.winKey = obj;
                    break;
                case ITEM.CHIP:
                    this.chip = obj;
                    break;
            }
        }

    }

    // 单例处理
    private static _instance: ItemMgr = null;
    public static getInstance(): ItemMgr {
        if (ItemMgr._instance == null) {
            ItemMgr._instance = new ItemMgr();
        }
        return ItemMgr._instance;
    }

}

