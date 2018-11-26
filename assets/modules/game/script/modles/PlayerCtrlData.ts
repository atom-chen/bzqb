/*
author: 黄凯
日期:2018-11-19
*/
// 玩家操作数据模型 发给服务器的数据格式 这个可以是单利
export default class fightPlayerModule{
    private static _instance: fightPlayerModule = new fightPlayerModule();
    public static getInstance(): fightPlayerModule {
        return fightPlayerModule._instance;
    }
    // -1 到 1
	direction:number;
    // 仰角表现
    elevation:number;
    // 发射向量
    shootPoi:any;
    // 使用卡牌
    userCard:number;
    // 使用飞机
    changePlane:number;

	constructor() {
        this.shootPoi = {};
        this.direction = 0;
        this.elevation = -1;
        this.userCard = -1;
        this.changePlane = -1;
    }

    // 发射炮弹
    setShootPoi(poi:any){
        this.shootPoi = poi;
    }
    
    // 获取操作
    getData() {
        let obj = {};
        if(this.direction !== 0){
            obj["direction"] = this.direction;
        }
        if(this.elevation !== -1){
            obj["elevation"] = this.elevation;
        }
        if(this.userCard !== -1){
            obj["userCard"] = this.userCard;
        }
        if(this.changePlane !== -1){
            obj["changePlane"] = this.changePlane;
        }
        if (this.shootPoi.x || this.shootPoi.y) {
            obj["shootPoi"] = this.shootPoi;
        }
        // 清空所有数据
        // this.clear();
        return obj;
    }
    clear() {
        this.shootPoi = {
            x:0,
            y:0
        };
        // this.direction = -1;
        this.elevation = -1;
        this.userCard = -1;
        this.changePlane = -1;
    }
}