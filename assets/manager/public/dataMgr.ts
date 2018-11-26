import BaseMgr from "../../framework/baseClass/BaseMgr";
import { dataids } from "../../framework/net/dataids";
import Package from "../../framework/net/package";
import UserMgr from "./userMgr";
import EffectMgr from "./effectMgr";
import RoleMgr from "./roleMgr";

export default class DataMgr extends BaseMgr {
    private static _instance: DataMgr = null;
    public static getInstance(): DataMgr {
        if (DataMgr._instance == null) {
            DataMgr._instance = new DataMgr();
        }
        return DataMgr._instance;
    }
    private _idArr: number[];
    constructor() {
        super();
        this._idArr = [
            dataids.ID_USER_MONEYGOLD,
            dataids.ID_USER_MONEYSTONE,
            dataids.ID_USER_MONEYFEN,
            dataids.ID_USRE_LEVEL,
            dataids.ID_USRE_EXPERIENCE,
            dataids.ID_GET_MONEY_GOLD,
            dataids.ID_GET_MAILITEMS,
            dataids.ID_GET_BOXPRIZE,
            dataids.ID_GET_WEEKVIPPRIZE,
            dataids.ID_DOSIGNIN_RECINFO,
            dataids.ID_MULTISIGNIN_RECINFO,
            dataids.ID_GET_ALLTYPE_ITEMS,
        ]
    }

    public dealResp(route: string, msg: Package): void {
        for (let i = 0; i < this._idArr.length; ++i) {
            let id = this._idArr[i], data = msg.getDataByType(id);
            if (data != null) UserMgr.getInstance().refreshData(id, data);  //刷新玩家数据
            if (id == dataids.ID_GET_MAILITEMS && data != null) {           //邮件奖励领取
                EffectMgr.getInstance().refreshData(data.dictPrize);
                RoleMgr.getInstance().refreshData(data.dictPrize);
            }
            if (id == dataids.ID_GET_BOXPRIZE && data != null) {
                for (let i = 0; i < data.length; i++) {
                    UserMgr.getInstance().refreshData(id, data[i]);
                    EffectMgr.getInstance().addEffect(data[i].listTejis);
                }
            }
            if (id == dataids.ID_GET_ALLTYPE_ITEMS && data != null) {
                UserMgr.getInstance().getAllTypeItem(data);
                console.log(EffectMgr.getInstance().isInit)
                if (EffectMgr.getInstance().isInit) {
                    EffectMgr.getInstance().getAllTypeItem(data);
                }
            }

        }
    }
}