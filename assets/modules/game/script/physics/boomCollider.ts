let hkCollisionManager = require("hkCollisionManager");

const {ccclass, property} = cc._decorator;

let boomType = {

}
/*
author: 黄凯
日期:2018-11-19
*/
@ccclass
export default class boomCollider extends cc.Component {

    // TODO 初始化场景大小
    init(width:number){
        let collider = this.getComponent(cc.PolygonCollider);
        if(!collider){
            collider = this.addComponent(cc.PolygonCollider);
        }
        collider.tag = 8;
        let points = this.createPoint(width);
        collider.points = points;
        this.onEnable();
    }

    // 计算points点为信息
    createPoint(width){
    	let height = Math.round(width/3);
    	let poi1 = {
    		x:-height,
    		y:-width
    	};
    	let poi2 = {
    		x:height,
    		y:-width
    	};
    	let poi3 = {
    		x:width,
    		y:0
    	};
    	let poi4 = {
    		x:height,
    		y:height
    	};
    	let poi5 = {
    		x:-height,
    		y:height
    	};
    	let poi6 = {
    		x:-width,
    		y:0
    	};
    	let points = [];
    	points.push(poi1);
    	points.push(poi2);
    	points.push(poi3);
    	points.push(poi4);
    	points.push(poi5);
    	points.push(poi6);
    	return points;
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
