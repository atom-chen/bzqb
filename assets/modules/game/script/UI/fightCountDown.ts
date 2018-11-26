import Emitter from "../../../../framework/modules/Emitter";
let emitter = Emitter.getInstance();
import config from "../common/gameConfig";
/*
author: 黄凯
日期:2018-11-19
*/
const {ccclass, property} = cc._decorator;
const { fightEvent } = config;

@ccclass
export default class fightCountDown extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad () {
    	emitter.on(fightEvent.showCountDown , this.showCountDown , this);
    	emitter.on(fightEvent.hideCountDown , this.hideCountDown , this);
    	emitter.on(fightEvent.updateCountDown , this.updateCountDown , this);
    }

    showCountDown(){
    	this.node.active = true;
    }

    hideCountDown(){
    	this.node.active = false;
    }

    updateCountDown(num:string){
    	this.label.string = num;
    }

    onDestroy(){
    	emitter.off(fightEvent.showCountDown , this );
    	emitter.off(fightEvent.hideCountDown , this );
    	emitter.off(fightEvent.updateCountDown , this );
    }
}
