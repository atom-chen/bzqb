import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";

export default class RankMgr extends BaseMgr {
    public page=-1;
    public rankList = null;
    public myRankInfo = null;
    constructor() {
        super();
        this.routes = {
            'search.entry.reqRank': this.search_entry_reqRank,
            'search.entry.reqMyRankInfo': this.search_entry_reqMyRankInfo,
        };
    }
    clearData()
    {
        this.page = -1;
    }
    getRankList()
    {
        return this.rankList;
    }
    gerMyRankInfo()
    {
        return this.myRankInfo;
    }
    // 单例处理
    private static _instance: RankMgr = null;
    public static getInstance(): RankMgr {
        if (RankMgr._instance == null) {
            RankMgr._instance = new RankMgr();
        }
        return RankMgr._instance;
    }

    public reqRank(rankType = 0): void {
        this.page++;
        let route = 'search.entry.reqRank';
        this.send_msg(route,{'page':this.page,'rankType':rankType});
    }
    public reqMyRankInfo(rankType = 0): void {
        let route = 'search.entry.reqMyRankInfo';
        this.send_msg(route,{'rankType':rankType});
    }
    search_entry_reqRank(msg: Package)
    {
        this.rankList = msg.getDataByType(dataids.ID_RANKLIST);
        console.log("search_entry_reqRank",msg,this.rankList)
    }
    search_entry_reqMyRankInfo(msg: Package)
    {
        this.myRankInfo = msg.getDataByType(dataids.ID_MYRANK_INFO);
        console.log("search_entry_reqMyRankInfo",msg,this.myRankInfo)
    }

}
