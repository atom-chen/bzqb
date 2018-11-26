/*
author: 黄凯
日期:2018-11-19
*/
// 帧数管理器
export default class netFrameMgr{
    // 留存的帧数据
    frameList:any;
    // 帧缓存
    poolNum:number;
    // 帧间隔
    frameTime:number;
    // 帧速率
    frameFps:number;
    // 帧起始点
    startTime:number;
    // 延迟次数
    lagTime:number;
    // 是否显示菊花
    nowIsShow:boolean;
    // 
    isShowFlower:boolean;
    // 是否显示延迟
    isShowLag:boolean;
    // 游戏第一次开始时
    gameStart:boolean;
    // 帧数计数器
    hisTroyFrameCount:number;
    constructor(){
        this.poolNum = 1;
        this.frameFps = 20;
        this.frameTime = Math.round(1000/(this.frameFps-4));
        // console.log("this.frameTime",this.frameTime)
        this.frameList = [];
        this.startTime = 0;
        this.isShowLag = false;
        this.hisTroyFrameCount = 0;
    }
    public addCount() : void{
        this.hisTroyFrameCount ++;
    }
    public addFrame(frame:any) : void{
        this.frameList.push(frame);
    }
    // 获取帧数据
    public getLastFrame() : any{
        return this.frameList.shift();
    }
    // 获取帧长度
    public getFrameCount() : number{
        return this.frameList.length;
    }
    public getIsShowLag() : boolean {
        return this.isShowLag;
    }
    // 返回是否可以循环操作
    public checkCanWhile() : boolean{
        return this.getFrameCount() > this.poolNum;
    }
    // 检测是否可以更新逻辑 
    public getCanDoNetFrame(dt):boolean{
        this.startTime += dt*1000;
        let frameCount = this.getFrameCount();
        let candoFrame = false;
        // 显示菊花
        // if (this.lagTime > 10 || frameCount > 10) {
        //     if (!this.nowIsShow) {
        //         // 这里网络延迟需要显示菊花
        //         this.isShowLag = true;
        //         // this.isShowFlower = true;
        //     }
        // }
        // 优化缓冲
        if (this.startTime >= this.frameTime) {
            this.startTime -= this.frameTime;
            if (!this.gameStart && frameCount >= this.poolNum) {
                this.gameStart = true;
            }
            // if (this.isShowFlower) {
            //     this.isShowFlower = false;
            //     return;
            // }
            // 数据发送
            if (this.gameStart && frameCount > 0) {
                this.lagTime = 0;
                candoFrame = true;
                this.addCount();
                // this.doFrame();
                // while (this.frameList.length > this.poolNum) {
                //     this.doFrame();
                // }
                // 隐藏菊花
                this.isShowLag = false;
                // this.hideFlower();
            } else if (this.gameStart && frameCount === 0) {
                this.lagTime++;
            }

        }
        return candoFrame;
    }
}