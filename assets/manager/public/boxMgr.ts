import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
import { enums } from "../enums";
import EffectMgr from "./effectMgr";
import ModuleMgr from "../../framework/modules/ModuleMgr";
let userMgr = UserMgr.getInstance();

export default class BoxMgr extends BaseMgr {
    public boxTable: any = null                     //宝箱表格
    public levelBoxTable: any = null                     //等级宝箱表格
    public levelBoxInfo: any = null                     //等级宝箱数据
    public onlineBox: any;                   //在线宝箱
    public winBox: any;                   //胜利宝箱
    public battleBox: any = [];                   //战斗宝箱

    public curBattleBox: any = null                     //当前战斗宝箱
    public boxReward: { type: number, amount: number }[]  //打开宝箱奖励
    constructor() {
        super();
        this.routes = {
            'plaza.data.reqBoxes': this.plaza_data_reqBoxes,
            'plaza.box.reqLevelBox': this.reqLevelBox,
            'plaza.box.unlockBox': this.plaza_box_unlockBox,
            'plaza.box.openBox': this.plaza_box_openBox,
            'plaza.box.buyLevelBox': this.buyLevelBox,
        };
    }
    private plaza_data_reqBoxes(msg: Package): void {
        let BoxInfo = msg.getDataByType(dataids.ID_BOXLIST);
        console.log("--------宝箱数据-------", BoxInfo);
        //查表
        this.boxTable = this.getConfigSync("baoxiang_baoxiang").json;
        this.initData(BoxInfo);
    }
    sendReqLevelBox() {
        console.log("请求等级宝箱")
        let route = 'plaza.box.reqLevelBox';
        this.send_msg(route);
    }
    reqLevelBox(msg: Package): void {
        this.levelBoxInfo = msg.getDataByType(dataids.ID_GET_LEVELBOX);
        console.log("--------等级宝箱数据-------", this.levelBoxInfo);
        this.levelBoxTable = this.getConfigSync("LevelBox_LevelBox").json;
    }
    sendBuyLevelBox(level) {
        console.log("请求购买等级宝箱")
        let route = 'plaza.box.buyLevelBox';
        this.send_msg(route, { buyLv: level });
    }
    buyLevelBox(msg: Package): void {
        let diamond = msg.getDataByType(dataids.ID_USER_MONEYSTONE)
        let rewardInfo = msg.getDataByType(dataids.ID_GET_ALLTYPE_ITEMS)
        console.log("--------购买等级宝箱-------", diamond, rewardInfo);
        ModuleMgr.getInstance().showHandleGainBox(rewardInfo);
    }

    private plaza_box_unlockBox(msg: Package): void {
        let battleBoxInfo = msg.getDataByType(dataids.ID_UNLOCKBOX);
        console.log("--------开始解锁战斗宝箱-------", battleBoxInfo);
        for (let i = 0; i < this.battleBox.length; i++) {
            if (battleBoxInfo.id == this.battleBox[i].id_service) {
                this.battleBox[i].unlockTime = battleBoxInfo.unlockTime;
                break;
            }
        }
    }
    private plaza_box_openBox(msg: Package): void {
        cc.log(msg)
        let id = msg.getDataByType(dataids.ID_OPR_BOXID).id;
        let getMoney = msg.getDataByType(dataids.ID_GET_MONEY_GOLD).moneyGold;
        let card = msg.getDataByType(dataids.ID_PRIZE_LIST_TEJI);
        let newBox = msg.getDataByType(dataids.ID_GET_BOX);
        userMgr.onlineBoxTimes = msg.getDataByType(dataids.ID_OPEN_TIMES).todayBoxShareTimes;
        console.log("--------打开宝箱-------", id, getMoney, card, newBox, this.onlineBox.boxTimes);
        this.deleteBox(id)
        this.addBox(newBox);
        if (EffectMgr.getInstance().isInit) {
            EffectMgr.getInstance().addEffect(card)
        }
        let amount = 0;
        for (let i = 0; i < card.length; i++) {
            amount += card[i].amount;
        }
        this.boxReward = [{ type: enums.Get_Gold, amount: getMoney }, { type: enums.Get_Skill, amount: amount }]
    }

    //删除宝箱
    public deleteBox(id: number) {
        console.log("--------删除宝箱-------", id);
        if (this.onlineBox.id_service == id) {
            this.onlineBox = null;
        }
        else if (this.winBox.id_service == id) {
            this.winBox = null;
        }
        else {
            for (let i = 0; i < this.battleBox.length; i++) {
                if (this.battleBox[i].id_service == id) {
                    this.battleBox.splice(i, i)
                    return
                }
            }
        }
    }
    //更新宝箱
    public addBox(boxData: any) {
        console.log("--------增加宝箱-------", boxData);
        let box = this.selectBox(boxData.itemId);
        let obj: any = {
            id_service: boxData.id,
            unlockTime: boxData.unlockTime,
            boxInfo: box,
        }
        if (box.boxtype == 1) {
            obj.boxTimes = userMgr.onlineBoxTimes;
            this.onlineBox = obj;
        }
        else if (box.boxtype == 2) {
            obj.boxTimes = userMgr.winBoxTimes;
            this.winBox = obj;
        }
        else if (box.boxtype > 3 && box.boxtype < 7) {
            this.battleBox.push(obj)
        }
    }


    public initData(data: any): void {
        for (let i = 0; i < data.length; i++) {
            this.addBox(data[i])
        }
        cc.log("----战斗宝箱----", this.battleBox)
        cc.log("----在线宝箱----", this.onlineBox)
        cc.log("----胜利宝箱----", this.winBox)
        //this.testGm2();
    }
    openBox(id: number) {
        let route = 'plaza.box.openBox';
        let msg = {
            'id': id,
        }
        this.send_msg(route, msg);
    }
    testGm1() {
        let route = 'plaza.box.gm';
        let msg = {
            oprType: 3,//操作类型
            //解锁加速
            boxId: 50,//解锁加速宝箱id
            reduceTime: 100000,//减少解锁时间
        }
        this.send_msg(route, msg);
    }
    testGm2() {
        let route = 'plaza.box.gm';
        let msg = {
            oprType: 4,//操作类型
            //解锁加速
            attrName: 'moneyFen',//玩家属性名
            attrValue: 10000,//修改后的值
        }
        this.send_msg(route, msg);
    }
    unlockBox() {
        this.closeModule("battleBox");
        let route = 'plaza.box.unlockBox';
        let msg = {
            'id': this.curBattleBox.id_service,
        }
        this.send_msg(route, msg)
    }

    public selectBox(id: number): any {
        for (let i = 0; i < this.boxTable.length; i++) {
            let box = this.boxTable[i];
            if (box.id == id) {
                return box;
            }
        }
        return console.log("没有该宝箱id");

    }

    public setCurBattleBox(index: number) {
        this.curBattleBox = this.battleBox[index];
    }

    // 单例处理
    private static _instance: BoxMgr = null;
    public static getInstance(): BoxMgr {
        if (BoxMgr._instance == null) {
            BoxMgr._instance = new BoxMgr();
        }
        return BoxMgr._instance;
    }

}

