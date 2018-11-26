import Package from "../net/package";

/**
 * 事件管理模块
 */
export default class Emitter {
    private static _instance: Emitter = new Emitter();
    public static getInstance(): Emitter {
        return Emitter._instance;
    }
    private _routeList: any[];
    private _callbacks: object;
    constructor() {
        this._routeList = [];
        this._callbacks = {};
    }

    public registerRoute(route: any): void {
        this._routeList.push(route);
    }

    public unregisterRoute(listener: any): void {
        let index = this._routeList.indexOf(listener);
		if (~index) this._routeList.splice(index, 1);
    }

    public dealNetRoute(event: string, msg: Package): void {
		for (let i = 0; i < this._routeList.length; ++i) {
			this._routeList[i].dealResp(event, msg);
		}
	}
    // 注册一个事件
    public on(event: string, callback: (...args) => any, listener: object): number {
        (this._callbacks[event] = this._callbacks[event] || [])
            .push({ callback: callback, listener: listener });
        return this._callbacks[event].length;
    }

    public once(event: string, callback: (...args) => any, listener: object): number {
        let onceCb = (...args) => {
            this.off(event, onceCb);
            callback.apply(listener, args);
        }
        return this.on(event, onceCb, listener);
    }

    // 发送一个事件
    public emit(event: string, ...args: any[]): boolean {
        let callbacks = this._callbacks[event];
        if (callbacks) {
            for (let i = 0; i < callbacks.length; ++i) {
                let item = callbacks[i];
                item.callback.apply(item.listener, args);
            }
            return true;
        }
        // 没有该事件的监听
        return false;
    }

    public off(event: string, listener: object): void {
        let callbacks = this._callbacks[event];
        if (callbacks) {
            let index = this._indexOf(callbacks, listener);
            while (~index) {
                callbacks.splice(index, 1);
                index = this._indexOf(callbacks, listener);
            }
        }
    }

    public targetOff(listener: object): void {
        for (let event in this._callbacks) {
            this.off(event, listener);
        }
    }

    public removeListener(event?: string): void {
        if (typeof event !== "undefined") {
            if (this._callbacks[event]) delete this._callbacks[event];
        } else {
            this._callbacks = {};
        }
    }

    private _indexOf(arr: any[], obj: any): number {
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i].listener === obj) return i;
        }
        return -1;
    }
}    
