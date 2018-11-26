
const {ccclass, property} = cc._decorator;

const timeType = {
	timeout:1,
	interval:2,
};
/*
author: 黄凯
日期:2018-11-19
*/
// 帧等待
@ccclass
export default class BaseGameFight extends cc.Component {
    _frameList:any = {};
    _frameId:number = 1;

	// 获取自增长id
	getAndAdd():string{
		return (this._frameId++).toString();
	}

	// 获取定时任务长度
	getNowMissionCount():number{
		return Object.keys(this._frameList).length;
	}

	// 启动定时器
	frameRun(){
		for(var _frameId in this._frameList){
			try{
				let obj = this._frameList[_frameId];
				switch(obj["type"]){
					case timeType.timeout:
					if(obj.time <= 0){
						obj.func();
						this.remove(_frameId);
					}else{
						obj.time -= 1;
					}
					break;
				}
			}catch(e){
				console.log("帧延迟系统错误",e);
			}
		}
	}

	// 绑定timeout事件 
	frameTimeout(callbackFun,frameNum){
		var id = this.getAndAdd();
		var obj = {
			func:callbackFun,
			time:frameNum,
			type:timeType.timeout,
		}
		this._frameList[id] = obj;
		return id;
	}

	
	// 删除事件
	remove(id){
		if(this._frameList[id]){
			try{
				this._frameList[id].func = null;
				delete this._frameList[id];
			}catch(e){
				console.log("帧延迟系统错误",e);
			}
		}
	}

}
