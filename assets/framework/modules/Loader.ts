/**加载管理 */
export default class Loader {
    private static _instance: Loader = new Loader();
    public static getInstance(): Loader {
        return Loader._instance;
    }
    /**
     * 加载预制
     * @param url 预制路径
     */
    public loadPrefab(url: string): Promise<cc.Prefab> {
        return this.loadRes(url, cc.Prefab);
    }
    /**
     * 加载图片
     * @param url 图片路径
     */
    public loadImage(url: string): Promise<cc.SpriteFrame> {
        return this.loadRes(url, cc.SpriteFrame);
    }
    /**
     * 加载配置
     * @param url 配置路径
     */
    public loadConfig(url: string): Promise<cc.JsonAsset> {
        return this.loadRes(url, cc.JsonAsset);
    }

    public loadQueue(obj: { paths: any[], progress: Function, complete: Function }) {
        let { paths, progress, complete } = obj;
        let totalFileCount = paths.length;
        let loadFileCount = 0;
        for (let i = 0; i < totalFileCount; ++i) {
            let { url, type } = paths[i];
            this.loadRes(url, type).then(() => {
                loadFileCount++;
                progress(loadFileCount / totalFileCount);
                if (loadFileCount === totalFileCount) complete();
            });
        }
    }

    public loadRes(url: string, type: any): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(url, type, (err: Error, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    public getRes(url: string, type: any): any {
        return cc.loader.getRes(url, type);
    }

    public releaseRes(urlArr: string[]) {
        for (let i = 0; i < urlArr.length; ++i) {
            let uuids = cc.loader.getDependsRecursively(urlArr[i]);
            cc.loader.release(uuids);
        }
    }
}
