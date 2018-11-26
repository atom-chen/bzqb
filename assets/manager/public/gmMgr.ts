import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import { enums } from "../enums";

let gmMgrType = {
    gm_addUserExp:1,
    gm_addUserCoin:2,
    gm_addFenZuan:3,
    gm_addBox:4,
    gm_addTeji:5,
    gm_addEmail:6,
    gm_addHonor:7,
    gm_addWinBattleCount:8,
    gm_addGoods:9,
    gm_addYueka:10,
    gm_addZhongShenKa:11,
    gm_addGuildKey:12,
    gm_changeStage:13,
    gm_getAllTeji:14,
    gm_getAllGoods:15

}
export default class GMMgr extends BaseMgr {

    public data
    constructor() {
        super();
        this.routes = {

        };
        var self = this
        cc.loader.loadRes("/config/clientgm_gm.json", function (err, object) {
            if (err) {
                console.log(err);
                return;
            }
            self.data = object.json
        });
    }

    // 单例处理
    private static _instance: GMMgr = null;
    public static getInstance(): GMMgr {
        if (GMMgr._instance == null) {
            GMMgr._instance = new GMMgr();
        }
        return GMMgr._instance;
    }

    public sendData(id, param1, param2){
        let route = "plaza.gm.clientGm"
        let msg = {
            gmId:0,
            param1:0,
            param2:0
        }

        if(gmMgrType.gm_addEmail != id){
            msg.gmId = parseInt(id)
            msg.param1 = parseInt(param1)
            msg.param2 = parseInt(param2)
        }else{
            msg.gmId = parseInt(id)
            msg.param1 = param1

            var data = JSON.parse(param2)
            msg.param2 = data
        }

        this.send_msg(route, msg)
    }
}
