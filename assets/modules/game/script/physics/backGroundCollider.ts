let hkCollisionManager = require("hkCollisionManager");

const {ccclass, property} = cc._decorator;
/*
author: 黄凯
日期:2018-11-19
*/
@ccclass
export default class backGroundCollider extends cc.Component {

    // TODO 初始化场景大小
    init(size:any){
        let collider = this.getComponent(cc.BoxCollider);
        if(!collider){
            collider = this.addComponent(cc.BoxCollider);
        }
        collider.tag = 9;
        collider.size.width = size.x;
        collider.size.height = size.y;
        this.onEnable();
    }

    onEnable(){
        let collider = this.getComponent(cc.Collider);
        if(collider){
            hkCollisionManager.addCollider(collider);
        }
    }

    onDisable(){
        let collider = this.getComponent(cc.Collider);
        if(collider){
            hkCollisionManager.removeCollider(collider);
        }
    }

}
