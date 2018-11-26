import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
import EffectMgr from "./effectMgr";
import { enums } from "../enums";

export default class cardMgr extends BaseMgr {
    public monthlyCardTime: number = 2592000000;//月卡时间(毫秒)
    public monthlyIsInit: boolean = false;
    public LifeIsInit: boolean = false;
    monthlyCardInfo: any = null;
    lifetimeCardInfo: any = null;
    monthlyCardBox:any =[];//月卡奖励
    constructor() {
        super();
        this.routes = {
            "plaza.privilege.reqMonthlyCardInfo": this.reqMonthlyCardInfo,
            "plaza.privilege.reqLifetimeCardInfo": this.reqLifetimeCardInfo,
            "plaza.privilege.buyMonthlyCard": this.buyMonthlyCard,
            "plaza.privilege.buyLifetimeCard": this.buyLifetimeCard,
            "plaza.privilege.recMonthlyDailyBox": this.recMonthlyDailyBox,
        };

    }
    sendReqMonthlyCardInfo() {
        let route = 'plaza.privilege.reqMonthlyCardInfo';
        this.send_msg(route);
    }
    reqMonthlyCardInfo(msg: Package): void {
        this.monthlyIsInit = true;
        this.monthlyCardInfo = msg.getDataByType(dataids.ID_MONTHLYCARD_INFO);
        console.log("--------月卡信息-------", this.monthlyCardInfo);
    }
    sendReqLifetimeCardInfo() {
        let route = 'plaza.privilege.reqLifetimeCardInfo';
        this.send_msg(route);
    }
    reqLifetimeCardInfo(msg: Package): void {
        this.LifeIsInit = true;
        this.lifetimeCardInfo = msg.getDataByType(dataids.ID_LIFETIMECARD_INFO);
        console.log("--------终身卡信息-------", this.lifetimeCardInfo);
    }
    sendBuyMonthlyCard() {
        let route = 'plaza.privilege.buyMonthlyCard';
        this.send_msg(route);
    }
    buyMonthlyCard(msg: Package): void {
        this.monthlyCardInfo = msg.getDataByType(dataids.ID_MONTHLYCARD_INFO);
        console.log("--------购买月卡-------", this.monthlyCardInfo);
    }
    sendBuyLifetimeCard() {
        let route = 'plaza.privilege.buyLifetimeCard';
        this.send_msg(route);
    }
    buyLifetimeCard(msg: Package): void {
        this.lifetimeCardInfo = msg.getDataByType(dataids.ID_LIFETIMECARD_INFO);
        console.log("--------购买终身卡-------", this.lifetimeCardInfo);
    }
    sendRecMonthlyDailyBox() {
        let route = 'plaza.privilege.recMonthlyDailyBox';
        this.send_msg(route);
    }
    recMonthlyDailyBox(msg: Package): void {
        this.monthlyCardInfo.isOpenBox = msg.getDataByType(dataids.ID_MONTHLYCARD_BOXPRIZE);
        let goldInfo = msg.getDataByType(dataids.ID_GET_MONEY_GOLD);
        let effectInfo = msg.getDataByType(dataids.ID_PRIZE_LIST_TEJI);
        console.log("--------领取月卡宝箱-------", this.monthlyCardInfo, goldInfo, effectInfo);
        if (EffectMgr.getInstance().isInit) {
            EffectMgr.getInstance().addEffect(effectInfo)
        }
        this.monthlyCardBox=[];
        this.monthlyCardBox.push({
            type: enums.Get_Gold,
			amount: goldInfo,
        })
        for (let i = 0; i < effectInfo.length; i++) {
            this.monthlyCardBox.push({
                type: effectInfo[i].type,
				amount: effectInfo[i].amount,
            })
        }
        
    }


    // 单例处理
    private static _instance: cardMgr = null;
    public static getInstance(): cardMgr {
        if (cardMgr._instance == null) {
            cardMgr._instance = new cardMgr();
        }
        return cardMgr._instance;
    }
}

