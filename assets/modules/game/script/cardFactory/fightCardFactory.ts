import Emitter from "../../../../framework/modules/Emitter";
import BaseBodyFight from "../baseClass/BaseBodyFight";
import effectBuffMgr from "../effectBuff/effectBuffMgr";
import PlayerData from "../modles/PlayerData";
import ShootData from "../modles/ShootData";
import fightPlayerModle from "../player/fightPlayerModle";
/*
author: 黄凯
日期:2018-11-22
*/
let emitter = Emitter.getInstance();
// 战斗卡牌处理

import config from "../common/gameConfig";

const { netFrame , fightEvent , missileType , waitTime , playerConfig ,missileBuffType } = config;

class cardFactory{

	doMain(playerModel:fightPlayerModle,card:number){
		// 测试
		switch(card){
			// 三分裂
			case 1:
			playerModel.addDivisionFire();
			break;
			// 二连射
			case 2:
			playerModel.addContinuousFire(2);
			break;
			// 三连射
			case 3:
			playerModel.addContinuousFire(3);
			break;
			// 攻击力加强100
			case 4:
			playerModel.addAtkPower(100);
			break;
		}
		

	}

}

export default new cardFactory();
