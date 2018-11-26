/**
 * 本地缓存数据管理模块
 */
export default class Cache {
    //单例处理
    private static _instance: Cache = new Cache();
    public static getInstance(): Cache {
        return Cache._instance;
    }

    public getItem(key: string): any {
        let data = cc.sys.localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    public setItem(key: string, value: object): void {
        let data = JSON.stringify(value);
        cc.sys.localStorage.setItem(key, data);
    }

    public removeItemByKey(key: string): void {
        cc.sys.localStorage.removeItem(key);
    }

    public clear() {
        cc.sys.localStorage.clear();
    }
}