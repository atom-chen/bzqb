import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import GameNet from "../../framework/modules/GameNet";
let userMgr = UserMgr.getInstance();

export default class talentMgr extends BaseMgr {
	public curTalent =null;
	public talentList: any = null
	public isInit: boolean = false;
	public talentPoint:number =null;
	public lastResetTime:number =null;
	public talentInfo:any =null;
	constructor() {
		super();
		this.routes = {
		'plaza.talent.reqTalentInfo':this.reqTalentInfo,
		'plaza.talent.resetTalent':this.resetTalent,
		'plaza.talent.learnTalent':this.learnTalent,
		};
	
	}
	initData(){
		this.talentList = this.getConfigSync("talent_talent").json;
		for (let i = 0; i < this.talentList.length; i++) {
			this.talentList[i].curLevel =0;
		}
		for (var id in this.talentInfo) {
			var obj =this.selectTalent(id);
			obj.curLevel =this.talentInfo[id];
		}
		console.log(this.talentList)
	}
	public selectTalent(id: any): any {
		for (let i = 0; i < this.talentList.length; i++) {
			let achievement = this.talentList[i];
			if (achievement.id == id) {
				return achievement;
			}
		}
		return console.log("没有该天赋id", id);
	}
	reqTalentInfo(msg: Package): void {
		let talentInfo = msg.getDataByType(dataids.ID_GET_TALENTINFO);
		console.log("-----天赋信息-----",talentInfo)
		this.talentPoint =talentInfo.talentPoints;
		this.lastResetTime =talentInfo.talentInfo.lastResetTime;
		this.talentInfo =talentInfo.talentInfo.talentInfo;
		this.isInit =true;
		this.initData();
	}
	sendReqTalentInfo(){
		let route = 'plaza.talent.reqTalentInfo';
		this.send_msg(route)
	}
	resetTalent(msg: Package): void {
		let crystalInfo = msg.getDataByType(dataids.ID_USER_MONEYFEN);
		let resetInfo = msg.getDataByType(76);
		console.log("-----重置天赋-----",crystalInfo,resetInfo)
		for (let i = 0; i < this.talentList.length; i++) {
			this.talentList[i].curLevel =0;
		}
		this.talentPoint =resetInfo.talentPoints;
		this.lastResetTime =resetInfo.resetTime;
	}
	sendReqresetTalent(id){
		let route = 'plaza.talent.resetTalent';
		let msg ={
			resetType: id,
		}
		this.send_msg(route,msg)
	}
	learnTalent(msg: Package): void {
		let talentInfo = msg.getDataByType(dataids.ID_GET_LEARNTALENT);
		console.log("-----升级天赋-----",talentInfo)
		this.talentPoint =talentInfo.talentPoints;
		for (var id in talentInfo.talentLvInfo) {
			var obj =this.selectTalent(id);
			obj.curLevel =talentInfo.talentLvInfo[id];
		}
	}
	sendReqLearnTalent(id){
		let route = 'plaza.talent.learnTalent';
		let msg ={
			talentId: id,
		}
		this.send_msg(route,msg)
	}
	boolStudyState(talent):boolean{
		console.log(talent)
		if(!talent.precondition){
			return true;
		}
		else{
			let obj =this.selectTalent(talent.precondition)
			if(obj.curLevel==obj.maxLevel ){
				return true;
			}
			else{
				return false;
			}
		}
	}
	
	// 单例处理
	private static _instance: talentMgr =null;
	public static getInstance(): talentMgr {
		if (talentMgr._instance == null) {
			talentMgr._instance = new talentMgr();
		}
		return talentMgr._instance;
	}
}

