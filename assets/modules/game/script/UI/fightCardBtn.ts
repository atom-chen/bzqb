/*
author: 黄凯
日期:2018-11-22
*/


const {ccclass, property} = cc._decorator;


@ccclass
export default class fightPlayerUi extends cc.Component {

	cardId:number;
	sendUseCard:any;

	@property(cc.Label)
	testText:cc.Label = null;
	// 初始图片 id等
	init(cardData){
		// 测试数据 不存在就用1
		this.cardId = cardData.cardId;
		let sprite = this.getComponent(cc.Sprite);
		this.sendUseCard = cardData.sendUseCard;
		// 
		if(cardData.spriteFrame){
			sprite.spriteFrame = cardData.spriteFrame;
		}
		this.testText.string = "id:"+this.cardId;
	}

	onLoad(){
		// let btn = this.getComponent(cc.Button);
		this.node.on(cc.Node.EventType.TOUCH_START,this.clieckBtn,this);
	}

	clieckBtn(){
		// 发送操作数据
		this.sendUseCard(this.cardId);
	}

	onDestroy(){
		this.node.off(cc.Node.EventType.TOUCH_START,this.clieckBtn);
	}

}