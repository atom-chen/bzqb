export default class Package {
	private _updateArr: any[];
	private _code: number;
	private _data:any;
	
	constructor(msg: any) {
		//可以理解成回包方法 
		//增量列表
		this._updateArr = msg.updateArr||[];
		//错误码
		this._code = msg.code;

		this._data = msg
	}

	getData(){
		return this._data
	}

	getDataByType(type) {
		for (let i = 0; i < this._updateArr.length; ++i) {
			if (this._updateArr[i][0] == type) {
				return this._updateArr[i][1];
			}
		}
		return null;
	}	
	getDatasByType(type){
		let arr=[]
		for (let i = 0; i < this._updateArr.length; ++i) {
			if (this._updateArr[i][0] == type) {
				arr.push( this._updateArr[i][1]);
			}
		}
		return arr;
	}
}