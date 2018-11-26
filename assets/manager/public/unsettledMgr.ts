import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import GameNet from "../../framework/modules/GameNet";
export default class UnsettledMgr extends BaseMgr {
    unsettledInfo = null;
    constructor() {
        super();
        this.routes = {
            'plaza.data.reqUnsettled': this.plaza_data_reqUnsettled,
        };
    }
    clearDatas()
    {
        this.unsettledInfo = null;
    }
    getGuildInvited()
    {
        return this.unsettledInfo&&this.unsettledInfo.guildInvited;
    }
    //创建公会
    reqUnsettled()
    {
        let route = 'plaza.data.reqUnsettled';
        this.send_msg(route);
    }
    plaza_data_reqUnsettled(msg: Package)
    {
        console.log("plaza_data_reqUnsettled",msg)
        this.unsettledInfo = msg.getDataByType(dataids.ID_UNSETTLEDINFO);
    }
    // 单例处理
    private static _instance: UnsettledMgr = null;
    public static getInstance(): UnsettledMgr {
        if (UnsettledMgr._instance == null) {
            UnsettledMgr._instance = new UnsettledMgr();
        }
        return UnsettledMgr._instance;
    }
}

