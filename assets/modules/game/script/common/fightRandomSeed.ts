// fightUtil.ts
/*
author: 黄凯
日期:2018-11-19
*/
// 随机数控制
export default class randomMgr{

	private static _instance: randomMgr = new randomMgr();

	public static getInstance(): randomMgr {
		return randomMgr._instance;
	}
	_seed:number = 0;

	init(seed:number){
		this._seed = seed;
	}

	randomRange(min:number, max:number) {
	    min = (typeof min !== "undefined") ? min : 0;
	    max = (typeof max !== "undefined") ? max : 1;
	    return min + this.random() * (max - min);
	}


	random() {
	    this._seed = (this._seed * 9301 + 49297) % 233280;
	    return this._seed / 233280;
	}
}


