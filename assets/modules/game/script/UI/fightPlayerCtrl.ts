import fightPlayerShootCtrl from "./fightPlayerShootCtrl";
import Emitter from "../../../../framework/modules/Emitter";
import config from "../common/gameConfig";
import fightCardBtn from "./fightCardBtn";

// import HkPhysics from "../physics/hkPhysics";
// let hkPhysics = HkPhysics.getInstance();
/*
author: 黄凯
日期:2018-11-19
*/
const { fightEvent } = config;

let emitter = Emitter.getInstance();

import PlayerCtrlData from "../modles/PlayerCtrlData";

let playerCtrlData = PlayerCtrlData.getInstance();

// 到我的回合时显示的ui
const {ccclass, property} = cc._decorator;


// TODO 
// 1,仰角限制
// 2,世界坐标等转换情况
// 3,显示隐藏 ui效果
// 4，圆形操作区域问题

@ccclass
export default class fightPlayerUi extends cc.Component {

    // 左按键
    @property(cc.Node)
    leftBtn : cc.Node = null;

    // 右按键
    @property(cc.Node)
    rightBtn : cc.Node = null;

    // 飞机按钮
    @property(cc.Node)
    planeBtn : cc.Node = null;

    // 卡牌列表
    @property(cc.Node)
    cardListNode : cc.Node = null;
    // 最后一张卡牌
    @property(cc.Node)
    lastCard : cc.Node = null;

    @property(cc.Prefab)
    cardPrefab : cc.Prefab = null;

    // 卡牌id找对应的图集
    // 测试用的
    @property(cc.SpriteFrame)
    cardSpriteFrame : cc.SpriteFrame = null;


    onLoad(){
    	// 长按发送移动数据
    	this.leftBtn.on(cc.Node.EventType.TOUCH_START,()=>{
    		this.setDirection(-1);
    	});
    	this.rightBtn.on(cc.Node.EventType.TOUCH_START,()=>{
    		this.setDirection(1);
    	});

    	this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL,this.cancleDirection,this);
    	this.leftBtn.on(cc.Node.EventType.TOUCH_END,this.cancleDirection,this);
    	this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL,this.cancleDirection,this);
    	this.rightBtn.on(cc.Node.EventType.TOUCH_END,this.cancleDirection,this);

    	this.planeBtn.on(cc.Node.EventType.TOUCH_START,this.setPlane,this);

        // 触发卡牌的删除
        emitter.on(fightEvent.onCardChange,this.onCardChange,this);
        // TODO 触发卡牌的收缩


    }

    // 设置运动方向
    public setDirection(direction:number):void{
    	playerCtrlData.direction = direction;
    }


    // 取消长按
    public cancleDirection():void{
    	playerCtrlData.direction = 0;
    }


    // 当前飞机状态
    nowPlane:number = 0;
    // TODO 重置当前飞机 设置飞机
    public setPlane():void{
        (this.nowPlane == 0)?(this.nowPlane = 1):(this.nowPlane = 0);
        playerCtrlData.changePlane = this.nowPlane;
    }

    // 1-6 张卡牌数组
    onCardChange(cards:any){
        // TODO 找到卡牌对应的图片
        // 取出最后一张卡牌作为下一张
        this.clearCardList();
        if(cards.length <= 0){
            return;
        }
        let lastCard = cards.splice(cards.length-1,1)[0];
        for(let i = 0 ; i < cards.length ; i++){
            let cardId = cards[i];
            let node = cc.instantiate(this.cardPrefab);
            let script = node.getComponent(fightCardBtn);
            // 测试表现  先写死了
            node.width = 110;
            node.height = 160;
            node.x = - i*120;
            // 测试数据
            script.init({
                cardId:cardId,
                spriteFrame:this.cardSpriteFrame,
                sendUseCard:this.sendUseCard.bind(this)
            });
            node.parent = this.cardListNode;
        }
    }

    // 使用卡牌
    sendUseCard(cardId){
        playerCtrlData.userCard = cardId;
    }


    // 清理卡牌列表
    clearCardList(){
        let children = this.cardListNode.children;
        for(let i = 0;i<children.length;i++){
            let child = children[i];
            child.destroy();
        }
    }

 
    onDestroy(){
    	this.leftBtn.off(cc.Node.EventType.TOUCH_START,this.setDirection,-1);
    	this.rightBtn.off(cc.Node.EventType.TOUCH_START,this.setDirection,1);

    	this.leftBtn.off(cc.Node.EventType.TOUCH_CANCEL,this.cancleDirection);
    	this.leftBtn.off(cc.Node.EventType.TOUCH_END,this.cancleDirection);
    	this.rightBtn.off(cc.Node.EventType.TOUCH_CANCEL,this.cancleDirection);
    	this.rightBtn.off(cc.Node.EventType.TOUCH_END,this.cancleDirection);

    	this.planeBtn.off(cc.Node.EventType.TOUCH_START,this.setPlane);

    }
}

