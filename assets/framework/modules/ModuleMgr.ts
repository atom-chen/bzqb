import LogMgr from "./LogMgr";
import Loader from "./Loader";

export default class ModuleMgr {
	private static _instance: ModuleMgr = new ModuleMgr();
	public static getInstance(): ModuleMgr {
		return ModuleMgr._instance;
	}
	private _pubResPaths: any = require("publicResPath");
	private _curResPaths: any = require("loginResPath");
	private _lastResPaths: any = null;

	private _switchPaths(sceneName: string): void {
		this._lastResPaths = this._curResPaths;
		this._curResPaths = require(`${sceneName}ResPath`);
	}
	/**
	 * 切换场景
	 * @param sceneName 场景名
	 */
	public switchScene(sceneName: string, routeArr?: string[]): void {
		this._switchPaths(sceneName);
		this.showLoading({
			resPaths: this._curResPaths,
			routeArr: routeArr,
			complete: () => {
				LogMgr.getInstance().switchScene(sceneName);
				cc.director.loadScene(sceneName);
			}
		});
	}

	private _releaseRes(): void {
		let urlArr = [];
		for (let k in this._lastResPaths) {
			if (k == "config") continue;
			for (let s in this._lastResPaths[k]) {
				urlArr.push(this._lastResPaths[k][s]);
			}
		}
		Loader.getInstance().releaseRes(urlArr);
	}

	public getResUrl(type: string, name: string, isPublic: boolean = false): string {
		let resPaths = this._pubResPaths;
		if (type !== "config" && !isPublic) resPaths = this._curResPaths;
		return resPaths[type][name];
	}

	/**
	 * 打开子模块
	 * @param moduleName 模块名
	 */
	public async openSubModule(moduleName: string, isPublic: boolean, isOnly: boolean = true): Promise<any> {
		let curScene = cc.director.getScene();
		let prefabInstance = curScene.getChildByName(moduleName);
		if (!prefabInstance || !cc.isValid(prefabInstance, true) || !isOnly) {
			let resPaths = isPublic ? this._pubResPaths : this._curResPaths;
			let prefab = await Loader.getInstance().loadPrefab(resPaths.prefab[moduleName]);
			prefabInstance = cc.instantiate(prefab);
			prefabInstance.parent = curScene;
		}
		return prefabInstance.getComponent(prefabInstance.name);
	}
	/**
	 * 加载图片
	 * @param imageName 图片名
	 * @param isPublic 是否是公共
	 */
	public async loadImage(imageName: string, isPublic: boolean): Promise<cc.SpriteFrame> {
		let resPaths = isPublic ? this._pubResPaths : this._curResPaths;
		let spriteFrame = await Loader.getInstance().loadImage(resPaths.image[imageName]);
		return spriteFrame;
	}
	/**
	 * 关闭模块
	 * @param moduleName 模块名
	 */
	public closeModule(moduleName: string): void {
		let instance = cc.director.getScene().getChildByName(moduleName);
		if (!instance) return console.log("没有打开此模块!");
		if (cc.isValid(instance)) instance.destroy();
	}

	public showLoading(obj: { resPaths: any, routeArr?: string[], complete: Function }) {
		let { resPaths, routeArr, complete } = obj;
		this.openSubModule("loading", true).then(script => {
			script.setPreLoad({
				resPaths: resPaths,
				routeArr: routeArr,
				complete: complete
			});
		});
	}

	public showMsgBox(obj: { content: string, title?: string, okcb?: Function }): void {
		let { content, title, okcb } = obj;
		this.openSubModule("msgBox", true).then(script => {
			script.init(title, content, okcb, null);
		});
	}

	public showDialog(obj: { content: string, title?: string, okcb?: Function, cancelcb?: Function }): void {
		let { content, title, okcb, cancelcb } = obj;
		this.openSubModule("msgBox", true).then(script => {
			script.init(title, content, okcb, cancelcb, false);
		});
	}

	public showGainBox(arr: { type: number, amount: number }[]): void {
		console.log(arr)
		this.openSubModule("gainBox", true).then(script => {
			script.setGainData(arr);
		});
	}
	public showHandleGainBox(data): void {
		let arr =[];
		for(let key in data){
			if(typeof data[key]== "object"){
				for (let i = 0; i < data[key].length; i++) {
					arr.push({
						type:key,
						amount:data[key][i].amount,
					})
				}
			}
			else{
				arr.push({
					type:key,
					amount:data[key],
				})
			}
		
		}
		this.showGainBox(arr)
	}

	public showTipBox(content: string): void {
		this.openSubModule("tipBox", true, false).then(script => {
			script.setContent(content);
		});
	}

	public showJuhua(): void {
		this.openSubModule("juhua", true);
	}
}
